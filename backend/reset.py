from app.database import engine, Base
from app.models import User, Course

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("✅ Database reset complete!")
