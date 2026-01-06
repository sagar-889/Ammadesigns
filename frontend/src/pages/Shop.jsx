import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../config/api';
import { useCart } from '../context/CartContext';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const { addToCart } = useCart();

    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [selectedCategory]);

    useEffect(() => {
        // Filter products based on search query
        if (searchQuery) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [searchQuery, products]);

    const fetchProducts = async () => {
        try {
            const url = selectedCategory ? `/shop/products?category=${selectedCategory}` : '/shop/products';
            const response = await api.get(url);
            setProducts(response.data);
        } catch (err) {
            console.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/shop/categories');
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to load categories');
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loader"></div>
        </div>
    );

    const displayProducts = filteredProducts;

    return (
        <div className="shop-page">
            <header className="page-header">
                <div className="container">
                    <h1 className="reveal-up">Collection</h1>
                    {searchQuery && (
                        <p className="search-results-text reveal-up" style={{ animationDelay: '0.05s' }}>
                            {displayProducts.length} result{displayProducts.length !== 1 ? 's' : ''} for "{searchQuery}"
                            <button 
                                onClick={() => setSearchParams({})} 
                                className="clear-search-btn"
                            >
                                Clear Search
                            </button>
                        </p>
                    )}
                    <div className="category-tabs reveal-up" style={{ animationDelay: '0.1s' }}>
                        <button
                            className={!selectedCategory ? 'active' : ''}
                            onClick={() => setSelectedCategory('')}
                        >
                            All Pieces
                        </button>
                        {categories.map(category => (
                            <button
                                key={category}
                                className={selectedCategory === category ? 'active' : ''}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <section className="section bg-soft">
                <div className="container">
                    {displayProducts.length === 0 ? (
                        <div className="no-results">
                            <p>No products found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchParams({})} 
                                    className="btn btn-primary"
                                >
                                    View All Products
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="products-grid">
                            {displayProducts.map((product, index) => (
                            <div key={product.id} className="product-card reveal-up" style={{ animationDelay: `${index * 0.05}s` }}>
                                <Link to={`/product/${product.id}`} className="product-image">
                                    <img src={product.image_url} alt={product.name} />
                                    {product.stock === 0 && <div className="stock-badge">Out of Stock</div>}
                                </Link>
                                <div className="product-info">
                                    <span className="category">{product.category}</span>
                                    <h3>{product.name}</h3>
                                    <div className="product-footer">
                                        <span className="price">₹{product.price}</span>
                                        <button
                                            className="btn-add"
                                            onClick={() => addToCart(product)}
                                            disabled={product.stock === 0}
                                        >
                                            {product.stock === 0 ? 'Unavailable' : 'Add to Bag'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Shop;
