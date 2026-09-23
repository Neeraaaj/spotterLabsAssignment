import requests
from django.conf import settings

ORS_BASE = "https://api.openrouteservice.org"

def geocode(location_text):
    """Returns (lng, lat, label) for a location string."""
    resp = requests.get(
        f"{ORS_BASE}/geocode/search",
        params={"api_key": settings.ORS_API_KEY, "text": location_text},
    )
    resp.raise_for_status()
    features = resp.json().get("features", [])
    if not features:
        raise ValueError(f"Could not geocode: {location_text}")
    coords = features[0]["geometry"]["coordinates"]  # [lng, lat]
    label = features[0]["properties"]["label"]
    return coords[0], coords[1], label


def get_route(coord_list):
    """coord_list: list of [lng, lat] pairs. Returns distance(m), duration(s), geometry."""
    print(f"Getting route for coordinates: {coord_list}")
    resp = requests.post(
        f"{ORS_BASE}/v2/directions/driving-car",
        headers={
            "Authorization": settings.ORS_API_KEY,
            "Content-Type": "application/json",
        },
        json={"coordinates": coord_list},
    )
    resp.raise_for_status()
    data = resp.json()
    route = data["routes"][0]
    return {
        "distance_m": route["summary"]["distance"],
        "duration_s": route["summary"]["duration"],
        "geometry": route["geometry"],  # encoded polyline
    }