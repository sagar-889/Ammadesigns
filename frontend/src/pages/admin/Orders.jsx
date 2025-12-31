import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { order_status: newStatus });
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, order_status: newStatus });
      }
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.order_status === filterStatus);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      processing: '#8b5cf6',
      shipped: '#06b6d4',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <header className="orders-header reveal-up">
          <div>
            <span className="hero-subtitle">Order Management</span>
            <h1>Order Book</h1>
          </div>
          <button onClick={() => navigate('/admin/dashboard')} className="btn btn-outline">
            ← Back to Dashboard
          </button>
        </header>

        <div className="orders-filters reveal-up" style={{ animationDelay: '0.1s' }}>
          <button 
            className={filterStatus === 'all' ? 'active' : ''} 
            onClick={() => setFilterStatus('all')}
          >
            All Orders ({orders.length})
          </button>
          <button 
            className={filterStatus === 'pending' ? 'active' : ''} 
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </button>
          <button 
            className={filterStatus === 'confirmed' ? 'active' : ''} 
            onClick={() => setFilterStatus('confirmed')}
          >
            Confirmed
          </button>
          <button 
            className={filterStatus === 'processing' ? 'active' : ''} 
            onClick={() => setFilterStatus('processing')}
          >
            Processing
          </button>
          <button 
            className={filterStatus === 'shipped' ? 'active' : ''} 
            onClick={() => setFilterStatus('shipped')}
          >
            Shipped
          </button>
          <button 
            className={filterStatus === 'delivered' ? 'active' : ''} 
            onClick={() => setFilterStatus('delivered')}
          >
            Delivered
          </button>
        </div>

        <div className="orders-content reveal-up" style={{ animationDelay: '0.2s' }}>
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <p>No orders found</p>
            </div>
          ) : (
            <div className="orders-grid">
              {filteredOrders.map((order) => (
                <div key={order.id} className="order-card" onClick={() => setSelectedOrder(order)}>
                  <div className="order-header">
                    <div>
                      <h3>{order.order_number}</h3>
                      <p className="order-date">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span 
                      className="order-status-badge" 
                      style={{ backgroundColor: getStatusColor(order.order_status) }}
                    >
                      {order.order_status}
                    </span>
                  </div>

                  <div className="order-customer">
                    <p><strong>{order.customer_name}</strong></p>
                    <p>📞 {order.customer_phone}</p>
                    <p>✉️ {order.customer_email}</p>
                  </div>

                  <div className="order-footer">
                    <div className="order-amount">
                      <span>Total Amount</span>
                      <strong>₹{parseFloat(order.total_amount).toFixed(2)}</strong>
                    </div>
                    <div className="order-payment">
                      <span 
                        className="payment-status" 
                        style={{ 
                          color: order.payment_status === 'completed' ? '#10b981' : '#f59e0b' 
                        }}
                      >
                        {order.payment_status === 'completed' ? '✓ Paid' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal-content order-detail-modal reveal-up" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>✕</button>
              
              <div className="modal-header">
                <div>
                  <h2>{selectedOrder.order_number}</h2>
                  <p className="order-date">
                    Placed on {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span 
                  className="order-status-badge" 
                  style={{ backgroundColor: getStatusColor(selectedOrder.order_status) }}
                >
                  {selectedOrder.order_status}
                </span>
              </div>

              <div className="order-detail-section">
                <h3>Customer Information</h3>
                <div className="detail-grid">
                  <div>
                    <label>Name</label>
                    <p>{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <label>Phone</label>
                    <p><a href={`tel:${selectedOrder.customer_phone}`}>{selectedOrder.customer_phone}</a></p>
                  </div>
                  <div>
                    <label>Email</label>
                    <p><a href={`mailto:${selectedOrder.customer_email}`}>{selectedOrder.customer_email}</a></p>
                  </div>
                  <div>
                    <label>Shipping Address</label>
                    <p>{selectedOrder.customer_address}</p>
                  </div>
                </div>
              </div>

              <div className="order-detail-section">
                <h3>Order Summary</h3>
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{parseFloat(selectedOrder.subtotal || selectedOrder.total_amount).toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping Charges</span>
                    <span>₹{parseFloat(selectedOrder.shipping_charges || 0).toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Amount</span>
                    <span>₹{parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Payment Status</span>
                    <span style={{ 
                      color: selectedOrder.payment_status === 'completed' ? '#10b981' : '#f59e0b',
                      fontWeight: '600'
                    }}>
                      {selectedOrder.payment_status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-detail-section">
                <h3>Update Order Status</h3>
                <div className="status-buttons">
                  <button 
                    className="btn btn-sm"
                    style={{ backgroundColor: '#3b82f6' }}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                  >
                    Confirm
                  </button>
                  <button 
                    className="btn btn-sm"
                    style={{ backgroundColor: '#8b5cf6' }}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                  >
                    Processing
                  </button>
                  <button 
                    className="btn btn-sm"
                    style={{ backgroundColor: '#06b6d4' }}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                  >
                    Shipped
                  </button>
                  <button 
                    className="btn btn-sm"
                    style={{ backgroundColor: '#10b981' }}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                  >
                    Delivered
                  </button>
                  <button 
                    className="btn btn-sm"
                    style={{ backgroundColor: '#ef4444' }}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {selectedOrder.razorpay_payment_id && (
                <div className="order-detail-section">
                  <h3>Payment Details</h3>
                  <div className="detail-grid">
                    <div>
                      <label>Payment ID</label>
                      <p style={{ fontSize: '12px', wordBreak: 'break-all' }}>{selectedOrder.razorpay_payment_id}</p>
                    </div>
                    <div>
                      <label>Order ID</label>
                      <p style={{ fontSize: '12px', wordBreak: 'break-all' }}>{selectedOrder.razorpay_order_id}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
