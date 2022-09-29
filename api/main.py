from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel
import json

app = FastAPI()

users_read_json = open("users.json", "r")
users = json.load(users_read_json)

class current_game(BaseModel):
    pseudo: str
    password: str
    score: str
    
class Basic_user(BaseModel) :
    pseudo : str
    password : str

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

@app.post("/login")
async def login_user(login : Basic_user) :
    for user in users :
        if login.pseudo == user['pseudo'] and login.password == user['password'] :
            return user

    return {}

@app.post("/register")
async def register_user(new_user : Basic_user) :
    new_element = {
        "pseudo":new_user.pseudo,
        "password":new_user.password,
        "score":"null"
    }
    users.append(new_element)
    a = open("users.json", "w")
    a.write(json.dumps(users))
    return