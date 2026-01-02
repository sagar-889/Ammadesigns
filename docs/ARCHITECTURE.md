# 🏗️ System Architecture

## Overview

This is a classic 3-tier web application architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                    (React + Vite)                            │
│                   Port: 5173 (dev)                           │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │ Services │  │ Gallery  │  │ Contact  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Admin Dashboard                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │ Services │  │ Gallery  │  │ Contacts │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │ (Axios)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│                   (Node.js + Express)                        │
│                      Port: 5000                              │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    API Routes                           │ │
│  │                                                         │ │
│  │  Public Routes:                                        │ │
│  │  • GET  /api/services                                  │ │
│  │  • GET  /api/gallery                                   │ │
│  │  • POST /api/contact                                   │ │
│  │                                                         │ │
│  │  Admin Routes (Protected):                            │ │
│  │  • POST   /api/admin/login                            │ │
│  │  • GET    /api/admin/contacts                         │ │
│  │  • CRUD   /api/admin/services                         │ │
│  │  • CRUD   /api/admin/gallery                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Middleware Layer                          │ │
│  │  • CORS                                                │ │
│  │  • JSON Parser                                         │ │
│  │  • JWT Authentication                                  │ │
│  │  • Input Validation                                    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ MySQL Protocol
                            │ (mysql2)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE                              │
│                         (MySQL)                              │
│                       Port: 3306                             │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  admins  │  │ services │  │ gallery  │  │ contacts │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Customer Views Services

```
Customer Browser
    │
    │ 1. GET /services
    ▼
React Component (Services.jsx)
    │
    │ 2. axios.get('/api/services')
    ▼
Express Backend (public.js)
    │
    │ 3. SELECT * FROM services
    ▼
MySQL Database
    │
    │ 4. Returns rows
    ▼
Express Backend
    │
    │ 5. res.json(services)
    ▼
React Component
    │
    │ 6. setServices(data)
    ▼
Customer sees services on screen
```

### 2. Customer Submits Contact Form

```
Customer fills form
    │
    │ 1. Submit form
    ▼
React Component (Contact.jsx)
    │
    │ 2. POST /api/contact
    │    { name, phone, message }
    ▼
Express Backend (public.js)
    │
    │ 3. Validate input
    │    (express-validator)
    ▼
    │ 4. INSERT INTO contacts
    ▼
MySQL Database
    │
    │ 5. Success
    ▼
Express Backend
    │
    │ 6. res.json({ message: 'Success' })
    ▼
React Component
    │
    │ 7. Show success message
    ▼
Customer sees confirmation
```

### 3. Admin Login Flow

```
Admin enters credentials
    │
    │ 1. Submit login form
    ▼
React Component (AdminLogin.jsx)
    │
    │ 2. POST /api/admin/login
    │    { username, password }
    ▼
Express Backend (admin.js)
    │
    │ 3. SELECT * FROM admins
    │    WHERE username = ?
    ▼
MySQL Database
    │
    │ 4. Returns admin record
    ▼
Express Backend
    │
    │ 5. bcrypt.compare(password, hash)
    │
    │ 6. jwt.sign({ id, username })
    ▼
React Component
    │
    │ 7. localStorage.setItem('token')
    │
    │ 8. navigate('/admin/dashboard')
    ▼
Admin Dashboard loads
```

### 4. Admin Adds Service (Protected)

