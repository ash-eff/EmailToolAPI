from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import router
from .models import ProjectCreate
from .crud import create_project
from contextlib import asynccontextmanager

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup event
    initialize_projects()
    yield

app.router.lifespan_context = lifespan

app.include_router(router)

def initialize_projects():
    initial_projects = [
        {
            "name": "Arizona",
            "signature_block": "AZ Signature Block"
        },
        {
            "name": "Arkansas",
            "signature_block": "AR Signature Block"
        },
        {
            "name": "Connecticut",
            "signature_block": "CT Signature Block"
        },
    ]
    for project_data in initial_projects:
        print(project_data)
        create_project(ProjectCreate(**project_data))