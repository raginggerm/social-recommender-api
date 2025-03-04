from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.base import Base

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    category = Column(String, nullable=False)
    weight = Column(Float, default=1.0)
    
    responses = relationship("UserResponse", back_populates="question")

class UserResponse(Base):
    __tablename__ = "user_responses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    response_value = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    profile_id = Column(Integer, ForeignKey("personality_profiles.id"))
    
    question = relationship("Question", back_populates="responses")
    personality_profile = relationship("PersonalityProfile", back_populates="responses")

class PersonalityProfile(Base):
    __tablename__ = "personality_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True)
    
    introversion_score = Column(Float)
    activity_level = Column(Float)
    social_preference = Column(Float)
    outdoor_interest = Column(Float)
    cultural_interest = Column(Float)
    
    last_updated = Column(DateTime, default=datetime.utcnow)
    
    responses = relationship("UserResponse", back_populates="personality_profile")

class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    location = Column(String)
    
    # Puntuaciones requeridas (0-100)
    introversion_level = Column(Float, default=50.0)
    activity_level = Column(Float, default=50.0)
    social_level = Column(Float, default=50.0)
    cultural_level = Column(Float, default=50.0)
    outdoor_level = Column(Float, default=50.0)
    
    # Metadatos
    category = Column(String)
    cost_level = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
class Place(Base):
    __tablename__ = "places"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)  # restaurant, park, museum, etc.
    address = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    # Niveles de compatibilidad (0-100)
    introversion_level = Column(Float, default=50.0)
    activity_level = Column(Float, default=50.0)
    social_level = Column(Float, default=50.0)
    cultural_level = Column(Float, default=50.0)
    outdoor_level = Column(Float, default=50.0)
    
    # Metadatos
    cost_level = Column(Integer, default=2)  # 1: bajo, 2: medio, 3: alto
    rating = Column(Float, default=0.0)  # 0-5 estrellas
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)