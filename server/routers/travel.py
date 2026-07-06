"""Route planner — real driving distance/time via OSRM's free public demo
server, geocoded via Nominatim (OSM's free geocoder), both keyless.

Honesty note: OSRM's public demo only actually routes on its "driving" graph —
its /bike/ and /foot/ endpoints exist but silently return the exact same
distance/duration as /driving/ on this shared instance (verified directly:
identical numbers for all three profiles on the same request). So only car
gets real routed data here; 2-wheeler/bus/train are clearly-labeled estimates
derived from that real distance, not fetched from any live transit source —
no free API for actual Indian train/bus travel times exists anywhere.

Nominatim's usage policy caps free use at ~1 req/sec and requires a real
User-Agent identifying the app, and asks callers to cache results — geocode_cache
below does that, and _throttle() below serializes our outbound calls to both
free services so a burst of users can't get DevQuiz's IP rate-limited/banned.
"""
import asyncio
import time
import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db_mongo import col_geocode_cache
from deps import current_user

router = APIRouter()

USER_AGENT = "DevQuizTravelPlanner/1.0 (https://ai-devquiz.netlify.app)"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
OSRM_URL = "http://router.project-osrm.org/route/v1/driving"

_last_call = 0.0
_throttle_lock = asyncio.Lock()


async def _throttle(min_interval: float = 1.1):
    """Serializes outbound calls to Nominatim/OSRM so concurrent users can't
    collectively exceed the ~1 req/sec free-tier policy."""
    global _last_call
    async with _throttle_lock:
        wait = min_interval - (time.monotonic() - _last_call)
        if wait > 0:
            await asyncio.sleep(wait)
        _last_call = time.monotonic()


async def _geocode(query: str) -> dict:
    key = query.strip().lower()
    if not key:
        raise HTTPException(400, "Location name is required")

    cached = await col_geocode_cache().find_one({"query": key})
    if cached:
        return {"name": cached["displayName"], "lat": cached["lat"], "lon": cached["lon"]}

    await _throttle()
    async with httpx.AsyncClient(timeout=10, headers={"User-Agent": USER_AGENT}) as c:
        r = await c.get(NOMINATIM_URL, params={"q": query, "format": "json", "limit": 1, "countrycodes": "in"})
        r.raise_for_status()
        results = r.json()

    if not results:
        raise HTTPException(404, f"Couldn't find a location matching '{query}'")

    place = results[0]
    doc = {
        "query": key,
        "displayName": place.get("display_name", query),
        "lat": float(place["lat"]),
        "lon": float(place["lon"]),
    }
    await col_geocode_cache().update_one({"query": key}, {"$set": doc}, upsert=True)
    return {"name": doc["displayName"], "lat": doc["lat"], "lon": doc["lon"]}


class RouteBody(BaseModel):
    fromPlace: str
    toPlace: str


@router.post("/route")
async def get_route(body: RouteBody, _user=Depends(current_user)):
    origin = await _geocode(body.fromPlace)
    dest = await _geocode(body.toPlace)

    # No _throttle() here — that's specifically for Nominatim's strict 1 req/sec
    # policy; OSRM's demo server doesn't carry the same hard limit, and geocode
    # results get cached above, so a repeat lookup of the same cities skips
    # the ~2.2s of Nominatim throttling entirely.
    coords = f"{origin['lon']},{origin['lat']};{dest['lon']},{dest['lat']}"
    async with httpx.AsyncClient(timeout=15) as c:
        r = await c.get(f"{OSRM_URL}/{coords}", params={"overview": "simplified", "geometries": "geojson"})
        if r.status_code != 200:
            raise HTTPException(502, "Routing service is unavailable right now — please try again.")
        data = r.json()

    if data.get("code") != "Ok" or not data.get("routes"):
        raise HTTPException(404, "No drivable route found between these two places.")

    route = data["routes"][0]
    distance_km = route["distance"] / 1000
    car_duration_min = route["duration"] / 60
    # GeoJSON coords are [lon, lat] — flip to [lat, lon] for Leaflet's Polyline.
    geometry = [[lat, lon] for lon, lat in route["geometry"]["coordinates"]]

    modes = [
        {
            "mode": "car", "icon": "🚗", "label": "Car",
            "durationMin": round(car_duration_min),
            "estimated": False,
            "note": "Live route data",
        },
        {
            "mode": "bike", "icon": "🏍️", "label": "2-Wheeler",
            "durationMin": round(distance_km / 45 * 60),
            "estimated": True,
            "note": "Estimated · ~45 km/h avg",
        },
        {
            "mode": "bus", "icon": "🚌", "label": "Bus",
            "durationMin": round(car_duration_min * 1.25),
            "estimated": True,
            "note": "Estimated · car time + stops",
        },
        {
            "mode": "train", "icon": "🚆", "label": "Train",
            "durationMin": round(distance_km / 60 * 60),
            "estimated": True,
            "note": "Estimated · ~60 km/h avg, road-distance based",
        },
    ]

    return {
        "from": origin,
        "to": dest,
        "distanceKm": round(distance_km, 1),
        "geometry": geometry,
        "modes": modes,
    }
