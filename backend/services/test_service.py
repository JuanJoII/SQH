from collections import Counter
from utils.test_logic import ANSWER_TO_TECHNIQUE, TECHNIQUE_NORMALIZATION
from utils.test_descriptions import DESCRIPTIONS
from models.test_models import TestAnswerModel

def calculate_affinity(answers: TestAnswerModel) -> dict:
    # Paso 1: Contar puntos
    points = Counter()
    answer_dict = answers.dict()

    for question, option in answer_dict.items():
        technique = ANSWER_TO_TECHNIQUE[question][option]
        points[technique] += 1

    # Paso 2: Normalizar nombres
    normalized_points = {}
    for tech, score in points.items():
        normalized_name = TECHNIQUE_NORMALIZATION.get(tech, tech)
        normalized_points[normalized_name] = normalized_points.get(normalized_name, 0) + score

    # Paso 3: Encontrar ganador(es)
    max_score = max(normalized_points.values())
    winners = [tech for tech, score in normalized_points.items() if score == max_score]

    # Paso 4: Generar respuesta
    if len(winners) == 1:
        main = winners[0]
        desc = DESCRIPTIONS[main]
        result = {
            "main_affinity": main,
            "score": max_score,
            "title": desc["title"],
            "description": desc["description"],
            "emoji": desc["emoji"],
            "is_tie": False,
            "all_scores": dict(normalized_points)
        }
    else:
        # Empate → doble afinidad
        main1, main2 = winners[:2]
        desc1 = DESCRIPTIONS[main1]["title"]
        desc2 = DESCRIPTIONS[main2]["title"]
        result = {
            "main_affinity": f"{main1} + {main2}",
            "score": max_score,
            "title": f"Doble Afinidad: {desc1} y {desc2}",
            "description": f"Tu alma combina la esencia de **{main1.lower()}** con la armonía de **{main2.lower()}**. Eres único/a.",
            "emoji": "Corazón",
            "is_tie": True,
            "all_scores": dict(normalized_points)
        }

    return result