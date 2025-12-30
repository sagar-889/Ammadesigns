cd backend# 🚀 Getting Started - Quick Guide

This is your fastest path to getting the Ladies Tailor Shop website running!

## ⚡ 5-Minute Setup (For Developers)

### Step 1: Install Dependencies (2 min)
```bash
# Windows users - double click:
install.bat

# Or manually:
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Step 2: Setup Database (2 min)
```bash
# Open MySQL
mysql -u root -p

# Run these commands:
CREATE DATABASE ladies_tailor_db;
exit;

# Import schema
mysql -u root -p ladies_tailor_db < backend/database/schema.sql
```

### Step 3: Configure Environment (1 min)
```bash
# Backend - create backend/.env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ladies_tailor_db
JWT_SECRET=change_this_to_random_string
NODE_ENV=development

# Frontend - create frontend/.env
VITE_API_URL=http://localhost:5000/api
VITE_SHOP_NAME=Sri Ladies Tailor
VITE_PHONE=+919876543210
VITE_WHATSAPP=919876543210
VITE_ADDRESS=123 Main Street, Your City
VITE_MAP_URL=https://maps.google.com
```

### Step 4: Start Servers
```bash
# Windows - double click:
start-dev.bat

# Or manually in 2 terminals:
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

### Step 5: Open & Test
- Website: http://localhost:5173
- Admin: http://localhost:5173/admin/login
  - Username: `admin`
  - Password: `admin123`

**Done!** 🎉

---

## 📖 For Non-Technical Users

### What You Need
1. A computer with Windows/Mac/Linux
2. Internet connection
3. MySQL database (can be installed locally or use cloud)
4. 30 minutes of time

### Installation Steps

#### 1. Install Required Software

**Node.js** (JavaScript runtime)
- Go to: https://nodejs.org
- Download LTS version
- Install with default settings
- Verify: Open terminal, type `node --version`

**MySQL** (Database)
- Go to: https://dev.mysql.com/downloads/mysql/
- Download Community version
- Install with default settings
- Remember your root password!

#### 2. Get the Code
- Download this project as ZIP
- Extract to a folder (e.g., `C:\ladies-tailor-shop`)

#### 3. Install Dependencies
- Open folder in File Explorer
- Double-click `install.bat`
- Wait for installation to complete

#### 4. Setup Database
- Open MySQL Workbench or command line
- Create new database: `ladies_tailor_db`
- Import file: `backend/database/schema.sql`

#### 5. Configure Settings
- Copy `backend/.env.example` to `backend/.env`
- Edit with your database password
- Copy `frontend/.env.example` to `frontend/.env`
- Edit with your shop details

#### 6. Start Website
- Double-click `start-dev.bat`
- Two windows will open (backend and frontend)
- Wait 30 seconds
- Open browser: http://localhost:5173

#### 7. Login to Admin Panel
- Go to: http://localhost:5173/admin/login
- Username: `admin`
- Password: `admin123`
- **Change password immediately!**

---

## 🎯 What to Do After Setup

### Customize Your Shop

1. **Update Shop Information**
   - Edit `frontend/.env`
   - Change shop name, phone, address
   - Save and restart frontend

2. **Add Your Services**
   - Login to admin panel
   - Go to Services tab
   - Click "Add Service"
   - Enter title, description, price

3. **Add Your Photos**
   - Go to Gallery tab
   - Click "Add Image"
   - Enter image URL
   - (Images must be hosted online)

4. **Check Contact Form**
   - Go to website contact page
   - Submit a test message
   - Check in admin panel → Contacts

### Change Admin Password

**Method 1: Using Script**
```bash
cd backend
node scripts/hashPassword.js your_new_password
# Copy the hash
```

Then in MySQL:
```sql
UPDATE admins SET password_hash = 'paste_hash_here' WHERE username = 'admin';
```

**Method 2: Create New Admin**
```sql
INSERT INTO admins (username, password_hash) 
VALUES ('newadmin', 'hash_from_script');
```

---

## 🌐 Going Live (Deploy to Internet)

### Option 1: Free Hosting

**Backend** (Render.com)
1. Create account on Render.com
2. New Web Service → Connect GitHub
3. Set environment variables
4. Deploy

**Frontend** (Netlify.com)
1. Create account on Netlify.com
2. Drag & drop `frontend/dist` folder
3. Set environment variables
4. Deploy

**Database** (Railway.app)
1. Create account on Railway.app
2. New Project → MySQL
3. Get connection details
4. Update backend .env

### Option 2: Paid Hosting
- DigitalOcean ($5/month)
- AWS (varies)
- Hostinger (₹99/month)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 🆘 Common Issues & Solutions

### "Cannot connect to database"
**Solution:**
- Check MySQL is running
- Verify password in `backend/.env`
- Ensure database `ladies_tailor_db` exists

### "Port 5000 already in use"
**Solution:**
- Change PORT in `backend/.env` to 5001
- Update `VITE_API_URL` in `frontend/.env`

### "npm not found"
**Solution:**
- Install Node.js from nodejs.org
- Restart terminal/computer

### "CORS error"
**Solution:**
- Check `VITE_API_URL` in `frontend/.env`
- Ensure backend is running

### "Invalid token"
**Solution:**
- Clear browser localStorage
- Login again

### Images not showing
**Solution:**
- Use full HTTPS URLs for images
- Try: https://images.unsplash.com/...
- Or upload to imgur.com and use that URL

---

## 📚 Learn More

- [Full Setup Guide](SETUP.md) - Detailed instructions
- [API Documentation](API_DOCUMENTATION.md) - For developers
- [Deployment Guide](DEPLOYMENT.md) - Go live
- [Production Checklist](PRODUCTION_CHECKLIST.md) - Before launch

---

## 💬 Need Help?

### Check These First
1. Is MySQL running?
2. Are both servers running?
3. Did you create .env files?
4. Are ports 5000 and 5173 free?

### Still Stuck?
- Read error messages carefully
- Check browser console (F12)
- Check terminal for errors
- Review documentation files

---

## 🎓 Video Tutorials (Recommended)

Search YouTube for:
- "How to install Node.js"
- "How to install MySQL"
- "React + Express tutorial"
- "Deploy to Netlify"
- "Deploy to Render"

---

## ✅ Success Checklist

After setup, verify:
- [ ] Website opens at localhost:5173
- [ ] Services page shows sample services
- [ ] Gallery page shows sample images
- [ ] Contact form submits successfully
- [ ] Admin login works
- [ ] Can add/edit/delete services
- [ ] Can add/edit/delete gallery items
- [ ] Can view contact submissions

**All checked?** You're ready to customize and deploy! 🚀

---

## 🎉 Next Steps

1. **Customize** - Add your shop details
2. **Add Content** - Services and photos
3. **Test** - Try all features
4. **Deploy** - Make it live
5. **Share** - Tell your customers!

**Welcome to your new website!** 🎊
