# Course Catalog Web Application

A full-stack web application for managing and browsing a catalog of courses with a RESTful API backend built with FastAPI and a responsive React frontend.

![Course Catalog](./preview.png)

## 🚀 Live Demo

- **Frontend:** [Your Vercel/Netlify URL]
- **Backend API:** [Your Railway URL]
- **API Documentation:** [Your Railway URL]/docs (Swagger UI)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Deployment](#deployment)
- [Testing](#testing)

## ✨ Features

### Core Features
- ✅ Browse complete course catalog with all course attributes
- ✅ Add new courses with comprehensive validation
- ✅ Edit existing courses with real-time updates
- ✅ Delete courses with confirmation
- ✅ Search and filter by category, level, and published status
- ✅ Fully responsive design (mobile & desktop)
- ✅ Loading indicators and error states
- ✅ RESTful API with proper HTTP status codes

### Bonus Features
- 🔐 User authentication (JWT-based login/logout)
- 💾 Persistent storage with PostgreSQL on Railway
- 📊 Category-based course organization
- 👤 User profile management
- 🎨 Modern UI matching Figma design specifications
- 🔄 Protected routes for authenticated users

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.9+)
- **Database:** PostgreSQL (Railway Cloud)
- **ORM:** SQLAlchemy
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Pydantic schemas
- **Password Hashing:** Passlib with bcrypt
- **CORS:** FastAPI CORS middleware

**Why FastAPI?**
- **High Performance:** One of the fastest Python frameworks, comparable to NodeJS
- **Automatic API Documentation:** Built-in Swagger UI and ReDoc
- **Type Safety:** Python type hints with Pydantic validation
- **Async Support:** Native async/await for better performance
- **Easy to Learn:** Clean and intuitive syntax

**Why PostgreSQL on Railway?**
- **Reliability:** Production-grade relational database
- **Cloud Hosting:** Easy deployment and scaling on Railway
- **ACID Compliance:** Ensures data integrity
- **JSON Support:** Native JSON data type support

### Frontend
- **Framework:** React 18
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **Styling:** Custom CSS with modern design
- **State Management:** React Hooks (useState, useEffect, useContext)
- **Build Tool:** Create React App / Vite

**Why React?**
- **Component Reusability:** Modular components (CourseCard, CourseForm, etc.)
- **Virtual DOM:** Efficient rendering and updates
- **Large Ecosystem:** Rich library support
- **Easy State Management:** Built-in hooks for simple applications

## 📦 Prerequisites

- Python 3.9 or higher
- Node.js 14+ and npm/yarn
- PostgreSQL (local) or Railway account
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/course-catalog.git
cd course-catalog
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Update .env with your PostgreSQL credentials
# DATABASE_URL=postgresql://user:password@host:port/dbname
# SECRET_KEY=your-secret-key-here

# Run database migrations (if using Alembic)
# alembic upgrade head

# Seed initial data (optional)
python seed_data.py

# Start the development server
uvicorn app.main:app --reload
```

The backend will run on `http://localhost:8000`
- API Documentation (Swagger): `http://localhost:8000/docs`
- Alternative Docs (ReDoc): `http://localhost:8000/redoc`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your backend API URL
# REACT_APP_API_URL=http://localhost:8000

# Start the development server
npm start
```

The frontend will run on `http://localhost:3000`

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/x-www-form-urlencoded

username=john@example.com&password=SecurePass123!
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Course Endpoints

#### Get All Courses
```http
GET /api/courses?category=Web%20Development&level=Beginner&published=true
```

**Query Parameters:**
- `category` (optional): Filter by category
- `level` (optional): Filter by level (Beginner, Intermediate, Advanced)
- `published` (optional): Filter by published status (true/false)
- `skip` (optional): Pagination offset (default: 0)
- `limit` (optional): Number of results (default: 100)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Intro to React",
    "description": "Learn the basics of React, including components and state.",
    "category": "Web Development",
    "level": "Beginner",
    "duration": 5,
    "published": true,
    "createdAt": "2025-09-01T09:00:00Z",
    "updatedAt": "2025-10-15T16:30:00Z"
  }
]
```

#### Get Single Course
```http
GET /api/courses/{id}
```

#### Create Course (Protected)
```http
POST /api/courses
Authorization: Bearer {your_jwt_token}
Content-Type: application/json

{
  "title": "Advanced Python Programming",
  "description": "Deep dive into Python advanced topics",
  "category": "Programming",
  "level": "Advanced",
  "duration": 20,
  "published": true
}
```

#### Update Course (Protected)
```http
PUT /api/courses/{id}
Authorization: Bearer {your_jwt_token}
Content-Type: application/json

