# ⚡ Quick Reference Guide

Your one-page cheat sheet for the Ladies Tailor Shop website.

## 🚀 Quick Commands

### Start Development
```bash
# Windows
start-dev.bat

# Manual
cd backend && npm run dev    # Terminal 1
cd frontend && npm run dev   # Terminal 2
```

### Install Dependencies
```bash
# Windows
install.bat

# Manual
cd backend && npm install
cd frontend && npm install
```

### Build for Production
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `backend/.env` | Database & API config |
| `frontend/.env` | Shop details & API URL |
| `backend/server.js` | Backend entry point |
| `frontend/src/App.jsx` | Frontend entry point |
| `backend/database/schema.sql` | Database structure |

## 🔑 Default Credentials

**Admin Login:**
- URL: http://localhost:5173/admin/login
- Username: `admin`
- Password: `admin123`

⚠️ **Change immediately!**

## 🌐 URLs

| Environment | Frontend | Backend | Database |
|-------------|----------|---------|----------|
| Development | :5173 | :5000 | :3306 |
| Production | Netlify/Vercel | Render/Railway | Railway/RDS |

## 📊 Database Tables

```sql
admins      - Admin users
services    - Service listings
gallery     - Gallery images
contacts    - Customer enquiries
```

## 🛠️ Common Tasks

### Add Service (Admin Panel)
1. Login → Services tab
2. Click "Add Service"
3. Enter: title, description, price

### Add Gallery Image (Admin Panel)
1. Login → Gallery tab
2. Click "Add Image"
3. Enter: image URL, title

### View Enquiries (Admin Panel)
1. Login → Contacts tab
2. See all customer messages

### Change Shop Name
Edit `frontend/.env`:
```env
VITE_SHOP_NAME=New Name
```

### Change Colors
Edit `frontend/src/index.css`:
```css
:root {
  --primary: #your-color;
}
```

### Generate Password Hash
```bash
cd backend
node scripts/hashPassword.js your_password
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ladies_tailor_db
JWT_SECRET=random_secret_key
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SHOP_NAME=Sri Ladies Tailor
VITE_PHONE=+919876543210
VITE_WHATSAPP=919876543210
VITE_ADDRESS=Your Address
VITE_MAP_URL=https://maps.google.com
```

## 📡 API Endpoints

### Public
```
GET  /api/services       - Get all services
GET  /api/gallery        - Get gallery images
POST /api/contact        - Submit enquiry
```

### Admin (Protected)
```
POST   /api/admin/login           - Login
GET    /api/admin/contacts        - View enquiries
POST   /api/admin/services        - Add service
PUT    /api/admin/services/:id    - Update service
DELETE /api/admin/services/:id    - Delete service
POST   /api/admin/gallery         - Add image
PUT    /api/admin/gallery/:id     - Update image
DELETE /api/admin/gallery/:id     - Delete image
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect to DB | Check MySQL running, verify .env |
| CORS error | Check VITE_API_URL in frontend/.env |
| Port in use | Change PORT in backend/.env |
| JWT error | Clear localStorage, login again |
| Images not loading | Use HTTPS URLs |

## 📝 SQL Quick Commands

### View All Services
```sql
SELECT * FROM services;
```

### Add Service
```sql
INSERT INTO services (title, description, price) 
VALUES ('Title', 'Description', 500.00);
```

### View Contacts
```sql
SELECT * FROM contacts ORDER BY created_at DESC;
```

### Change Admin Password
```sql
UPDATE admins 
SET password_hash = 'new_hash' 
WHERE username = 'admin';
```

### Delete Old Contacts
```sql
DELETE FROM contacts 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

## 🎨 Quick Customizations

### Change Primary Color
```css
/* frontend/src/index.css */
:root {
  --primary: #d946ef;  /* Your color */
}
```

### Update Tagline
```jsx
/* frontend/src/pages/Home.jsx */
<p className="tagline">Your New Tagline</p>
```

