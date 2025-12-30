import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const shopName = import.meta.env.VITE_SHOP_NAME || 'Sri Ladies Tailor';

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-overlay"></div>
                <div className="container">
                    <div className="hero-content reveal-up">
                        <span className="hero-subtitle">Est. 1995</span>
                        <h1 className="hero-title">{shopName}</h1>
                        <p className="hero-desc">
                            Where tradition meets contemporary style. Experience the luxury of
                            bespoke tailoring, handcrafted for your unique silhouette.
                        </p>
                        <div className="hero-btns">
                            <Link to="/shop" className="btn btn-primary">Shop Collection</Link>
                            <Link to="/services" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>Our Services</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="section bg-soft">
                <div className="container">
                    <h2 className="section-title">Why Choose Us</h2>
                    <div className="features-grid">
                        <div className="feature-card reveal-up" style={{ animationDelay: '0.1s' }}>
                            <div className="feature-icon">✨</div>
                            <h3>Master Tailors</h3>
                            <p>Decades of experience in crafting high-fashion garments with precision.</p>
                        </div>
                        <div className="feature-card reveal-up" style={{ animationDelay: '0.2s' }}>
                            <div className="feature-icon">🧵</div>
                            <h3>Fine Fabrics</h3>
                            <p>Only the highest quality materials, from pure silks to imported laces.</p>
                        </div>
                        <div className="feature-card reveal-up" style={{ animationDelay: '0.3s' }}>
                            <div className="feature-icon">📐</div>
                            <h3>Perfect Fit</h3>
                            <p>Meticulous measurements ensure that every piece is customized for you.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Showcase Section */}
            <section className="section">
                <div className="container">
                    <div className="showcase-grid">
                        <div className="showcase-content reveal-up">
                            <h2 className="serif">Bespoke Bridal</h2>
                            <p>
                                Your special day deserves a special ensemble. Our bridal boutique
                                specializes in intricate embroidery and hand-worked details.
                            </p>
                            <Link to="/gallery" className="btn btn-gold">View Lookbook</Link>
                        </div>
                        <div className="showcase-image reveal">
                            <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80" alt="Bridal" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="section bg-primary text-white">
                <div className="container text-center reveal-up">
                    <h2 className="serif" style={{ color: 'var(--white)', fontSize: '3rem' }}>Ready to Get Started?</h2>
                    <p style={{ opacity: 0.8, marginBottom: '40px' }}>Book your appointment आज and experience the best tailoring in town.</p>
                    <Link to="/contact" className="btn btn-gold">Book Appointment</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
