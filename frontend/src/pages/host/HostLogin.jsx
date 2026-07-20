// Login page for hosts/admins only — reached via the "Become a Host" button on the main site.
// Regular guest accounts are rejected here since this leads into the host dashboard.

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const HostLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      if (data.role !== 'host' && data.role !== 'admin') {
        setError('This account does not have host access');
        return;
      }

      login(data);
      navigate('/host');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
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
          <h1 style={styles.leftTitle}>Welcome back, Host</h1>
          <p style={styles.leftSub}>
            Manage your listings, track reservations and grow your hosting business — all in one place.
          </p>
          <div style={styles.statsRow}>
            <div style={styles.stat}>
              <span style={styles.statNum}>2M+</span>
              <span style={styles.statLabel}>Active hosts</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNum}>100K+</span>
              <span style={styles.statLabel}>Cities</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNum}>4M+</span>
              <span style={styles.statLabel}>Listings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Sign in to your account</h2>
          <p style={styles.formSub}>Enter your credentials to access the dashboard</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={styles.switchText}>
            New host?{' '}
            <Link to="/host/register" style={styles.link}>Create a host account</Link>
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
    marginBottom: '48px',
  },
  statsRow: {
    display: 'flex',
    gap: '32px',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statNum: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.75)',
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
    transition: 'border-color 0.2s',
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

export default HostLogin;
