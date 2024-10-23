from fastapi import APIRouter, HTTPException, Depends
from typing import List
from . import crud
from .models import (User, UserCreate, Project, 
                     ProjectCreate, KeyWord, KeyWordCreate, 
                     KeywordType, EmailTemplate, EmailTemplateCreate)
from .database import get_db
from sqlalchemy.orm import Session

router = APIRouter()

# Project Routes
@router.post("/projects/", response_model=Project)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    return crud.create_project(db, project)

@router.get("/projects/{project_id}", response_model=Project)
def read_project(project_id: int, db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.get("/projects/", response_model=List[Project])
def read_projects(db: Session = Depends(get_db)):
    return crud.get_projects(db)

# User Routes
@router.post("/users/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)

@router.get("/users/{user_id}", response_model=User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/users/", response_model=List[User])
def read_users(db: Session = Depends(get_db)):
    return crud.read_users(db)

@router.get("/keyword_types/", response_model=List[KeywordType])
def get_keyword_types() -> List[KeywordType]:
    return KeywordType

@router.post("/keywords/", response_model=KeyWord)
def create_keyword(keyword: KeyWordCreate, db: Session = Depends(get_db)):
    return crud.create_keyword(db, keyword)

@router.get("/keywords/{keyword_id}", response_model=KeyWord)
def read_keyword(keyword_id: int, db: Session = Depends(get_db)):
    keyword = crud.get_keyword(db, keyword_id)
    if keyword is None:
        raise HTTPException(status_code=404, detail="Keyword not found")
    return keyword

@router.get("/keywords/", response_model=List[KeyWord])
def read_keywords(db: Session = Depends(get_db)):
    return crud.get_keywords(db)

@router.put("/keywords/{keyword_id}", response_model=KeyWord)
def update_keyword(keyword_id: int, updated_keyword: KeyWordCreate, db: Session = Depends(get_db)):
    keyword = crud.update_keyword(db, keyword_id, updated_keyword)
    if keyword is None:
        raise HTTPException(status_code=404, detail="Keyword not found")
    return keyword

@router.delete("/keywords/{keyword_id}")
def delete_keyword(keyword_id: int, db: Session = Depends(get_db)):
    keyword = crud.delete_keyword(db, keyword_id)
    if keyword is None:
        raise HTTPException(status_code=404, detail="Keyword not found")
    return {"message": "Keyword deleted successfully"}

# Email Template Routes
@router.post("/email_templates/", response_model=EmailTemplate)
def create_email_template(email_template: EmailTemplateCreate, db: Session = Depends(get_db)):
    return crud.create_email_template(db, email_template)

@router.get("/email_templates/{email_template_id}", response_model=EmailTemplate)
def read_email_template(email_template_id: int, db: Session = Depends(get_db)):
    email_template = crud.get_email_template(db, email_template_id)
    if email_template is None:
        raise HTTPException(status_code=404, detail="Email Template not found")
    return email_template

@router.get("/email_templates/", response_model=List[EmailTemplate])
def read_email_templates(db: Session = Depends(get_db)):
    return crud.get_email_templates(db)

@router.put("/email_templates/{email_template_id}", response_model=EmailTemplate)
def update_email_template(email_template_id: int, updated_template: EmailTemplateCreate, db: Session = Depends(get_db)):
    email_template = crud.update_email_template(db, email_template_id, updated_template)
    if email_template is None:
        raise HTTPException(status_code=404, detail="Email Template not found")
    return email_template

@router.delete("/email_templates/{email_template_id}")
def delete_email_template(email_template_id: int, db: Session = Depends(get_db)):
    email_template = crud.delete_email_template(db, email_template_id)
    if email_template is None:
        raise HTTPException(status_code=404, detail="Email Template not found")
    return {"message": "Email Template deleted successfully"}
