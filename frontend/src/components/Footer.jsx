import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const shopName = import.meta.env.VITE_SHOP_NAME || 'Sri Ladies Tailor';
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-info">
                        <Link to="/" className="footer-logo">
                            {shopName.split(' ')[0]}<span>{shopName.split(' ')[1] || ''}</span>
                        </Link>
                        <p className="footer-desc">
                            Premium bespoke tailoring for the modern woman.
                            Celebrating elegance, craftsmanship, and the perfect fit.
                        </p>
                    </div>

                    <div className="footer-links-group">
                        <h4>Boutique</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/services">Services</Link></li>
                            <li><Link to="/shop">Shop</Link></li>
                            <li><Link to="/gallery">Gallery</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links-group">
                        <h4>Support</h4>
                        <ul className="footer-links">
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/track-order">My Orders</Link></li>
                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    <div className="footer-social">
                        <h4>Follow Us</h4>
                        <div className="social-icons">
                            <a href="#" className="social-icon">Instagram</a>
                            <a href="#" className="social-icon">Facebook</a>
                            <a href="#" className="social-icon">Pinterest</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {year} {shopName}. All Rights Reserved.</p>
                    <p>Handcrafted by Excellence.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
