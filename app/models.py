from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional
from enum import Enum

class KeywordType(str, Enum):
    INPUT = "Input Field"
    DROPDOWN = "Dropdown Menu"

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
    projects: Optional[List[Project]] = []

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class KeyWordBase(BaseModel):
    name: str
    type: KeywordType
    options: Optional[List[str]] = []

class KeyWordCreate(KeyWordBase):
    keyword_link: str = ""

    @field_validator("keyword_link", mode="before")
    def set_keyword_link(cls, v, values):
        return "{" + values["name"] + "}"

class KeyWord(KeyWordBase):
    id: int

    class Config:
        from_attributes = True

class EmailTemplateBase(BaseModel):
    name: str
    body: str
    keywords: Optional[List[KeyWord]] = []
    project: Project

class EmailTemplateCreate(EmailTemplateBase):
    pass

class EmailTemplate(EmailTemplateBase):
    id: int

    class Config:
        from_attributes = True