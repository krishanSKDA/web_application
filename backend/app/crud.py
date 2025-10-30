"""
CRUD operations for database models
"""
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import Optional, List
from datetime import datetime

from app.models import User, Course
from app.schemas import UserCreate, CourseCreate, CourseUpdate
from app.auth import get_password_hash


# User CRUD operations
def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Get user by username"""
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate) -> User:
    """Create a new user"""
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user: User, update_data: dict) -> User:
    """Update user information"""
    for field, value in update_data.items():
        if value is not None:
            setattr(user, field, value)
    
    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)
    return user


# Course CRUD operations
def get_courses(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    level: Optional[str] = None,
    published: Optional[bool] = None,
    search: Optional[str] = None,
    sort_by: str = "created_at",
    order: str = "desc"
) -> tuple[List[Course], int]:
    """Get courses with filtering, sorting, and pagination"""
    query = db.query(Course)
    
    # Apply filters
    filters = []
    if category:
        filters.append(Course.category == category)
    if level:
        filters.append(Course.level == level)
    if published is not None:
        filters.append(Course.published == published)
    if search:
        search_filter = or_(
            Course.title.ilike(f"%{search}%"),
            Course.description.ilike(f"%{search}%")
        )
        filters.append(search_filter)
    
    if filters:
        query = query.filter(and_(*filters))
    
    # Get total count
    total_count = query.count()
    
    # Apply sorting
    valid_sort_fields = ["title", "created_at", "updated_at", "duration", "level"]
    if sort_by in valid_sort_fields:
        sort_column = getattr(Course, sort_by)
        if order.lower() == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())
    
    # Apply pagination
    courses = query.offset(skip).limit(limit).all()
    
    return courses, total_count


def get_course_by_id(db: Session, course_id: str) -> Optional[Course]:
    """Get a single course by ID"""
    return db.query(Course).filter(Course.id == course_id).first()


def create_course(db: Session, course: CourseCreate, user_id: str) -> Course:
    """Create a new course"""
    db_course = Course(
        **course.dict(),
        created_by=user_id
    )
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course


def update_course(db: Session, db_course: Course, course_update: CourseUpdate) -> Course:
    """Update an existing course"""
    update_data = course_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_course, field, value)
    
    db_course.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_course)
    return db_course


def delete_course(db: Session, db_course: Course) -> bool:
    """Delete a course"""
    db.delete(db_course)
    db.commit()
    return True


def get_user_courses(db: Session, user_id: str) -> List[Course]:
    """Get all courses created by a user"""
    return db.query(Course).filter(Course.created_by == user_id).all()