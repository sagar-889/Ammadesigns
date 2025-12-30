import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const shopName = import.meta.env.VITE_SHOP_NAME || 'Sri Ladies Tailor';
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-wrapper">
          <Link to="/" className="logo">
            {shopName.split(' ')[0]}<span>{shopName.split(' ')[1] || ''}</span>
          </Link>

          <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
            <span className="line"></span>
            <span className="line"></span>
          </button>

          <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
            <li><Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setIsOpen(false)}>Home</Link></li>
            <li><Link to="/services" className={isActive('/services') ? 'active' : ''} onClick={() => setIsOpen(false)}>Studio</Link></li>
            <li><Link to="/gallery" className={isActive('/gallery') ? 'active' : ''} onClick={() => setIsOpen(false)}>The Lookbook</Link></li>
            <li><Link to="/contact" className={isActive('/contact') ? 'active' : ''} onClick={() => setIsOpen(false)}>Contact</Link></li>
            
            {!location.pathname.startsWith('/admin') && (
              <>
                <li>
                  <button 
                    className="cart-button" 
                    onClick={() => { navigate('/cart'); setIsOpen(false); }}
                    aria-label="Shopping cart"
                  >
                    <span className="cart-icon">🛍️</span>
                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                  </button>
                </li>
                
                {isAuthenticated ? (
                  <li>
                    <Link to="/account" className={`account-link ${isActive('/account') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                      Profile
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link to="/login" className={`login-link ${isActive('/login') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
