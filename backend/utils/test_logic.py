# utils/test_logic.py
from typing import Dict

# Cada respuesta suma 1 punto a una técnica
ANSWER_TO_TECHNIQUE: Dict = {
    "q1": {"a": "ilustracion", "b": "forja", "c": "barro", "d": "telas"},
    "q2": {"a": "ilustracion", "b": "forja", "c": "barro", "d": "decoracion"},
    "q3": {"a": "ilustracion", "b": "forja", "c": "barro", "d": "decoracion"},
    "q4": {"a": "ilustracion", "b": "forja", "c": "barro", "d": "decoracion"},
    "q5": {"a": "ilustracion", "b": "forja", "c": "barro", "d": "decoracion"},
    "q6": {"a": "ilustracion", "b": "forja", "c": "barro", "d": "decoracion"},
}

# Normalizamos: "decoracion" incluye "telas", "barro" incluye "vasijas"
TECHNIQUE_NORMALIZATION: Dict = {
    "ilustracion": "Ilustración",
    "forja": "Forja",
    "barro": "Barro y Vasijas",
    "telas": "Decoración y Telas",
    "decoracion": "Decoración y Telas"
}