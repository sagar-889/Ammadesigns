import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import './TrackOrder.css';

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasOrders, setHasOrders] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check if user has orders when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      checkUserOrders();
    } else {
      setHasOrders(false);
    }
  }, [isAuthenticated]);

  const checkUserOrders = async () => {
    try {
      const token = localStorage.getItem('customerToken');
      if (!token) {
        setHasOrders(false);
        return;
      }
      
      const response = await api.get('/auth/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.orders && response.data.orders.length > 0) {
        setHasOrders(true);
        setUserOrders(response.data.orders);
        // Auto-load the most recent order
        if (response.data.orders[0]?.order_number) {
          setOrderNumber(response.data.orders[0].order_number);
          await handleTrackOrder(response.data.orders[0].order_number);
        }
      } else {
        setHasOrders(false);
      }
    } catch (err) {
      console.error('Error checking orders:', err);
      setHasOrders(false);
    }
  };

  const handleTrackOrder = async (orderNum) => {
    const trackingNumber = orderNum || orderNumber.trim();
    if (!trackingNumber) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await api.get(`/track/${trackingNumber}`);
      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found. Please check your order number.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleTrackOrder();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFA500',
      paid: '#4CAF50',
      processing: '#2196F3',
      shipped: '#9C27B0',
      delivered: '#4CAF50',
      cancelled: '#F44336'
    };
    return colors[status] || '#757575';
  };

  return (
    <div className="track-order-page">
      <div className="container">
        <div className="track-header reveal-up">
          <h1>My Orders</h1>
          <p>
            {isAuthenticated 
              ? 'View your order status and delivery information' 
              : 'Enter your order number to view your order status'}
          </p>
        </div>

        {/* Show "No Orders" message if user is authenticated but has no orders */}
        {isAuthenticated && hasOrders === false && (
          <div className="no-orders-container reveal-up" style={{ animationDelay: '0.1s' }}>
            <div className="no-orders-content">
              <span className="no-orders-icon">📦</span>
              <h2>No Orders Yet</h2>
              <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/shop')}
              >
                🛍️ Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* Show order list for authenticated users with orders */}
        {isAuthenticated && hasOrders && userOrders.length > 0 && (
          <div className="user-orders-list reveal-up" style={{ animationDelay: '0.1s' }}>
            <h2>Your Orders</h2>
            <div className="orders-grid">
              {userOrders.map((userOrder) => (
                <div 
                  key={userOrder.id} 
                  className={`order-card ${orderNumber === userOrder.order_number ? 'active' : ''}`}
                  onClick={() => {
                    setOrderNumber(userOrder.order_number);
                    handleTrackOrder(userOrder.order_number);
                  }}
                >
                  <div className="order-card-header">
                    <span className="order-num">{userOrder.order_number}</span>
                    <span 
                      className="order-status-badge" 
                      style={{ backgroundColor: getStatusColor(userOrder.order_status) }}
                    >
                      {userOrder.order_status.toUpperCase()}
                    </span>
                  </div>
                  <div className="order-card-info">
                    <span className="order-date">
                      {new Date(userOrder.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="order-amount">₹{parseFloat(userOrder.total_amount).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show track form for non-authenticated users or as alternative for authenticated users */}
        {(!isAuthenticated || (hasOrders && userOrders.length > 0)) && (
          <div className="track-form-container reveal-up" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleSubmit} className="track-form">
              <div className="form-group">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter Order Number (e.g., ORD-1234567890)"
                  required
                  className="track-input"
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Loading...' : 'View Order'}
              </button>
            </form>

            {error && (
              <div className="error-message">
                <span>⚠️</span> {error}
              </div>
            )}
          </div>
        )}

        {order && (
          <div className="order-details reveal-up" style={{ animationDelay: '0.2s' }}>
            {/* Order Summary */}
            <div className="order-summary-card">
              <h2>Order Details</h2>
              <div className="order-info-grid">
                <div className="info-item">
                  <span className="label">Order Number:</span>
                  <span className="value">{order.order_number}</span>
                </div>
                <div className="info-item">
                  <span className="label">Order Date:</span>
                  <span className="value">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Payment Status:</span>
                  <span 
                    className="value status-badge" 
                    style={{ backgroundColor: getStatusColor(order.payment_status) }}
                  >
                    {order.payment_status.toUpperCase()}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Order Status:</span>
                  <span 
                    className="value status-badge" 
                    style={{ backgroundColor: getStatusColor(order.order_status) }}
                  >
                    {order.order_status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="customer-details">
                <h3>Delivery Information</h3>
                <p><strong>Name:</strong> {order.customer_name}</p>
                <p><strong>Phone:</strong> {order.customer_phone}</p>
                <p><strong>Email:</strong> {order.customer_email}</p>
                <p><strong>Address:</strong> {order.customer_address}</p>
                {order.customer_state && <p><strong>State:</strong> {order.customer_state}</p>}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="order-timeline-card">
              <h2>Order Timeline</h2>
              <div className="timeline">
                {order.timeline.map((step, index) => (
                  <div 
                    key={step.status} 
                    className={`timeline-item ${step.completed ? 'completed' : 'pending'}`}
                  >
                    <div className="timeline-marker">
                      {step.completed ? '✓' : index + 1}
                    </div>
                    <div className="timeline-content">
                      <h4>{step.label}</h4>
                      <p>{step.description}</p>
                      {step.date && (
                        <span className="timeline-date">
                          {new Date(step.date).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="order-items-card">
              <h2>Order Items</h2>
              <div className="items-list">
                {order.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <div className="item-details">
                      <span className="item-name">{item.product_name}</span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="item-price">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>₹{parseFloat(order.subtotal || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>₹{parseFloat(order.shipping_charges || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
