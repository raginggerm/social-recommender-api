from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

# Schemas para Question
class QuestionBase(BaseModel):
    text: str = Field(..., description="Texto de la pregunta")
    category: str = Field(..., description="Categoría de la pregunta")
    weight: float = Field(default=1.0, description="Peso de la pregunta en el cálculo final")

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int
    
    class Config:
        from_attributes = True

# Schemas para UserResponse
class UserResponseBase(BaseModel):
    question_id: int
    response_value: int = Field(..., ge=1, le=5, description="Valor de la respuesta (1-5)")

class UserResponseCreate(UserResponseBase):
    pass

class UserResponse(UserResponseBase):
    id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True

# Schemas para PersonalityProfile
class PersonalityProfileBase(BaseModel):
    introversion_score: float = Field(..., ge=0, le=100)
    activity_level: float = Field(..., ge=0, le=100)
    social_preference: float = Field(..., ge=0, le=100)
    outdoor_interest: float = Field(..., ge=0, le=100)
    cultural_interest: float = Field(..., ge=0, le=100)

class PersonalityProfileCreate(PersonalityProfileBase):
    user_id: int

class PersonalityProfile(PersonalityProfileBase):
    id: int
    user_id: int
    last_updated: datetime
    
    class Config:
        from_attributes = True

# Schema para el cuestionario completo
class QuestionnaireResponse(BaseModel):
    user_id: int
    responses: List[UserResponseBase]

# Schemas para Activity
class ActivityBase(BaseModel):
    name: str
    description: str
    location: str
    introversion_level: float = Field(ge=0, le=100)
    activity_level: float = Field(ge=0, le=100)
    social_level: float = Field(ge=0, le=100)
    cultural_level: float = Field(ge=0, le=100)
    outdoor_level: float = Field(ge=0, le=100)
    category: str
    cost_level: int = Field(ge=1, le=3)

class ActivityCreate(ActivityBase):
    pass

class Activity(ActivityBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        
        # Schemas para Place
class PlaceBase(BaseModel):
    name: str
    description: str
    category: str
    address: str
    latitude: float = Field(..., description="Latitud del lugar")
    longitude: float = Field(..., description="Longitud del lugar")
    introversion_level: float = Field(default=50.0, ge=0, le=100)
    activity_level: float = Field(default=50.0, ge=0, le=100)
    social_level: float = Field(default=50.0, ge=0, le=100)
    cultural_level: float = Field(default=50.0, ge=0, le=100)
    outdoor_level: float = Field(default=50.0, ge=0, le=100)
    cost_level: int = Field(default=2, ge=1, le=3)
    rating: float = Field(default=0.0, ge=0, le=5)

class PlaceCreate(PlaceBase):
    pass

class Place(PlaceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PlaceSearch(BaseModel):
    latitude: float
    longitude: float
    radius: float = Field(default=15.0, description="Radio de búsqueda en kilómetros")