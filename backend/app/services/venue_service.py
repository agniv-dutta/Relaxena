import json
from datetime import UTC, datetime
from typing import Any

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.venue import Floor, Gate, Restroom, Stand, Venue, Zone


async def get_venue_layout(db: AsyncSession, venue_id: int) -> dict[str, Any] | None:
    venue = await db.get(Venue, venue_id)
    if venue is None:
        return None

    floors = (await db.execute(select(Floor).where(Floor.venue_id == venue_id).order_by(Floor.level.asc()))).scalars().all()
    zones = (await db.execute(select(Zone).where(Zone.venue_id == venue_id))).scalars().all()
    gates = (await db.execute(select(Gate).where(Gate.venue_id == venue_id))).scalars().all()
    stands = (await db.execute(select(Stand).where(Stand.venue_id == venue_id))).scalars().all()
    restrooms = (await db.execute(select(Restroom).where(Restroom.venue_id == venue_id))).scalars().all()

    features = []
    for zone in zones:
        geometry = None
        if zone.polygon_geojson:
            try:
                geometry = json.loads(zone.polygon_geojson)
            except json.JSONDecodeError:
                geometry = None

        features.append(
            {
                "type": "Feature",
                "id": zone.id,
                "geometry": geometry,
                "properties": {
                    "zone_id": zone.id,
                    "name": zone.name,
                    "capacity": zone.capacity,
                    "current_count": zone.current_count,
                    "density_score": zone.density_score,
                    "floor_id": zone.floor_id,
                },
            }
        )

    return {
        "venue": {
            "id": venue.id,
            "name": venue.name,
            "city": venue.city,
            "capacity": venue.capacity,
        },
        "floors": [{"id": f.id, "name": f.name, "level": f.level} for f in floors],
        "zones_geojson": {"type": "FeatureCollection", "features": features},
        "gates": [{"id": g.id, "name": g.name, "zone_id": g.zone_id, "status": g.status} for g in gates],
        "stands": [{"id": s.id, "name": s.name, "zone_id": s.zone_id} for s in stands],
        "restrooms": [{"id": r.id, "name": r.name, "zone_id": r.zone_id, "status": r.status} for r in restrooms],
    }


async def get_venue_conditions(db: AsyncSession, venue_id: int) -> dict[str, Any] | None:
    venue = await db.get(Venue, venue_id)
    if venue is None:
        return None

    weather = {"status": "unknown", "temp_c": None, "rain_probability": None}
    if settings.openweather_api_key:
        url = "https://api.openweathermap.org/data/2.5/weather"
        params = {"q": venue.city, "appid": settings.openweather_api_key, "units": "metric"}
        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                payload = response.json()
                weather = {
                    "status": payload.get("weather", [{}])[0].get("main", "unknown"),
                    "temp_c": payload.get("main", {}).get("temp"),
                    "rain_probability": payload.get("clouds", {}).get("all", 0) / 100,
                }
        except Exception:
            pass

    venue.weather_condition = weather["status"]
    base_score = 0.3 if weather["status"].lower() in {"rain", "thunderstorm"} else 0.1
    venue.crowd_weather_score = round(base_score + (weather["rain_probability"] or 0.0), 2)
    await db.commit()

    return {
        "venue_id": venue_id,
        "weather": weather,
        "crowd_weather_score": venue.crowd_weather_score,
        "updated_at": datetime.now(UTC).isoformat(),
    }