### Add Feature
```jsx
/* frontend/src/pages/Home.jsx */
<div className="feature-card">
  <div className="feature-icon">✨</div>
  <h3>Feature Title</h3>
  <p>Description</p>
</div>
```

## 📦 NPM Scripts

### Backend
```bash
npm run dev    # Start development server
npm start      # Start production server
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔐 Security Checklist

- [ ] Changed default admin password
- [ ] Strong JWT_SECRET set
- [ ] Database password secure
- [ ] CORS configured for production
- [ ] HTTPS enabled
- [ ] .env files not in git

## 📚 Documentation Files

| File | Content |
|------|---------|
| README.md | Project overview |
| GETTING_STARTED.md | Quick start guide |
| SETUP.md | Detailed setup |
| DEPLOYMENT.md | Deploy to production |
| API_DOCUMENTATION.md | API reference |
| CUSTOMIZATION_GUIDE.md | How to customize |
| ARCHITECTURE.md | System design |
| PRODUCTION_CHECKLIST.md | Pre-launch checklist |

## 🎯 Project Structure

```
ladies-tailor-shop/
├── backend/
│   ├── config/db.js
│   ├── routes/
│   │   ├── public.js
│   │   └── admin.js
│   ├── middleware/auth.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── config/api.js
│       └── App.jsx
└── docs/
```

## 💻 Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: MySQL 8
- **Auth**: JWT + bcrypt
- **Styling**: CSS3

## 🚀 Deployment Quick Steps

### Backend (Render)
1. Push to GitHub
2. New Web Service on Render
3. Set environment variables
4. Deploy

### Frontend (Netlify)
1. Build: `npm run build`
2. Drag `dist` folder to Netlify
3. Set environment variables
4. Done!

## 📞 Support

**Check First:**
1. Error messages in terminal
2. Browser console (F12)
3. Documentation files
4. Database connection

**Common Issues:**
- MySQL not running
- Wrong .env values
- Port conflicts
- Missing dependencies

## 🎓 Learning Resources

- React: https://react.dev
- Express: https://expressjs.com
- MySQL: https://dev.mysql.com/doc
- JWT: https://jwt.io

## ⚡ Performance Tips

1. Optimize images (WebP format)
2. Use CDN for assets
3. Enable gzip compression
4. Minimize database queries
5. Add caching headers

## 🔄 Backup Commands

### Database Backup
```bash
mysqldump -u root -p ladies_tailor_db > backup.sql
```

### Database Restore
```bash
mysql -u root -p ladies_tailor_db < backup.sql
```

### Code Backup
```bash
git add .
git commit -m "Backup"
git push
```

## 📊 Monitoring

### Check Backend Health
```bash
curl http://localhost:5000
```

### Check API
```bash
curl http://localhost:5000/api/services
```

### Check Database
```bash
mysql -u root -p -e "USE ladies_tailor_db; SELECT COUNT(*) FROM services;"
```

## 🎉 Quick Wins

**5-Minute Tasks:**
- Change shop name
- Update phone number
- Change colors
- Add a service

**15-Minute Tasks:**
- Add logo
- Customize home page
- Add social links
- Update meta tags

**1-Hour Tasks:**
- Add email notifications
- Customize all pages
- Add testimonials
- Deploy to production

---

## 🆘 Emergency Commands

### Reset Admin Password
```bash
cd backend
node scripts/hashPassword.js newpassword
# Copy hash, then:
mysql -u root -p
USE ladies_tailor_db;
UPDATE admins SET password_hash='paste_hash' WHERE username='admin';
```

### Clear All Contacts
```sql
TRUNCATE TABLE contacts;
```

### Restart Everything
```bash
# Stop all (Ctrl+C in terminals)
# Then:
start-dev.bat
```

---

**Print this page for quick reference!** 📄

**Bookmark these URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Admin: http://localhost:5173/admin/login

**Keep handy:**
- Database password
- JWT secret
- Admin credentials
- Hosting credentials

---

**Need detailed help?** Check the full documentation files!
