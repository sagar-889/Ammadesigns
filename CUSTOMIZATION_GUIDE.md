# 🎨 Customization Guide

Learn how to customize the website to match your brand and requirements.

## 🏪 Shop Information

### Update Shop Name
**File:** `frontend/.env`
```env
VITE_SHOP_NAME=Your Shop Name Here
```

### Update Contact Details
**File:** `frontend/.env`
```env
VITE_PHONE=+919876543210
VITE_WHATSAPP=919876543210
VITE_ADDRESS=Your Full Address Here
```

### Update Google Maps Location
1. Go to Google Maps
2. Search for your shop
3. Click "Share" → "Embed a map"
4. Copy the URL
5. Update in `frontend/.env`:
```env
VITE_MAP_URL=https://maps.google.com/?q=Your+Location
```

## 🎨 Colors & Branding

### Change Primary Colors
**File:** `frontend/src/index.css`

```css
:root {
  --primary: #d946ef;      /* Main brand color */
  --secondary: #a855f7;    /* Secondary color */
  --dark: #1f2937;         /* Dark text */
  --light: #f9fafb;        /* Light background */
  --gray: #6b7280;         /* Gray text */
  --success: #10b981;      /* Success messages */
  --error: #ef4444;        /* Error messages */
}
```

**Popular Color Schemes:**

**Elegant Purple (Default)**
```css
--primary: #d946ef;
--secondary: #a855f7;
```

**Professional Blue**
```css
--primary: #3b82f6;
--secondary: #2563eb;
```

**Warm Pink**
```css
--primary: #ec4899;
--secondary: #db2777;
```

**Elegant Gold**
```css
--primary: #f59e0b;
--secondary: #d97706;
```

**Traditional Red**
```css
--primary: #ef4444;
--secondary: #dc2626;
```

### Change Fonts
**File:** `frontend/src/index.css`

```css
body {
  font-family: 'Your Font', sans-serif;
}
```

**Popular Font Combinations:**

**Modern & Clean**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}
```

**Elegant & Professional**
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@400;700&display=swap');

h1, h2, h3 {
  font-family: 'Playfair Display', serif;
}

body {
  font-family: 'Lato', sans-serif;
}
```

## 📝 Content Customization

### Update Home Page Tagline
**File:** `frontend/src/pages/Home.jsx`

```jsx
<p className="tagline">Your Custom Tagline Here</p>
<p className="subtitle">Your Subtitle • Key Points • Here</p>
```

### Update Features Section
**File:** `frontend/src/pages/Home.jsx`

```jsx
<div className="feature-card">
  <div className="feature-icon">✨</div>
  <h3>Your Feature Title</h3>
  <p>Your feature description</p>
</div>
```

**Icon Options:**
- ✨ Sparkles
- 👗 Dress
- ✂️ Scissors
- 📏 Ruler
- 🧵 Thread
- 💎 Diamond
- ⚡ Lightning
- 🎨 Palette
- 💰 Money
- ⏰ Clock

### Add More Services
**Option 1: Via Admin Panel**
1. Login to admin panel
2. Go to Services tab
3. Click "Add Service"
4. Fill details

**Option 2: Via Database**
```sql
INSERT INTO services (title, description, price) VALUES
('Service Name', 'Description here', 500.00);
```

### Add Gallery Images
**Option 1: Via Admin Panel**
1. Login to admin panel
2. Go to Gallery tab
3. Click "Add Image"
4. Enter image URL

**Option 2: Via Database**
```sql
INSERT INTO gallery (image_url, title) VALUES
('https://your-image-url.com/image.jpg', 'Image Title');
```

**Free Image Sources:**
- Unsplash: https://unsplash.com
- Pexels: https://pexels.com
- Pixabay: https://pixabay.com

## 🖼️ Logo & Favicon

### Add Logo
1. Create logo image (PNG, 200x50px recommended)
2. Save as `frontend/public/logo.png`
3. Update Navbar:

**File:** `frontend/src/components/Navbar.jsx`
```jsx
<Link to="/" className="logo">
  <img src="/logo.png" alt="Shop Logo" />
</Link>
```

**File:** `frontend/src/components/Navbar.css`
```css
.logo img {
  height: 40px;
  width: auto;
}
```

### Add Favicon
1. Create favicon (32x32px, .ico or .png)
2. Save as `frontend/public/favicon.ico`
3. Update HTML:

**File:** `frontend/index.html`
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```

## 📱 Social Media Integration

### Add Social Media Links
**File:** `frontend/src/components/Footer.jsx`

```jsx
<div className="social-links">
  <a href="https://facebook.com/yourpage" target="_blank">
    Facebook
  </a>
  <a href="https://instagram.com/yourpage" target="_blank">
    Instagram
  </a>
  <a href="https://twitter.com/yourpage" target="_blank">
    Twitter
  </a>
</div>
```

### Add Social Share Buttons
**File:** `frontend/src/pages/Home.jsx`

```jsx
<div className="share-buttons">
  <a 
    href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
    target="_blank"
  >
    Share on Facebook
  </a>
