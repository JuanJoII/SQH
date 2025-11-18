from pydantic import BaseModel
from typing import Literal, Dict, Optional

AnswerOptions = Literal['a', 'b', 'c', 'd']

class UnlockedAvatar(BaseModel):
    id: str
    name: str
    image_url: str
    is_new: bool = True

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
    unlocked_avatar: Optional[UnlockedAvatar] = None
    recomended_tags: Optional[list[str]] = None