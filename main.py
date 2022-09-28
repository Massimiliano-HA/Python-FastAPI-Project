
# *************************************************************************************
# SECOND STEP OF THE TUTORIAL FASTAPI
#
from fastapi import FastAPI


app = FastAPI()

items_db = [
    {"item_name": "Foo", "n": 1},
    {"item_name": "Bar", "n": 2},
    {"item_name": "Baz", "n": 3},
    {"item_name": "Foo", "n": 4},
    {"item_name": "Bar", "n": 5},
    {"item_name": "Foo", "n": 6},
    {"item_name": "Bar", "n": 7},
    {"item_name": "Baz", "n": 8},
    {"item_name": "Foo", "n": 9},
    {"item_name": "Bar", "n": 10},
]


@app.get("/items/")
async def read_item():
    return sorted(items_db, key=lambda x: x["n"], reverse=True)


#
#
# @app.get("/items/{item_id}")
# async def read_item(item_id: str, q: str | None = None, short: bool = False):
#     item = {"item_id": item_id}
#     if q:
#         item.update({"q": q})
#     if not short:
#         item.update(
#             {"description": "This is an amazing item that has a long description"}
#         )
#     return item
#
#
# @app.get("/users/{user_id}/items/{item_id}")
# async def read_user_item(
#     user_id: int, item_id: str, q: str | None = None, short: bool = False
# ):
#     item = {"item_id": item_id, "owner_id": user_id}
#     if q:
#         item.update({"q": q})
#     if not short:
#         item.update(
#             {"description": "This is an amazing item that has a long description"}
#         )
#     return item
#
#
# @app.get("/items/{item_id}")
# async def read_user_item(item_id: str, needy: str):
#     item = {"item_id": item_id, "needy": needy}
#     return item
#
# *************************************************************************************
# FIRST STEP OF THE TUTORIAL FASTAPI
#
# from enum import Enum
#
# from fastapi import FastAPI
#
#
# class ModelName(str, Enum):
#     samsung = "samsung"
#     apple = "apple"
#     xiaomi = "xiaomi"
#
#
# app = FastAPI()
#
#
# @app.get("/")
# async def root():
#     return {"message": "Hello World"}
#
#
# @app.get("/items/{item_id}")
# async def read_item(item_id: int):
#     return {"item_id": item_id}
#
#
# @app.get("/users/me")
# async def read_user_me():
#     return {"user_id": "the current user"}
#
#
# @app.get("/users/{user_id}")
# async def read_user(user_id: str):
#     return {"user_id": user_id}
#
#
# @app.get("/users")
# async def read_users():
#     return ["Rick", "Morty"]
#
#
# @app.get("/users")
# async def read_users2():
#     return ["Bean", "Elfo"]
#
#
# @app.get("/models/{model_name}")
# async def get_model(model_name: ModelName):
#     if model_name is ModelName.samsung:
#         return {"model_name": model_name, "message": "Bienvenue chez Samsung ! Découvrez nos gammes de produits high tech pour améliorer votre vie au quotidien"}
#
#     if model_name.value == "apple":
#         return {"model_name": model_name, "message": "Apple est une entreprise multinationale américaine qui crée et commercialise des produits électroniques grand public, des ordinateurs personnels et des logiciels"}
#
#     return {"model_name": model_name, "message": "Le futur est déjà là avec Xiaomi ! Mobile 5G, objets connectés, mobilité. Une large gamme..."}
#
#
# @app.get("/files/{file_path:path}")
# async def read_file(file_path: str):
#     return {"file_path": file_path}
# ******************************************************************************************************