</div>
```

## 🌐 SEO Customization

### Update Meta Tags
**File:** `frontend/index.html`

```html
<head>
  <title>Your Shop Name - Professional Tailoring</title>
  <meta name="description" content="Your custom description here" />
  <meta name="keywords" content="tailor, stitching, your, keywords" />
  
  <!-- Open Graph for social media -->
  <meta property="og:title" content="Your Shop Name" />
  <meta property="og:description" content="Your description" />
  <meta property="og:image" content="https://your-site.com/og-image.jpg" />
  <meta property="og:url" content="https://your-site.com" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Your Shop Name" />
  <meta name="twitter:description" content="Your description" />
</head>
```

## 💳 Add Pricing Table

**File:** `frontend/src/pages/Services.jsx`

Add after services grid:

```jsx
<div className="pricing-table">
  <h2>Standard Pricing</h2>
  <table>
    <thead>
      <tr>
        <th>Service</th>
        <th>Price</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Blouse Stitching</td>
        <td>₹300</td>
        <td>2-3 days</td>
      </tr>
      {/* Add more rows */}
    </tbody>
  </table>
</div>
```

## 📧 Email Notifications

### Add Email on Contact Form Submit

**Install nodemailer:**
```bash
cd backend
npm install nodemailer
```

**File:** `backend/routes/public.js`

```javascript
import nodemailer from 'nodemailer';

// Configure email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// In contact route, after saving to database:
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'your-email@gmail.com',
  subject: 'New Contact Form Submission',
  html: `
    <h3>New Enquiry</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Message:</strong> ${message}</p>
  `
});
```

**Add to backend/.env:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## 🎯 Add Testimonials Section

**File:** `frontend/src/pages/Home.jsx`

```jsx
<section className="section testimonials">
  <div className="container">
    <h2 className="section-title">What Our Customers Say</h2>
    <div className="testimonials-grid">
      <div className="testimonial-card">
        <p>"Excellent work and perfect fitting!"</p>
        <h4>- Customer Name</h4>
      </div>
      {/* Add more testimonials */}
    </div>
  </div>
</section>
```

**File:** `frontend/src/pages/Home.css`

```css
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.testimonial-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.testimonial-card p {
  font-style: italic;
  margin-bottom: 16px;
}

.testimonial-card h4 {
  color: var(--primary);
  text-align: right;
}
```

## 🕐 Add Business Hours

**File:** `frontend/src/pages/Contact.jsx`

```jsx
<div className="business-hours">
  <h3>Business Hours</h3>
  <table>
    <tr>
      <td>Monday - Saturday</td>
      <td>9:00 AM - 8:00 PM</td>
    </tr>
    <tr>
      <td>Sunday</td>
      <td>10:00 AM - 6:00 PM</td>
    </tr>
  </table>
</div>
```

## 🔔 Add WhatsApp Floating Button

**File:** `frontend/src/App.jsx`

```jsx
function App() {
  const whatsapp = import.meta.env.VITE_WHATSAPP;
  
  return (
    <Router>
      {/* ... existing code ... */}
      
      <a 
        href={`https://wa.me/${whatsapp}`}
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
      >
        💬
      </a>
    </Router>
  );
}
```

**File:** `frontend/src/index.css`

```css
.whatsapp-float {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: #25d366;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 1000;
  text-decoration: none;
  transition: transform 0.3s;
}

.whatsapp-float:hover {
  transform: scale(1.1);
}
```

## 📊 Add Google Analytics

**File:** `frontend/index.html`

```html
<head>
  <!-- ... existing tags ... -->
  
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  </script>
</head>
```

## 🎨 Advanced Styling

### Add Gradient Background
**File:** `frontend/src/index.css`

```css
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}
```

### Add Animations
**File:** `frontend/src/index.css`

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fadeIn 0.5s ease-out;
}
```

### Add Dark Mode
**File:** `frontend/src/index.css`

```css
@media (prefers-color-scheme: dark) {
  :root {
    --dark: #f9fafb;
    --light: #1f2937;
  }
  
  body {
    background: #1f2937;
    color: #f9fafb;
  }
}
```

## 🔧 Backend Customization

### Add More Admin Users
```bash
cd backend
node scripts/hashPassword.js new_password
```

Then in MySQL:
```sql
INSERT INTO admins (username, password_hash) 
VALUES ('newadmin', 'hash_from_script');
```

### Change JWT Expiration
**File:** `backend/routes/admin.js`

```javascript
const token = jwt.sign(
  { id: admin.id, username: admin.username }, 
  process.env.JWT_SECRET, 
  { expiresIn: '7d' }  // Change from 24h to 7 days
);
```

### Add Rate Limiting
```bash
cd backend
npm install express-rate-limit
```

**File:** `backend/server.js`

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 💡 Tips

1. **Test After Each Change** - Make one change at a time
2. **Keep Backups** - Save original files before editing
3. **Use Version Control** - Commit changes to git
4. **Mobile First** - Always test on mobile devices
5. **Performance** - Optimize images before uploading
6. **Accessibility** - Use proper alt tags and ARIA labels

---

**Need more customization?** Check the code comments or ask for help!
