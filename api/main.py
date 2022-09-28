from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel
import json

app = FastAPI()

users_read_json = open("users.json","r")
users = json.load(users_read_json)

class current_game(BaseModel):
    pseudo: str
    password: str
    score: str

@app.get("/questions")
def read_questions():
    with open("questions.json", "r") as f:
        questions = json.load(f)
    return questions

@app.patch("/upload")
async def upload_score(current_score: current_game):
    for user in users:
        if current_score.pseudo == user["pseudo"] and current_score.password == user["password"]:
            user["score"] = current_score.score
    print(users)
    return