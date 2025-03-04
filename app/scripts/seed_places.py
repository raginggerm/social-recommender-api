from sqlalchemy.orm import Session
from app.database.base import SessionLocal
from app.models.personality import Place

def seed_places():
    db = SessionLocal()
    
    # Lista de lugares en Monterrey
    places = [
        {
            "name": "Parque Fundidora",
            "description": "Parque público con áreas verdes, museos y espacios para actividades al aire libre",
            "category": "park",
            "address": "Av. Fundidora y Adolfo Prieto S/N, Obrera, 64010 Monterrey",
            "latitude": 25.6785,
            "longitude": -100.2843,
            "introversion_level": 40.0,
            "activity_level": 80.0,
            "social_level": 60.0,
            "cultural_level": 70.0,
            "outdoor_level": 90.0,
            "cost_level": 1,
            "rating": 4.8
        },
        {
            "name": "Museo de Historia Mexicana",
            "description": "Museo que exhibe la historia de México desde la época prehispánica",
            "category": "museum",
            "address": "Dr. Coss 445, Centro, 64000 Monterrey",
            "latitude": 25.6690,
            "longitude": -100.2889,
            "introversion_level": 70.0,
            "activity_level": 30.0,
            "social_level": 40.0,
            "cultural_level": 90.0,
            "outdoor_level": 10.0,
            "cost_level": 2,
            "rating": 4.7
        },
        {
            "name": "Barrio Antiguo",
            "description": "Zona histórica con bares, restaurantes y vida nocturna",
            "category": "entertainment",
            "address": "Barrio Antiguo, Centro, Monterrey",
            "latitude": 25.6651,
            "longitude": -100.3099,
            "introversion_level": 20.0,
            "activity_level": 70.0,
            "social_level": 90.0,
            "cultural_level": 60.0,
            "outdoor_level": 50.0,
            "cost_level": 2,
            "rating": 4.5
        },
        {
            "name": "Macroplaza",
            "description": "Plaza principal de Monterrey con monumentos y áreas verdes",
            "category": "plaza",
            "address": "Centro, 64000 Monterrey",
            "latitude": 25.6672,
            "longitude": -100.3099,
            "introversion_level": 50.0,
            "activity_level": 60.0,
            "social_level": 70.0,
            "cultural_level": 60.0,
            "outdoor_level": 80.0,
            "cost_level": 1,
            "rating": 4.6
        },
        {
            "name": "Sierra Madre",
            "description": "Centro comercial con tiendas, restaurantes y cine",
            "category": "mall",
            "address": "Av. José Vasconcelos 1000, Del Valle, San Pedro Garza García",
            "latitude": 25.6508,
            "longitude": -100.3384,
            "introversion_level": 60.0,
            "activity_level": 50.0,
            "social_level": 70.0,
            "cultural_level": 40.0,
            "outdoor_level": 20.0,
            "cost_level": 3,
            "rating": 4.5
        },
        {
            "name": "Planetario Alfa",
            "description": "Centro científico y cultural con exposiciones interactivas",
            "category": "museum",
            "address": "Av. Roberto Garza Sada 1000, Carrizalejo, San Pedro Garza García",
            "latitude": 25.6444,
            "longitude": -100.3349,
            "introversion_level": 60.0,
            "activity_level": 50.0,
            "social_level": 40.0,
            "cultural_level": 90.0,
            "outdoor_level": 20.0,
            "cost_level": 2,
            "rating": 4.7
        },
        {
            "name": "Parque Chipinque",
            "description": "Área natural protegida ideal para senderismo y actividades al aire libre",
            "category": "nature",
            "address": "Carretera a Chipinque Km. 2.5, San Pedro Garza García",
            "latitude": 25.6161,
            "longitude": -100.3594,
            "introversion_level": 40.0,
            "activity_level": 90.0,
            "social_level": 30.0,
            "cultural_level": 40.0,
            "outdoor_level": 100.0,
            "cost_level": 2,
            "rating": 4.8
        },
        {
            "name": "Café Útero",
            "description": "Café cultural con ambiente tranquilo y artístico",
            "category": "cafe",
            "address": "Morelos 823, Barrio Antiguo, Centro, Monterrey",
            "latitude": 25.6654,
            "longitude": -100.3104,
            "introversion_level": 80.0,
            "activity_level": 20.0,
            "social_level": 40.0,
            "cultural_level": 70.0,
            "outdoor_level": 30.0,
            "cost_level": 2,
            "rating": 4.6
        }
    ]
    
    for place_data in places:
        place = Place(**place_data)
        db.add(place)
    
    try:
        db.commit()
        print("Lugares añadidos exitosamente")
    except Exception as e:
        print(f"Error al añadir lugares: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_places()