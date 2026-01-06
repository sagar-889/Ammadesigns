import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    stock: '',
    is_available: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      category: '',
      stock: '',
      is_available: true
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image_url: product.image_url || '',
      category: product.category || '',
      stock: product.stock.toString(),
      is_available: product.is_available
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
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
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0
      };

      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, productData);
      } else {
        await api.post('/admin/products', productData);
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert('Failed to save product: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    try {
      await api.delete(`/admin/products/${id}`);
      alert('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete product';
      alert(errorMessage);
      console.error('Delete error:', err.response?.data);
    }
  };

  const toggleAvailability = async (product) => {
    try {
      await api.put(`/admin/products/${product.id}`, {
        ...product,
        is_available: !product.is_available
      });
      fetchProducts();
    } catch (err) {
      alert('Failed to update product availability');
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="products-page">
      <div className="container">
        <header className="products-header reveal-up">
          <div>
            <h1>Inventory</h1>
          </div>
          <div className="header-actions" style={{ display: 'flex', gap: '15px' }}>
            <button onClick={() => navigate('/admin/dashboard')} className="btn btn-outline">
              Dashboard
            </button>
            <button onClick={handleLogout} className="btn btn-primary">
              Logout
            </button>
          </div>
        </header>

        <div className="products-actions-bar reveal-up" style={{ animationDelay: '0.1s' }}>
          <button onClick={openAddModal} className="btn btn-gold">
            + Add New Masterpiece
          </button>
          <div className="products-stats">
            <span className="stat">Total Items <strong>{products.length}</strong></span>
            <span className="stat">Published <strong>{products.filter(p => p.is_available).length}</strong></span>
            <span className="stat">Out of Stock <strong>{products.filter(p => p.stock === 0).length}</strong></span>
          </div>
        </div>

        <div className="products-grid">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="product-admin-card reveal-up"
              style={{ animationDelay: `${index * 0.05 + 0.2}s` }}
            >
              <div className="product-admin-image">
                <img src={product.image_url} alt={product.name} loading="lazy" />
                <div className="badge-overlay">
                  {!product.is_available && <span className="badge badge-private">Private</span>}
                  {product.stock === 0 && <span className="badge badge-empty">Empty</span>}
                </div>
              </div>

              <div className="product-admin-info">
                <h3>{product.name}</h3>
                <p className="product-desc">{product.description}</p>

                <div className="product-data-table">
                  <div className="data-row">
                    <span className="data-label">Category</span>
                    <span className="data-value">{product.category || 'N/A'}</span>
                  </div>
                  <div className="data-row">
                    <span className="data-label">Price (₹)</span>
                    <span className="data-value">₹{product.price}</span>
                  </div>
                  <div className="data-row">
                    <span className="data-label">Stock Level</span>
                    <span className="data-value">{product.stock} Units</span>
                  </div>
                </div>

                <div className="admin-card-actions">
                  <button onClick={() => openEditModal(product)} className="btn btn-outline">
                    Modify
                  </button>
                  <button
                    onClick={() => toggleAvailability(product)}
                    className={`btn ${product.is_available ? 'btn-outline' : 'btn-primary'}`}
                  >
                    {product.is_available ? 'Archive' : 'Publish'}
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="btn btn-outline btn-delete">
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="empty-state text-center reveal-up" style={{ padding: '100px 0' }}>
            <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '20px' }}>Your collection is empty</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Begin adding your handcrafted pieces to the inventory.</p>
            <button onClick={openAddModal} className="btn btn-gold">
              Create First Piece
            </button>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content reveal-up" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            <div className="modal-header">
              <h2 className="serif" style={{ fontSize: '2.5rem', marginBottom: '30px' }}>
                {editingProduct ? 'Update Masterpiece' : 'New Collection Piece'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Title of the Piece</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. Silk Wedding Gown"
                />
              </div>

              <div className="form-group">
                <label>The Piece's Story (Description)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  className="form-group-textarea"
                  style={{ width: '100%', padding: '14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-soft)', fontFamily: 'inherit' }}
                  placeholder="Describe the craft, fabric, and details..."
                />
              </div>

              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Valuation (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Initial Units</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleFormChange}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category Selection</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  placeholder="e.g. Bridal, Ethnic, Casual"
                />
              </div>

              <div className="form-group">
                <label>Visual Presentation</label>
                <div className="upload-box" style={{ marginTop: '10px' }}>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="image-upload" className="btn btn-outline" style={{ cursor: 'pointer', width: '100%', marginBottom: '15px' }}>
                    {uploading ? 'Processing Image...' : 'Upload Atelier Photography'}
                  </label>

                  {formData.image_url && (
                    <div className="preview-box" style={{ border: '1px solid var(--border-color)', padding: '10px', marginBottom: '15px', borderRadius: 'var(--radius-sm)' }}>
                      <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    </div>
                  )}

                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleFormChange}
                    required
                    placeholder="Or enter image URL here..."
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <input
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleFormChange}
                  style={{ width: 'auto' }}
                />
                <label style={{ marginBottom: 0 }}>Available for public viewing in catalog</label>
              </div>

              <button type="submit" className="btn btn-gold btn-block" style={{ marginTop: '20px' }}>
                {editingProduct ? 'Finalize Changes' : 'Add to Collection'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
