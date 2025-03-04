# app/api/recommendation_routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import math

from app.database.base import get_db
from app.models.personality import Activity, PersonalityProfile
from app.schemas.schemas import Activity as ActivitySchema

router = APIRouter(
    prefix="/recommendations",
    tags=["recommendations"]
)

def calculate_compatibility_score(profile: PersonalityProfile, activity: Activity) -> float:
    """
    Calcula un puntaje de compatibilidad entre un perfil y una actividad.
    Returns: float entre 0 y 100, donde 100 es máxima compatibilidad
    """
    # Pesos para cada dimensión
    weights = {
        "introversion": 1.0,
        "activity": 1.0,
        "social": 1.0,
        "cultural": 1.0,
        "outdoor": 1.0
    }
    
    # Calcular diferencias normalizadas
    intro_diff = abs(profile.introversion_score - activity.introversion_level) / 100
    activity_diff = abs(profile.activity_level - activity.activity_level) / 100
    social_diff = abs(profile.social_preference - activity.social_level) / 100
    cultural_diff = abs(profile.cultural_interest - activity.cultural_level) / 100
    outdoor_diff = abs(profile.outdoor_interest - activity.outdoor_level) / 100
    
    # Calcular puntaje total (100 - promedio de diferencias ponderadas * 100)
    total_diff = (
        intro_diff * weights["introversion"] +
        activity_diff * weights["activity"] +
        social_diff * weights["social"] +
        cultural_diff * weights["cultural"] +
        outdoor_diff * weights["outdoor"]
    ) / sum(weights.values())
    
    compatibility = (1 - total_diff) * 100
    return round(compatibility, 2)

@router.get("/user/{user_id}", response_model=List[ActivitySchema])
async def get_recommendations(
    user_id: int,
    limit: int = 3,
    min_compatibility: float = 70.0,
    db: Session = Depends(get_db)
):
    """
    Obtiene recomendaciones de actividades para un usuario específico.
    - limit: número máximo de recomendaciones
    - min_compatibility: compatibilidad mínima requerida (0-100)
    """
    # Obtener perfil del usuario
    profile = db.query(PersonalityProfile).filter(
        PersonalityProfile.user_id == user_id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Perfil de usuario no encontrado. Completa el cuestionario primero."
        )
    
    # Obtener todas las actividades
    activities = db.query(Activity).all()
    
    # Calcular compatibilidad para cada actividad
    scored_activities = [
        (activity, calculate_compatibility_score(profile, activity))
        for activity in activities
    ]
    
    # Filtrar por compatibilidad mínima y ordenar por puntaje
    recommended_activities = [
        activity for activity, score in sorted(
            scored_activities,
            key=lambda x: x[1],
            reverse=True
        )
        if score >= min_compatibility
    ]
    
    return recommended_activities[:limit]