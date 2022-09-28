from fastapi import FastAPI
from pydantic import BaseModel
import json

usersFile = open("users.json")
users = json.load(usersFile)
app = FastAPI()

class Basic_user(BaseModel) :
    pseudo : str
    password : str

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


@app.get("/users")
async def item():
    return users


@app.get("/users/sort")
async def items_sort():
    return sorted(users, key=lambda x: x["score"], reverse=True)
