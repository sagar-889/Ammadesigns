# 🛍️ Shopping Features Guide

Complete guide to the e-commerce features added to your Ladies Tailor Shop.

## 🎯 Overview

Your website now includes a full-featured online shop with:
- Product catalog
- Shopping cart
- Secure checkout
- Razorpay payment integration
- Order management
- Admin product management

## 📦 New Features

### Customer Features

#### 1. Shop Page (`/shop`)
- Browse all products
- Filter by category
- View product images and prices
- Add to cart directly
- Stock availability display

#### 2. Product Detail Page (`/product/:id`)
- Detailed product information
- Large product image
- Description
- Price
- Stock status
- Quantity selector
- Add to cart button

#### 3. Shopping Cart (`/cart`)
- View all cart items
- Update quantities
- Remove items
- See total price
- Clear cart
- Proceed to checkout

#### 4. Checkout Page (`/checkout`)
- Enter shipping information
- Review order summary
- Secure Razorpay payment
- Multiple payment methods

#### 5. Order Success Page (`/order-success/:orderNumber`)
- Order confirmation
- Order details
- Shipping information
- Order items list
- Order tracking number

### Admin Features

#### 1. Product Management
- View all products
- Add new products
- Edit products
- Delete products
- Manage stock
- Set availability

#### 2. Order Management
- View all orders
- Order details
- Customer information
- Payment status
- Update order status
- Track orders

## 🗄️ Database Schema

### Products Table
```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(50),
    stock INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(200),
    order_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## 🔌 API Endpoints

### Shop APIs (Public)

#### Get All Products
```
GET /api/shop/products
GET /api/shop/products?category=Blouses
```

#### Get Single Product
```
GET /api/shop/products/:id
```

#### Get Categories
```
GET /api/shop/categories
```

#### Create Order
```
POST /api/shop/create-order
Body: {
  amount: 1500,
  customerInfo: {
    name: "Customer Name",
    email: "email@example.com",
    phone: "9876543210",
    address: "Full Address"
  },
  items: [
    { id: 1, name: "Product", price: 500, quantity: 2 }
  ]
}
```

#### Verify Payment
```
POST /api/shop/verify-payment
Body: {
  razorpay_order_id: "order_xxx",
  razorpay_payment_id: "pay_xxx",
  razorpay_signature: "signature_xxx",
  dbOrderId: 123
}
```

#### Get Order Details
```
GET /api/shop/orders/:orderNumber
```

### Admin APIs (Protected)

#### Get All Products
```
GET /api/admin/products
Authorization: Bearer <token>
```

#### Add Product
```
POST /api/admin/products
Authorization: Bearer <token>
Body: {
  name: "Product Name",
  description: "Description",
  price: 1200,
  image_url: "https://...",
  category: "Blouses",
  stock: 10,
  is_available: true
}
```

#### Update Product
```
PUT /api/admin/products/:id
Authorization: Bearer <token>
Body: { ...product data }
```

#### Delete Product
```
DELETE /api/admin/products/:id
Authorization: Bearer <token>
```

#### Get All Orders
```
GET /api/admin/orders
Authorization: Bearer <token>
```

#### Get Order Details
```
GET /api/admin/orders/:id
Authorization: Bearer <token>
```

#### Update Order Status
```
PUT /api/admin/orders/:id/status
Authorization: Bearer <token>
Body: {
  order_status: "shipped"
}
```

## 🎨 Frontend Components

### Cart Context
**File:** `frontend/src/context/CartContext.jsx`

Provides cart functionality throughout the app:
- `cart` - Array of cart items
- `addToCart(product, quantity)` - Add product to cart
- `removeFromCart(productId)` - Remove from cart
- `updateQuantity(productId, quantity)` - Update quantity
- `clearCart()` - Empty cart
- `getCartTotal()` - Get total price
- `getCartCount()` - Get item count

### Usage Example
```jsx
import { useCart } from '../context/CartContext';

