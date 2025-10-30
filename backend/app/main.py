"""
Course Catalog API - Main Application
FastAPI backend with PostgreSQL, JWT authentication, and full CRUD operations
"""
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os
from pathlib import Path
from dotenv import load_dotenv

from app.database import engine, Base
from app.routers import users, courses

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Course Catalog API",
    description="API for managing course catalog with authentication, filtering, sorting, and pagination",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Configuration
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Get the absolute path to the assets directory
BASE_DIR = Path(__file__).resolve().parent.parent 
ASSETS_DIR = BASE_DIR / "assets"

# Create assets directory if it doesn't exist
ASSETS_DIR.mkdir(exist_ok=True)

# Mount the assets directory to serve static files
try:
    app.mount("/assets", StaticFiles(directory=str(ASSETS_DIR)), name="assets")
    print(f"Static files mounted successfully from: {ASSETS_DIR}")
except Exception as e:
    print(f"Warning: Could not mount static files: {e}")

# Include routers
app.include_router(users.router)
app.include_router(courses.router)


@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint - API health check
    """
    return {
        "message": "Course Catalog API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/api/docs",
        "assets_path": str(ASSETS_DIR),
        "assets_available": ASSETS_DIR.exists()
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "database": "connected",
        "static_files": {
            "enabled": True,
            "path": str(ASSETS_DIR),
            "exists": ASSETS_DIR.exists(),
            "files": list(ASSETS_DIR.glob("*")) if ASSETS_DIR.exists() else []
        }
    }


@app.get("/api/assets/list", tags=["Assets"])
async def list_assets():
    """
    List all available asset files
    """
    if not ASSETS_DIR.exists():
        return {
            "error": "Assets directory not found",
            "path": str(ASSETS_DIR)
        }
    
    files = []
    for file_path in ASSETS_DIR.glob("*"):
        if file_path.is_file():
            files.append({
                "name": file_path.name,
                "url": f"/assets/{file_path.name}",
                "size": file_path.stat().st_size
            })
    
    return {
        "assets_directory": str(ASSETS_DIR),
        "total_files": len(files),
        "files": files
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """
    Global exception handler for unhandled errors
    """
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "error": str(exc) if os.getenv("DEBUG") == "True" else "An error occurred"
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    # Print startup information
    print("\n" + "="*60)
    print("Starting Course Catalog API")
    print("="*60)
    print(f"Assets Directory: {ASSETS_DIR}")
    print(f"Assets Exists: {ASSETS_DIR.exists()}")
    if ASSETS_DIR.exists():
        print(f"Files in assets:")
        for file in ASSETS_DIR.glob("*"):
            print(f"   - {file.name}")
    print("="*60 + "\n")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )