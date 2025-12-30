# 💳 Razorpay Payment Integration Guide

Complete guide to set up Razorpay payment gateway for your Ladies Tailor Shop.

## 📋 Prerequisites

1. Razorpay account (Sign up at https://razorpay.com)
2. Business verification completed
3. Bank account linked

## 🔑 Get Razorpay Credentials

### Step 1: Create Razorpay Account
1. Go to https://razorpay.com
2. Click "Sign Up"
3. Complete registration
4. Verify your email

### Step 2: Get API Keys
1. Login to Razorpay Dashboard
2. Go to Settings → API Keys
3. Click "Generate Test Keys" (for testing)
4. Copy:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (keep this secret!)

### Step 3: For Production
1. Complete KYC verification
2. Add business details
3. Link bank account
4. Generate Live Keys
5. Copy:
   - **Key ID** (starts with `rzp_live_`)
   - **Key Secret**

## ⚙️ Configuration

### Backend Configuration

**File:** `backend/.env`

```env
# Razorpay Test Keys (for development)
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here

# For production, use live keys:
# RAZORPAY_KEY_ID=rzp_live_your_key_id_here
# RAZORPAY_KEY_SECRET=your_key_secret_here
```

### Frontend Configuration

**File:** `frontend/.env`

```env
# Use the same Key ID (NOT the secret!)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here

# For production:
# VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id_here
```

⚠️ **Important:** 
- Never commit `.env` files to git
- Never expose Key Secret in frontend
- Only Key ID goes in frontend

## 🧪 Testing

### Test Mode
Razorpay provides test mode for development:

**Test Card Details:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Test UPI:**
- UPI ID: `success@razorpay`

**Test Netbanking:**
- Select any bank
- Use credentials provided by Razorpay

### Test Payment Flow
1. Add products to cart
2. Go to checkout
3. Fill shipping details
4. Click "Pay"
5. Razorpay popup opens
6. Use test card details
7. Complete payment
8. Verify order success page

## 🔒 Security Features

### Backend Security
✅ Signature verification
✅ Order validation
✅ Payment verification
✅ Secure webhook handling

### Frontend Security
✅ HTTPS required in production
✅ No sensitive data in client
✅ Razorpay hosted checkout
✅ PCI DSS compliant

## 📊 Payment Flow

```
1. Customer adds products to cart
   ↓
2. Goes to checkout page
   ↓
3. Fills shipping information
   ↓
4. Clicks "Pay" button
   ↓
5. Backend creates Razorpay order
   ↓
6. Order saved to database (status: pending)
   ↓
7. Razorpay checkout popup opens
   ↓
8. Customer completes payment
   ↓
9. Razorpay sends payment response
   ↓
10. Backend verifies signature
   ↓
11. Order status updated (status: confirmed)
   ↓
12. Product stock reduced
   ↓
13. Customer redirected to success page
```

## 🛠️ Troubleshooting

### Payment Not Working

**Check 1: API Keys**
```bash
# Verify keys are set
echo $RAZORPAY_KEY_ID
echo $RAZORPAY_KEY_SECRET
```

**Check 2: Script Loading**
- Open browser console (F12)
- Check for Razorpay script errors
- Verify `https://checkout.razorpay.com/v1/checkout.js` loads

**Check 3: CORS**
- Ensure backend allows frontend origin
- Check browser console for CORS errors

**Check 4: Amount**
- Amount must be in paise (multiply by 100)
- Must be integer, not decimal

### Common Errors

**Error: "Key ID is required"**
- Solution: Add `VITE_RAZORPAY_KEY_ID` to frontend `.env`

**Error: "Invalid signature"**
- Solution: Check `RAZORPAY_KEY_SECRET` in backend `.env`

**Error: "Order creation failed"**
- Solution: Verify Razorpay API keys are correct

**Error: "Payment verification failed"**
- Solution: Check signature verification logic

## 💰 Pricing & Fees

### Razorpay Charges
- **Domestic Cards:** 2% per transaction
- **International Cards:** 3% per transaction
- **UPI:** 0% (free)
- **Netbanking:** 2% per transaction
- **Wallets:** 2% per transaction

### Settlement
- **Standard:** T+3 days (3 business days)
- **Instant:** Available for verified businesses

## 📱 Payment Methods Supported

✅ Credit Cards (Visa, Mastercard, Amex, Rupay)
✅ Debit Cards
✅ UPI (Google Pay, PhonePe, Paytm, etc.)
✅ Netbanking (All major banks)
✅ Wallets (Paytm, Mobikwik, etc.)
✅ EMI (for eligible cards)

## 🔔 Webhooks (Optional)

For advanced order tracking:

### Setup Webhook
1. Go to Razorpay Dashboard
2. Settings → Webhooks
3. Add webhook URL: `https://your-backend.com/api/shop/webhook`
4. Select events:
   - payment.authorized
   - payment.captured
   - payment.failed
5. Copy webhook secret

### Backend Webhook Handler
```javascript
// backend/routes/shop.js
router.post('/webhook', async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (signature === expectedSignature) {
    // Process webhook event
    const event = req.body.event;
    const payment = req.body.payload.payment.entity;
    
    // Update order based on event
    // ...
  }
  
  res.json({ status: 'ok' });
});
```

## 📈 Going Live

### Pre-Launch Checklist
- [ ] KYC verification completed
- [ ] Bank account linked
- [ ] Test payments successful
- [ ] Live API keys generated
- [ ] Environment variables updated
- [ ] HTTPS enabled on website
- [ ] Terms & conditions page added
- [ ] Refund policy page added
- [ ] Privacy policy page added

### Switch to Live Mode
1. Complete Razorpay KYC
2. Generate live API keys
3. Update backend `.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```
4. Update frontend `.env`:
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
   ```
5. Deploy changes
6. Test with small real payment
7. Monitor first few transactions

## 📞 Support

### Razorpay Support
- Email: support@razorpay.com
- Phone: +91-80-6890-6890
- Dashboard: Live chat available

### Documentation
- Razorpay Docs: https://razorpay.com/docs
- API Reference: https://razorpay.com/docs/api
- Integration Guide: https://razorpay.com/docs/payment-gateway

## 🎯 Best Practices

1. **Always verify signatures** - Never trust client-side data
2. **Use webhooks** - For reliable order updates
3. **Log everything** - Keep payment logs for debugging
4. **Handle failures** - Show clear error messages
5. **Test thoroughly** - Test all payment methods
6. **Monitor transactions** - Check Razorpay dashboard daily
7. **Keep keys secure** - Never expose secrets
8. **Update regularly** - Keep Razorpay SDK updated

## 🔐 Security Checklist

- [ ] API keys stored in environment variables
- [ ] Key Secret never exposed to frontend
- [ ] HTTPS enabled in production
- [ ] Signature verification implemented
- [ ] Order validation before payment
- [ ] Payment verification after payment
- [ ] Webhook signature verification
- [ ] SQL injection prevention
- [ ] Input validation on all fields
- [ ] Rate limiting on payment endpoints

## 📊 Monitoring

### Check Daily
1. Razorpay Dashboard → Payments
2. Verify all payments captured
3. Check for failed payments
4. Monitor refund requests
5. Review settlement reports

### Database Checks
```sql
-- Check pending payments
SELECT * FROM orders WHERE payment_status = 'pending';

-- Check today's orders
SELECT * FROM orders WHERE DATE(created_at) = CURDATE();

-- Revenue summary
SELECT SUM(total_amount) as revenue FROM orders 
WHERE payment_status = 'completed';
```

## 🎉 Success!

Your Razorpay integration is complete! Customers can now:
- Browse products
- Add to cart
- Checkout securely
- Pay with multiple methods
- Receive order confirmation

---

**Need Help?** Check the troubleshooting section or contact Razorpay support!
