"""
Script para crear todas las tablas en la base de datos
"""
# Importación correcta según la estructura del proyecto
from app.database.base import Base, engine

# Importa todos los modelos para que SQLAlchemy los registre
# Necesitamos importar explícitamente los modelos para que SQLAlchemy los conozca
from app.models.personality import Question, UserResponse, PersonalityProfile, Activity, Place

def create_tables():
    """Crea todas las tablas definidas en los modelos"""
    print("Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("Tablas creadas exitosamente")

if __name__ == "__main__":
    create_tables()