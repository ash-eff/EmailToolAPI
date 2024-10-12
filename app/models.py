from pydantic import BaseModel, EmailStr
from typing import List, Optional

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

class KeyWordBase(BaseModel):
    name: str
    value: List[str]
    description: Optional[str] = None

class KeyWordCreate(KeyWordBase):
    pass

class KeyWord(KeyWordBase):
    id: int

    class Config:
        from_attributes = True

class EmailTemplateBase(BaseModel):
    name: str
    body: str

class EmailTemplateCreate(EmailTemplateBase):
    keywords: List[KeyWord]

class EmailTemplate(EmailTemplateBase):
    id: int
    keywords: List[KeyWord]

    class Config:
        from_attributes = True