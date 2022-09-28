from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel
import json

app = FastAPI()

class current_game(BaseModel):
    username: str
    password: str
    score: float

@app.get("/questions")
def read_questions():
    with open("questions.json", "r") as f:
        questions = json.load(f)
    return questions

@app.post("/upload")
async def upload_score(current_score: current_game ):
    if 
    return current_score
