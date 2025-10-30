"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Enums for validation
class CourseLevel(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


# User Schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Course Schemas
class CourseBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1, max_length=100)
    level: CourseLevel
    duration: float = Field(..., gt=0, description="Duration in hours, must be positive")
   
    credits: int = Field(default=40, ge=1, le=100, description="Course credits (1-100)")
    rating: float = Field(default=4.5, ge=0, le=5, description="Course rating (0-5)")
    duration_text: str = Field(default="1 Year", min_length=1, max_length=50, description="Human-readable duration")
    image_url: str = Field(default="/assets/card-image.png", min_length=1, max_length=500, description="Course image URL")
    
    published: bool = True

    @validator('rating')
    def validate_rating(cls, v):
        if v < 0 or v > 5:
            raise ValueError('Rating must be between 0 and 5')
        return round(v, 1)  # Round to 1 decimal place


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    level: Optional[CourseLevel] = None
    duration: Optional[float] = Field(None, gt=0)

    credits: Optional[int] = Field(None, ge=1, le=100)
    rating: Optional[float] = Field(None, ge=0, le=5)
    duration_text: Optional[str] = Field(None, min_length=1, max_length=50)
    image_url: Optional[str] = Field(None, min_length=1, max_length=500)
    
    published: Optional[bool] = None

    @validator('duration')
    def validate_duration(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Duration must be positive')
        return v

    @validator('rating')
    def validate_rating(cls, v):
        if v is not None:
            if v < 0 or v > 5:
                raise ValueError('Rating must be between 0 and 5')
            return round(v, 1)
        return v


class CourseResponse(CourseBase):
    id: str
    created_by: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CourseWithCreator(CourseResponse):
    creator: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str


# Pagination Schema
class PaginatedResponse(BaseModel):
    items: List[CourseResponse]  
    total: int
    page: int
    page_size: int
    total_pages: int

    class Config:
        from_attributes = True


# Filter Schema for Course Search
class CourseFilter(BaseModel):
    category: Optional[str] = None
    level: Optional[CourseLevel] = None
    published: Optional[bool] = None
    search: Optional[str] = Field(None, description="Search in title and description")
    min_rating: Optional[float] = Field(None, ge=0, le=5)
    max_duration: Optional[float] = Field(None, gt=0)