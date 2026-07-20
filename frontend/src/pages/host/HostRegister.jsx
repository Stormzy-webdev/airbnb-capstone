// Signup page for new hosts — creates the account with role "host" and drops them straight into the dashboard

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const HostRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post(`${API_URL}/api/users/register`, {
        ...form,
        role: 'host',
      });
      login(data);
      navigate('/host');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left panel */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <div style={styles.logoRow}>
            <img
              src={`${API_URL}/images/Airbnb-logo.png`}
              alt="Airbnb"
              style={{ height: '44px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <h1 style={styles.leftTitle}>Start hosting today</h1>
          <p style={styles.leftSub}>
            Create a host account to list your place, manage reservations, and start earning.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Create your host account</h2>
          <p style={styles.formSub}>It only takes a minute</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="John Doe"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Creating account...' : 'Create host account'}
            </button>
          </form>

          <p style={styles.switchText}>
            Already have a host account?{' '}
            <Link to="/host/login" style={styles.link}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(145deg, #FF385C 0%, #e8143c 50%, #c40d31 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 48px',
  },
  leftContent: {
    maxWidth: '400px',
    color: '#fff',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '48px',
  },
  leftTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '16px',
    lineHeight: '1.2',
  },
  leftSub: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: '1.6',
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
    padding: '60px 48px',
  },
  formCard: {
    backgroundColor: '#fff',
    padding: '48px',
    borderRadius: '20px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '420px',
  },
  formTitle: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#222',
    marginBottom: '8px',
  },
  formSub: {
    fontSize: '14px',
    color: '#717171',
    marginBottom: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#222',
  },
  input: {
    padding: '13px 16px',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    fontSize: '15px',
    color: '#222',
    outline: 'none',
    backgroundColor: '#fafafa',
  },
  button: {
    padding: '14px',
    backgroundColor: '#FF385C',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '4px',
    letterSpacing: '0.2px',
  },
  error: {
    color: '#FF385C',
    backgroundColor: '#fff0f2',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    marginBottom: '16px',
    borderLeft: '3px solid #FF385C',
  },
  switchText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#717171',
    marginTop: '24px',
  },
  link: {
    color: '#FF385C',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

export default HostRegister;
