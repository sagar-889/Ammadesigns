import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, enquiries: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    stock: '',
    is_available: true
  });
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, enquiryRes] = await Promise.all([
        api.get('/admin/products'),
        api.get('/admin/orders'),
        api.get('/admin/contacts')
      ]);
      setProducts(prodRes.data);
      setOrders(orderRes.data);
      setEnquiries(enquiryRes.data);
      setStats({
        products: prodRes.data.length,
        orders: orderRes.data.length,
        enquiries: enquiryRes.data.length
      });
    } catch (err) {
      console.error('Dashboard fetch failed:', err);
      if (err.response?.status === 401) navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleProductFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const response = await api.post('/admin/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProductForm(prev => ({ ...prev, image_url: response.data.imageUrl }));
    } catch (err) {
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock)
      };
      await api.post('/admin/products', data);
      setShowProductModal(false);
      fetchDashboardData();
      setProductForm({ name: '', description: '', price: '', image_url: '', category: '', stock: '', is_available: true });
    } catch (err) {
      alert('Failed to add product');
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="container">
        <header className="admin-header reveal-up">
          <div>
            <span className="hero-subtitle">Management Suite</span>
            <h1>Studio Control</h1>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate('/admin/products')} className="btn btn-outline" style={{ marginRight: '15px' }}>
              Inventory Management
            </button>
            <button onClick={() => { localStorage.removeItem('token'); navigate('/admin/login'); }} className="btn btn-primary">
              Logout
            </button>
          </div>
        </header>

        <div className="admin-tabs reveal-up" style={{ animationDelay: '0.1s' }}>
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>General Overview</button>
          <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Recent Pieces</button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Recent Orders</button>
          <button className={activeTab === 'enquiries' ? 'active' : ''} onClick={() => setActiveTab('enquiries')}>Enquiries</button>
        </div>

        {activeTab === 'overview' && (
          <div className="admin-grid reveal-up" style={{ animationDelay: '0.2s' }}>
            <div className="admin-card">
              <h3>Active Inventory</h3>
              <p>Total curated pieces in your collection.</p>
              <div className="stat-display" style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary)' }}>{stats.products}</div>
              <button onClick={() => navigate('/admin/products')} className="btn btn-outline" style={{ marginTop: '20px', width: '100%' }}>Manage Catalog</button>
            </div>

            <div className="admin-card">
              <h3>Client Orders</h3>
              <p>Total orders placed through the boutique.</p>
              <div className="stat-display" style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--secondary)' }}>{stats.orders}</div>
              <button onClick={() => navigate('/admin/orders')} className="btn btn-outline" style={{ marginTop: '20px', width: '100%' }}>View Order Book</button>
            </div>

            <div className="admin-card">
              <h3>Quick Actions</h3>
              <p>Instantly perform common studio tasks.</p>
              <button
                onClick={() => setShowProductModal(true)}
                className="btn btn-gold"
                style={{ width: '100%', marginBottom: '10px' }}
              >
                + Add New Piece
              </button>
              <button 
                className="btn btn-outline" 
                style={{ width: '100%' }}
                onClick={() => setActiveTab('enquiries')}
              >
                View Inquiries ({stats.enquiries})
              </button>
            </div>
          </div>
        )}

        {activeTab === 'enquiries' && (
          <div className="enquiries-section reveal-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="section-title">Customer Enquiries</h2>
            {enquiries.length === 0 ? (
              <div className="empty-state">
                <p>No enquiries yet</p>
              </div>
            ) : (
              <div className="enquiries-list">
                {enquiries.map((enquiry) => (
                  <div key={enquiry.id} className="enquiry-card">
                    <div className="enquiry-header">
                      <h3>{enquiry.name}</h3>
                      <span className="enquiry-date">
                        {new Date(enquiry.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="enquiry-contact">
                      <span className="contact-info">
                        📞 <a href={`tel:${enquiry.phone}`}>{enquiry.phone}</a>
                      </span>
                    </div>
                    <div className="enquiry-message">
                      <p>{enquiry.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product Modal */}
        {showProductModal && (
          <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
            <div className="modal-content reveal-up" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowProductModal(false)}>✕</button>
              <div className="modal-header">
                <h2 className="serif">Enlist New Masterpiece</h2>
              </div>

              <form onSubmit={handleProductSubmit} className="auth-form">
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" name="name" value={productForm.name} onChange={handleProductFormChange} required />
                </div>

                <div className="form-group">
                  <label>Story/Description</label>
                  <textarea
                    name="description"
                    value={productForm.description}
                    onChange={handleProductFormChange}
                    style={{ width: '100%', padding: '14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-soft)', fontFamily: 'inherit' }}
                  />
                </div>

                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Valuation (₹)</label>
                    <input type="number" name="price" value={productForm.price} onChange={handleProductFormChange} required />
                  </div>
                  <div className="form-group">
                    <label>In Stock Units</label>
                    <input type="number" name="stock" value={productForm.stock} onChange={handleProductFormChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Visual Upload</label>
                  <div className="upload-box" style={{ marginTop: '10px' }}>
                    <input type="file" id="image-upload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    <label htmlFor="image-upload" className="btn btn-outline" style={{ cursor: 'pointer', width: '100%', marginBottom: '15px' }}>
                      {uploading ? 'Processing Image...' : 'Select Atelier Photography'}
                    </label>
                    {productForm.image_url && <img src={productForm.image_url} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '15px' }} />}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">Add to Catalog</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
