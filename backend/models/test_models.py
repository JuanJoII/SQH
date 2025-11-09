from pydantic import BaseModel
from typing import Literal, Dict

AnswerOptions = Literal['a', 'b', 'c', 'd']

class TestAnswerModel(BaseModel):
    q1: AnswerOptions
    q2: AnswerOptions
    q3: AnswerOptions
    q4: AnswerOptions
    q5: AnswerOptions
    q6: AnswerOptions

class TestResultResponse(BaseModel):
    main_affinity: str
    score: int
    title: str
    description: str
    emoji: str
    is_tie: bool
    all_scores: Dict[str, int]