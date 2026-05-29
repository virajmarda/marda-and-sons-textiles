"""
Admin leads endpoint tests.
Covers: token enforcement, type/contacted filters, PATCH happy + error paths.
"""
import os
import uuid
import time
import pytest

ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "marda-atelier-2026")


def _seed_cart_enquiry(api_client, base_url, name_prefix="TEST_ADMIN") -> str:
    """POST a cart-enquiry; return its lead id."""
    ref = f"MS-ADM-{uuid.uuid4().hex[:4].upper()}"
    payload = {
        "name": f"{name_prefix}_{uuid.uuid4().hex[:4]}",
        "phone": "+91 94224 60420",
        "order_ref": ref,
        "subtotal": 899,
        "items": [{
            "slug": "royal-maroon-pheta", "name": "Royal Maroon Pheta",
            "mode": "retail", "qty": 1, "price": 899,
        }],
    }
    r = api_client.post(f"{base_url}/api/cart-enquiry", json=payload)
    assert r.status_code == 200, r.text
    return r.json()["id"]


def _admin_headers(token: str = ADMIN_TOKEN) -> dict:
    return {"X-Admin-Token": token, "Content-Type": "application/json"}


# -------- Auth --------
class TestAdminAuth:
    def test_missing_token_401(self, api_client, base_url):
        # Use bare requests-like call without the session header trick
        import requests
        r = requests.get(f"{base_url}/api/admin/leads")
        assert r.status_code == 401, r.text

    def test_wrong_token_401(self, api_client, base_url):
        import requests
        r = requests.get(
            f"{base_url}/api/admin/leads",
            headers={"X-Admin-Token": "totally-wrong"},
        )
        assert r.status_code == 401

    def test_correct_token_200_shape(self, api_client, base_url):
        import requests
        r = requests.get(f"{base_url}/api/admin/leads", headers=_admin_headers())
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("ok") is True
        assert isinstance(data.get("leads"), list)
        counts = data.get("counts")
        assert isinstance(counts, dict)
        for key in ("all", "contact", "wholesale", "newsletter", "cart_enquiry", "uncontacted"):
            assert key in counts, f"counts missing {key}"
            assert isinstance(counts[key], int)


# -------- Filters --------
class TestAdminFilters:
    def test_filter_type_cart_enquiry(self, api_client, base_url):
        import requests
        _seed_cart_enquiry(api_client, base_url)
        r = requests.get(
            f"{base_url}/api/admin/leads",
            headers=_admin_headers(),
            params={"type": "cart_enquiry"},
        )
        assert r.status_code == 200
        leads = r.json()["leads"]
        assert len(leads) > 0
        assert all(l["type"] == "cart_enquiry" for l in leads)

    def test_filter_contacted_false_returns_uncontacted(self, api_client, base_url):
        import requests
        _seed_cart_enquiry(api_client, base_url)
        r = requests.get(
            f"{base_url}/api/admin/leads",
            headers=_admin_headers(),
            params={"contacted": "false"},
        )
        assert r.status_code == 200
        leads = r.json()["leads"]
        assert all(l.get("contacted_at") in (None, "") for l in leads)

    def test_filter_contacted_true(self, api_client, base_url):
        import requests
        # Seed + mark contacted
        lead_id = _seed_cart_enquiry(api_client, base_url)
        rp = requests.patch(
            f"{base_url}/api/admin/leads/{lead_id}",
            headers=_admin_headers(),
            json={"contacted": True},
        )
        assert rp.status_code == 200, rp.text
        r = requests.get(
            f"{base_url}/api/admin/leads",
            headers=_admin_headers(),
            params={"contacted": "true"},
        )
        assert r.status_code == 200
        leads = r.json()["leads"]
        assert len(leads) > 0
        assert all(l.get("contacted_at") for l in leads)

    def test_limit_param(self, api_client, base_url):
        import requests
        # Make sure we have ≥2 leads
        _seed_cart_enquiry(api_client, base_url)
        _seed_cart_enquiry(api_client, base_url)
        r = requests.get(
            f"{base_url}/api/admin/leads",
            headers=_admin_headers(),
            params={"limit": 1},
        )
        assert r.status_code == 200
        leads = r.json()["leads"]
        assert len(leads) == 1


# -------- PATCH --------
class TestAdminPatch:
    def test_patch_mark_contacted_then_uncontact(self, api_client, base_url):
        import requests
        lead_id = _seed_cart_enquiry(api_client, base_url)
        # Mark contacted=True
        r = requests.patch(
            f"{base_url}/api/admin/leads/{lead_id}",
            headers=_admin_headers(),
            json={"contacted": True},
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["ok"] is True
        assert isinstance(body["contacted_at"], str) and len(body["contacted_at"]) > 10

        # Re-fetch via GET and verify persistence
        rg = requests.get(
            f"{base_url}/api/admin/leads",
            headers=_admin_headers(),
            params={"type": "cart_enquiry"},
        )
        match = next((l for l in rg.json()["leads"] if l["id"] == lead_id), None)
        assert match is not None, "lead missing after PATCH"
        assert match["contacted_at"] is not None

        # Mark contacted=False
        r2 = requests.patch(
            f"{base_url}/api/admin/leads/{lead_id}",
            headers=_admin_headers(),
            json={"contacted": False},
        )
        assert r2.status_code == 200
        assert r2.json()["contacted_at"] is None

        # Verify via GET
        rg2 = requests.get(
            f"{base_url}/api/admin/leads",
            headers=_admin_headers(),
            params={"type": "cart_enquiry"},
        )
        match2 = next((l for l in rg2.json()["leads"] if l["id"] == lead_id), None)
        assert match2 is not None
        assert match2.get("contacted_at") in (None, "")

    def test_patch_invalid_id_400(self, api_client, base_url):
        import requests
        r = requests.patch(
            f"{base_url}/api/admin/leads/not-an-objectid",
            headers=_admin_headers(),
            json={"contacted": True},
        )
        assert r.status_code == 400

    def test_patch_nonexistent_id_404(self, api_client, base_url):
        import requests
        # Valid 24-hex ObjectId that doesn't exist
        fake = "0" * 24
        r = requests.patch(
            f"{base_url}/api/admin/leads/{fake}",
            headers=_admin_headers(),
            json={"contacted": True},
        )
        assert r.status_code == 404, r.text

    def test_patch_empty_body_400(self, api_client, base_url):
        import requests
        lead_id = _seed_cart_enquiry(api_client, base_url)
        r = requests.patch(
            f"{base_url}/api/admin/leads/{lead_id}",
            headers=_admin_headers(),
            json={},
        )
        assert r.status_code == 400

    def test_patch_requires_token(self, api_client, base_url):
        import requests
        lead_id = _seed_cart_enquiry(api_client, base_url)
        r = requests.patch(
            f"{base_url}/api/admin/leads/{lead_id}",
            json={"contacted": True},
        )
        assert r.status_code == 401
