from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

origins = [
    "http://127.0.0.1",
    "http://127.0.0.1:5500",
    "http://93.95.32.114"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "PATCH",
        "PUT",
        "DELETE"
    ],
    allow_headers=["*"],
)

users_read_json = open("users.json", "r")
users = json.load(users_read_json)

# ----------- CLASSES ------------

"""
Definition of every classes used in the API
- current_game
    params: pseudo, password, score
- Basic_user
    params: pseudo, password
- recup_data
    params: pseudo, password, new_pseudo, new_password
"""


class current_game(BaseModel):
    pseudo: str
    password: str
    score: str


class Basic_user(BaseModel):
    pseudo: str
    password: str


class recup_data(BaseModel):
    pseudo: str
    password: str
    new_pseudo: str | None = None
    new_password: str | None = None

# --------------------------------
# ------------- API --------------


"""
Descriptions of all functions from the API :
- Function that retrieves questions from questions.json : 
  root : /questions (GET)

- Function that retrieves users from users.json : 
  root : /users (GET)

- Function that allows players to be sorted according to their score : 
  root : /ranking (GET)

- Function that allows you to connect with your username and password by comparing with the data in users.json : 
  root : /login (POST)
  params : login: Basic_user

- Function that allows you to create an account with username and password by adding the data in users.json : 
  root : /register (POST)
  params : new_user: Basic_user

- Function that allows you to update your score in users.json according to your number of correct answers to questions : 
  root : /upload (PATCH)
  params : current_score: current_game

- Function that allows you to modify your pseudo and updates it in users.json : 
  root : /change_pseudo (PATCH)
  params : x: recup_data

- Function that allows you to modify your password and updates it in users.json : 
  root : /change_password (PATCH)
  params : y: recup_data

- Function that allows to delete an account in users.json from the logged in account : 
  root : /delete (DELETE)
  params : deleteUser: Basic_user
"""


# ---------- GET

# Function that retrieves questions from questions.json :
@app.get("/questions")
def read_questions():
    with open("questions.json", encoding="utf-8") as f:
        questions = json.load(f)
    return questions


# Function that retrieves users from users.json :
@app.get("/users")
async def item():
    return users


# Function that allows players to be sorted according to their score :
@app.get("/ranking")
async def items_sort():
    return sorted(users, key=lambda x: x["score"], reverse=True)

# ---------- POST


# Function that allows you to connect with your username and password by comparing with the data in users.json :
@app.post("/login")
async def login_user(login: Basic_user):
    for user in users:
        if login.pseudo == user['pseudo'] and login.password == user['password']:
            return user

    return {}


# Function that allows you to create an account with username and password by adding the data in users.json :
@app.post("/register")
async def register_user(new_user: Basic_user):
    new_element = {
        "pseudo": new_user.pseudo,
        "password": new_user.password,
        "score": "null"
    }
    users.append(new_element)
    update_database(users)
    return

# ---------- PATCH


# Function that allows you to update your score in users.json according to your number of correct answers to questions :
@app.patch("/upload")
async def upload_score(current_score: current_game):
    for user in users:
        if current_score.pseudo == user["pseudo"] and current_score.password == user["password"]:
            user["score"] = current_score.score
            update_database(users)
    print(users)


# Function that allows you to modify your pseudo and updates it in users.json :
@app.patch("/change_pseudo")
def change_name(x: recup_data):
    for a in users:
        if a['pseudo'] == x.pseudo and a['password'] == x.password:
            a['pseudo'] = x.new_pseudo
            update_database(users)


# Function that allows you to modify your password and updates it in users.json :
@app.patch("/change_password")
def change_password(y: recup_data):
    for b in users:
        if b['pseudo'] == y.pseudo and b['password'] == y.password:
            b['password'] = y.new_password
            update_database(users)

# ---------- DELETE


# Function that allows to delete an account in users.json from the logged in account :
@app.delete("/delete")
async def delete_item(deleteUser: Basic_user):
    for user in users:
        if (user["pseudo"] == deleteUser.pseudo):
            users.remove(user)
            update_database(users)
    return

# --------------------------------
# ---------- FUNCTIONS -----------


def update_database(data):
    open("users.json", "w").write(json.dumps(data))
