"""
Marda & Sons - Backend API
FastAPI + MongoDB for product catalog, lead capture, newsletter
"""
import os
from datetime import datetime, timezone
from typing import List, Optional, Annotated
from contextlib import asynccontextmanager

from bson import ObjectId
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, BeforeValidator, ConfigDict, EmailStr, Field

load_dotenv()

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*").split(",")

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
    category: str          # towels | bedsheets | shawls | phetas | topis | lungi | blankets | chatais
    subtitle: Optional[str] = None
    description: str
    story: Optional[str] = None
    price_retail: int       # INR
    price_wholesale: int    # per piece in bulk
    moq_wholesale: int = 12
    images: List[str] = []
    materials: List[str] = []
    dimensions: Optional[str] = None
    care: Optional[str] = None
    colors: List[str] = []
    badges: List[str] = []  # "Bestseller", "Heritage", "New", "Wedding"
    in_stock: bool = True
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Lead(BaseDocument):
    type: str               # contact | wholesale | newsletter
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    city: Optional[str] = None
    message: Optional[str] = None
    interested_in: Optional[List[str]] = None
    quantity_estimate: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Request schemas ----------
class ContactIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str


class WholesaleIn(BaseModel):
    name: str
    company: Optional[str] = None
    email: EmailStr
    phone: str
    city: Optional[str] = None
    interested_in: List[str] = []
    quantity_estimate: Optional[str] = None
    message: Optional[str] = None


class NewsletterIn(BaseModel):
    email: EmailStr


# ---------- App ----------
client: AsyncIOMotorClient = None  # type: ignore
db = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global client, db
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    await seed_products(db)
    yield
    client.close()


app = FastAPI(title="Marda & Sons API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Routes ----------
@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "marda-sons-api"}


@app.get("/api/products")
async def list_products(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    q: Optional[str] = None,
    limit: int = Query(100, le=200),
):
    query: dict = {}
    if category and category != "all":
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if q:
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
        ]
    cursor = db.products.find(query).limit(limit)
    items = [Product.from_mongo(doc).model_dump(by_alias=False) async for doc in cursor]
    return {"products": items, "count": len(items)}


@app.get("/api/products/{slug}")
async def get_product(slug: str):
    doc = await db.products.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product.from_mongo(doc).model_dump(by_alias=False)


@app.get("/api/categories")
async def list_categories():
    return {"categories": CATEGORIES}


@app.post("/api/contact")
async def post_contact(payload: ContactIn):
    lead = Lead(type="contact", **payload.model_dump())
    res = await db.leads.insert_one(lead.to_mongo())
    return {"ok": True, "id": str(res.inserted_id)}


@app.post("/api/wholesale")
async def post_wholesale(payload: WholesaleIn):
    lead = Lead(type="wholesale", **payload.model_dump())
    res = await db.leads.insert_one(lead.to_mongo())
    return {"ok": True, "id": str(res.inserted_id)}


@app.post("/api/newsletter")
async def post_newsletter(payload: NewsletterIn):
    existing = await db.leads.find_one({"type": "newsletter", "email": payload.email})
    if existing:
        return {"ok": True, "duplicate": True}
    lead = Lead(type="newsletter", email=payload.email)
    res = await db.leads.insert_one(lead.to_mongo())
    return {"ok": True, "id": str(res.inserted_id)}


# ---------- Categories meta ----------
CATEGORIES = [
    {"slug": "towels", "name": "Towels", "marathi": "टॉवेल",
     "tagline": "The Original Solapuri Soft-Touch",
     "image": "https://images.unsplash.com/photo-1521587765099-8835e7201186?auto=format&fit=crop&w=1400&q=80"},
    {"slug": "bedsheets", "name": "Bedsheets", "marathi": "चादर",
     "tagline": "Handloom comfort, woven for generations",
     "image": "https://images.unsplash.com/photo-1631049552240-59c37f38802b?auto=format&fit=crop&w=1400&q=80"},
    {"slug": "shawls", "name": "Shawls", "marathi": "शाल",
     "tagline": "Warmth wrapped in heritage",
     "image": "https://images.unsplash.com/photo-1616756351484-798f37bdffa0?auto=format&fit=crop&w=1400&q=80"},
    {"slug": "phetas", "name": "Phetas", "marathi": "फेटा",
     "tagline": "The crown of Maharashtrian pride",
     "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80"},
    {"slug": "topis", "name": "Topis", "marathi": "टोपी",
     "tagline": "Tradition that sits gracefully",
     "image": "https://images.unsplash.com/photo-1611516491426-03025e6043c8?auto=format&fit=crop&w=1400&q=80"},
    {"slug": "lungi", "name": "Lungi", "marathi": "लुंगी",
     "tagline": "Everyday comfort, timeless weave",
     "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=80"},
    {"slug": "blankets", "name": "Blankets", "marathi": "घोंगडी",
     "tagline": "Solapuri chaddars — winters' best companion",
     "image": "https://images.unsplash.com/photo-1592229505726-ca121723b8ef?auto=format&fit=crop&w=1400&q=80"},
    {"slug": "chatais", "name": "Chatais", "marathi": "चटई",
     "tagline": "Handwoven mats for floors that welcome",
     "image": "https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?auto=format&fit=crop&w=1400&q=80"},
]


