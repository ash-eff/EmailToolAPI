from typing import List, Optional
from .models import User, UserCreate, Project, ProjectCreate

users_db = []
projects_db = []

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
    new_user = User(id=len(users_db) + 1, email=user.email, full_name=user.full_name)
    users_db.append(new_user)
    return new_user

def get_user(user_id: int) -> Optional[User]:
    for user in users_db:
        if user.id == user_id:
            return user
    return None

def read_users() -> List[User]:
    return users_db