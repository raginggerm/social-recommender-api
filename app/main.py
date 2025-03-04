from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.api import question_routes
from app.api import response_routes
from app.api import activity_routes
from app.api import recommendation_routes
from app.api import place_routes

from app.database.base import SessionLocal, engine, Base
from app.models import personality  # Importamos los modelos
from app.schemas import schemas  # Importamos los schemas

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Crear la aplicación FastAPI
app = FastAPI(
    title="Social Recommender API",
    description="API para recomendación de actividades sociales basada en personalidad",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de rutas 
app.include_router(question_routes.router)
app.include_router(response_routes.router)
app.include_router(activity_routes.router)
app.include_router(recommendation_routes.router)
app.include_router(place_routes.router, prefix="/api", tags=["places"])

# Endpoint de prueba
@app.get("/")
async def read_root():
    return {
        "status": "online",
        "message": "Bienvenido a la API del Recomendador Social",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)