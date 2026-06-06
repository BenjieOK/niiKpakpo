import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/apiService';
import './admin.css';

export default function AdminLogin() {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await login(creds.username, creds.password);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      navigate('/admin');
    } catch {
      setError('Incorrect username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <h1>Admin Panel</h1>
        <p className="subtitle">Edgar Nii Kpakpo — Content Manager</p>
        {error && <div className="admin-alert error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="username"><i className="fas fa-user" style={{ marginRight: 8 }}></i>Username</label>
            <input
              id="username"
              type="text"
              value={creds.username}
              onChange={(e) => setCreds({ ...creds, username: e.target.value })}
              placeholder="Enter your username"
              required
              autoFocus
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="password"><i className="fas fa-lock" style={{ marginRight: 8 }}></i>Password</label>
            <input
              id="password"
              type="password"
              value={creds.password}
              onChange={(e) => setCreds({ ...creds, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: '#6c757d' }}>
          <a href="/" style={{ color: 'var(--color-primary)' }}>← Return to website</a>
        </p>
      </div>
    </div>
  );
}
