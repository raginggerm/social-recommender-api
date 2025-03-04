from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from math import radians, cos, sin, asin, sqrt
from app.database.base import get_db
from app.models.personality import Place, PersonalityProfile
from app.schemas.schemas import PlaceCreate, Place as PlaceSchema

router = APIRouter()

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calcula la distancia en kilómetros entre dos puntos usando la fórmula de Haversine
    """
    R = 6371  # Radio de la Tierra en km

    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return R * c

@router.get("/places/nearby/{user_id}")
async def get_nearby_places(
    user_id: int,
    latitude: float = Query(...),  # ... significa que es requerido
    longitude: float = Query(...),
    radius: float = Query(default=15.0),
    db: Session = Depends(get_db)
):
    print(f"DEBUG - Recibiendo: user_id={user_id}, lat={latitude}, lon={longitude}, radius={radius}")

    # Obtener el perfil del usuario
    profile = db.query(PersonalityProfile).filter(
        PersonalityProfile.user_id == user_id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil de usuario no encontrado")

    # Obtener todos los lugares
    places = db.query(Place).all()
    print(f"DEBUG - Lugares en DB: {len(places)}")
    
    # Filtrar lugares por distancia y calcular puntuación de compatibilidad
    nearby_places = []
    for place in places:
        try:
            distance = haversine_distance(
                latitude, longitude,
                place.latitude, place.longitude
            )
            
            if distance <= radius:
                compatibility = (
                    (100 - abs(profile.introversion_score - place.introversion_level)) +
                    (100 - abs(profile.activity_level - place.activity_level)) +
                    (100 - abs(profile.social_preference - place.social_level)) +
                    (100 - abs(profile.cultural_interest - place.cultural_level)) +
                    (100 - abs(profile.outdoor_interest - place.outdoor_level))
                ) / 5

                place_dict = {
                    "id": place.id,
                    "name": place.name,
                    "description": place.description,
                    "category": place.category,
                    "address": place.address,
                    "latitude": float(place.latitude),
                    "longitude": float(place.longitude),
                    "distance": round(distance, 2),
                    "compatibility_score": round(compatibility, 2)
                }
                
                nearby_places.append(place_dict)
        except Exception as e:
            print(f"DEBUG - Error procesando lugar {place.id}: {str(e)}")
    
    print(f"DEBUG - Lugares cercanos encontrados: {len(nearby_places)}")
    return nearby_places