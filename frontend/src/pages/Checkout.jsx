import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import './Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    doorNo: '',
    street: '',
    area: '',
    village: '',
    district: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [isAuthenticated, user]);

  const getLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      setLocationLoading(false);
      alert('Location services are not supported by your browser. Please enter your address manually.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        setFormData(prev => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lon.toString()
        }));

        // Reverse geocoding to get location name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'LadiesTailorShop/1.0'
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            const address = data.address;
            
            console.log('Geocoding response:', data);
            
            // Build detailed location string with priority
            const locationParts = [];
            
            // Add neighborhood/suburb/locality
            if (address.neighbourhood || address.suburb || address.locality) {
              locationParts.push(address.neighbourhood || address.suburb || address.locality);
            }
            
            // Add city/town/village
            if (address.city || address.town || address.village) {
              locationParts.push(address.city || address.town || address.village);
            }
            
            // Add district if different from city
            if (address.state_district && address.state_district !== (address.city || address.town)) {
              locationParts.push(address.state_district);
            }
            
            // Add state
            if (address.state) {
              locationParts.push(address.state);
            }
            
            // Add country
            if (address.country) {
              locationParts.push(address.country);
            }
            
            const locationStr = locationParts.length > 0 
              ? locationParts.join(', ') 
              : data.display_name.split(',').slice(0, 4).join(',');
            
            setLocationName(locationStr);
            
            // Auto-fill form fields if available and empty
            setFormData(prev => ({
              ...prev,
              state: prev.state || address.state || '',
              district: prev.district || address.state_district || address.county || '',
              village: prev.village || address.city || address.town || address.village || '',
              area: prev.area || address.neighbourhood || address.suburb || address.locality || '',
              pincode: prev.pincode || address.postcode || ''
            }));
          } else {
            setLocationName(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          setLocationName(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
        }
        
        setLocationLoading(false);
        alert('✓ Location captured successfully for precise delivery!');
      },
      (error) => {
        setLocationLoading(false);
        let errorMessage = 'Unable to get location. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
        
        alert(errorMessage + ' You can still proceed by entering your address manually.');
        console.error('Location error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const calculateShipping = () => {
    // FREE SHIPPING FOR TESTING
    return 0;
    
    /* PRODUCTION CODE - Uncomment when ready
    const state = formData.state.toLowerCase().trim();
    
    if (!state) return 0;
    
    // Andhra Pradesh variations
    if (state === 'andhra pradesh' || state === 'andhrapradesh' || state === 'ap') {
      return 70;
    }
    
    // Other states
    return 120;
    */
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if Razorpay is configured
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKeyId || razorpayKeyId === 'your_razorpay_key_id') {
        alert('Payment gateway is not configured yet. Please contact the administrator to set up Razorpay credentials.');
        setLoading(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Gateway connection failed. Please check your network.');
        setLoading(false);
        return;
      }

      const fullAddress = `${formData.doorNo}, ${formData.street}, ${formData.area}, ${formData.village}, ${formData.district}, ${formData.state} - ${formData.pincode}`;
      
      const shippingCharges = calculateShipping();
      const subtotal = getCartTotal();
      const totalAmount = subtotal + shippingCharges;

      const orderData = {
        amount: totalAmount,
        subtotal: subtotal,
        shippingCharges: shippingCharges,
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: fullAddress,
          state: formData.state,
          latitude: formData.latitude,
          longitude: formData.longitude
        },
        items: cart,
        customerId: user?.id || null
      };

      console.log('Creating order with data:', orderData);
      const { data } = await api.post('/shop/create-order', orderData);
      console.log('Order created:', data);

      const options = {
        key: razorpayKeyId,
        amount: data.amount,
        currency: data.currency,
        name: import.meta.env.VITE_SHOP_NAME || 'Sri Ladies Tailor',
        description: 'Bespoke Collection Purchase',
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: data.dbOrderId
            };

            await api.post('/shop/verify-payment', verifyData);
            clearCart();
            navigate(`/order-success/${data.orderNumber}`);
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Verification in progress. You will receive a notification.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#1B263B'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Order creation error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || 'Order generation failed. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <header className="checkout-header reveal-up">
          <h1 className="serif" style={{ fontSize: '3rem' }}>Boutique Checkout</h1>
          <button className="btn btn-outline small" onClick={() => navigate('/cart')}>
            Back to Bag
          </button>
        </header>

        <div className="checkout-content">
          <div className="checkout-form reveal-up" style={{ animationDelay: '0.1s' }}>
            <h3>Customer Identity</h3>
            <form onSubmit={handlePayment}>
              <div className="form-group">
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="address-row">
                <input type="email" name="email" placeholder="Email (for receipt)" value={formData.email} onChange={handleChange} required />
                <input type="tel" name="phone" placeholder="Contact Number" value={formData.phone} onChange={handleChange} pattern="[0-9]{10}" required />
              </div>

              <div className="location-section" style={{ marginTop: '20px' }}>
                <button type="button" className="btn btn-primary" onClick={getLocation} disabled={locationLoading}>
                  {locationLoading ? 'Locating...' : '📍 Capture Precise Delivery Location'}
                </button>
                {formData.latitude && (
                  <div style={{ marginTop: '10px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #b3e0ff' }}>
                    <div style={{ color: '#1E8E3E', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                      ✓ Location Captured
                    </div>
                    <div style={{ color: '#333', fontSize: '14px', lineHeight: '1.6' }}>
                      📍 <strong>{locationName || 'Loading location name...'}</strong>
                    </div>
                  </div>
                )}
              </div>

              <h4 className="address-heading">Shipping Destination</h4>

              <div className="address-row">
                <input type="text" name="doorNo" placeholder="Apt/Floor/No" value={formData.doorNo} onChange={handleChange} required />
                <input type="text" name="street" placeholder="Street/Way" value={formData.street} onChange={handleChange} required />
              </div>

              <input type="text" name="area" placeholder="Locality/Area" value={formData.area} onChange={handleChange} required />

              <div className="address-row">
                <input type="text" name="village" placeholder="Town/Village" value={formData.village} onChange={handleChange} required />
                <input type="text" name="district" placeholder="District" value={formData.district} onChange={handleChange} required />
              </div>

              <div className="address-row">
                <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
                <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} pattern="[0-9]{6}" required />
              </div>

              <button type="submit" className="btn btn-gold btn-block" style={{ marginTop: '30px' }} disabled={loading}>
                {loading ? 'Authenticating...' : `Finalize Order • ₹${(getCartTotal() + calculateShipping()).toFixed(2)}`}
              </button>
            </form>
          </div>

          <aside className="order-summary reveal-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="serif">Selection Summary</h3>
            <div className="summary-items">
              {cart.map(item => (
                <div key={item.id} className="summary-item">
                  <img src={item.image_url} alt={item.name} />
                  <div className="summary-item-details">
                    <h4>{item.name}</h4>
                    <p>{item.quantity} × ₹{item.price}</p>
                  </div>
                  <div className="summary-item-total" style={{ fontWeight: '700', marginLeft: 'auto' }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Catalogue Total</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping Fees</span>
                <span style={{ color: '#1E8E3E', fontWeight: '600' }}>
                  FREE (Testing Mode)
                </span>
              </div>
              <div className="summary-row total">
                <span>Grand Total</span>
                <span>₹{(getCartTotal() + calculateShipping()).toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
