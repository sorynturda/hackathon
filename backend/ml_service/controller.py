from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from logic import get_matches_for_resume, get_matches_for_jd
app = FastAPI(title="ML Service API")

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class InputDTO(BaseModel):
    skill: str
    weight: float

class Item(BaseModel):
    id: int
    userId: int
    limit: int
    inputs: List[InputDTO]

@app.post("/api/find_match/cv")
async def find_match_cv(item: Item):
    response = get_matches_for_resume(item.id, item.userId, item.limit)
    print(response)
    return response


@app.post("/api/find_match/jd")
async def find_match_cv(item: Item):
    response = get_matches_for_jd(item.id, item.userId, item.limit)
    print(response)
    return response