# Project Structure

```
ladies-tailor-shop/
│
├── backend/                          # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                    # MySQL connection pool
│   ├── database/
│   │   └── schema.sql               # Database schema & sample data
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication middleware
│   ├── routes/
│   │   ├── public.js                # Public API routes
│   │   └── admin.js                 # Protected admin routes
│   ├── scripts/
│   │   └── hashPassword.js          # Password hash generator
│   ├── .env.example                 # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                    # Express server entry point
│
├── frontend/                         # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation component
│   │   │   ├── Navbar.css
│   │   │   ├── Footer.jsx           # Footer component
│   │   │   ├── Footer.css
│   │   │   └── PrivateRoute.jsx     # Protected route wrapper
│   │   ├── config/
│   │   │   └── api.js               # Axios configuration
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Home.css
│   │   │   ├── Services.jsx         # Services listing
│   │   │   ├── Services.css
│   │   │   ├── Gallery.jsx          # Gallery page
│   │   │   ├── Gallery.css
│   │   │   ├── Contact.jsx          # Contact form
│   │   │   ├── Contact.css
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx   # Admin login page
│   │   │       ├── AdminLogin.css
│   │   │       ├── AdminDashboard.jsx  # Admin panel
│   │   │       └── AdminDashboard.css
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── README.md                         # Project overview
├── SETUP.md                          # Setup instructions
├── DEPLOYMENT.md                     # Deployment guide
├── API_DOCUMENTATION.md              # API reference
└── PROJECT_STRUCTURE.md              # This file
```

## Key Files Explained

### Backend

**server.js**
- Express server setup
- Middleware configuration (CORS, JSON parsing)
- Route mounting
- Error handling

**config/db.js**
- MySQL connection pool
- Database configuration from environment variables

**middleware/auth.js**
- JWT token verification
- Protects admin routes

**routes/public.js**
- GET /services - Fetch all services
- GET /gallery - Fetch all gallery images
- POST /contact - Submit contact form

**routes/admin.js**
- POST /admin/login - Admin authentication
- CRUD operations for services
- CRUD operations for gallery
- GET /admin/contacts - View enquiries

**database/schema.sql**
- Database structure
- Sample data
- Default admin user

### Frontend

**App.jsx**
- React Router setup
- Route definitions
- Layout structure

**config/api.js**
- Axios instance with base URL
- JWT token interceptor
- Centralized API configuration

**components/Navbar.jsx**
- Responsive navigation
- Mobile menu toggle
- Active route highlighting

**components/PrivateRoute.jsx**
- Route protection
- Redirects to login if not authenticated

**pages/Home.jsx**
- Hero section with shop name
- Call and WhatsApp buttons
- Features showcase
- Call-to-action sections

**pages/Services.jsx**
- Fetches services from API
- Displays in responsive grid
- Shows price if available

**pages/Gallery.jsx**
- Fetches gallery images from API
- Responsive image grid
- Hover effects

**pages/Contact.jsx**
- Contact form with validation
- Shop information display
- Google Maps link
- Success/error messages

**pages/admin/AdminLogin.jsx**
- Admin authentication form
- JWT token storage
- Error handling

**pages/admin/AdminDashboard.jsx**
- Tabbed interface (Services, Gallery, Contacts)
- CRUD operations for services
- CRUD operations for gallery
- View customer enquiries
- Logout functionality

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: cors package

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3 (no framework)

## Database Schema

### admins
- id (PK)
- username (unique)
- password_hash
- created_at

### services
- id (PK)
- title
- description
- price (nullable)
- created_at

### gallery
- id (PK)
- image_url
- title (nullable)
- created_at

### contacts
- id (PK)
- name
- phone
- message
- created_at

## Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ladies_tailor_db
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_SHOP_NAME=Sri Ladies Tailor
VITE_PHONE=+919876543210
VITE_WHATSAPP=919876543210
VITE_ADDRESS=123 Main Street, City
VITE_MAP_URL=https://maps.google.com/?q=Location
```

## Security Features

1. **Password Security**
   - Bcrypt hashing (10 rounds)
   - No plaintext storage

2. **Authentication**
   - JWT tokens (24h expiry)
   - Protected admin routes

3. **SQL Injection Prevention**
   - Parameterized queries
   - mysql2 prepared statements

4. **Input Validation**
   - express-validator
   - Phone number format validation
   - Required field checks

5. **CORS Protection**
   - Configurable origins
   - Proper headers

## Features Checklist

### Customer Features
- ✅ View services dynamically
- ✅ Browse gallery
- ✅ Submit contact enquiries
- ✅ Call button
- ✅ WhatsApp button
- ✅ Google Maps integration
- ✅ Mobile responsive design
- ✅ SEO meta tags

### Admin Features
- ✅ Secure login
- ✅ Add/Edit/Delete services
- ✅ Add/Edit/Delete gallery images
- ✅ View customer enquiries
- ✅ Protected routes
- ✅ JWT authentication
- ✅ Logout functionality

### Technical Features
- ✅ RESTful API
- ✅ MySQL database
- ✅ Environment variables
- ✅ Error handling
- ✅ Input validation
- ✅ CORS configuration
- ✅ Responsive design
- ✅ Clean code structure

## Future Enhancements

- Image upload functionality
- Email notifications
- SMS integration
- Order tracking
- Payment gateway
- Customer reviews
- Appointment booking
- Multi-language support
- Dark mode
- Analytics dashboard
