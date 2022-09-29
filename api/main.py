from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

origins = [
    "http://127.0.0.1",
    "http://93.95.32.114"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

users_read_json = open("users.json", "r")
users = json.load(users_read_json)

# ----------- CLASSES ------------

class current_game(BaseModel):
    pseudo: str
    password: str
    score: str
    
class Basic_user(BaseModel) :
    pseudo : str
    password : str

class recup_data(BaseModel):
    pseudo: str
    password: str
    new_pseudo: str | None = None
    new_password: str | None = None

# --------------------------------
# ------------- API --------------

# ---------- GET

@app.get("/questions")
def read_questions():
    with open("questions.json", "r") as f:
        questions = json.load(f)
    return questions

@app.get("/users")
async def item():
    return users


@app.get("/ranking")
async def items_sort():
    return sorted(users, key=lambda x: x["score"], reverse=True)

# ---------- POST

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
    update_database(users)
    return

# ---------- PATCH

@app.patch("/upload")
async def upload_score(current_score: current_game):
    for user in users:
        if current_score.pseudo == user["pseudo"] and current_score.password == user["password"]:
            user["score"] = current_score.score
            update_database(users)
    print(users)

@app.patch("/change_pseudo")
def change_name(x: recup_data):
     for a in users:
          if a['pseudo'] == x.pseudo and a['password'] == x.password:
               a['pseudo'] = x.new_pseudo
               update_database(users)

@app.patch("change_password")
def change_password(y: recup_data):
     for b in users:
          if b['pseudo'] == y.pseudo and b['password'] == y.password:
               b['password'] = y.new_password
               update_database(users)

# --------------------------------
# ---------- FUNCTIONS -----------

def update_database(data):
    open("users.json", "w").write(json.dumps(data))