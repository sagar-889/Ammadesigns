import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import './Products.css';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null
      };

      if (editingService) {
        await api.put(`/services/${editingService.id}`, data);
      } else {
        await api.post('/services', data);
      }

      setShowModal(false);
      setEditingService(null);
      setFormData({ title: '', description: '', price: '' });
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description || '',
      price: service.price || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await api.delete(`/services/${id}`);
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  const handleAddNew = () => {
    setEditingService(null);
    setFormData({ title: '', description: '', price: '' });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <header className="admin-header reveal-up">
          <div>
            <span className="hero-subtitle">Service Management</span>
            <h1>Studio Services</h1>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => navigate('/admin/dashboard')} 
              className="btn btn-outline"
              style={{ marginRight: '15px' }}
            >
              ← Back to Dashboard
            </button>
            <button 
              onClick={handleAddNew}
              className="btn btn-primary"
            >
              + Add New Service
            </button>
          </div>
        </header>

        <div className="products-grid reveal-up" style={{ animationDelay: '0.1s' }}>
          {services.length === 0 ? (
            <div className="empty-state">
              <p>No services added yet</p>
              <button onClick={handleAddNew} className="btn btn-primary">
                Add Your First Service
              </button>
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="product-card">
                <div className="product-info">
                  <h3>{service.title}</h3>
                  <p className="product-description">{service.description}</p>
                  {service.price && (
                    <p className="product-price">₹{parseFloat(service.price).toLocaleString('en-IN')}</p>
                  )}
                  <p className="product-meta">
                    Added: {new Date(service.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="product-actions">
                  <button 
                    onClick={() => handleEdit(service)}
                    className="btn btn-outline"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Service Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content reveal-up" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
              <div className="modal-header">
                <h2 className="serif">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label>Service Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Custom Tailoring"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Describe the service..."
                    style={{
                      width: '100%',
                      padding: '14px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-soft)',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>Price (₹) - Optional</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Leave empty if price varies"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    {editingService ? 'Update Service' : 'Add Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageServices;