```
Admin clicks "Add Service"
    │
    │ 1. Enter service details
    ▼
React Component (AdminDashboard.jsx)
    │
    │ 2. POST /api/admin/services
    │    Authorization: Bearer <token>
    │    { title, description, price }
    ▼
Express Backend (admin.js)
    │
    │ 3. authenticateToken middleware
    │    • Verify JWT token
    │    • Extract admin info
    ▼
    │ 4. Validate input
    ▼
    │ 5. INSERT INTO services
    ▼
MySQL Database
    │
    │ 6. Success, return insertId
    ▼
Express Backend
    │
    │ 7. res.json({ id, message })
    ▼
React Component
    │
    │ 8. Refresh services list
    ▼
Admin sees new service
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: HTTPS (Transport Security)                        │
│  └─ Encrypts data in transit                                │
│                                                              │
│  Layer 2: CORS (Cross-Origin Protection)                    │
│  └─ Restricts which domains can access API                  │
│                                                              │
│  Layer 3: JWT Authentication (Identity)                     │
│  └─ Verifies admin identity                                 │
│  └─ Token expires after 24 hours                            │
│                                                              │
│  Layer 4: Input Validation (Data Integrity)                 │
│  └─ express-validator checks all inputs                     │
│  └─ Prevents invalid data                                   │
│                                                              │
│  Layer 5: SQL Injection Prevention                          │
│  └─ Parameterized queries (mysql2)                          │
│  └─ Never concatenate user input                            │
│                                                              │
│  Layer 6: Password Hashing (Credential Security)            │
│  └─ bcrypt with 10 rounds                                   │
│  └─ Never store plaintext passwords                         │
│                                                              │
│  Layer 7: Environment Variables (Secret Management)         │
│  └─ Sensitive data in .env files                            │
│  └─ Never commit secrets to git                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

```
App.jsx (Root)
│
├─ Navbar.jsx (Always visible)
│
├─ Routes
│  │
│  ├─ Home.jsx
│  │  └─ Hero section
│  │  └─ Features
│  │  └─ CTA buttons
│  │
│  ├─ Services.jsx
│  │  └─ Fetches from API
│  │  └─ Displays in grid
│  │
│  ├─ Gallery.jsx
│  │  └─ Fetches from API
│  │  └─ Image grid
│  │
│  ├─ Contact.jsx
│  │  └─ Form with validation
│  │  └─ Shop info
│  │
│  └─ Admin
│     │
│     ├─ AdminLogin.jsx
│     │  └─ Login form
│     │  └─ JWT storage
│     │
│     └─ AdminDashboard.jsx (Protected)
│        └─ Tabbed interface
│        └─ CRUD operations
│
└─ Footer.jsx (Always visible)
```

### Backend Structure

```
server.js (Entry point)
│
├─ Middleware
│  ├─ cors()
│  ├─ express.json()
│  └─ Error handler
│
├─ Routes
│  │
│  ├─ /api (public.js)
│  │  ├─ GET  /services
│  │  ├─ GET  /gallery
│  │  └─ POST /contact
│  │
│  └─ /api/admin (admin.js)
│     ├─ POST   /login
│     ├─ GET    /contacts (protected)
│     ├─ CRUD   /services (protected)
│     └─ CRUD   /gallery (protected)
│
├─ Middleware
│  └─ authenticateToken (auth.js)
│     └─ Verifies JWT
│
└─ Database
   └─ Connection pool (db.js)
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                         admins                               │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          │ INT AUTO_INCREMENT                        │
│ username         │ VARCHAR(50) UNIQUE                        │
│ password_hash    │ VARCHAR(255)                              │
│ created_at       │ TIMESTAMP                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        services                              │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          │ INT AUTO_INCREMENT                        │
│ title            │ VARCHAR(100)                              │
│ description      │ TEXT                                      │
│ price            │ DECIMAL(10,2) NULL                        │
│ created_at       │ TIMESTAMP                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                         gallery                              │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          │ INT AUTO_INCREMENT                        │
│ image_url        │ VARCHAR(500)                              │
│ title            │ VARCHAR(100) NULL                         │
│ created_at       │ TIMESTAMP                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        contacts                              │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          │ INT AUTO_INCREMENT                        │
│ name             │ VARCHAR(100)                              │
│ phone            │ VARCHAR(20)                               │
│ message          │ TEXT                                      │
│ created_at       │ TIMESTAMP                                 │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

### Development
```
Localhost:5173 (Frontend) ──→ Localhost:5000 (Backend) ──→ Localhost:3306 (MySQL)
```

### Production
```
Netlify/Vercel          Render/Railway         Railway/AWS RDS
(Static Files)          (Node.js API)          (MySQL Database)
     │                       │                        │
     │                       │                        │
     └──── HTTPS ────────────┴──── MySQL Protocol ────┘
```

## Technology Stack Details

### Frontend Stack
```
React 18
  └─ Component-based UI
  └─ Hooks (useState, useEffect)
  └─ Functional components

React Router v6
  └─ Client-side routing
  └─ Protected routes
  └─ Navigation

Axios
  └─ HTTP client
  └─ Interceptors for JWT
  └─ Promise-based

Vite
  └─ Fast build tool
  └─ Hot module replacement
  └─ Optimized production builds

CSS3
  └─ Custom properties (variables)
  └─ Flexbox & Grid
  └─ Media queries
  └─ Animations
```

### Backend Stack
```
Node.js
  └─ JavaScript runtime
  └─ Event-driven
  └─ Non-blocking I/O

Express.js
  └─ Web framework
  └─ Middleware support
  └─ Routing

MySQL2
  └─ MySQL client
  └─ Promise support
  └─ Connection pooling
  └─ Prepared statements

JWT (jsonwebtoken)
  └─ Token generation
  └─ Token verification
  └─ Expiration handling

bcryptjs
  └─ Password hashing
  └─ Salt generation
  └─ Comparison

express-validator
  └─ Input validation
  └─ Sanitization
  └─ Error formatting
```

## Performance Considerations

### Frontend Optimization
- Code splitting (automatic with Vite)
- Lazy loading for images
- Minification in production
- Gzip compression
- CDN for static assets

### Backend Optimization
- Connection pooling (MySQL)
- Efficient queries (indexed columns)
- Response caching (optional)
- Rate limiting (optional)
- Load balancing (production)

### Database Optimization
- Indexed primary keys
- Indexed foreign keys (if added)
- Query optimization
- Regular backups
- Connection limits

## Scalability Path

### Current (Small Scale)
- Single backend server
- Single database
- Suitable for: 100-1000 users

### Medium Scale
- Multiple backend instances
- Load balancer
- Database replication
- Redis caching
- Suitable for: 1000-10000 users

### Large Scale
- Microservices architecture
- CDN for assets
- Database sharding
- Message queues
- Suitable for: 10000+ users

---

**This architecture is designed to be:**
- ✅ Simple to understand
- ✅ Easy to maintain
- ✅ Secure by default
- ✅ Scalable when needed
- ✅ Cost-effective
