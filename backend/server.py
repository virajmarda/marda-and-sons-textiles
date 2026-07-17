"""
Marda & Sons - Backend API
FastAPI + MongoDB for product catalog, lead capture, newsletter
"""
import os
from datetime import datetime, timezone
from typing import List, Optional, Annotated
from contextlib import asynccontextmanager

import bleach
from bson import ObjectId
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, BeforeValidator, ConfigDict, EmailStr, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

load_dotenv()

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*").split(",")
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")

# ---------- Rate Limiter ----------
limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])

# ---------- MongoDB helpers ----------
PyObjectId = Annotated[str, BeforeValidator(str)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    def to_mongo(self) -> dict:
        d = self.model_dump(by_alias=True, exclude_none=True)
        d.pop("_id", None)
        return d

    @classmethod
    def from_mongo(cls, doc: dict):
        if not doc:
            return None
        if "_id" in doc:
            doc["_id"] = str(doc["_id"])
        return cls(**doc)


# ---------- Models ----------
class Product(BaseDocument):
    slug: str
    name: str
    category: str
    subcategory: Optional[str] = None
    photos: List[str] = []
    tags: List[str] = []
    price: Optional[float] = None
    unit: Optional[str] = None
    description: Optional[str] = None
    featured: bool = False
    in_stock: bool = True


class Lead(BaseDocument):
    type: str  # contact | wholesale | newsletter | cart
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    message: Optional[str] = None
    company: Optional[str] = None
    city: Optional[str] = None
    cart: Optional[list] = None
    contacted: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Request schemas ----------
class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str


class WholesaleRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    company: Optional[str] = None
    city: Optional[str] = None
    message: Optional[str] = None


class NewsletterRequest(BaseModel):
    email: EmailStr


class CartEnquiryRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    cart: list


# ---------- Sanitisation helper ----------
ALLOWED_TAGS: list = []


def sanitize(value: Optional[str]) -> Optional[str]:
    """Strip all HTML tags and dangerous characters from user input."""
    if value is None:
        return None
    return bleach.clean(value, tags=ALLOWED_TAGS, strip=True).strip()


# ---------- Seed data ----------
SEED_PRODUCTS = [
    {
        "slug": "solapuri-chaddar-classic",
        "name": "Solapuri Chaddar Classic",
        "category": "bedsheets",
        "photos": [],
        "tags": ["solapuri", "cotton", "chaddar"],
        "price": 899,
        "unit": "piece",
        "description": "Handwoven Solapuri cotton chaddar, breathable and durable.",
        "featured": True,
        "in_stock": True,
    },
    {
        "slug": "terry-towel-premium",
        "name": "Premium Terry Towel",
        "category": "towels",
        "photos": [],
        "tags": ["towel", "terry", "cotton"],
        "price": 349,
        "unit": "piece",
        "description": "Super-absorbent premium terry towel.",
        "featured": True,
        "in_stock": True,
    },
]


async def seed_products(db):
    count = await db.products.count_documents({})
    if count == 0:
        await db.products.insert_many(SEED_PRODUCTS)


# ---------- DB globals ----------
client = None
db = None


# ---------- Lifespan ----------
@asynccontextmanager
async def lifespan(app: FastAPI):
    global client, db
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    await seed_products(db)
    yield
    client.close()


# ---------- App ----------
app = FastAPI(title="Marda & Sons API", version="1.0.0", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Auth helper ----------
def verify_admin(x_admin_token: str = Header(...)):
    if not ADMIN_TOKEN or x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Forbidden")


# ---------- Routes ----------
@app.get("/api/health")
async def health():
    """Liveness + DB ping."""
    try:
        await client.admin.command("ping")
        db_status = "connected"
    except Exception:
        db_status = "unreachable"
    return {
        "status": "ok",
        "service": "marda-sons-api",
        "db": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/products")
@limiter.limit("30/minute")
async def list_products(
    request: Request,
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    q: Optional[str] = Query(default=None),
    limit: int = Query(default=50, le=200),
):
    query: dict = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if q:
        query["$text"] = {"$search": sanitize(q)}

    cursor = db.products.find(query).limit(limit)
    products = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        products.append(doc)
    return {"products": products, "count": len(products)}


@app.get("/api/products/{slug}")
@limiter.limit("60/minute")
async def get_product(request: Request, slug: str):
    doc = await db.products.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    doc["_id"] = str(doc["_id"])
    return doc


@app.get("/api/categories")
@limiter.limit("30/minute")
async def list_categories(request: Request):
    categories = await db.products.distinct("category")
    return {"categories": sorted(categories)}


@app.post("/api/contact", status_code=201)
@limiter.limit("5/minute")
async def contact(request: Request, body: ContactRequest):
    lead = Lead(
        type="contact",
        name=sanitize(body.name),
        email=body.email,
        phone=sanitize(body.phone),
        message=sanitize(body.message),
    )
    await db.leads.insert_one(lead.to_mongo())
    return {"message": "Thank you. We will be in touch shortly."}


@app.post("/api/wholesale", status_code=201)
@limiter.limit("5/minute")
async def wholesale(request: Request, body: WholesaleRequest):
    lead = Lead(
        type="wholesale",
        name=sanitize(body.name),
        email=body.email,
        phone=sanitize(body.phone),
        company=sanitize(body.company),
        city=sanitize(body.city),
        message=sanitize(body.message),
    )
    await db.leads.insert_one(lead.to_mongo())
    return {"message": "Wholesale enquiry received. Our team will contact you within 24 hours."}


@app.post("/api/newsletter", status_code=201)
@limiter.limit("3/minute")
async def newsletter(request: Request, body: NewsletterRequest):
    existing = await db.leads.find_one({"type": "newsletter", "email": body.email})
    if existing:
        return {"message": "You are already subscribed."}
    lead = Lead(type="newsletter", email=body.email)
    await db.leads.insert_one(lead.to_mongo())
    return {"message": "Subscribed successfully. Welcome to the Marda & Sons circle."}


@app.post("/api/cart-enquiry", status_code=201)
@limiter.limit("5/minute")
async def cart_enquiry(request: Request, body: CartEnquiryRequest):
    lead = Lead(
        type="cart",
        name=sanitize(body.name),
        email=body.email,
        phone=sanitize(body.phone),
        cart=body.cart,
    )
    await db.leads.insert_one(lead.to_mongo())
    return {"message": "Order enquiry received. We will confirm via WhatsApp shortly."}


@app.get("/api/admin/leads")
@limiter.limit("20/minute")
async def admin_leads(
    request: Request,
    lead_type: Optional[str] = None,
    contacted: Optional[bool] = None,
    _: str = Depends(verify_admin),
):
    query: dict = {}
    if lead_type:
        query["type"] = lead_type
    if contacted is not None:
        query["contacted"] = contacted

    cursor = db.leads.find(query).sort("created_at", -1).limit(500)
    leads = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        leads.append(doc)

    total = await db.leads.count_documents({})
    uncontacted = await db.leads.count_documents({"contacted": False})

    return {
        "leads": leads,
        "stats": {"total": total, "uncontacted": uncontacted},
    }


@app.patch("/api/admin/leads/{lead_id}")
@limiter.limit("20/minute")
async def update_lead(
    request: Request,
    lead_id: str,
    contacted: bool,
    _: str = Depends(verify_admin),
):
    result = await db.leads.update_one(
        {"_id": ObjectId(lead_id)},
        {"$set": {"contacted": contacted}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"updated": True}
