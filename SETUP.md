# Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Step-by-Step Setup

### 1. Database Setup

Create MySQL database and run schema:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE ladies_tailor_db;
exit;
```

Import the schema:
```bash
mysql -u root -p ladies_tailor_db < backend/database/schema.sql
```

Or manually run the SQL from `backend/database/schema.sql`

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ladies_tailor_db
JWT_SECRET=your_random_secret_key_here
NODE_ENV=development
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Start backend server:
```bash
npm run dev
```

Backend will run on http://localhost:5000

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your shop details:
```
VITE_API_URL=http://localhost:5000/api
VITE_SHOP_NAME=Sri Ladies Tailor
VITE_PHONE=+919876543210
VITE_WHATSAPP=919876543210
VITE_ADDRESS=123 Main Street, Your City
VITE_MAP_URL=https://maps.google.com/?q=Your+Shop+Location
```

Start frontend:
```bash
npm run dev
```

Frontend will run on http://localhost:5173

### 4. Access the Application

- **Website**: http://localhost:5173
- **Admin Login**: http://localhost:5173/admin/login
  - Username: `admin`
  - Password: `admin123`

**IMPORTANT**: Change the default admin password immediately!

### 5. Update Admin Password

To create a new password hash:

```bash
cd backend
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your_new_password', 10));"
```

Then update in MySQL:
```sql
UPDATE admins SET password_hash = 'your_generated_hash' WHERE username = 'admin';
```

## Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

### Frontend (Netlify/Vercel)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Set environment variables
4. Update `VITE_API_URL` to production backend URL

### Database (Production)
Use managed MySQL services:
- AWS RDS
- PlanetScale
- Railway MySQL
- DigitalOcean Managed Database

## Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists

### CORS Error
- Check backend CORS configuration
- Verify API URL in frontend `.env`

### JWT Error
- Ensure JWT_SECRET is set in backend `.env`
- Clear localStorage and login again

## Features

### Customer Features
- View services with prices
- Browse gallery
- Contact form with validation
- Call and WhatsApp buttons
- Mobile responsive

### Admin Features
- Secure login with JWT
- Add/Edit/Delete services
- Add/Edit/Delete gallery images
- View customer enquiries
- Protected routes

## Security Features
- Password hashing with bcrypt
- JWT authentication
- SQL injection prevention (parameterized queries)
- Input validation
- CORS protection
- Environment variables for sensitive data
