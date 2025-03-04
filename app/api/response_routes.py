# app/api/response_routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from datetime import datetime

from app.database.base import get_db
from app.models.personality import UserResponse, PersonalityProfile, Question
from app.schemas.schemas import QuestionnaireResponse, UserResponseCreate, PersonalityProfile as ProfileSchema

router = APIRouter(
    prefix="/responses",
    tags=["responses"]
)

@router.post("/submit", response_model=ProfileSchema)
def submit_questionnaire(
    responses: QuestionnaireResponse,
    db: Session = Depends(get_db)
):
    """
    Envía las respuestas del cuestionario y genera el perfil de personalidad
    """
    # Verificar que el user_id sea válido
    if responses.user_id <= 0:
        raise HTTPException(status_code=400, detail="user_id debe ser mayor que 0")

    # Verificar que exista el usuario
    existing_profile = db.query(PersonalityProfile).filter(
        PersonalityProfile.user_id == responses.user_id
    ).first()
    
    if existing_profile:
        profile = existing_profile
    else:
        profile = PersonalityProfile(
            user_id=responses.user_id,
            introversion_score=0.0,
            activity_level=0.0,
            social_preference=0.0,
            outdoor_interest=0.0,
            cultural_interest=0.0
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    # Limpiar respuestas anteriores si existen
    db.query(UserResponse).filter(
        UserResponse.user_id == responses.user_id
    ).delete()
    
    # Guardar las nuevas respuestas
    user_responses = []
    for response in responses.responses:
        question = db.query(Question).filter(
            Question.id == response.question_id
        ).first()
        if not question:
            raise HTTPException(
                status_code=404, 
                detail=f"Pregunta {response.question_id} no encontrada"
            )
        
        user_response = UserResponse(
            user_id=responses.user_id,
            question_id=response.question_id,
            response_value=response.response_value,
            profile_id=profile.id
        )
        user_responses.append(user_response)
        db.add(user_response)
    
    # Calcular puntuaciones
    questions = {q.id: q for q in db.query(Question).all()}
    scores: Dict[str, List[float]] = {
        "introversion": [],
        "activity_level": [],
        "social_preference": [],
        "outdoor_interest": [],
        "cultural_interest": []
    }
    
    for response in responses.responses:
        question = questions.get(response.question_id)
        if question and question.category in scores:
            scores[question.category].append(response.response_value)

    # Actualizar perfil con nuevas puntuaciones
    profile.introversion_score = calculate_score(scores["introversion"])
    profile.activity_level = calculate_score(scores["activity_level"])
    profile.social_preference = calculate_score(scores["social_preference"])
    profile.outdoor_interest = calculate_score(scores["outdoor_interest"])
    profile.cultural_interest = calculate_score(scores["cultural_interest"])
    profile.last_updated = datetime.utcnow()
    
    db.commit()
    db.refresh(profile)
    return profile

def calculate_score(values: List[float]) -> float:
    """
    Calcula la puntuación normalizada (0-100) basada en las respuestas
    """
    if not values:
        return 0.0
    # La escala original es 1-5, la convertimos a 0-100
    avg = sum(values) / len(values)
    return (avg - 1) * 25  # Convierte 1-5 a 0-100