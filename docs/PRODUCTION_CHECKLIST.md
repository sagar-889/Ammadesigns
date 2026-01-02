# 🚀 Production Checklist

Use this checklist before deploying to production.

## 🔐 Security

- [ ] Change default admin password
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Update CORS to allow only your frontend domain
- [ ] Enable HTTPS (automatic on Netlify/Render)
- [ ] Remove console.log statements from production code
- [ ] Set NODE_ENV=production
- [ ] Secure database with strong password
- [ ] Restrict database access to backend IP only
- [ ] Review all environment variables
- [ ] Never commit .env files to git

## 🗄️ Database

- [ ] Create production database
- [ ] Run schema.sql on production database
- [ ] Set up automated backups
- [ ] Test database connection from backend
- [ ] Verify all tables created correctly
- [ ] Add production data (services, gallery)
- [ ] Remove test/sample data if needed
- [ ] Document database credentials securely

## 🔧 Backend Configuration

- [ ] Update .env with production values
- [ ] Set correct DB_HOST, DB_USER, DB_PASSWORD
- [ ] Generate new JWT_SECRET
- [ ] Set PORT (usually 5000 or from environment)
- [ ] Configure CORS for production domain
- [ ] Test all API endpoints
- [ ] Verify JWT authentication works
- [ ] Check error handling
- [ ] Enable request logging (optional)
- [ ] Set up monitoring (optional)

## 🎨 Frontend Configuration

- [ ] Update VITE_API_URL to production backend
- [ ] Set correct VITE_SHOP_NAME
- [ ] Update VITE_PHONE with real number
- [ ] Update VITE_WHATSAPP with real number
- [ ] Set correct VITE_ADDRESS
- [ ] Update VITE_MAP_URL with actual location
- [ ] Test build: `npm run build`
- [ ] Verify dist folder created
- [ ] Test production build locally: `npm run preview`

## 🌐 Deployment

### Backend
- [ ] Deploy to Render/Railway/Heroku
- [ ] Set all environment variables
- [ ] Verify deployment successful
- [ ] Test API health endpoint
- [ ] Check logs for errors
- [ ] Note down backend URL

### Frontend
- [ ] Deploy to Netlify/Vercel
- [ ] Set all environment variables
- [ ] Configure build settings
- [ ] Verify deployment successful
- [ ] Test website loads
- [ ] Check all pages work

### Domain (Optional)
- [ ] Purchase domain name
- [ ] Configure DNS settings
- [ ] Add custom domain to Netlify/Vercel
- [ ] Add custom domain to Render (backend)
- [ ] Wait for DNS propagation
- [ ] Verify SSL certificate active

## ✅ Testing

### Frontend Testing
- [ ] Home page loads correctly
- [ ] Services page shows data from API
- [ ] Gallery page displays images
- [ ] Contact form submits successfully
- [ ] Call button works
- [ ] WhatsApp button works
- [ ] Google Maps link works
- [ ] Navigation works on all pages
- [ ] Mobile responsive on all pages
- [ ] Admin login page accessible
- [ ] Admin dashboard loads after login

### Backend Testing
- [ ] GET /api/services returns data
- [ ] GET /api/gallery returns data
- [ ] POST /api/contact saves to database
- [ ] POST /api/admin/login returns token
- [ ] Protected routes require authentication
- [ ] CRUD operations work for services
- [ ] CRUD operations work for gallery
- [ ] GET /api/admin/contacts returns enquiries

### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### Device Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Large mobile (414x896)

## 📊 Performance

- [ ] Images optimized (use WebP if possible)
- [ ] Lazy loading for gallery images
- [ ] Minified CSS and JS (automatic with Vite)
- [ ] Gzip compression enabled
- [ ] Database queries optimized
- [ ] No N+1 query problems
- [ ] API response times acceptable (<500ms)
- [ ] Page load times acceptable (<3s)

## 📱 SEO & Meta Tags

- [ ] Title tag set correctly
- [ ] Meta description added
- [ ] Meta keywords added
- [ ] Open Graph tags (optional)
- [ ] Favicon added
- [ ] robots.txt configured (optional)
- [ ] sitemap.xml created (optional)
- [ ] Google Analytics added (optional)

## 📧 Communication

- [ ] Test contact form submissions
- [ ] Verify enquiries saved to database
- [ ] Set up email notifications (optional)
- [ ] Test WhatsApp link
- [ ] Test phone call link
- [ ] Verify admin can see all enquiries

## 🔄 Backup & Recovery

- [ ] Database backup strategy in place
- [ ] Code backed up on GitHub
- [ ] Environment variables documented securely
- [ ] Recovery plan documented
- [ ] Test restore from backup

## 📝 Documentation

- [ ] Update README with production URLs
- [ ] Document admin credentials (securely)
- [ ] Create user guide for shop owner
- [ ] Document deployment process
- [ ] Note down all service credentials
- [ ] Create maintenance guide

## 🎓 Training

- [ ] Train shop owner on admin panel
- [ ] Show how to add services
- [ ] Show how to add gallery images
- [ ] Show how to view enquiries
- [ ] Explain how to change password
- [ ] Provide contact for support

## 📞 Go-Live

- [ ] Announce website launch
- [ ] Share on social media
- [ ] Update Google My Business
- [ ] Add to business cards
- [ ] Monitor for first 24 hours
- [ ] Check for errors in logs
- [ ] Respond to first enquiries
- [ ] Celebrate! 🎉

## 🔍 Post-Launch Monitoring

### Week 1
- [ ] Check daily for errors
- [ ] Monitor enquiry submissions
- [ ] Verify all features working
- [ ] Check mobile experience
- [ ] Review analytics (if enabled)

### Month 1
- [ ] Review performance metrics
- [ ] Check database size
- [ ] Verify backups working
- [ ] Collect user feedback
- [ ] Plan improvements

## 🆘 Emergency Contacts

Document these securely:
- [ ] Hosting provider support
- [ ] Database provider support
- [ ] Domain registrar support
- [ ] Developer contact
- [ ] Backup admin credentials

## 💡 Optional Enhancements

Consider for future:
- [ ] Email notifications for enquiries
- [ ] SMS notifications
- [ ] Image upload from admin panel
- [ ] Appointment booking system
- [ ] Payment integration
- [ ] Customer reviews
- [ ] Blog section
- [ ] Newsletter signup
- [ ] Social media integration
- [ ] Live chat support

---

## 🎯 Final Check

Before going live, answer these:

1. ✅ Can customers view services?
2. ✅ Can customers view gallery?
3. ✅ Can customers submit enquiries?
4. ✅ Can admin login securely?
5. ✅ Can admin manage services?
6. ✅ Can admin manage gallery?
7. ✅ Can admin view enquiries?
8. ✅ Is website mobile-friendly?
9. ✅ Are all links working?
10. ✅ Is data secure?

If all YES → **You're ready to launch!** 🚀

---

**Remember**: Keep this checklist for future updates and maintenance!
