"""
Database seeding script - Creates sample data for testing
"""
import sys
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Base, User, Course
from app.auth import get_password_hash
from datetime import datetime, timedelta
from datetime import timezone
import random

def seed_database():
    """Populate database with sample data"""
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("⚠️  Database already contains data. Skipping seed.")
            return
        
        print("🌱 Seeding database with sample data...")
        
        # Create sample users
        users_data = [
            {
                "username": "krishan",
                "email": "krishan@gmail.com",
                "full_name": "Krishan Danushka",
                "password": "password123"
            },
            {
                "username": "danushka",
                "email": "danu@gmail.com",
                "full_name": "Danushka Perera",
                "password": "password123"
            },
            {
                "username": "admin",
                "email": "admin@gmail.com",
                "full_name": "Admin User",
                "password": "admin123"
            }
        ]
        
        users = []
        for user_data in users_data:
            user = User(
                username=user_data["username"],
                email=user_data["email"],
                full_name=user_data["full_name"],
                hashed_password=get_password_hash(user_data["password"])
            )
            db.add(user)
            users.append(user)
        
        db.commit()
        print(f"✅ Created {len(users)} users")
    
        courses_data = [
            # Business & Management
            {
                "title": "Pearson BTEC Level 4 Diploma in Business Administration",
                "description": "Learn comprehensive business administration skills including office management, communication, and organizational procedures.",
                "category": "Business & Management",
                "level": "Beginner",
                "duration": 4.5,
                "credits": 42,
                "rating": 4.5,
                "duration_text": "1 Year",
                "image_url": "/assets/card-image.png"
            },
            {
                "title": "Pearson BTEC Level 7 Diploma in Strategic Management and Leadership",
                "description": "Advanced strategic management course covering leadership, organizational strategy, and change management.",
                "category": "Business & Management",
                "level": "Advanced",
                "duration": 5.0,
                "credits": 60,
                "rating": 5.0,
                "duration_text": "2 Year",
                "image_url": "/assets/crd-2.png"
            },
            {
                "title": "Pearson BTEC Level 4 Diploma in Management and Leadership",
                "description": "Develop essential management and leadership skills for modern business environments.",
                "category": "Business & Management",
                "level": "Intermediate",
                "duration": 4.5,
                "credits": 37,
                "rating": 4.5,
                "duration_text": "1 Year",
                "image_url": "/assets/crd-3.png"
            },
            
            # Health & Social Care
            {
                "title": "Pearson BTEC Level 3 Diploma in Health and Social Care",
                "description": "Comprehensive healthcare training covering patient care, health promotion, and social care practices.",
                "category": "Health & Social Care",
                "level": "Intermediate",
                "duration": 3.5,
                "credits": 45,
                "rating": 4.7,
                "duration_text": "1 Year",
                "image_url": "/assets/card-image.png"
            },
            {
                "title": "Pearson BTEC Level 5 Diploma in Health and Social Care Management",
                "description": "Advanced healthcare management focusing on leadership in health and social care settings.",
                "category": "Health & Social Care",
                "level": "Advanced",
                "duration": 5.5,
                "credits": 55,
                "rating": 4.8,
                "duration_text": "1.5 Year",
                "image_url": "/assets/crd-2.png"
            },
            
            # Information Technology
            {
                "title": "Pearson BTEC Level 4 Diploma in Computing and Systems Development",
                "description": "Master software development, system analysis, database design, and programming fundamentals.",
                "category": "Information Technology",
                "level": "Intermediate",
                "duration": 4.0,
                "credits": 48,
                "rating": 4.6,
                "duration_text": "1 Year",
                "image_url": "/assets/crd-3.png"
            },
            {
                "title": "Pearson BTEC Level 5 Diploma in IT Network Engineering",
                "description": "Advanced networking course covering infrastructure, security, and cloud technologies.",
                "category": "Information Technology",
                "level": "Advanced",
                "duration": 5.0,
                "credits": 52,
                "rating": 4.9,
                "duration_text": "1.5 Year",
                "image_url": "/assets/card-image.png"
            },
            
            # Teaching & Education
            {
                "title": "Pearson BTEC Level 3 Diploma in Education and Training",
                "description": "Qualification for teaching in further education, covering pedagogy and assessment methods.",
                "category": "Teaching & Education",
                "level": "Intermediate",
                "duration": 3.0,
                "credits": 40,
                "rating": 4.4,
                "duration_text": "1 Year",
                "image_url": "/assets/crd-2.png"
            },
            {
                "title": "Pearson BTEC Level 5 Diploma in Teaching and Learning",
                "description": "Advanced teaching qualification focusing on curriculum design and educational leadership.",
                "category": "Teaching & Education",
                "level": "Advanced",
                "duration": 5.0,
                "credits": 58,
                "rating": 4.7,
                "duration_text": "1.5 Year",
                "image_url": "/assets/crd-3.png"
            },
            
            # Accounting & Finance
            {
                "title": "Pearson BTEC Level 4 Diploma in Accounting and Finance",
                "description": "Professional accounting qualification covering financial reporting, management accounting, and taxation.",
                "category": "Accounting & Finance",
                "level": "Intermediate",
                "duration": 4.5,
                "credits": 45,
                "rating": 4.6,
                "duration_text": "1 Year",
                "image_url": "/assets/card-image.png"
            },
            {
                "title": "Pearson BTEC Level 7 Diploma in Strategic Finance Management",
                "description": "Advanced finance course covering corporate finance, investment analysis, and financial strategy.",
                "category": "Accounting & Finance",
                "level": "Advanced",
                "duration": 6.0,
                "credits": 62,
                "rating": 4.8,
                "duration_text": "2 Year",
                "image_url": "/assets/crd-2.png"
            },
            {
                "title": "Pearson BTEC Level 5 Diploma in Financial Management",
                "description": "Intermediate finance qualification focusing on budgeting, financial planning, and risk management.",
                "category": "Accounting & Finance",
                "level": "Intermediate",
                "duration": 4.0,
                "credits": 50,
                "rating": 4.5,
                "duration_text": "1 Year",
                "image_url": "/assets/crd-3.png"
            }
        ]
        
        courses = []
        for i, course_data in enumerate(courses_data):
            creator = users[i % len(users)]
            # Make most courses published
            published = i % 5 != 0  # Only 1 in 5 will be unpublished
            created_time = datetime.utcnow() - timedelta(days=random.randint(1, 60))
            
            course = Course(
                title=course_data["title"],
                description=course_data["description"],
                category=course_data["category"],
                level=course_data["level"],
                duration=course_data["duration"],
                credits=course_data.get("credits", 40),
                rating=course_data.get("rating", 4.5),
                duration_text=course_data.get("duration_text", "1 Year"),
                image_url=course_data.get("image_url", "/assets/card-image.png"),
                published=published,
                created_by=creator.id,
                created_at=created_time,
                updated_at=created_time
            )
            db.add(course)
            courses.append(course)
        
        db.commit()
        print(f"✅ Created {len(courses)} courses")
        
        print("\n" + "="*60)
        print("🎉 Database seeded successfully!")
        print("="*60)
        print("\n📝 Sample User Credentials:")
        print("-" * 60)
        for user_data in users_data:
            print(f"Username: {user_data['username']}")
            print(f"Password: {user_data['password']}")
            print("-" * 60)
        
        print("\n📚 Course Categories Created:")
        print("-" * 60)
        categories = {}
        for course in courses:
            if course.category not in categories:
                categories[course.category] = 0
            categories[course.category] += 1
        
        for category, count in categories.items():
            print(f"{category}: {count} courses")
        print("-" * 60)
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()