{
  "title": "Updated Course Title",
  "description": "Updated description"
}
```

#### Delete Course (Protected)
```http
DELETE /api/courses/{id}
Authorization: Bearer {your_jwt_token}
```

### User Profile Endpoint

#### Get User Profile (Protected)
```http
GET /api/users/me
Authorization: Bearer {your_jwt_token}
```

## 📁 Project Structure

```
course-catalog/
├── backend/
│   ├── app/
│   │   ├── routers/          # API route handlers
│   │   ├── __init__.py       # Package initializer
│   │   ├── auth.py           # Authentication logic
│   │   ├── crud.py           # Database CRUD operations
│   │   ├── database.py       # Database connection & session
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── models.py         # SQLAlchemy models
│   │   └── schemas.py        # Pydantic validation schemas
│   ├── assets/               # Static assets (images)
│   │   ├── card-image.png
│   │   ├── crd-2.png
│   │   └── crd-3.png
│   ├── venv/                 # Virtual environment
│   ├── .env                  # Environment variables (not in git)
│   ├── .env.example          # Example environment file
│   ├── .gitignore            # Git ignore rules
│   ├── railway.json          # Railway deployment config
│   ├── README.md             # Backend documentation
│   ├── requirements.txt      # Python dependencies
│   ├── reset.py              # Database reset script
│   └── seed_data.py          # Database seeding script
│
├── frontend/
│   ├── node_modules/         # Node dependencies
│   ├── public/               # Static public files
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Categories.jsx      # Category filter component
│   │   │   ├── CategoryTabs.jsx    # Category tabs navigation
│   │   │   ├── CourseCard.jsx      # Individual course card
│   │   │   ├── CourseForm.jsx      # Add/Edit course form
│   │   │   ├── CourseList.jsx      # Course list container
│   │   │   ├── Footer.jsx          # Footer component
│   │   │   ├── Hero.jsx            # Hero section
│   │   │   ├── Navbar.jsx          # Navigation bar
│   │   │   └── ProtectedRoute.jsx  # Route protection HOC
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx      # Homepage
│   │   │   ├── Login.jsx     # Login page
│   │   │   ├── Profile.jsx   # User profile page
│   │   │   └── Register.jsx  # Registration page
│   │   ├── services/         # API service layer
│   │   │   └── api.js        # Axios API configuration
│   │   ├── styles/           # CSS stylesheets
│   │   │   ├── CourseForm.css
│   │   │   ├── index.css
│   │   │   └── profile.css
│   │   ├── App.js            # Main App component
│   │   └── index.js          # React DOM entry point
│   ├── .env                  # Environment variables (not in git)
│   ├── .env.example          # Example environment file
│   ├── .gitignore            # Git ignore rules
│   ├── package.json          # NPM dependencies
│   └── package-lock.json     # NPM lock file
│
└── README.md                 # This file
```

### Architecture Overview

#### Backend Architecture (FastAPI)
```
┌─────────────────────────────────────────────────────┐
│                   main.py (FastAPI)                 │
│  • CORS configuration                               │
│  • Route registration                               │
│  • Middleware setup                                 │
└──────────────────┬──────────────────────────────────┘
                   │
         ┌─────────┴──────────┐
         │                    │
    ┌────▼────┐         ┌─────▼──────┐
    │ routers │         │   auth.py  │
    │         │         │  • JWT      │
    │ CRUD    │         │  • Login    │
    │ ops     │         │  • Register │
    └────┬────┘         └─────┬──────┘
         │                    │
         ├────────────────────┤
         │                    │
    ┌────▼────┐         ┌─────▼──────┐
    │models.py│         │ schemas.py │
    │         │         │            │
    │SQLAlchemy│       │ Pydantic   │
    │Models   │         │ Validation │
    └────┬────┘         └────────────┘
         │
    ┌────▼─────────┐
    │ database.py  │
    │              │
    │ PostgreSQL   │
    │ (Railway)    │
    └──────────────┘
```

**Key Components:**
- **main.py**: FastAPI application instance, CORS setup, route inclusion
- **models.py**: SQLAlchemy ORM models (Course, User)
- **schemas.py**: Pydantic models for request/response validation
- **crud.py**: Database operations (Create, Read, Update, Delete)
- **auth.py**: JWT authentication, password hashing, user verification
- **database.py**: Database connection and session management

#### Frontend Architecture (React)
```
┌──────────────────────────────────────────┐
│           App.js (Router)                │
│  • Route definitions                     │
│  • Authentication context                │
└──────────────┬───────────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐  ┌───▼───┐  ┌───▼────┐
│ Home  │  │ Login │  │Profile │
│ Page  │  │ Page  │  │ Page   │
└───┬───┘  └───┬───┘  └───┬────┘
    │          │          │
    └──────────┼──────────┘
               │
    ┌──────────▼──────────┐
    │    Components       │
    │  • CourseList       │
    │  • CourseCard       │
    │  • CourseForm       │
    │  • Navbar           │
    │  • Hero             │
    └──────────┬──────────┘
               │
         ┌─────▼──────┐
         │  api.js    │
         │  (Axios)   │
         │            │
         │  Backend   │
         │    API     │
         └────────────┘
```

## 🔐 Environment Variables

### Backend (.env)
```env
# Database Configuration (Railway PostgreSQL)
DATABASE_URL=postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway

# JWT Secret Key (generate a secure random string)
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production

