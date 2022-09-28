from fastapi import FastAPI
from pydantic import BaseModel
import json

usersFile = open("users.json")
users = json.load(usersFile)
app = FastAPI()

class login(BaseModel) :
    pseudo : str
    password : str

@app.post("/login")
async def login_user(login: login) :
    for user in users :
        if login.pseudo == user['pseudo'] and login.password == user['password'] :
            return user

    return {}

# @app.post("/register")