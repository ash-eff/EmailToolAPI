from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify a list of origins instead of "*" for more security
    allow_credentials=True,
    allow_methods=["*"],  # Or specify ['GET', 'POST', 'PUT', 'DELETE']
    allow_headers=["*"],  # Or specify which headers are allowed
)

app.include_router(router)