# ---------- Seed ----------
async def seed_products(database):
    """Idempotent seeding of catalog with a version flag."""
    SEED_VERSION = 5
    meta = await database.meta.find_one({"_id": "seed"})
    if meta and meta.get("version") == SEED_VERSION:
        return

    await database.products.delete_many({})
    catalog = build_catalog()
    if catalog:
        await database.products.insert_many([p.to_mongo() for p in catalog])
    await database.meta.update_one(
        {"_id": "seed"}, {"$set": {"version": SEED_VERSION}}, upsert=True,
    )


def build_catalog() -> List[Product]:
    """Curated catalog: 4-6 products per category."""
    img = {
        "towels": [
            "https://images.unsplash.com/photo-1521587765099-8835e7201186?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1583845112203-29329902332e?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
        ],
        "bedsheets": [
            "https://images.unsplash.com/photo-1631049552240-59c37f38802b?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
        ],
        "shawls": [
            "https://images.unsplash.com/photo-1616756351484-798f37bdffa0?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=1200&q=80",
        ],
        "phetas": [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1611516491426-03025e6043c8?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
        ],
        "topis": [
            "https://images.unsplash.com/photo-1611516491426-03025e6043c8?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
        ],
        "lungi": [
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?auto=format&fit=crop&w=1200&q=80",
        ],
        "blankets": [
            "https://images.unsplash.com/photo-1592229505726-ca121723b8ef?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=80",
        ],
        "chatais": [
            "https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=1200&q=80",
        ],
    }

    items: List[Product] = []

    # Towels
    items += [
        Product(slug="solapuri-classic-bath-towel",
                name="Solapuri Classic Bath Towel",
                category="towels", subtitle="Heritage Soft-Touch Cotton",
                description="Our flagship 100% cotton bath towel, woven on traditional Solapuri looms. Absorbent, fast-drying, and softens with every wash.",
                story="The original towel that built the Marda name in the 1970s.",
                price_retail=649, price_wholesale=380, moq_wholesale=24,
                images=img["towels"][:2], materials=["100% Combed Cotton"],
                dimensions="70 × 140 cm", care="Machine wash cold",
                colors=["Ivory", "Maroon", "Indigo"], badges=["Bestseller", "Heritage"], featured=True),
        Product(slug="royal-velour-spa-towel",
                name="Royal Velour Spa Towel",
                category="towels", subtitle="Luxury Velvet Finish",
                description="Premium velour-finish towel, double-ply cotton. The kind of towel five-star resorts request by name.",
                price_retail=1299, price_wholesale=750, moq_wholesale=12,
                images=img["towels"][1:3], materials=["100% Egyptian-blend Cotton"],
                dimensions="80 × 160 cm", colors=["Ivory", "Sand"], badges=["Premium"]),
        Product(slug="handloom-face-towel-set",
                name="Handloom Face Towel — Set of 6",
                category="towels", subtitle="Daily Essentials",
                description="A set of six classic face towels for the everyday Indian household — soft, durable, family-tested.",
                price_retail=549, price_wholesale=290, moq_wholesale=24,
                images=img["towels"][:1], dimensions="30 × 30 cm × 6", colors=["Assorted"], badges=["Family Pack"]),
        Product(slug="wedding-gift-towel-trousseau",
                name="Wedding Trousseau Towel Set",
                category="towels", subtitle="The Bridal Bundle",
                description="A beautifully packaged set of bath, hand, and face towels in maroon and ivory — a Solapuri gifting tradition.",
                price_retail=2499, price_wholesale=1499, moq_wholesale=10,
                images=img["towels"][2:3], badges=["Wedding", "Gift Ready"], featured=True),
    ]

    # Bedsheets
    items += [
        Product(slug="solapuri-double-bedsheet-handloom",
                name="Solapuri Handloom Double Bedsheet",
                category="bedsheets", subtitle="King Size · Pure Cotton",
                description="Pure cotton handloom bedsheet with two pillow covers. Iconic Solapuri double-weave that gets softer with time.",
                price_retail=1599, price_wholesale=950, moq_wholesale=12,
                images=img["bedsheets"][:2], materials=["100% Cotton, 180 TC"],
                dimensions="240 × 270 cm + 2 pillow covers",
                colors=["Maroon Border", "Indigo Border", "Antique Gold"], badges=["Bestseller"], featured=True),
        Product(slug="ivory-gold-luxury-bedsheet",
                name="Ivory & Gold Luxury Bedsheet",
                category="bedsheets", subtitle="The Marda Heirloom",
                description="An editorial heirloom — ivory base with hand-loomed antique-gold borders. Limited weave batches each season.",
                price_retail=2899, price_wholesale=1850, moq_wholesale=8,
                images=img["bedsheets"][1:], badges=["Heritage", "Limited"], featured=True),
        Product(slug="solapuri-single-bedsheet",
                name="Solapuri Single Bedsheet",
                category="bedsheets",
                description="Single-bed cotton sheet with pillow cover — perfect for hostels, guest rooms, and homestays.",
                price_retail=799, price_wholesale=470, moq_wholesale=24,
                images=img["bedsheets"][:1], dimensions="150 × 230 cm + 1 pillow cover", badges=["Hotelier"]),
        Product(slug="hotel-collection-bedsheet",
                name="Hotel Collection Bedsheet (Bulk)",
                category="bedsheets", subtitle="For Resorts & Homestays",
                description="High-thread-count cotton sheet built for hospitality. Tested for 200+ industrial washes.",
                price_retail=1199, price_wholesale=720, moq_wholesale=50,
                images=img["bedsheets"][2:3], badges=["B2B", "Hospitality"]),
    ]

    # Shawls
    items += [
        Product(slug="maroon-gold-handloom-shawl",
                name="Maroon & Gold Handloom Shawl",
                category="shawls", subtitle="The Marda Signature",
                description="A regal maroon shawl with antique-gold zari borders. Hand-finished by master weavers of Solapur.",
                price_retail=1899, price_wholesale=1150, moq_wholesale=10,
                images=img["shawls"][:2], colors=["Maroon-Gold"], badges=["Heritage", "Wedding"], featured=True),
        Product(slug="ivory-wool-winter-shawl",
                name="Ivory Wool Winter Shawl",
                category="shawls", subtitle="Soft. Warm. Editorial.",
                description="Lightweight wool-blend ivory shawl with subtle weave — pairs beautifully with both saree and silhouette.",
                price_retail=2499, price_wholesale=1500, moq_wholesale=8,
                images=img["shawls"][1:], colors=["Ivory"], badges=["Premium"]),
        Product(slug="gent-classic-shawl-cream",
                name="Gent's Classic Shawl — Cream",
                category="shawls",
                description="The cream pheta-paired shawl worn by Maharashtrian gentlemen at weddings and ceremonies for generations.",
                price_retail=1399, price_wholesale=820, moq_wholesale=12,
                images=img["shawls"][:1], badges=["Wedding"]),
    ]

    # Phetas
    items += [
        Product(slug="royal-maroon-pheta",
                name="Royal Maroon Pheta",
                category="phetas", subtitle="Pre-Tied · Wedding Edition",
                description="A pre-tied royal maroon pheta with gold zari — the crown of every Maharashtrian groom and dignitary.",
                price_retail=899, price_wholesale=520, moq_wholesale=12,
                images=img["phetas"][:2], colors=["Maroon-Gold"], badges=["Wedding", "Bestseller"], featured=True),
        Product(slug="saffron-pheta-traditional",
                name="Saffron Traditional Pheta",
                category="phetas",
                description="The classic saffron pheta — worn on Gudi Padwa, Shivjayanti, and festive processions.",
                price_retail=649, price_wholesale=380, moq_wholesale=24,
                images=img["phetas"][1:], colors=["Saffron"], badges=["Festival"]),
        Product(slug="ivory-pheta-wedding-guest",
                name="Ivory Wedding-Guest Pheta",
                category="phetas",
                description="Soft ivory with gold border — the refined choice for wedding guests and groomsmen.",
                price_retail=749, price_wholesale=440, moq_wholesale=12,
                images=img["phetas"][:1], colors=["Ivory-Gold"]),
    ]

    # Topis
    items += [
        Product(slug="gandhi-topi-handspun",
                name="Gandhi Topi — Handspun Khadi",
                category="topis",
                description="The iconic white khadi cap, hand-spun and gently starched. A symbol carried with pride.",
                price_retail=249, price_wholesale=140, moq_wholesale=24,
                images=img["topis"][:1], colors=["Ivory"], badges=["Heritage"]),
        Product(slug="maharashtrian-black-topi",
                name="Maharashtrian Black Topi",
                category="topis", subtitle="Traditional Velvet",
                description="The dignified black velvet topi — paired with kurta-pyjama for ceremonies and weddings.",
                price_retail=349, price_wholesale=200, moq_wholesale=24,
                images=img["topis"][1:], colors=["Black"]),
    ]

    # Lungi
    items += [
        Product(slug="solapuri-cotton-lungi-classic",
                name="Solapuri Cotton Lungi — Classic Checks",
                category="lungi",
                description="Pure cotton, breathable, and unmistakably Solapuri. The everyday comfort wear of South & West India.",
                price_retail=399, price_wholesale=220, moq_wholesale=24,
                images=img["lungi"][:1], colors=["Assorted Checks"], badges=["Bestseller"]),
        Product(slug="premium-lungi-gift-pack",
                name="Premium Lungi Gift Pack (Set of 3)",
                category="lungi", subtitle="Gift-Ready",
                description="Three premium lungis in a maroon gift box — a thoughtful gift for elders and guests.",
                price_retail=1199, price_wholesale=720, moq_wholesale=12,
                images=img["lungi"][1:], badges=["Gift"]),
    ]

    # Blankets
    items += [
        Product(slug="solapuri-chaddar-original",
                name="Solapuri Chaddar — The Original",
                category="blankets", subtitle="The Famous Solapuri Blanket",
                description="The chaddar that put Solapur on the textile map of India. Cotton-blend, breathable, ideal for Indian winters.",
                price_retail=899, price_wholesale=520, moq_wholesale=24,
                images=img["blankets"][:2], dimensions="220 × 240 cm",
                colors=["Maroon", "Indigo", "Forest", "Charcoal"],
                badges=["Solapur Famous", "Bestseller"], featured=True),
        Product(slug="royal-double-chaddar",
                name="Royal Double-Ply Chaddar",
                category="blankets", subtitle="Heavyweight Winter Edition",
                description="A heavier, plush double-ply chaddar for harsh Indian winters — feels like an heirloom from the very first night.",
                price_retail=1599, price_wholesale=950, moq_wholesale=12,
                images=img["blankets"][1:], colors=["Maroon", "Indigo"], badges=["Premium"]),
        Product(slug="ghongdi-traditional-blanket",
                name="Ghongdi — Traditional Marathi Blanket",
                category="blankets", subtitle="Handwoven Wool",
                description="The legendary ghongdi — handwoven of pure wool, used in Maharashtrian homes for centuries.",
                price_retail=2299, price_wholesale=1400, moq_wholesale=8,
                images=img["blankets"][2:], badges=["Heritage", "Handwoven"]),
        Product(slug="travel-blanket-light",
                name="Travel Blanket — Light & Soft",
                category="blankets",
                description="A lightweight travel blanket for long train journeys and chilly flights.",
                price_retail=549, price_wholesale=320, moq_wholesale=24,
                images=img["blankets"][:1], badges=["Travel"]),
    ]

    # Chatais
    items += [
        Product(slug="handwoven-bamboo-chatai",
                name="Handwoven Bamboo Chatai",
                category="chatais",
                description="A cool, handwoven bamboo chatai — perfect for verandahs, prayer rooms, and Indian summer afternoons.",
                price_retail=799, price_wholesale=470, moq_wholesale=12,
                images=img["chatais"][:1], dimensions="180 × 120 cm", badges=["Handwoven"]),
        Product(slug="festive-chatai-set",
                name="Festive Chatai Set (Pair)",
                category="chatais",
                description="A pair of festival-ready chatais for pujas, weddings, and large gatherings.",
                price_retail=1299, price_wholesale=780, moq_wholesale=10,
                images=img["chatais"][1:], badges=["Festival"]),
    ]

    return items
