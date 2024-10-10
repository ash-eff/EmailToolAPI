from fastapi import APIRouter, HTTPException
from typing import List
from . import crud
from .models import User, UserCreate, Project, ProjectCreate

router = APIRouter()

@router.post("/projects/", response_model=Project)
def create_project(project: ProjectCreate):
    return crud.create_project(project)

@router.get("/projects/{project_id}", response_model=Project)
def read_project(project_id: int):
    project = crud.get_project(project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.get("/projects/", response_model=List[Project])
def read_projects():
    return crud.get_projects()

@router.post("/users/", response_model=User)
def create_user(user: UserCreate):
    return crud.create_user(user)

@router.get("/users/{user_id}", response_model=User)
def read_user(user_id: int):
    user = crud.get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user