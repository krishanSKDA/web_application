"""
Course API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
import math

from app.database import get_db
from app.schemas import (
    CourseCreate,
    CourseUpdate,
    CourseResponse,
    CourseWithCreator,
    PaginatedResponse
)
from app.models import User, Course
from app import crud
from app.auth import get_current_active_user

router = APIRouter(prefix="/api/courses", tags=["Courses"])


@router.get("", response_model=PaginatedResponse)
async def get_courses(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    category: Optional[str] = Query(None, description="Filter by category"),
    level: Optional[str] = Query(None, description="Filter by level"),
    published: Optional[bool] = Query(None, description="Filter by published status"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    sort_by: str = Query("created_at", description="Sort by field"),
    order: str = Query("desc", description="Sort order (asc, desc)"),
    db: Session = Depends(get_db)
):
    """Get all courses with filtering, sorting, and pagination"""
    skip = (page - 1) * limit
    
    courses, total = crud.get_courses(
        db=db,
        skip=skip,
        limit=limit,
        category=category,
        level=level,
        published=published,
        search=search,
        sort_by=sort_by,
        order=order
    )
    
    total_pages = math.ceil(total / limit) if total > 0 else 0
    
   
    courses_response = [CourseResponse.model_validate(course) for course in courses]
    
    return PaginatedResponse(
        items=courses_response,
        total=total,
        page=page,
        page_size=limit,
        total_pages=total_pages
    )


@router.get("/{course_id}", response_model=CourseWithCreator)
async def get_course(course_id: str, db: Session = Depends(get_db)):
    """
    Get a single course by ID
    """
    course = crud.get_course_by_id(db, course_id=course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
   
    return CourseWithCreator.model_validate(course)


@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(
    course: CourseCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new course (requires authentication)
    """
    new_course = crud.create_course(db=db, course=course, user_id=current_user.id)
   
    return CourseResponse.model_validate(new_course)


@router.put("/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: str,
    course_update: CourseUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update an existing course (requires authentication)
    Only the creator can update the course
    """
    # Get the course
    db_course = crud.get_course_by_id(db, course_id=course_id)
    if not db_course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Check if user is the creator
    if db_course.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own courses"
        )
    
    # Update the course
    updated_course = crud.update_course(db, db_course, course_update)
    
    return CourseResponse.model_validate(updated_course)


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(
    course_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a course (requires authentication)
    Only the creator can delete the course
    """
    # Get the course
    db_course = crud.get_course_by_id(db, course_id=course_id)
    if not db_course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Check if user is the creator
    if db_course.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own courses"
        )
    
    # Delete the course
    crud.delete_course(db, db_course)
    return None


@router.get("/user/my-courses", response_model=List[CourseResponse])
async def get_my_courses(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all courses created by the current user
    """
    courses = crud.get_user_courses(db, user_id=current_user.id)
    
    return [CourseResponse.model_validate(course) for course in courses]