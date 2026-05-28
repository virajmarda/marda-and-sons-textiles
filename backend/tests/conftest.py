import os
import pytest
import requests

BASE_URL = os.environ.get(
    "BACKEND_BASE_URL",
    "https://c0ae75ab-be30-46a0-81cf-70bdbc8579d0.preview.emergentagent.com",
).rstrip("/")


@pytest.fixture(scope="session")
def base_url():
    return BASE_URL


@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s
