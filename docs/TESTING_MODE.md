# Testing Mode Configuration

## Current Testing Settings

### ✅ Active Testing Features

1. **All Products: ₹1**
   - Every product in the shop is now priced at ₹1
   - Original prices are safely backed up in `products_price_backup` table

2. **Free Shipping**
   - Shipping charges are set to ₹0 for all orders
   - Location-based shipping logic is commented out but preserved

3. **Location Display**
   - User's GPS coordinates (latitude/longitude) are now displayed on checkout page
   - Shows in a blue info box after location is captured

## How to Use

### Testing Payment Flow

1. Browse products (all showing ₹1)
2. Add items to cart
3. Go to checkout
4. Click "📍 Capture Precise Delivery Location" to get GPS coordinates
5. Your location will be displayed with latitude and longitude
6. Fill in shipping details
7. Complete payment with minimal amount (₹1 per item + ₹0 shipping)

### Razorpay Test Cards

Use these test card details for payment testing:

**Success:**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**
- Card: 4111 1111 1111 1112
- CVV: Any 3 digits
- Expiry: Any future date

## Switching Back to Production

### Restore Original Prices

```bash
node backend/scripts/restoreOriginalPrices.js
```

This will:
- Restore all original product prices from backup
- Keep the backup table for future testing

### Enable Real Shipping Charges

Edit `frontend/src/pages/Checkout.jsx`:

1. Find the `calculateShipping()` function
2. Comment out the `return 0;` line
3. Uncomment the production code block

```javascript
const calculateShipping = () => {
  // Comment this line:
  // return 0;
  
  // Uncomment this block:
  const state = formData.state.toLowerCase().trim();
  
  if (!state) return 0;
  
  if (state === 'andhra pradesh' || state === 'andhrapradesh' || state === 'ap') {
    return 70;
  }
  
  return 120;
};
```

## Quick Commands

```bash
# Set testing mode (₹1 products)
node backend/scripts/setTestPrices.js

# Restore production prices
node backend/scripts/restoreOriginalPrices.js

# View current product prices
# Login to MySQL and run:
# SELECT id, name, price FROM products LIMIT 10;
```

## Safety Features

- Original prices are automatically backed up before changing to ₹1
- Backup is only created once (won't overwrite existing backup)
- Restore script safely brings back original prices
- Testing mode changes are clearly marked in code comments

## Notes

- The location display helps verify GPS capture is working correctly
- Free shipping makes it easy to test with minimal payment amounts
- All testing changes can be reverted without data loss
- Remember to switch back to production mode before going live!
