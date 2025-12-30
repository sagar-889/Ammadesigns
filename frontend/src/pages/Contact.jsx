import { useState } from 'react';
import api from '../config/api';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const phone = import.meta.env.VITE_PHONE || '+919876543210';
    const address = import.meta.env.VITE_ADDRESS || '9-262 pallapuveedhy, sankhavaram';
    const mapUrl = import.meta.env.VITE_MAP_URL || 'https://maps.app.goo.gl/E9ccmQFJHA1nArE87';

    const openGoogleMaps = () => {
        // Open the Google Maps link directly
        window.open(mapUrl, '_blank');
    };

    const makePhoneCall = () => {
        // Initiate phone call
        window.location.href = `tel:${phone}`;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await api.post('/contact', formData);
            setStatus({ type: 'success', message: 'Message sent successfully! We will contact you soon.' });
            setFormData({ name: '', phone: '', message: '' });
        } catch (err) {
            setStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page">
            <header className="page-header">
                <div className="container">
                    <h1 className="reveal-up">Get in Touch</h1>
                    <p className="reveal-up" style={{ animationDelay: '0.1s' }}>
                        Book an appointment or send us an enquiry about your tailored needs.
                    </p>
                </div>
            </header>

            <section className="section bg-soft">
                <div className="container">
                    <div className="contact-grid">
                        <div className="contact-info reveal-up">
                            <h2 className="serif">Visit the Studio</h2>
                            <div className="info-item location-item" onClick={openGoogleMaps} style={{ cursor: 'pointer' }}>
                                <span className="info-icon">📍</span>
                                <div>
                                    <h4>Location</h4>
                                    <p>{address}</p>
                                    <small style={{ color: 'var(--secondary)', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                                        Click to open in Google Maps
                                    </small>
                                </div>
                            </div>
                            <div className="info-item phone-item" onClick={makePhoneCall} style={{ cursor: 'pointer' }}>
                                <span className="info-icon">📞</span>
                                <div>
                                    <h4>Phone</h4>
                                    <p>{phone}</p>
                                    <small style={{ color: 'var(--secondary)', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                                        Click to call
                                    </small>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="info-icon">⏰</span>
                                <div>
                                    <h4>Working Hours</h4>
                                    <p>Mon - Sat: 10:00 AM - 08:30 PM<br />Sunday: Closed</p>
                                </div>
                            </div>

                            <div className="boutique-note">
                                <p>Private consultations are recommended for bridal and heavy ethnic wear.</p>
                            </div>
                        </div>

                        <div className="contact-form-container reveal-up" style={{ animationDelay: '0.1s' }}>
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        pattern="[0-9]{10}"
                                        required
                                        placeholder="10-digit mobile number"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Message / Inquiry</label>
                                    <textarea
                                        name="message"
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder="Describe your requirement..."
                                    ></textarea>
                                </div>

                                {status.message && (
                                    <div className={`status-message ${status.type}`}>
                                        {status.message}
                                    </div>
                                )}

                                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
