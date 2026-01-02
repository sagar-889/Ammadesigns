# Render Deployment Guide for Ammadesigns

## Quick Fix for Current Error

The error `Cannot find module '/opt/render/project/src/server.js'` occurs because Render is running from the root directory, but your backend code is in the `backend/` folder.

### IMMEDIATE FIX: Update Your Existing Service

If you already created a Web Service on Render:

1. **Go to your service settings on Render Dashboard**
2. **Update these fields:**
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
3. **Click "Save Changes"**
4. **Manually trigger a new deploy**

This will fix the path issue immediately.

---

## Deployment Steps

### Option 1: Deploy with render.yaml (Recommended for New Deployments)

1. **Push the render.yaml file to your GitHub repository**
   ```bash
   git add render.yaml
   git commit -m "Add Render configuration"
   git push origin main
   ```

2. **Create New Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and create both services

3. **Configure Environment Variables**
   
   For **Backend Service**:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - Will be auto-generated
   - `RAZORPAY_KEY_ID` - Your Razorpay key
   - `RAZORPAY_KEY_SECRET` - Your Razorpay secret
   
   For **Frontend Service**:
   - `VITE_API_URL` - Will be set to your backend URL automatically

### Option 2: Manual Service Configuration

If you prefer to configure manually:

#### Backend Service

1. **Create New Web Service**
   - Name: `ammadesigns-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node server.js`
   - Plan: Free

2. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_jwt_secret_here
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

#### Frontend Service

1. **Create New Static Site**
   - Name: `ammadesigns-frontend`
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
   - Plan: Free

2. **Environment Variables**:
   ```
   VITE_API_URL=https://ammadesigns-backend.onrender.com
   ```

## Database Setup

### Option 1: Render PostgreSQL (Recommended)

1. Create a new PostgreSQL database on Render
2. Copy the Internal Database URL
3. Add it as `DATABASE_URL` environment variable to your backend service

### Option 2: External PostgreSQL

Use any PostgreSQL provider (Neon, Supabase, etc.) and add the connection string to `DATABASE_URL`.

## Post-Deployment Steps

1. **Initialize Database**
   - Run the database initialization script from your backend service shell:
   ```bash
   cd backend && node scripts/init-db.js
   ```

2. **Verify Backend**
   - Visit: `https://your-backend-name.onrender.com`
   - Should see: `{"message":"Ladies Tailor Shop API is running"}`

3. **Update Frontend API URL**
   - If you used a different backend name, update the `VITE_API_URL` in frontend service
   - Redeploy frontend after updating

4. **Test the Application**
   - Visit your frontend URL
   - Try logging in with admin credentials
   - Test order placement and tracking

## Common Issues

### Issue: "Cannot find module" Error
**Solution**: Make sure your Start Command includes `cd backend &&` before `node server.js`

### Issue: Database Connection Failed
**Solution**: 
- Verify `DATABASE_URL` is set correctly
- Check if database allows connections from Render IPs
- Run the database initialization script

### Issue: CORS Errors
**Solution**: Update backend CORS configuration to allow your frontend domain

### Issue: Frontend Can't Connect to Backend
**Solution**: 
- Verify `VITE_API_URL` points to correct backend URL
- Rebuild frontend after changing environment variables

## Free Tier Limitations

- Backend service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free (enough for one service running 24/7)

## Upgrade Considerations

For production use, consider:
- Paid plan ($7/month) for always-on backend
- Custom domain setup
- PostgreSQL paid plan for better performance
- CDN for static assets

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [Troubleshooting Deploys](https://render.com/docs/troubleshooting-deploys)
