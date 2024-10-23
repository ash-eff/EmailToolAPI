from pydantic import BaseModel, EmailStr
from typing import List, Optional
from enum import Enum
from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class KeywordType(str, Enum):
    INPUT = "Input Field"
    DROPDOWN = "Dropdown Menu"

class ProjectDB(Base):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    signature_block = Column(Text)

    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("UserDB", back_populates="projects")
    email_templates = relationship("EmailTemplateDB", back_populates="project")

class UserDB(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)  # hash later

    projects = relationship("ProjectDB", back_populates="user")

class EmailTemplateDB(Base):
    __tablename__ = 'email_templates'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    body = Column(Text)
    project_id = Column(Integer, ForeignKey('projects.id'))

    project = relationship("ProjectDB", back_populates="email_templates")
    keywords = relationship("KeyWordDB", back_populates="template")

class KeyWordDB(Base):
    __tablename__ = 'keywords'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String, nullable=False) 
    options = Column(Text)
    project_id = Column(Integer, ForeignKey('email_templates.id'))

    template = relationship("EmailTemplateDB", back_populates="keywords")

class ProjectBase(BaseModel):
    name: str
    signature_block: str

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
    pass

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