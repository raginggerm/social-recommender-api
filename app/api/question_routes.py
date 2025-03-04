from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.base import get_db
from app.models.personality import Question
from app.schemas.schemas import QuestionCreate, Question as QuestionSchema

router = APIRouter(
    prefix="/questions",
    tags=["questions"]
)

@router.post("/", response_model=QuestionSchema)
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    """Crear una nueva pregunta para el cuestionario"""
    db_question = Question(
        text=question.text,
        category=question.category,
        weight=question.weight
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.get("/", response_model=List[QuestionSchema])
def get_all_questions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener todas las preguntas del cuestionario"""
    questions = db.query(Question).offset(skip).limit(limit).all()
    return questions

@router.get("/{question_id}", response_model=QuestionSchema)
def get_question(question_id: int, db: Session = Depends(get_db)):
    """Obtener una pregunta específica por su ID"""
    question = db.query(Question).filter(Question.id == question_id).first()
    if question is None:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")
    return question

@router.put("/{question_id}", response_model=QuestionSchema)
def update_question(question_id: int, question_update: QuestionCreate, db: Session = Depends(get_db)):
    """Actualizar una pregunta existente"""
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if db_question is None:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")
    
    for field, value in question_update.dict().items():
        setattr(db_question, field, value)
    
    db.commit()
    db.refresh(db_question)
    return db_question

@router.delete("/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db)):
    """Eliminar una pregunta"""
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if db_question is None:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")
    
    db.delete(db_question)
    db.commit()
    return {"message": "Pregunta eliminada exitosamente"}