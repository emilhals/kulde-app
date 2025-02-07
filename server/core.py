from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 

import CoolProp.CoolProp as CP

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/simulator/{refrigerant}/{room_temp}/get-pressures")
def read_pressures(refrigerant, room_temp: int):
    p_LP = CP.PropsSI("P", "T", room_temp + 273, "Q", 1, refrigerant)
    T_HP = 50 - room_temp
    T_HP = max(T_HP, room_temp + 5)
    p_HP = CP.PropsSI("P", "T", T_HP + 273, "Q", 0, refrigerant)
    return {"LP": p_LP, "HP": p_HP}
