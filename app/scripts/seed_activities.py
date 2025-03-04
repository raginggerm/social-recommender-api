from sqlalchemy.orm import Session
from app.database.base import SessionLocal
from app.models.personality import Activity

def seed_activities():
    db = SessionLocal()
    
    activities = [
        {
            "name": "Grupos de lectura",
            "description": "Únete a un club de lectura para discutir libros y conocer personas con intereses similares",
            "location": "Varios lugares",
            "introversion_level": 70.0,
            "activity_level": 20.0,
            "social_level": 50.0,
            "cultural_level": 90.0,
            "outdoor_level": 10.0,
            "category": "cultural",
            "cost_level": 1
        },
        {
            "name": "Clases de baile",
            "description": "Aprende diferentes estilos de baile mientras socializas y haces ejercicio",
            "location": "Estudios de baile locales",
            "introversion_level": 30.0,
            "activity_level": 80.0,
            "social_level": 90.0,
            "cultural_level": 70.0,
            "outdoor_level": 0.0,
            "category": "fitness",
            "cost_level": 2
        },
        {
            "name": "Senderismo grupal",
            "description": "Explora rutas naturales con un grupo de entusiastas del senderismo",
            "location": "Parques y montañas cercanas",
            "introversion_level": 50.0,
            "activity_level": 90.0,
            "social_level": 70.0,
            "cultural_level": 30.0,
            "outdoor_level": 100.0,
            "category": "outdoor",
            "cost_level": 1
        },
        {
            "name": "Talleres de arte",
            "description": "Participa en talleres de pintura, cerámica o dibujo con otros artistas",
            "location": "Estudios de arte locales",
            "introversion_level": 60.0,
            "activity_level": 40.0,
            "social_level": 60.0,
            "cultural_level": 90.0,
            "outdoor_level": 0.0,
            "category": "cultural",
            "cost_level": 2
        },
        {
            "name": "Deportes en equipo casual",
            "description": "Únete a grupos de deportes recreativos como fútbol o voleibol",
            "location": "Parques y centros deportivos",
            "introversion_level": 20.0,
            "activity_level": 100.0,
            "social_level": 90.0,
            "cultural_level": 20.0,
            "outdoor_level": 80.0,
            "category": "sports",
            "cost_level": 1
        }
    ]
    
    for activity_data in activities:
        activity = Activity(**activity_data)
        db.add(activity)
    
    try:
        db.commit()
        print("Actividades añadidas exitosamente")
    except Exception as e:
        print(f"Error al añadir actividades: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_activities()