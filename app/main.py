from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import router
# from .crud import create_project
# from contextlib import asynccontextmanager
from .database import engine, Base

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the email template API!"}