# 🔐 Customer Authentication Guide

Complete guide to the customer login/signup system added to your Ladies Tailor Shop.

## 🎯 Overview

Your website now includes a full customer authentication system with:
- Customer signup/registration
- Customer login
- Profile management
- Order history
- Secure JWT authentication
- Auto-fill checkout for logged-in users

## ✨ Features

### Customer Features

#### 1. Signup (`/signup`)
- Create new customer account
- Required fields:
  - Full name
  - Email (unique)
  - Phone (10 digits)
  - Password (min 6 characters)
  - Address (optional)
- Password confirmation
- Automatic login after signup
- JWT token stored in localStorage

#### 2. Login (`/login`)
- Email and password authentication
- Remember user session
- Redirect to previous page after login
- 7-day token expiry
- Link to admin login

#### 3. Account/Profile (`/account`)
- View profile information
- Edit profile (name, phone, address)
- View order history
- Track order status
- Logout functionality

#### 4. Auto-fill Checkout
- Logged-in users get pre-filled checkout form
- Faster checkout process
- Orders linked to customer account

## 🗄️ Database Schema

### Customers Table
```sql
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Updated Orders Table
```sql
CREATE TABLE orders (
    ...
    customer_id INT,
    ...
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);
```

## 🔌 API Endpoints

### Authentication APIs

#### Customer Signup
```
POST /api/auth/signup
Body: {
  name: "Customer Name",
  email: "customer@example.com",
  phone: "9876543210",
  password: "password123",
  address: "Full Address (optional)"
}

Response: {
  token: "jwt_token",
  customer: {
    id: 1,
    name: "Customer Name",
    email: "customer@example.com",
    phone: "9876543210"
  }
}
```

#### Customer Login
```
POST /api/auth/login
Body: {
  email: "customer@example.com",
  password: "password123"
}

Response: {
  token: "jwt_token",
  customer: {
    id: 1,
    name: "Customer Name",
    email: "customer@example.com",
    phone: "9876543210",
    address: "Full Address"
  }
}
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <token>

Response: {
  id: 1,
  name: "Customer Name",
  email: "customer@example.com",
  phone: "9876543210",
  address: "Full Address",
  created_at: "2024-01-01T00:00:00.000Z"
}
```

#### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <token>
Body: {
  name: "Updated Name",
  phone: "9876543210",
  address: "Updated Address"
}

Response: {
  message: "Profile updated successfully"
}
```

#### Get Customer Orders
```
GET /api/auth/orders
Authorization: Bearer <token>

Response: [
  {
    id: 1,
    order_number: "ORD1234567890",
    total_amount: 1500,
    payment_status: "completed",
    order_status: "confirmed",
    created_at: "2024-01-01T00:00:00.000Z",
    items: [...]
  }
]
```

## 🎨 Frontend Components

### Auth Context
**File:** `frontend/src/context/AuthContext.jsx`

Provides authentication functionality:
- `user` - Current logged-in user
- `loading` - Loading state
- `isAuthenticated` - Boolean auth status
- `login(email, password)` - Login function
- `signup(userData)` - Signup function
- `logout()` - Logout function
- `updateProfile(userData)` - Update profile

### Usage Example
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => navigate('/login')}>Login</button>
      )}
    </div>
  );
}
```

## 🔒 Security Features

### Password Security
- Passwords hashed with bcrypt (10 rounds)
- Never stored in plaintext
- Minimum 6 characters required
- Password confirmation on signup

### JWT Authentication
- Secure token-based authentication
- 7-day token expiry
- Stored in localStorage
- Sent in Authorization header
- Verified on every protected request

### Input Validation
- Email format validation
- Phone number validation (10 digits)
- Required field checks
- SQL injection prevention
- XSS protection

## 🚀 User Flows

### Signup Flow
```
1. Visit /signup
   ↓
2. Fill registration form
   ↓
3. Submit form
   ↓
4. Backend validates data
   ↓
5. Password hashed
   ↓
6. Customer created in database
   ↓
7. JWT token generated
   ↓
8. Token stored in localStorage
   ↓
9. Redirect to home page
   ↓
10. User is logged in
```

### Login Flow
```
1. Visit /login
   ↓
2. Enter email & password
   ↓
3. Submit form
   ↓
4. Backend verifies credentials
   ↓
5. JWT token generated
   ↓
6. Token stored in localStorage
   ↓
7. Redirect to previous page
   ↓
8. User is logged in
```

### Checkout Flow (Logged In)
```
1. Add items to cart
   ↓
2. Go to checkout
   ↓
