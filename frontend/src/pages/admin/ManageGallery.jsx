import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import './Products.css';

const ManageGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image_url: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await api.get('/gallery');
      setGallery(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      if (error.response?.status === 401) {
        navigate('/login');
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
      setFormData(prev => ({ ...prev, image_url: response.data.imageUrl }));
    } catch (err) {
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await api.put(`/gallery/${editingItem.id}`, formData);
      } else {
        await api.post('/gallery', formData);
      }

      setShowModal(false);
      setEditingItem(null);
      setFormData({ title: '', image_url: '' });
      fetchGallery();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      alert('Failed to save gallery item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      image_url: item.image_url
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) {
      return;
    }

    try {
      await api.delete(`/gallery/${id}`);
      fetchGallery();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Failed to delete gallery item');
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({ title: '', image_url: '' });
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
            <span className="hero-subtitle">Gallery Management</span>
            <h1>The Lookbook</h1>
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
              + Add New Image
            </button>
          </div>
        </header>

        <div className="products-grid reveal-up" style={{ animationDelay: '0.1s' }}>
          {gallery.length === 0 ? (
            <div className="empty-state">
              <p>No gallery items added yet</p>
              <button onClick={handleAddNew} className="btn btn-primary">
                Add Your First Image
              </button>
            </div>
          ) : (
            gallery.map((item) => (
              <div key={item.id} className="product-card">
                <div className="product-image">
                  <img src={item.image_url} alt={item.title || 'Gallery item'} />
                </div>
                <div className="product-info">
                  <h3>{item.title || 'Untitled'}</h3>
                  <p className="product-meta">
                    Added: {new Date(item.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="product-actions">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="btn btn-outline"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Gallery Item Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content reveal-up" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
              <div className="modal-header">
                <h2 className="serif">
                  {editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label>Title (Optional)</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Bridal Collection 2024"
                  />
                </div>

                <div className="form-group">
                  <label>Image Upload *</label>
                  <div className="upload-box" style={{ marginTop: '10px' }}>
                    <input 
                      type="file" 
                      id="image-upload" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      style={{ display: 'none' }} 
                    />
                    <label 
                      htmlFor="image-upload" 
                      className="btn btn-outline" 
                      style={{ cursor: 'pointer', width: '100%', marginBottom: '15px' }}
                    >
                      {uploading ? 'Uploading...' : 'Select Image'}
                    </label>
                    {formData.image_url && (
                      <img 
                        src={formData.image_url} 
                        alt="Preview" 
                        style={{ 
                          width: '100%', 
                          height: '200px', 
                          objectFit: 'cover', 
                          marginBottom: '15px',
                          borderRadius: '8px'
                        }} 
                      />
                    )}
                  </div>
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
                    disabled={!formData.image_url || uploading}
                  >
                    {editingItem ? 'Update Item' : 'Add Item'}
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

export default ManageGallery;
