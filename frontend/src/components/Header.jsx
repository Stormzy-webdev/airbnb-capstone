import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ onSearch, locations = [] }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [liveFilter, setLiveFilter] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const locationRef = useRef(null);

  // Close location dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(search);
    setLocationOpen(false);
  };

  const handleLocationSelect = (location) => {
    setSearch(location);
    setLiveFilter('');
    setLocationOpen(false);
    if (onSearch) onSearch(location);
  };

  const handleShowAll = () => {
    setSearch('');
    setLiveFilter('');
    setLocationOpen(false);
    if (onSearch) onSearch('');
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header style={styles.header}>
      {/* Logo */}
      <div style={styles.logo} onClick={() => navigate('/')}>
        <img
          src="http://localhost:5000/images/AirBnBLogo.jfif"
          alt="Airbnb"
          style={{ height: '52px', objectFit: 'contain', cursor: 'pointer' }}
        />
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={styles.searchBar}>

        {/* Where — with location dropdown */}
        <div style={styles.searchSection} ref={locationRef}>
          <label style={styles.searchLabel}>Where</label>
          <input
            type="text"
            placeholder="Search destinations"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setLiveFilter(e.target.value);
              setLocationOpen(true);
            }}
            onFocus={() => {
              setLiveFilter('');
              setLocationOpen(true);
            }}
            style={styles.searchInput}
          />

          {locationOpen && locations.length > 0 && (
            <div style={styles.locationDropdown}>
              <p style={styles.locationDropdownTitle}>Destinations</p>

              <button type="button" style={styles.locationItemAll} onClick={handleShowAll}>
                <span style={styles.locationPin}>🌍</span>
                All locations
              </button>

              {locations
                .filter((loc) => loc.toLowerCase().includes(liveFilter.toLowerCase()))
                .map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    style={styles.locationItem}
                    onClick={() => handleLocationSelect(loc)}
                  >
                    <span style={styles.locationPin}>📍</span>
                    {loc}
                  </button>
                ))}
            </div>
          )}
        </div>

        <div style={styles.searchDivider} />

        <div style={styles.searchSection}>
          <label style={styles.searchLabel}>When</label>
          <span style={styles.searchPlaceholder}>Add dates</span>
        </div>

        <div style={styles.searchDivider} />

        <div style={styles.searchSectionLast}>
          <label style={styles.searchLabel}>Who</label>
          <span style={styles.searchPlaceholder}>Add guests</span>
        </div>

        <button type="submit" style={styles.searchBtn}>
          <svg viewBox="0 0 32 32" width="14" height="14" fill="white">
            <path d="M13 2a11 11 0 1 0 7.16 19.245l6.548 6.549 1.414-1.414-6.548-6.55A11 11 0 0 0 13 2zm0 2a9 9 0 1 1 0 18A9 9 0 0 1 13 4z" />
          </svg>
        </button>
      </form>

      {/* Auth area */}
      <div style={styles.authArea}>
        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              style={styles.avatarBtn}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span style={styles.hamburger}>≡</span>
              <span style={styles.avatar}>{user.username?.[0]?.toUpperCase()}</span>
            </button>

            {dropdownOpen && (
              <div style={styles.dropdown}>
                <p style={styles.dropdownName}>Hi, {user.username}</p>
                <hr style={styles.divider} />
                <button style={styles.dropdownItem} onClick={handleLogout}>
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={styles.authButtons}>
            <button style={styles.loginBtn} onClick={() => navigate('/login')}>
              Log in
            </button>
            <button style={styles.signupBtn} onClick={() => navigate('/register')}>
              Sign up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 40px',
    borderBottom: '1px solid #ebebeb',
    position: 'sticky',
    top: 0,
    backgroundColor: '#fff',
    zIndex: 100,
    gap: '16px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ddd',
    borderRadius: '40px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    flex: 1,
    maxWidth: '560px',
    backgroundColor: '#fff',
    padding: '0 4px 0 0',
    position: 'relative',
  },
  searchSection: {
    flex: 1,
    padding: '10px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    position: 'relative',
  },
  searchSectionLast: {
    flex: 1,
    padding: '10px 12px 10px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  searchLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#222',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '13px',
    color: '#717171',
    backgroundColor: 'transparent',
    padding: 0,
    width: '100%',
  },
  searchPlaceholder: {
    fontSize: '13px',
    color: '#717171',
  },
  searchDivider: {
    width: '1px',
    height: '24px',
    backgroundColor: '#ddd',
    flexShrink: 0,
  },
  searchBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#FF385C',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    cursor: 'pointer',
  },
  locationDropdown: {
    position: 'absolute',
    top: '56px',
    left: '-20px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '16px',
    boxShadow: '0 8px 28px rgba(0,0,0,0.15)',
    minWidth: '260px',
    zIndex: 300,
    padding: '12px 0',
  },
  locationDropdownTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#717171',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '4px 16px 10px',
  },
  locationItemAll: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#f7f7f7',
    border: 'none',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '700',
    color: '#222',
    cursor: 'pointer',
    borderBottom: '1px solid #ebebeb',
  },
  locationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    fontSize: '14px',
    color: '#222',
    cursor: 'pointer',
  },
  locationPin: {
    fontSize: '16px',
  },
  authArea: {
    flexShrink: 0,
  },
  authButtons: {
    display: 'flex',
    gap: '8px',
  },
  loginBtn: {
    padding: '8px 16px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  signupBtn: {
    padding: '8px 16px',
    backgroundColor: '#222',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  avatarBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  hamburger: {
    fontSize: '18px',
    color: '#222',
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#717171',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '600',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '44px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    padding: '8px 0',
    minWidth: '160px',
    zIndex: 200,
  },
  dropdownName: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#222',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #ebebeb',
    margin: '4px 0',
  },
  dropdownItem: {
    width: '100%',
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    fontSize: '14px',
    color: '#222',
    cursor: 'pointer',
  },
};

export default Header;
