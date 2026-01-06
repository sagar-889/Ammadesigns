import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const shopName = import.meta.env.VITE_SHOP_NAME || 'Sri Ladies Tailor';
  const cartCount = getCartCount();
  const navbarRef = useRef(null);

  // Determine if we should show home page navigation
  const isHomePage = location.pathname === '/';
  const showHomeNav = isHomePage && !isAuthenticated;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on a modal or modal content
      if (event.target.closest('.modal-overlay, .modal-content, .service-modal')) {
        return;
      }
      
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
      setIsOpen(false);
    }
  };

  return (
    <nav ref={navbarRef} className={`navbar ${scrolled ? 'scrolled' : ''} ${isOpen ? 'menu-open' : ''}`}>
      <div className="container">
        <div className="nav-wrapper">
          {/* Logo */}
          <Link 
            to="/" 
            className="logo"
            onClick={() => setIsOpen(false)}
            aria-label="Home"
          >
            {shopName.split(' ')[0]}
            <span>{shopName.split(' ').slice(1).join(' ')}</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className={`menu-toggle ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <span className="close-icon" aria-hidden="true">✕</span>
            ) : (
              <>
                <span className="line line1"></span>
                <span className="line line2"></span>
                <span className="line line3"></span>
              </>
            )}
          </button>

          {/* Navigation Menu */}
          <div className={`nav-menu-container ${isOpen ? 'active' : ''}`}>
            <ul className="nav-links">
              {/* Show Home/Gallery/Contact only on home page before login */}
              {showHomeNav && (
                <>
                  <li>
                    <Link 
                      to="/" 
                      className={isActive('/') ? 'active' : ''} 
                      onClick={() => setIsOpen(false)}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/gallery" 
                      className={isActive('/gallery') ? 'active' : ''} 
                      onClick={() => setIsOpen(false)}
                    >
                      The Lookbook
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/contact" 
                      className={isActive('/contact') ? 'active' : ''} 
                      onClick={() => setIsOpen(false)}
                    >
                      Contact
                    </Link>
                  </li>
                </>
              )}

              {/* Show Shop and My Orders when logged in */}
              {isAuthenticated && (
                <>
                  <li>
                    <Link 
                      to="/shop" 
                      className={isActive('/shop') ? 'active' : ''} 
                      onClick={() => setIsOpen(false)}
                    >
                      Shop
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/track-order" 
                      className={isActive('/track-order') ? 'active' : ''} 
                      onClick={() => setIsOpen(false)}
                    >
                      My Orders
                    </Link>
                  </li>
                </>
              )}
              
              {/* User Actions - Only show on non-admin pages */}
              {!location.pathname.startsWith('/admin') && (
                <>
                  {/* Search Button */}
                  {isAuthenticated && (
                    <li className="search-item">
                      <button 
                        className="search-toggle-button" 
                        onClick={() => setShowSearch(!showSearch)}
                        aria-label="Search products"
                      >
                        <span className="search-icon" aria-hidden="true">🔍</span>
                      </button>
                    </li>
                  )}

                  {/* Cart Button - Show only when logged in */}
                  {isAuthenticated && (
                    <li className="cart-item">
                      <button 
                        className="cart-button" 
                        onClick={() => { 
                          navigate('/cart'); 
                          setIsOpen(false); 
                        }}
                        aria-label={`Shopping cart with ${cartCount} items`}
                      >
                        <span className="cart-icon" aria-hidden="true">🛍️</span>
                        {cartCount > 0 && (
                          <span className="cart-badge">{cartCount}</span>
                        )}
                      </button>
                    </li>
                  )}
                  
                  {/* User Profile / Login / Logout */}
                  {isAuthenticated ? (
                    <>
                      <li>
                        <Link 
                          to="/account" 
                          className={`account-link ${isActive('/account') ? 'active' : ''}`} 
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="user-icon" aria-hidden="true">👤</span>
                          <span className="user-text">Profile</span>
                        </Link>
                      </li>
                      <li>
                        <button 
                          className="logout-button"
                          onClick={() => {
                            logout();
                            setIsOpen(false);
                            navigate('/');
                          }}
                        >
                          <span className="logout-icon" aria-hidden="true">➜]</span>
                          <span className="logout-text">Logout</span>
                        </button>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link 
                        to="/login" 
                        className={`login-link ${isActive('/login') ? 'active' : ''}`} 
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="login-icon" aria-hidden="true">🔐</span>
                        <span className="login-text">Login</span>
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>

            {/* Search Bar */}
            {showSearch && isAuthenticated && (
              <form className="search-form" onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="search-input"
                  autoFocus
                />
                <button type="submit" className="search-submit-btn">
                  Search
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
