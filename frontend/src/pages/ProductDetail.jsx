import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/shop/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      console.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loader"></div>
    </div>
  );

  if (!product) return (
    <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
      <h2 className="serif">Product not found</h2>
      <button className="btn btn-primary" onClick={() => navigate('/shop')}>Back to Collection</button>
    </div>
  );

  return (
    <div className="product-detail-page">
      <section className="section">
        <div className="container">
          <div className="product-detail reveal-up">
            <div className="product-image">
              <img src={product.image_url} alt={product.name} />
            </div>

            <div className="product-details">
              <h1>{product.name}</h1>
              <p className="category">{product.category}</p>
              <div className="price">₹{product.price}</div>

              <div className="description">
                <h3 className="serif">Decription</h3>
                <p>{product.description}</p>
              </div>

              <div className="stock-info">
                {product.stock > 0 ? (
                  <span className="in-stock">✓ Ready to Tailor ({product.stock} pieces remaining)</span>
                ) : (
                  <span className="out-of-stock">✗ Fabric Out of Stock</span>
                )}
              </div>

              {product.stock > 0 && (
                <div className="quantity-selector">
                  <label>Quantity</label>
                  <div className="quantity-controls">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      min="1"
                      max={product.stock}
                    />
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                  </div>
                </div>
              )}

              <div className="action-buttons">
                <button
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Unavailable' : 'Add to Collection Bag'}
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/shop')}>
                  Browse Boutique
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
