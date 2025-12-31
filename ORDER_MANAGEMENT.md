# Order Management System

## Overview
A comprehensive order book system has been added to the admin dashboard for managing customer orders.

## Features

### Order Book Page (`/admin/orders`)

**View All Orders:**
- Grid view of all orders with key information
- Order number, customer details, amount, and status
- Click any order card to view full details

**Filter Orders by Status:**
- All Orders
- Pending
- Confirmed
- Processing
- Shipped
- Delivered

**Order Details Modal:**
Shows complete information including:
- Customer name, phone, email
- Shipping address
- Order items (coming from order_items table)
- Subtotal, shipping charges, total amount
- Payment status and payment IDs
- Order status with color coding

**Update Order Status:**
Quick action buttons to change order status:
- Confirm (blue)
- Processing (purple)
- Shipped (cyan)
- Delivered (green)
- Cancel (red)

### Status Color Coding

- **Pending**: Orange (#f59e0b)
- **Confirmed**: Blue (#3b82f6)
- **Processing**: Purple (#8b5cf6)
- **Shipped**: Cyan (#06b6d4)
- **Delivered**: Green (#10b981)
- **Cancelled**: Red (#ef4444)

## Access

### From Admin Dashboard:
1. Login to admin panel at `/admin/login`
2. Click "View Order Book" button in the Client Orders card
3. Or navigate directly to `/admin/orders`

### Navigation:
- Back button returns to admin dashboard
- All orders are protected by authentication

## API Endpoints

### Get All Orders
```
GET /api/admin/orders
Headers: Authorization: Bearer <token>
```

### Get Order Details
```
GET /api/admin/orders/:id
Headers: Authorization: Bearer <token>
```

### Update Order Status
```
PUT /api/admin/orders/:id
Headers: Authorization: Bearer <token>
Body: { "order_status": "confirmed" }
```

## Database Fields

Orders table includes:
- `order_number`: Unique order identifier
- `customer_name`, `customer_email`, `customer_phone`
- `customer_address`, `customer_state`
- `total_amount`, `subtotal`, `shipping_charges`
- `payment_status`: pending/completed
- `order_status`: pending/confirmed/processing/shipped/delivered/cancelled
- `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`
- `created_at`, `updated_at`

## Usage Tips

1. **Quick Status Updates**: Click any order card to open details, then use status buttons for quick updates
2. **Filter for Efficiency**: Use status filters to focus on orders needing attention
3. **Contact Customers**: Phone and email are clickable links for easy communication
4. **Track Payments**: Payment status shows if order is paid or pending
5. **Monitor Orders**: Real-time view of all orders with automatic refresh after updates

## Mobile Responsive

The order book is fully responsive:
- Single column layout on mobile
- Touch-friendly buttons
- Scrollable order details modal
- Optimized for all screen sizes
