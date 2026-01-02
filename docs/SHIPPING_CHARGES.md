# Shipping Charges Configuration

## Overview
The application now supports location-based shipping charges based on the customer's state.

## Shipping Rates

### Andhra Pradesh (AP)
- **Charge**: ₹70
- **Applies to**: Orders delivered within Andhra Pradesh state
- **Variations handled**: "Andhra Pradesh", "andhrapradesh", "AP" (case-insensitive)

### Other States
- **Charge**: ₹120
- **Applies to**: All other states in India
- **Note**: Can be adjusted to ₹150 for specific states if needed

## How It Works

1. **Customer enters state** during checkout
2. **Shipping is calculated automatically** based on the state
3. **Order summary updates** to show:
   - Catalogue Total (products subtotal)
   - Shipping Fees (based on state)
   - Grand Total (subtotal + shipping)
4. **Backend stores** shipping charges separately in the database

## Database Schema

The `orders` table now includes:
- `subtotal`: Product total before shipping
- `shipping_charges`: Calculated shipping fee
- `customer_state`: State for shipping calculation
- `total_amount`: Grand total (subtotal + shipping)

## Customization

To modify shipping charges, edit the `calculateShipping()` function in:
- **File**: `frontend/src/pages/Checkout.jsx`

```javascript
const calculateShipping = () => {
  const state = formData.state.toLowerCase().trim();
  
  if (!state) return 0;
  
  // Andhra Pradesh
  if (state === 'andhra pradesh' || state === 'andhrapradesh' || state === 'ap') {
    return 70;
  }
  
  // Other states - modify this value as needed
  return 120;
};
```

## Adding State-Specific Rates

To add different rates for specific states:

```javascript
const calculateShipping = () => {
  const state = formData.state.toLowerCase().trim();
  
  if (!state) return 0;
  
  // Andhra Pradesh
  if (state === 'andhra pradesh' || state === 'andhrapradesh' || state === 'ap') {
    return 70;
  }
  
  // Telangana (example)
  if (state === 'telangana' || state === 'ts') {
    return 80;
  }
  
  // Karnataka (example)
  if (state === 'karnataka' || state === 'ka') {
    return 100;
  }
  
  // Default for other states
  return 120;
};
```

## Migration

The database migration has been completed. If you need to run it again:

```bash
node backend/scripts/addShippingColumns.js
```

This script:
- Adds `subtotal`, `shipping_charges`, and `customer_state` columns
- Updates existing orders with default values
- Is safe to run multiple times (checks if columns exist)
