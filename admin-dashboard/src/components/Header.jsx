import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AirbnbLogo = () => (
  <img
    src="http://localhost:5000/images/AirBnBLogo.jfif"
    alt="Airbnb"
    style={{ height: '52px', objectFit: 'contain' }}
  />
);

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <AirbnbLogo />
      </Link>

      <div style={styles.centerLabel}>
        <span style={styles.dashboardBadge}>Host Dashboard</span>
      </div>

      <nav style={styles.nav}>
        {user ? (
          <div style={styles.profileSection}>
            <span style={styles.greeting}>Hi, {user.username}</span>
            <div style={styles.avatarWrapper}>
              <button
                style={styles.avatarBtn}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span style={styles.hamburger}>≡</span>
                <span style={styles.avatar}>{user.username.charAt(0).toUpperCase()}</span>
              </button>

              {dropdownOpen && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownHeader}>
                    <p style={styles.dropdownName}>{user.username}</p>
                    <p style={styles.dropdownEmail}>{user.email}</p>
                  </div>
                  <hr style={styles.divider} />
                  <button
                    style={styles.dropdownItem}
                    onClick={() => { navigate('/'); setDropdownOpen(false); }}
                  >
                    📋 My Listings
                  </button>
                  <button
                    style={styles.dropdownItem}
                    onClick={() => { navigate('/reservations'); setDropdownOpen(false); }}
                  >
                    🗓 View Reservations
                  </button>
                  <hr style={styles.divider} />
                  <button
                    style={{ ...styles.dropdownItem, color: '#FF385C' }}
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link to="/login" style={styles.hostLink}>Become a host</Link>
        )}
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 40px',
    borderBottom: '1px solid #ebebeb',
    backgroundColor: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
  },
  centerLabel: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  dashboardBadge: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#717171',
    backgroundColor: '#f7f7f7',
    padding: '4px 14px',
    borderRadius: '20px',
    border: '1px solid #ebebeb',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    position: 'relative',
  },
  greeting: {
    fontSize: '14px',
    color: '#444',
    fontWeight: '500',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '5px 8px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  hamburger: {
    fontSize: '16px',
    color: '#222',
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#FF385C',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '48px',
    backgroundColor: '#fff',
    border: '1px solid #ebebeb',
    borderRadius: '12px',
    boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
    minWidth: '200px',
    zIndex: 200,
    overflow: 'hidden',
  },
  dropdownHeader: {
    padding: '14px 16px',
  },
  dropdownName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#222',
    marginBottom: '2px',
  },
  dropdownEmail: {
    fontSize: '12px',
    color: '#717171',
  },
  divider: {
    margin: 0,
    border: 'none',
    borderTop: '1px solid #ebebeb',
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#222',
  },
  hostLink: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#222',
    textDecoration: 'none',
  },
};

export default Header;
