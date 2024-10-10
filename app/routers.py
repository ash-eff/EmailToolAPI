from fastapi import APIRouter, HTTPException
from typing import List
from . import crud
from .models import User, UserCreate, Project, ProjectCreate, KeyWord, KeyWordCreate, EmailTemplate, EmailTemplateCreate

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

@router.get("/users/", response_model=List[User])
def read_users():
    return crud.read_users()

@router.post("/keywords/", response_model=KeyWord)
def create_keyword(keyword: KeyWordCreate):
    return crud.create_keyword(keyword)

@router.get("/keywords/{keyword_id}", response_model=KeyWord)
def read_keyword(keyword_id: int):
    keyword = crud.get_keyword(keyword_id)
    if keyword is None:
        raise HTTPException(status_code=404, detail="Keyword not found")
    return keyword

@router.get("/keywords/", response_model=List[KeyWord])
def read_keywords():
    return crud.get_keywords()

@router.post("/email_templates/", response_model=EmailTemplate)
def create_email_template(email_template: EmailTemplateCreate):
    return crud.create_email_template(email_template)

@router.get("/email_templates/{email_template_id}", response_model=EmailTemplate)
def read_email_template(email_template_id: int):
    email_template = crud.get_email_template(email_template_id)
    if email_template is None:
        raise HTTPException(status_code=404, detail="Email Template not found")
    return email_template

@router.get("/email_templates/", response_model=List[EmailTemplate])
def read_email_templates():
    return crud.get_email_templates()