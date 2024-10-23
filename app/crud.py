from typing import List, Optional
from .models import (ProjectDB, UserDB, EmailTemplateDB, 
                     KeyWordDB, User, UserCreate, Project, 
                     ProjectCreate, KeyWord, KeyWordCreate, 
                     KeywordType, EmailTemplate, EmailTemplateCreate)
from sqlalchemy.orm import Session

def create_project(db: Session, project: ProjectCreate) -> Project:
    new_project = ProjectDB(
        name=project.name, 
        signature_block=project.signature_block
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

def get_project(db: Session, project_id: int) -> Optional[Project]:
    return db.query(ProjectDB).filter(ProjectDB.id == project_id).first()

def get_projects(db: Session) -> List[Project]:
    return db.query(ProjectDB).all()

def create_user(db: Session, user: UserCreate) -> User:
    new_user = UserDB(full_name=user.full_name, email=user.email, password=user.password)  # hash password later
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(UserDB).filter(UserDB.id == user_id).first()

def read_users(db: Session) -> List[User]:
    return db.query(UserDB).all()

def create_keyword(db: Session, keyword: KeyWordCreate) -> KeyWord:
    capitalized_options = [option.title() for option in keyword.options]
    new_keyword = KeyWordDB(
        name=keyword.name.title(), 
        type=keyword.type, 
        options=capitalized_options
        )
    db.add(new_keyword)
    db.commit()
    db.refresh(new_keyword)
    return new_keyword

def get_keyword_types(db: Session, ) -> List[KeywordType]:
    return KeywordType

def get_keyword(db: Session, keyword_id: int) -> Optional[KeyWord]:
    return db.query(KeyWordDB).filter(KeyWordDB.id == keyword_id).first()
    
def get_keywords(db: Session, ) -> List[KeyWord]:
    return db.query(KeyWordDB).all()

def delete_keyword(db: Session, keyword_id: int) -> Optional[KeyWord]:
    keyword = db.query(KeyWordDB).filter(KeyWordDB.id == keyword_id).first()
    if keyword:
        db.delete(keyword)
        db.commit()
        return keyword
    return None

def update_keyword(db: Session, keyword_id: int, updated_keyword: KeyWordCreate) -> Optional[KeyWord]:
    keyword = db.query(KeyWordDB).filter(KeyWordDB.id == keyword_id).first()
    if keyword:
        keyword.name = updated_keyword.name
        keyword.type = updated_keyword.type
        keyword.options = updated_keyword.options
        db.commit()
        db.refresh(keyword)
        return keyword
    return None

def create_email_template(db: Session, email_template: EmailTemplateCreate) -> EmailTemplate:
    new_email_template = EmailTemplateDB(
        name=email_template.name, 
        body=email_template.body, 
        keywords=email_template.keywords,
        project=email_template.project
        )
    db.add(new_email_template)
    db.commit()
    db.refresh(new_email_template)
    return new_email_template

def get_email_template(db: Session, email_template_id: int) -> Optional[EmailTemplate]:
    return db.query(EmailTemplateDB).filter(EmailTemplateDB.id == email_template_id).first()

def get_email_templates(db: Session, ) -> List[EmailTemplate]:
    return db.query(EmailTemplateDB).all()

def update_email_template(db: Session, email_template_id: int, updated_template: EmailTemplateCreate) -> Optional[EmailTemplate]:
    email_template = db.query(EmailTemplateDB).filter(EmailTemplateDB.id == email_template_id).first()
    if email_template:
        email_template.name = updated_template.name
        email_template.body = updated_template.body
        email_template.keywords = updated_template.keywords
        email_template.project = updated_template.project
        db.commit()
        db.refresh(email_template)
        return email_template
    return None

def delete_email_template(db: Session, email_template_id: int) -> Optional[EmailTemplate]:
    email_template = db.query(EmailTemplateDB).filter(EmailTemplateDB.id == email_template_id).first()
    if email_template:
        db.delete(email_template)
        db.commit()
        return email_template
    return None