# Deployment Guide

## Backend Deployment (Render)

### 1. Prepare Backend
1. Ensure `package.json` has start script
2. Push code to GitHub

### 2. Deploy on Render
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node

### 3. Set Environment Variables
Add these in Render dashboard:
```
PORT=5000
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=ladies_tailor_db
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

### 4. Database Options
- **Railway MySQL**: Free tier available
- **PlanetScale**: Serverless MySQL
- **AWS RDS**: Production-grade
- **DigitalOcean**: Managed database

## Frontend Deployment (Netlify)

### 1. Build Frontend
```bash
cd frontend
npm run build
```

### 2. Deploy on Netlify
1. Go to https://netlify.com
2. Drag and drop `dist` folder
3. Or connect GitHub repository

### 3. Set Environment Variables
In Netlify dashboard:
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SHOP_NAME=Sri Ladies Tailor
VITE_PHONE=+919876543210
VITE_WHATSAPP=919876543210
VITE_ADDRESS=Your Shop Address
VITE_MAP_URL=https://maps.google.com/?q=Your+Location
```

### 4. Configure Build Settings
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

## Alternative: Vercel (Frontend)

```bash
cd frontend
npm install -g vercel
vercel
```

Follow prompts and set environment variables in Vercel dashboard.

## Alternative: Railway (Full Stack)

Railway can host both backend and database:

1. Create Railway account
2. New Project → Deploy from GitHub
3. Add MySQL database
4. Set environment variables
5. Deploy

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify database connection
- [ ] Test admin login
- [ ] Check CORS settings
- [ ] Test contact form
- [ ] Verify image loading
- [ ] Test on mobile devices
- [ ] Update Google Maps link
- [ ] Change default admin password
- [ ] Set up SSL (automatic on Netlify/Render)
- [ ] Configure custom domain (optional)

## Custom Domain Setup

### Netlify
1. Domain Settings → Add custom domain
2. Update DNS records as instructed

### Render
1. Settings → Custom Domain
2. Add CNAME record to your DNS

## Monitoring

- Check Render logs for backend errors
- Monitor Netlify deploy logs
- Set up error tracking (optional): Sentry
- Monitor database performance

## Backup Strategy

1. **Database Backups**
   - Use managed database backup features
   - Or set up automated mysqldump

2. **Code Backups**
   - GitHub repository (already backed up)
   - Keep production .env files secure

## Security Checklist

- [ ] HTTPS enabled (automatic)
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] Admin password changed
- [ ] CORS properly configured
- [ ] Rate limiting (optional)
- [ ] SQL injection prevention (already implemented)
- [ ] Input validation (already implemented)

## Cost Estimates

### Free Tier Options
- **Render**: Free for web services (with limitations)
- **Netlify**: Free for static sites
- **Railway**: $5 credit/month free
- **PlanetScale**: Free tier available

### Paid Options (Monthly)
- **Render**: $7+ for always-on service
- **Railway**: ~$5-10 for database + backend
- **AWS RDS**: $15+ for small instance
- **Custom Domain**: $10-15/year

## Troubleshooting

### Backend not connecting to database
- Check DB_HOST, DB_USER, DB_PASSWORD
- Verify database is accessible from Render IP
- Check firewall rules

### Frontend can't reach backend
- Verify VITE_API_URL is correct
- Check CORS settings in backend
- Ensure backend is running

### Images not loading
- Verify image URLs are accessible
- Check HTTPS/HTTP mixed content issues
- Use HTTPS image URLs in production
