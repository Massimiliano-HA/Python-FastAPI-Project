from fastapi import FastAPI
from pydantic import BaseModel
import json

data = json.load(open("users.json"))

app = FastAPI()
class recup_data(BaseModel):
     pseudo: str
     password: str
     new_pseudo: str
     new_password: str

@app.patch("/change_pseudo")
def change_name(x: recup_data):
     for a in data:
          if a['pseudo'] == x.pseudo and a['password'] == x.password:
               a['pseudo'] = x.new_pseudo

@app.patch("change_password")
def change_password(y: recup_data):
     for b in data:
          if b['pseudo'] == y.pseudo and b['password'] == y.password:
               b['password'] = y.new_password