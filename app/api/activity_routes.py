# app/api/activity_routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.base import get_db
from app.models.personality import Activity
from app.schemas.schemas import ActivityCreate, Activity as ActivitySchema

router = APIRouter(
    prefix="/activities",
    tags=["activities"]
)

@router.post("/", response_model=ActivitySchema)
def create_activity(activity: ActivityCreate, db: Session = Depends(get_db)):
    """Crear una nueva actividad"""
    db_activity = Activity(
        name=activity.name,
        description=activity.description,
        location=activity.location,
        introversion_level=activity.introversion_level,
        activity_level=activity.activity_level,
        social_level=activity.social_level,
        cultural_level=activity.cultural_level,
        outdoor_level=activity.outdoor_level,
        category=activity.category,
        cost_level=activity.cost_level
    )
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.get("/", response_model=List[ActivitySchema])
def get_all_activities(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener todas las actividades"""
    activities = db.query(Activity).offset(skip).limit(limit).all()
    return activities

@router.get("/{activity_id}", response_model=ActivitySchema)
def get_activity(activity_id: int, db: Session = Depends(get_db)):
    """Obtener una actividad específica por su ID"""
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if activity is None:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")
    return activity