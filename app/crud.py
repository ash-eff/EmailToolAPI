from typing import List, Optional
from .models import User, UserCreate, Project, ProjectCreate, KeyWord, KeyWordCreate, KeywordType, EmailTemplate, EmailTemplateCreate

users_db = []
projects_db = []
keywords_db = []
email_templates_db = []

def create_project(project: ProjectCreate) -> Project:
    new_project = Project(id=len(projects_db) + 1, name=project.name)
    projects_db.append(new_project)
    return new_project

def get_project(project_id: int) -> Optional[Project]:
    for project in projects_db:
        if project.id == project_id:
            return project
    return None

def get_projects() -> List[Project]:
    return projects_db

def create_user(user: UserCreate) -> User:
    new_user_id = len(users_db) + 1
    new_user = User(
        id=new_user_id, 
        full_name=user.full_name, 
        email=user.email, 
        projects=user.projects
        )
    users_db.append(new_user)
    return new_user

def get_user(user_id: int) -> Optional[User]:
    for user in users_db:
        if user.id == user_id:
            return user
    return None

def read_users() -> List[User]:
    return users_db

def create_keyword(keyword: KeyWordCreate) -> KeyWord:
    new_keyword_id = len(keywords_db) + 1

    capitalized_options = [option.title() for option in keyword.options]

    new_keyword = KeyWord(
        id=new_keyword_id, 
        name=keyword.name.capitalize(), 
        type=keyword.type, 
        options=capitalized_options
        )
    keywords_db.append(new_keyword)
    return new_keyword

def get_keyword(keyword_id: int) -> Optional[KeyWord]:
    for keyword in keywords_db:
        if keyword.id == keyword_id:
            return keyword
    return None

def get_keyword_types() -> List[KeywordType]:
    return KeywordType
    
def get_keywords() -> List[KeyWord]:
    return keywords_db

def create_email_template(email_template: EmailTemplateCreate) -> EmailTemplate:
    email_template_id = len(email_templates_db) + 1
    new_email_template = EmailTemplate(
        id = email_template_id, 
        name=email_template.name, 
        body=email_template.body, 
        keywords=email_template.keywords,
        project=email_template.project
        )
    email_templates_db.append(new_email_template)
    return new_email_template

def get_email_template(email_template_id: int) -> Optional[EmailTemplate]:
    for email_template in email_templates_db:
        if email_template.id == email_template_id:
            return email_template
    return None

def get_email_templates() -> List[EmailTemplate]:
    return email_templates_db