3. Form auto-filled with user data
   ↓
4. Review and edit if needed
   ↓
5. Complete payment
   ↓
6. Order linked to customer account
   ↓
7. View in order history
```

## 📱 Pages

### Login Page (`/login`)
- Email input
- Password input
- Login button
- Link to signup
- Link to admin login
- Error messages
- Loading state

### Signup Page (`/signup`)
- Name input
- Email input
- Phone input
- Password input
- Confirm password input
- Address textarea (optional)
- Signup button
- Link to login
- Validation errors
- Loading state

### Account Page (`/account`)
**Profile Tab:**
- View profile info
- Edit profile button
- Update form
- Save/Cancel buttons
- Logout button

**Orders Tab:**
- Order history list
- Order details
- Order status
- Payment status
- Order items
- Order tracking

## 🎯 Benefits

### For Customers
✅ Faster checkout (auto-fill)
✅ Order history tracking
✅ Profile management
✅ Saved addresses
✅ Order status updates
✅ Secure account

### For Shop Owner
✅ Customer database
✅ Repeat customer tracking
✅ Customer contact info
✅ Order history per customer
✅ Marketing opportunities
✅ Customer insights

## 💡 Customization

### Change Token Expiry
**File:** `backend/routes/auth.js`
```javascript
const token = jwt.sign(
  { id: customer.id, email: customer.email, type: 'customer' },
  process.env.JWT_SECRET,
  { expiresIn: '30d' }  // Change from 7d to 30d
);
```

### Add Password Reset
Add these routes to `backend/routes/auth.js`:
```javascript
// Request password reset
router.post('/forgot-password', async (req, res) => {
  // Generate reset token
  // Send email with reset link
});

// Reset password
router.post('/reset-password', async (req, res) => {
  // Verify reset token
  // Update password
});
```

### Add Email Verification
```javascript
// Send verification email on signup
// Add email_verified column to customers table
// Verify email with token
```

### Add Social Login
```javascript
// Google OAuth
// Facebook Login
// Use passport.js
```

## 🔧 Testing

### Test Signup
1. Go to `/signup`
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Password: test123
   - Confirm: test123
3. Click "Sign Up"
4. Should redirect to home
5. Check navbar shows "Test"

### Test Login
1. Go to `/login`
2. Enter:
   - Email: test@example.com
   - Password: test123
3. Click "Login"
4. Should redirect to home
5. Check navbar shows user name

### Test Profile
1. Login first
2. Go to `/account`
3. Click "Edit Profile"
4. Update information
5. Click "Save Changes"
6. Verify updates saved

### Test Order History
1. Login first
2. Place an order
3. Go to `/account`
4. Click "My Orders" tab
5. Verify order appears
6. Check order details

## 📊 Database Queries

### Get Customer Stats
```sql
-- Total customers
SELECT COUNT(*) as total_customers FROM customers;

-- Customers with orders
SELECT COUNT(DISTINCT customer_id) as customers_with_orders 
FROM orders WHERE customer_id IS NOT NULL;

-- Top customers by orders
SELECT c.name, c.email, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.payment_status = 'completed'
GROUP BY c.id
ORDER BY total_spent DESC
LIMIT 10;

-- Recent signups
SELECT * FROM customers 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🚨 Troubleshooting

### "Email already registered"
- Email must be unique
- User already exists
- Try different email or login

### "Invalid credentials"
- Check email spelling
- Check password
- Case sensitive

### "Token expired"
- Token expires after 7 days
- Login again
- Token stored in localStorage

### Profile not loading
- Check if logged in
- Check token in localStorage
- Check browser console for errors

### Orders not showing
- Must be logged in
- Orders must have customer_id
- Check database connection

## 🎉 Launch Checklist

- [ ] Database schema updated
- [ ] Backend routes working
- [ ] Frontend pages created
- [ ] Auth context integrated
- [ ] Navbar updated
- [ ] Checkout auto-fill working
- [ ] Profile page functional
- [ ] Order history showing
- [ ] Logout working
- [ ] Error handling in place
- [ ] Validation working
- [ ] Security tested
- [ ] Mobile responsive
- [ ] Test all flows

## 📝 Future Enhancements

- [ ] Email verification
- [ ] Password reset
- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication
- [ ] Email notifications
- [ ] Wishlist feature
- [ ] Saved addresses (multiple)
- [ ] Order tracking with updates
- [ ] Customer reviews
- [ ] Loyalty points

---

**Your authentication system is ready!** Customers can now create accounts, login, and track their orders! 🎊
