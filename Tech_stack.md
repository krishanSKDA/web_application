# Tech Stack Overview

## Architecture: RESTful API with JWT Authentication
**Why?** Separates frontend and backend for independent scaling, easier maintenance, and flexibility to add mobile apps later.

---

## Backend

### FastAPI (Python 3.9+)
**Why FastAPI?**
- High performance (comparable to Node.js)
- Automatic interactive API docs at `api/docs`
- Built-in validation with Pydantic
- Async support for better concurrency
- Clean, readable code with type hints

**Alternative considered:** Django REST Framework (too heavy), Flask (lacks built-in validation)

### SQLAlchemy
**Why?** Industry-standard Python ORM with excellent PostgreSQL support, type safety, and migration capabilities via Alembic.

### PostgreSQL (Railway)
**Why?**
- ACID compliance ensures data integrity
- Advanced features (full-text search, JSON support)
- Scales to millions of rows
- Railway provides automatic backups and one-click setup

**Alternative considered:** MongoDB (overkill for structured data), SQLite (not production-ready)

### JWT Authentication
**Why?** Stateless (no server-side sessions), scalable, secure, and perfect for separate frontend/backend deployments.

### Bcrypt (via Passlib)
**Why?** Industry-standard password hashing with automatic salting and protection against rainbow tables.

---

## Frontend

### React 18
**Why?**
- Component-based architecture (reusable UI)
- Large ecosystem and community
- Virtual DOM for efficient updates
- Industry standard with strong job market

**Alternative considered:** Vue (smaller ecosystem), Angular (too heavy), Next.js (unnecessary for SPA)

### React Hooks (useState, useEffect, useContext)
**Why?** Built-in state management sufficient for project size. No need for Redux complexity.

### Axios
**Why?** Better than Fetch API - automatic JSON handling, request/response interceptors for JWT tokens, and better error handling.

### React Router v6
**Why?** Standard React routing library with declarative syntax and easy protected route implementation.

### Custom CSS
**Why?** Full control for pixel-perfect Figma implementation, lightweight (no framework bloat), and demonstrates CSS fundamentals.

**Alternative considered:** Tailwind (adds build complexity), Material-UI (hard to match custom designs)

---

## Deployment

### Railway (Backend + Database)
**Why?**
- Git-based auto-deployment
- Integrated PostgreSQL with automatic backups
- Free $5/month credits
- Real-time logs and simple dashboard

**Alternative considered:** Heroku (no free tier), AWS (too complex)

### Vercel (Frontend)
**Why?**
- Optimized for React
- Global CDN for fast loading
- Preview deployments for PRs
- Free tier with 100GB bandwidth
- Zero configuration

**Alternative considered:** Netlify (similar but Vercel better for React)

---

## Tech Stack Summary

| Layer | Technology | Why? |
|-------|-----------|------|
| **Backend** | FastAPI | Fast, auto docs, type safety |
| **ORM** | SQLAlchemy | Mature, flexible, type-safe |
| **Database** | PostgreSQL | Reliable, ACID-compliant, powerful |
| **Auth** | JWT + Bcrypt | Stateless, secure, scalable |
| **Frontend** | React 18 | Component-based, industry standard |
| **State** | React Hooks | Built-in, simple, sufficient |
| **HTTP** | Axios | Interceptors, better API |
| **Routing** | React Router v6 | Standard, declarative |
| **Styling** | Custom CSS | Lightweight, full control |
| **Backend Host** | Railway | Simple, free tier, integrated DB |
| **Frontend Host** | Vercel | React-optimized, CDN, free tier |

---

## Key Benefits

✅ **Performance:** FastAPI + React + PostgreSQL = fast response times  
✅ **Developer Experience:** Auto docs, type safety, hot reload  
✅ **Scalable:** Stateless auth, independent scaling  
✅ **Cost-Effective:** Free hosting tiers  
✅ **Modern:** Industry-standard technologies  
✅ **Maintainable:** Clear separation, component-based  
