from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from logic import get_matches_for_resume, get_matches_for_jd, get_comprehensive_matches_for_resume, get_comprehensive_matches_for_job

app = FastAPI(title="ML Service API")

class InputDTO(BaseModel):
    skill: str
    weight: float

class Item(BaseModel):
    id: int
    userId: int
    limit: int
    inputs: List[InputDTO] = []

class CandidateResponse(BaseModel):
    cv_id: int
    candidate_name: str
    overall_match: float
    missing_skills_req: List[str]
    matching_skills_req: List[str]
    reasoning: str

class JobMatchResponse(BaseModel):
    job_position: str
    candidates: List[CandidateResponse]

@app.post("/api/find_match/cv")
async def find_match_cv(item: Item):
    response = get_comprehensive_matches_for_resume(item.id, item.userId, item.limit)
    print(response)
    return response

@app.post("/api/find_match/jd", response_model=JobMatchResponse)
async def find_match_jd(item: Item):
    formatted_inputs = [{"skill": input.skill, "weight": input.weight} for input in item.inputs]
    
    response = get_comprehensive_matches_for_job(
        id=item.id,
        userId=item.userId,
        limit=item.limit,
        custom_skills_inputs=formatted_inputs
    )
    print(response)
    return response
