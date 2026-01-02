# Test Payment Setup - Quick Guide

## ✅ Testing Mode is Now Active!

### What's Changed:

1. **All Products = ₹1** 
   - Every item in your shop now costs just ₹1
   - Perfect for testing payment flow without spending real money

2. **Free Shipping (₹0)**
   - No shipping charges applied
   - Makes testing even cheaper

3. **Location Display**
   - When you click "📍 Capture Precise Delivery Location"
   - Your GPS coordinates will be displayed in a blue box
   - Shows: Latitude and Longitude

## Test the Payment Flow

### Step-by-Step:

1. **Browse Shop** → All products show ₹1
2. **Add to Cart** → Add any items
3. **Go to Checkout** → Click checkout
4. **Capture Location** → Click the location button
5. **See Your Coordinates** → Lat/Long displayed in blue box
6. **Fill Details** → Enter shipping address
7. **Pay** → Total will be (number of items × ₹1) + ₹0 shipping

### Example:
- 3 items in cart = ₹3 total
- 1 item in cart = ₹1 total

## Razorpay Test Cards

### For Successful Payment:
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25 (any future date)
```

### For Failed Payment (to test error handling):
```
Card Number: 4111 1111 1111 1112
CVV: 123
Expiry: 12/25
```

## What You'll See

### On Checkout Page:
```
Catalogue Total: ₹3.00
Shipping Fees: FREE (Testing Mode)
Grand Total: ₹3.00
```

### After Clicking Location Button:
```
✓ Location Captured
Latitude: 17.385044
Longitude: 78.486671
```

## Restore Production Mode

When you're done testing and ready to go live:

### 1. Restore Real Prices:
```bash
node backend/scripts/restoreOriginalPrices.js
```

### 2. Enable Real Shipping:
Edit `frontend/src/pages/Checkout.jsx` and uncomment the shipping calculation code (instructions in file)

## Quick Commands

```bash
# Check current prices
node backend/scripts/checkPrices.js

# Set to testing mode (₹1)
node backend/scripts/setTestPrices.js

# Restore original prices
node backend/scripts/restoreOriginalPrices.js
```

## Safety Notes

✅ Original prices are backed up automatically
✅ You can switch back anytime without losing data
✅ Testing mode is clearly marked in the UI
✅ All changes are reversible

---

**Ready to test!** Just refresh your shop page and start adding items to cart. 🎉