function MyComponent() {
  const { cart, addToCart, getCartTotal } = useCart();
  
  return (
    <div>
      <p>Total: ₹{getCartTotal()}</p>
      <button onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}
```

## 🛒 Shopping Flow

### Customer Journey
```
1. Browse Shop (/shop)
   ↓
2. View Product (/product/:id)
   ↓
3. Add to Cart
   ↓
4. View Cart (/cart)
   ↓
5. Checkout (/checkout)
   ↓
6. Enter Details
   ↓
7. Pay with Razorpay
   ↓
8. Order Success (/order-success/:orderNumber)
```

### Order Statuses
- **pending** - Order created, payment pending
- **confirmed** - Payment successful
- **shipped** - Order dispatched
- **delivered** - Order delivered
- **cancelled** - Order cancelled

### Payment Statuses
- **pending** - Payment not completed
- **completed** - Payment successful
- **failed** - Payment failed

## 📝 Admin Tasks

### Add New Product
1. Login to admin panel
2. Go to "Products" tab
3. Click "Add Product"
4. Enter:
   - Product name
   - Description
   - Price
   - Image URL
   - Category
   - Stock quantity
5. Product appears on shop page

### Manage Orders
1. Go to "Orders" tab
2. View all orders
3. Click "Update Status" on any order
4. Enter new status:
   - confirmed
   - shipped
   - delivered
   - cancelled
5. Customer can track status

### Update Stock
1. Go to "Products" tab
2. Find product
3. Edit stock quantity
4. Save changes
5. Out of stock products show "Out of Stock"

## 🎯 Product Categories

Default categories:
- Blouses
- Sarees
- Churidar
- Kurtis
- Lehenga
- Salwar

Add more categories by creating products with new category names.

## 💡 Tips & Best Practices

### Product Management
1. **Use high-quality images** - Clear, well-lit photos
2. **Write detailed descriptions** - Help customers decide
3. **Set accurate stock** - Avoid overselling
4. **Categorize properly** - Easy filtering
5. **Price competitively** - Research market rates

### Order Management
1. **Update status promptly** - Keep customers informed
2. **Check orders daily** - Don't miss any
3. **Verify payment** - Ensure payment completed
4. **Contact customers** - For any issues
5. **Ship quickly** - Better customer satisfaction

### Inventory Management
1. **Track stock levels** - Reorder when low
2. **Mark unavailable** - If out of stock
3. **Update regularly** - Keep accurate counts
4. **Plan for demand** - Stock popular items
5. **Remove old products** - Keep catalog fresh

## 🔧 Customization

### Change Product Grid Layout
**File:** `frontend/src/pages/Shop.css`
```css
.products-grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  /* Change 250px to adjust card size */
}
```

### Add Product Filters
Add more filters in Shop.jsx:
```jsx
const [priceRange, setPriceRange] = useState('all');

// Filter products
const filteredProducts = products.filter(p => {
  if (priceRange === 'under1000') return p.price < 1000;
  if (priceRange === '1000-3000') return p.price >= 1000 && p.price <= 3000;
  return true;
});
```

### Customize Order Statuses
Add more statuses in backend:
```javascript
const validStatuses = [
  'pending', 'confirmed', 'processing', 
  'shipped', 'delivered', 'cancelled', 'refunded'
];
```

## 📊 Analytics

### Track Sales
```sql
-- Total revenue
SELECT SUM(total_amount) as revenue 
FROM orders 
WHERE payment_status = 'completed';

-- Orders by status
SELECT order_status, COUNT(*) as count 
FROM orders 
GROUP BY order_status;

-- Top selling products
SELECT p.name, SUM(oi.quantity) as sold
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.id
ORDER BY sold DESC
LIMIT 10;

-- Revenue by date
SELECT DATE(created_at) as date, SUM(total_amount) as revenue
FROM orders
WHERE payment_status = 'completed'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## 🚀 Performance Tips

1. **Optimize images** - Use WebP format, compress
2. **Lazy load** - Load images as needed
3. **Cache products** - Reduce database queries
4. **Index database** - Add indexes on frequently queried columns
5. **CDN for images** - Use image hosting service

## 🔒 Security

1. **Validate all inputs** - Backend validation
2. **Verify payments** - Always verify Razorpay signature
3. **Protect admin routes** - JWT authentication
4. **Sanitize data** - Prevent SQL injection
5. **Use HTTPS** - Secure connections only

## 📱 Mobile Optimization

All shopping pages are mobile-responsive:
- Touch-friendly buttons
- Responsive grids
- Mobile-optimized checkout
- Easy cart management

## 🎉 Launch Checklist

- [ ] Add products with images
- [ ] Set correct prices
- [ ] Configure Razorpay keys
- [ ] Test complete purchase flow
- [ ] Test all payment methods
- [ ] Verify order emails (if configured)
- [ ] Check mobile responsiveness
- [ ] Update terms & conditions
- [ ] Add refund policy
- [ ] Train staff on order management

---

**Your shop is ready to start selling!** 🎊
