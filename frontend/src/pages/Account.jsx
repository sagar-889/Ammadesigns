import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import './Account.css';

const Account = () => {
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [isAuthenticated, navigate, user, activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('customerToken');
      const response = await api.get('/auth/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      setEditMode(false);
      alert('Profile details updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="account-page reveal-up">
      <section className="section">
        <div className="container">
          <header className="text-center" style={{ marginBottom: '60px' }}>
            <span className="studio-tag" style={{ border: 'none', color: 'var(--secondary)', letterSpacing: '4px' }}>Welcome Back</span>
            <h1 className="serif" style={{ fontSize: '4rem', color: 'var(--primary)' }}>{user.name.split(' ')[0]}'s Atelier</h1>
          </header>

          <div className="account-tabs">
            <button
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => setActiveTab('profile')}
            >
              Identity Info
            </button>
            <button
              className={activeTab === 'orders' ? 'active' : ''}
              onClick={() => setActiveTab('orders')}
            >
              Order Residency
            </button>
          </div>

          <div className="account-content">
            {activeTab === 'profile' && (
              <div className="profile-section">
                <div className="profile-header">
                  <h2 className="serif">Client Identity</h2>
                  {!editMode && (
                    <button className="btn btn-outline small" onClick={() => setEditMode(true)}>
                      Modify Profile
                    </button>
                  )}
                </div>

                {editMode ? (
                  <form onSubmit={handleUpdateProfile} className="profile-form auth-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Authorized Email</label>
                      <input type="email" value={user.email} disabled style={{ opacity: 0.6 }} />
                      <small style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '5px', display: 'block' }}>Email identity is fixed for security.</small>
                    </div>
                    <div className="form-group">
                      <label>Contact Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        required
                        placeholder="10-digit primary number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Shipping Destination</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Full delivery address"
                        style={{ width: '100%', padding: '15px', border: '1px solid var(--border-color)', background: 'var(--bg-soft)', fontFamily: 'inherit' }}
                      ></textarea>
                    </div>
                    <div className="form-actions" style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Updating...' : 'Confirm Changes'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setEditMode(false)}
                      >
                        Discard
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-info">
                    <div className="info-row">
                      <strong>Full Name</strong>
                      <span>{user.name}</span>
                    </div>
                    <div className="info-row">
                      <strong>Email Residence</strong>
                      <span>{user.email}</span>
                    </div>
                    <div className="info-row">
                      <strong>Contact Channel</strong>
                      <span>{user.phone || 'Registry incomplete'}</span>
                    </div>
                    <div className="info-row">
                      <strong>Primary Address</strong>
                      <span>{user.address || 'No destination recorded'}</span>
                    </div>
                    <div className="info-row">
                      <strong>Client Since</strong>
                      <span>{new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                )}

                <div className="logout-section">
                  <button className="btn btn-outline" onClick={handleLogout} style={{ borderColor: '#ff4d4d', color: '#ff4d4d' }}>
                    Sign Out 
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-section">
                <h2 className="serif" style={{ fontSize: '2rem', marginBottom: '30px', color: 'var(--primary)' }}>Engagement Record</h2>
                {loading ? (
                  <div className="text-center" style={{ padding: '60px' }}>
                    <div className="loader" style={{ margin: '0 auto' }}></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center" style={{ padding: '60px' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Your commission record is currently empty.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/shop')}>
                      Browse Collections
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <h3 className="serif">Commission #{order.order_number}</h3>
                          <span className={`status status-${order.order_status}`}>
                            {order.order_status}
                          </span>
                        </div>
                        <div className="order-details">
                          <div>
                            <small style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Engagement Date</small>
                            <p style={{ fontWeight: '600' }}>{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                          </div>
                          <div>
                            <small style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Investment</small>
                            <p style={{ fontWeight: '600' }}>₹{order.total_amount}</p>
                          </div>
                          <div>
                            <small style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Value Registry</small>
                            <p style={{ fontWeight: '600' }} className={`status-${order.payment_status}`}>{order.payment_status}</p>
                          </div>
                        </div>
                        <div className="order-items">
                          <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', color: 'var(--secondary)' }}>Masterpieces in Care</h4>
                          {order.items && order.items.map(item => (
                            <div key={item.id} className="order-item">
                              <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{item.product_name}</span>
                              <span>× {item.quantity}</span>
                              <span style={{ fontWeight: '600' }}>₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Account;
