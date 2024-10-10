from pydantic import BaseModel, EmailStr
from typing import List

class ProjectBase(BaseModel):
    name: str

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    projects: List[Project] = []

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True