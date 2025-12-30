import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import './Services.css';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEnquiryModal, setShowEnquiryModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [enquiryForm, setEnquiryForm] = useState({
        name: '',
        phone: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await api.get('/services');
            setServices(response.data);
        } catch (err) {
            console.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const openEnquiryModal = (service) => {
        setSelectedService(service);
        setEnquiryForm({
            name: '',
            phone: '',
            message: `I would like to enquire about ${service.title}`
        });
        setShowEnquiryModal(true);
    };

    const handleFormChange = (e) => {
        setEnquiryForm({
            ...enquiryForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitEnquiry = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.post('/contact', enquiryForm);
            alert('Enquiry submitted successfully! We will contact you soon.');
            setShowEnquiryModal(false);
            setEnquiryForm({ name: '', phone: '', message: '' });
        } catch (err) {
            alert('Failed to submit enquiry. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loader"></div>
        </div>
    );

    return (
        <div className="services-page">
            <header className="page-header">
                <div className="container">
                    <h1 className="reveal-up">Our Expertise</h1>
                    <p className="reveal-up" style={{ animationDelay: '0.1s' }}>
                        Discover our range of bespoke services, from casual refinements
                        to bridal excellence.
                    </p>
                </div>
            </header>

            <section className="section bg-soft">
                <div className="container">
                    <div className="services-grid">
                        {services.map((service, index) => (
                            <div
                                key={service.id}
                                className="service-card reveal-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="service-icon">
                                    {index % 4 === 0 ? '👘' : index % 4 === 1 ? '👗' : index % 4 === 2 ? '👰' : '🧥'}
                                </div>
                                <div className="service-info">
                                    <h3>{service.title}</h3>
                                    <p>{service.description}</p>
                                    <div className="service-footer">
                                        <span className="price">Starting from ₹{service.price}</span>
                                        <button 
                                            className="btn btn-outline small"
                                            onClick={() => openEnquiryModal(service)}
                                        >
                                            Enquiry
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section text-center">
                <div className="container reveal-up">
                    <h2 className="serif">Cannot find what you're looking for?</h2>
                    <p style={{ marginBottom: '40px', color: 'var(--text-muted)' }}>
                        We handle customized orders of all kinds. Reach out for a specialized quote.
                    </p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/contact')}
                    >
                        Custom Order Enquiry
                    </button>
                </div>
            </section>

            {/* Enquiry Modal */}
            {showEnquiryModal && (
                <div className="modal-overlay" onClick={() => setShowEnquiryModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Service Enquiry</h2>
                            <button className="close-btn" onClick={() => setShowEnquiryModal(false)}>×</button>
                        </div>
                        
                        {selectedService && (
                            <div className="modal-service-info">
                                <h3>{selectedService.title}</h3>
                                <p>{selectedService.description}</p>
                                <p className="service-price">Starting from ₹{selectedService.price}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmitEnquiry} className="enquiry-form">
                            <div className="form-group">
                                <label>Your Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={enquiryForm.name}
                                    onChange={handleFormChange}
                                    required
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={enquiryForm.phone}
                                    onChange={handleFormChange}
                                    required
                                    pattern="[0-9]{10}"
                                    placeholder="10-digit phone number"
                                />
                            </div>

                            <div className="form-group">
                                <label>Message *</label>
                                <textarea
                                    name="message"
                                    value={enquiryForm.message}
                                    onChange={handleFormChange}
                                    required
                                    rows="4"
                                    placeholder="Tell us about your requirements"
                                />
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setShowEnquiryModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Enquiry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;
