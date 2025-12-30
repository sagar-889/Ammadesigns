import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../config/api';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/shop/orders/${orderNumber}`);
      setOrder(response.data);
    } catch (err) {
      console.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loader"></div>
    </div>
  );

  if (!order) return (
    <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
      <h2 className="serif">Order not found</h2>
      <Link to="/" className="btn btn-primary">Return to Boutique</Link>
    </div>
  );

  return (
    <div className="order-success-page">
      <section className="section">
        <div className="container">
          <div className="success-card reveal-up">
            <div className="success-icon">✓</div>
            <h1 className="serif">Bespoke Order Confirmed</h1>
            <p className="success-message">Thank you for choosing our atelier. Your masterpiece is now in our meticulous care.</p>

            <div className="order-details">
              <h3 className="serif">Engagement Record</h3>
              <div className="detail-row">
                <span>Confirmation ID:</span>
                <strong>{order.order_number}</strong>
              </div>
              <div className="detail-row">
                <span>Commission Date:</span>
                <strong>{new Date(order.created_at).toLocaleDateString()}</strong>
              </div>
              <div className="detail-row">
                <span>Total Investment:</span>
                <strong>₹{order.total_amount}</strong>
              </div>
              <div className="detail-row">
                <span>Payment Identity:</span>
                <strong className="status-completed">{order.payment_status}</strong>
              </div>
              <div className="detail-row">
                <span>Order Residency:</span>
                <strong className="status-confirmed">{order.order_status}</strong>
              </div>
            </div>

            <div className="shipping-details">
              <h3 className="serif">Delivery Destination</h3>
              <p><strong>Recipient:</strong> {order.customer_name}</p>
              <p><strong>Primary:</strong> {order.customer_phone}</p>
              <p><strong>Address:</strong> {order.customer_address}</p>
            </div>

            <div className="order-items">
              <h3 className="serif">Items in Care</h3>
              {order.items && order.items.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <h4>{item.product_name}</h4>
                    <p>Quantity Selected: {item.quantity}</p>
                  </div>
                  <div className="item-price" style={{ color: 'var(--primary)' }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="action-buttons">
              <Link to="/shop" className="btn btn-gold">Explore More Pieces</Link>
              <Link to="/" className="btn btn-outline">Back to Gallery</Link>
            </div>

            <p className="contact-info">
              For any concierge services, please contact us at {import.meta.env.VITE_PHONE}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderSuccess;
