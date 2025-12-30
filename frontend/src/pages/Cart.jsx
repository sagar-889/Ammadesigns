import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-card reveal-up" style={{ textAlign: 'center', padding: '100px 40px' }}>
            <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🛍️</div>
            <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '15px' }}>Your bag is empty</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Looks like you haven't added any masterpieces to your collection yet.</p>
            <Link to="/shop" className="btn btn-primary">Discover the Collection</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-card reveal-up">
          <header className="cart-header">
            <h1 className="serif">Your Shopping Bag</h1>
            <button className="btn btn-outline small" onClick={handleLogout}>
              Logout
            </button>
          </header>

          <div className="cart-grid">
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={item.id} className="cart-item reveal-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <img src={item.image_url} alt={item.name} />
                  <div className="item-details">
                    <span className="category">{item.category}</span>
                    <h3>{item.name}</h3>
                    <p className="price-tag">₹{item.price}</p>
                  </div>
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="item-subtotal" style={{ fontWeight: '700', color: 'var(--primary)' }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    className="qty-btn"
                    style={{ color: 'var(--text-muted)', opacity: '0.5' }}
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/shop" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '14px' }}>← Continue Browsing</Link>
                <button onClick={clearCart} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Empty Entire Bag</button>
              </div>
            </div>

            <aside className="cart-summary">
              <h3 className="serif summary-title">Order Details</h3>
              <div className="summary-row">
                <span>Value of Items</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tailoring Services</span>
                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Complementary</span>
              </div>
              <div className="summary-row">
                <span>Standard Delivery</span>
                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Free</span>
              </div>

              <div className="summary-row total-row">
                <span>Total Due</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>

              <button
                className="btn btn-gold"
                style={{ width: '100%', marginTop: '30px' }}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>

              <p style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                Secured checkout for your bespoke experience.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
