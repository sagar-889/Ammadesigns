import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetPhone, setResetPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/shop';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.identifier, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setError('');
    setResetSuccess('');

    try {
      await api.post('/auth/reset-password', {
        phone: resetPhone,
        newPassword: newPassword
      });
      setResetSuccess('Password reset successful! You can now login with your new password.');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetPhone('');
        setNewPassword('');
        setResetSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. Please check your phone number.');
    } finally {
      setResetLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="auth-page">
        <div className="auth-container-centered">
          <header className="auth-header-centered">
            <span className="brand-tag">ammadesigns</span>
            <h1>Reset Password</h1>
            <p>Enter your phone number to reset your password</p>
          </header>

          <form onSubmit={handleForgotPassword} className="auth-form">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your registered phone number"
                value={resetPhone}
                onChange={(e) => setResetPhone(e.target.value)}
                pattern="[0-9]{10}"
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength="6"
                required
              />
            </div>

            {error && <div className="error-message">⚠️ {error}</div>}
            {resetSuccess && <div className="success-message">✓ {resetSuccess}</div>}

            <button type="submit" className="btn btn-primary btn-block" disabled={resetLoading}>
              {resetLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <div className="auth-footer">
            <button 
              onClick={() => {
                setShowForgotPassword(false);
                setError('');
                setResetSuccess('');
              }} 
              className="back-link"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container-centered">
        <header className="auth-header-centered">
          <span className="brand-tag">ammadesigns</span>
          <h1>Welcome Back</h1>
          <p>Sign in to continue your fashion journey</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email or Phone Number</label>
            <input
              type="text"
              name="identifier"
              placeholder="Enter your email or phone"
              value={formData.identifier}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

          <div className="forgot-password-link">
            <button 
              type="button" 
              onClick={() => setShowForgotPassword(true)}
              className="text-link"
            >
              Forgot Password?
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Create One</Link></p>
          <Link to="/admin/login" className="admin-link">Admin Portal</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
