from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


app = FastAPI()


@app.post("/items/")
async def create_item(item: Item):
    return item


# *************************************************************************************
# SECOND STEP OF THE TUTORIAL FASTAPI
#
# from fastapi import FastAPI
#
# app = FastAPI()
#
# fake_items_db = [{"item_name": "1 Foo"}, {"item_name": "2 Bar"}, {"item_name": "3 Baz"}, {"item_name": "4 Foo"}, {"item_name": "5 Bar"}, {"item_name": "6 Baz"}, {"item_name": "7 Foo"}, {"item_name": "8 Bar"}, {"item_name": "9 Baz"}, {"item_name": "10 Foo"}, {"item_name": "11 Bar"}, {"item_name": "12 Baz"}, {"item_name": "13 Foo"}, {"item_name": "14 Bar"}, {"item_name": "15 Baz"}, {"item_name": "16 Foo"}, {"item_name": "17 Bar"}, {"item_name": "18 Baz"}, {"item_name": "19 Foo"}, {"item_name": "20 Bar"}, {"item_name": "21 Baz"},{"item_name": "22 Foo"}, {"item_name": "23 Bar"}, {"item_name": "24 Baz"} ]
#
#
# @app.get("/items/")
# async def read_item(skip: int = 0, limit: int = 10):
#     return fake_items_db[skip : skip + limit]
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