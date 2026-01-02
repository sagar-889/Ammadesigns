# 🚨 Payment Gateway Not Configured

## The Issue
You're seeing "Order generation failed" because Razorpay payment gateway credentials are not set up yet.

## Quick Fix (5 minutes)

### Step 1: Get Razorpay Credentials
1. Go to https://razorpay.com/
2. Sign up for a free account (or login)
3. Go to Settings → API Keys
4. Generate Test/Live API Keys
5. Copy both:
   - Key ID (starts with `rzp_test_` or `rzp_live_`)
   - Key Secret

### Step 2: Update Backend Environment
Edit `backend/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
```

### Step 3: Update Frontend Environment
Edit `frontend/.env`:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
```

### Step 4: Restart Servers
```bash
# Stop both servers (Ctrl+C)

# Restart backend
cd backend
npm start

# Restart frontend (in new terminal)
cd frontend
npm run dev
```

## Test Mode vs Live Mode

### Test Mode (Development)
- Use keys starting with `rzp_test_`
- No real money transactions
- Use test card: 4111 1111 1111 1111
- Any CVV, any future expiry date

### Live Mode (Production)
- Use keys starting with `rzp_live_`
- Real money transactions
- Complete KYC verification on Razorpay
- Activate your account

## Verification
After setup, try placing an order. You should see the Razorpay payment popup!

## Need Help?
- Razorpay Docs: https://razorpay.com/docs/
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-upi-details/
