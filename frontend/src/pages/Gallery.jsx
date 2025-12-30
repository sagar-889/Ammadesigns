import { useState, useEffect } from 'react';
import api from '../config/api';
import './Gallery.css';

const Gallery = () => {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const response = await api.get('/gallery');
            setGallery(response.data);
        } catch (err) {
            console.error('Failed to load gallery');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loader"></div>
        </div>
    );

    return (
        <div className="gallery-page">
            <header className="page-header">
                <div className="container">
                    <h1 className="reveal-up">Style Gallery</h1>
                    <p className="reveal-up" style={{ animationDelay: '0.1s' }}>
                        A visual journey through our finest bespoke creations and seasonal lookbooks.
                    </p>
                </div>
            </header>

            <section className="section bg-soft">
                <div className="container">
                    <div className="gallery-grid">
                        {gallery.map((item, index) => (
                            <div
                                key={item.id}
                                className={`gallery-item reveal-up ${index % 5 === 0 ? 'large' : ''}`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <div className="gallery-overlay">
                                    <div className="overlay-content">
                                        <h3>{item.title || 'Collection Piece'}</h3>
                                        <p>Sri Ladies Tailor</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Gallery;