# JWT Configuration
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application Settings
DEBUG=True
PORT=8000
HOST=0.0.0.0

# CORS Origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-url.vercel.app
```

**Generate a secure SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Frontend (.env)
```env
# Backend API URL
REACT_APP_API_URL=http://localhost:8000

# For production
# REACT_APP_API_URL=https://your-railway-backend.up.railway.app
```

## 💡 Usage

### For Regular Users

1. **Browse Courses**
   - Visit the homepage to see all available courses
   - Use category tabs to filter by subject area
   - Search by course title or description

2. **View Course Details**
   - Click on any course card to see full details
   - View duration, level, category, and description

### For Authenticated Users

3. **Register/Login**
   - Click "Login" in the navigation bar
   - Register a new account or login with existing credentials

4. **Add New Course**
   - After login, click "Add Course" button
   - Fill in all required fields:
     - Title (required)
     - Description (required)
     - Category (required)
     - Level (Beginner/Intermediate/Advanced)
     - Duration in hours (positive number)
     - Published status (checkbox)

5. **Edit Course**
   - Click the edit icon on any course card
   - Update fields as needed
   - Save changes

6. **Delete Course**
   - Click the delete icon on any course card
   - Confirm deletion in the modal

7. **View Profile**
   - Click on your username in the navbar
   - View your profile information
   - See your created courses

## 🚀 Deployment

### Backend Deployment (Railway)

1. **Create Railway Account**
   - Sign up at [railway.app](https://railway.app)

2. **Create New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Add PostgreSQL Database**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically provide DATABASE_URL

4. **Configure Environment Variables**
   - Add all variables from `.env.example`
   - Update `ALLOWED_ORIGINS` with your frontend URL

5. **Deploy**
   - Railway will automatically deploy on push to main branch
   - Access your API at the provided Railway URL

**Railway Configuration (railway.json):**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure Environment Variables**
   - In Vercel dashboard, add `REACT_APP_API_URL`
   - Set to your Railway backend URL

4. **Automatic Deployments**
   - Connect your GitHub repository
   - Vercel will auto-deploy on push to main

**Alternative: Netlify**
```bash
cd frontend
npm run build
# Drag and drop the 'build' folder to Netlify
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

### API Testing with Swagger
Visit `http://localhost:8000/docs` to test all endpoints interactively.

## 📊 Database Schema

### Course Model
```sql
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    level VARCHAR(50) CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    duration INTEGER CHECK (duration > 0),
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id)
);
```

### User Model
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📝 Development Notes

### Design Implementation
- ✅ Figma design implemented with high fidelity
- ✅ Responsive breakpoints for mobile, tablet, desktop
- ✅ Custom CSS matching brand colors and typography
- ✅ Hero section with search functionality
- ✅ Category tabs with icons
- ✅ Course cards with hover effects

### Authentication Flow
1. User registers with username, email, password
2. Password is hashed using bcrypt
3. On login, JWT token is generated and returned
4. Frontend stores token in localStorage
5. Token is sent in Authorization header for protected routes
6. Backend validates token using SECRET_KEY

### Data Validation
- **Backend**: Pydantic schemas validate all inputs
- **Frontend**: HTML5 validation + custom validation
- **Database**: PostgreSQL constraints ensure data integrity

### Error Handling
- **Backend**: Custom exception handlers return appropriate HTTP status codes
- **Frontend**: Try-catch blocks with user-friendly error messages
- **API**: Consistent error response format

### Challenges & Solutions

**Challenge 1: CORS Issues**
- **Problem**: Frontend couldn't connect to backend API
- **Solution**: Configured CORS middleware in FastAPI with specific origins

**Challenge 2: JWT Token Expiration**
- **Problem**: Users logged out unexpectedly
- **Solution**: Implemented token refresh mechanism and proper error handling

**Challenge 3: Database Connection on Railway**
- **Problem**: Connection string format issues
- **Solution**: Used SQLAlchemy's create_engine with proper PostgreSQL URL format

## 🔄 Future Improvements

- [ ] Add course ratings and reviews
- [ ] Implement course enrollment tracking
- [ ] Add search with Elasticsearch
- [ ] Email verification for new users
- [ ] Password reset functionality
- [ ] Admin dashboard for course management
- [ ] Course categories with icons/images
- [ ] Advanced filtering (price range, rating, popularity)
- [ ] Course progress tracking
- [ ] Multi-language support

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Railway Documentation](https://docs.railway.app/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Introduction](https://jwt.io/introduction)
- [Figma Design](https://www.figma.com/design/x694SHd7SVaJfvJUSd7o5R/HomePageDesign)

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is [MIT](LICENSE) licensed.

## 🙏 Acknowledgments

- **Figma Design**: Provided by assessment team
- **FastAPI**: For the amazing framework
- **Railway**: For easy database hosting
- **React Community**: For excellent libraries and tools
- **Stack Overflow**: For helping solve many challenges

---

**Built with ❤️ for the Associate Fullstack Developer Assessment**

*Last Updated: October 2025*