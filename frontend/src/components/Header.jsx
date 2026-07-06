// Navbar with the Airbnb logo, a three-section search bar, and login/signup or user avatar depending on auth state

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Header = ({ onSearch, locations = [], transparent = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [liveFilter, setLiveFilter] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestOpen, setGuestOpen] = useState(false);
  const [guests, setGuests] = useState(1);
  const locationRef = useRef(null);
  const dateRef = useRef(null);
  const guestRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) setLocationOpen(false);
      if (dateRef.current && !dateRef.current.contains(e.target)) setDateOpen(false);
      if (guestRef.current && !guestRef.current.contains(e.target)) setGuestOpen(false);
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

  const logoEl = (
    <div style={styles.logo} onClick={() => navigate('/')}>
      <img
        src={`${API_URL}/images/Airbnb-logo.png`}
        alt="Airbnb"
        style={{ height: '100px', objectFit: 'contain', cursor: 'pointer' }}
      />
    </div>
  );

  const authEl = (
    <div style={{ ...styles.authArea, display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ ...styles.becomeHost, color: transparent ? '#fff' : '#222' }}>Become a Host</span>
      {user ? (
        <div style={{ position: 'relative' }}>
          <button style={transparent ? styles.avatarBtnTransparent : styles.avatarBtn} onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span style={{ ...styles.hamburger, color: transparent ? '#fff' : '#222' }}>≡</span>
            <span style={styles.avatar}>{user.username?.[0]?.toUpperCase()}</span>
          </button>
          {dropdownOpen && (
            <div style={styles.dropdown}>
              <p style={styles.dropdownName}>Hi, {user.username}</p>
              <hr style={styles.divider} />
              <button style={styles.dropdownItem} onClick={handleLogout}>Log out</button>
            </div>
          )}
        </div>
      ) : (
        <div style={styles.authButtons}>
          <button
            style={transparent ? { ...styles.loginBtn, backgroundColor: 'transparent', color: '#fff', borderColor: '#fff' } : styles.loginBtn}
            onClick={() => navigate('/login')}
          >
            Log in
          </button>
          <button
            style={transparent ? { ...styles.signupBtn, backgroundColor: '#fff', color: '#222' } : styles.signupBtn}
            onClick={() => navigate('/register')}
          >
            Sign up
          </button>
        </div>
      )}
    </div>
  );

  const searchForm = (
    <form onSubmit={handleSearch} style={styles.searchBar}>
      {/* Where */}
      <div style={styles.searchSection} ref={locationRef}>
        <label style={styles.searchLabel}>Where</label>
        <input
          type="text"
          placeholder="Search destinations"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setLiveFilter(e.target.value); setLocationOpen(true); }}
          onFocus={() => { setLiveFilter(''); setLocationOpen(true); }}
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
                <button key={loc} type="button" style={styles.locationItem} onClick={() => handleLocationSelect(loc)}>
                  <span style={styles.locationPin}>📍</span>
                  {loc}
                </button>
              ))}
          </div>
        )}
      </div>

      <div style={styles.searchDivider} />

      {/* When */}
      <div style={styles.searchSection} ref={dateRef}>
        <label style={styles.searchLabel}>When</label>
        <span
          style={{ ...styles.searchPlaceholder, cursor: 'pointer' }}
          onClick={() => { setDateOpen(!dateOpen); setLocationOpen(false); setGuestOpen(false); }}
        >
          {checkIn && checkOut
            ? `${new Date(checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${new Date(checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
            : checkIn
            ? `${new Date(checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – Check-out`
            : 'Add dates'}
        </span>
        {dateOpen && (
          <div style={styles.dateDropdown}>
            <p style={styles.dateDropdownTitle}>Select dates</p>
            <div style={styles.dateFields}>
              <div style={styles.dateField}>
                <label style={styles.dateFieldLabel}>Check-in</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={styles.dateInput} />
              </div>
              <div style={styles.dateField}>
                <label style={styles.dateFieldLabel}>Check-out</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={styles.dateInput} />
              </div>
            </div>
            {checkIn && checkOut && (
              <button type="button" style={styles.dateApplyBtn} onClick={() => setDateOpen(false)}>Apply</button>
            )}
          </div>
        )}
      </div>

      <div style={styles.searchDivider} />

      {/* Who */}
      <div style={{ ...styles.searchSectionLast, position: 'relative' }} ref={guestRef}>
        <label style={styles.searchLabel}>Who</label>
        <span
          style={{ ...styles.searchPlaceholder, cursor: 'pointer' }}
          onClick={() => { setGuestOpen(!guestOpen); setLocationOpen(false); setDateOpen(false); }}
        >
          {guests > 0 ? `${guests} guest${guests > 1 ? 's' : ''}` : 'Add guests'}
        </span>
        {guestOpen && (
          <div style={styles.guestDropdown}>
            <p style={styles.guestDropdownTitle}>Guests</p>
            <div style={styles.guestRow}>
              <div>
                <p style={styles.guestType}>Adults</p>
                <p style={styles.guestSub}>Ages 13 or above</p>
              </div>
              <div style={styles.counter}>
                <button type="button" style={styles.counterBtn} onClick={() => setGuests(Math.max(1, guests - 1))}>−</button>
                <span style={styles.counterNum}>{guests}</span>
                <button type="button" style={styles.counterBtn} onClick={() => setGuests(guests + 1)}>+</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <button type="submit" style={styles.searchBtn}>
        <svg viewBox="0 0 32 32" width="14" height="14" fill="white">
          <path d="M13 2a11 11 0 1 0 7.16 19.245l6.548 6.549 1.414-1.414-6.548-6.55A11 11 0 0 0 13 2zm0 2a9 9 0 1 1 0 18A9 9 0 0 1 13 4z" />
        </svg>
      </button>
    </form>
  );

  return (
    <header style={{
      ...styles.header,
      backgroundColor: transparent ? 'transparent' : '#fff',
      borderBottom: transparent ? 'none' : '1px solid #ebebeb',
    }}>
      {logoEl}

      {/* Center: tabs (transparent only) + search bar */}
      <div style={styles.centerCol}>
        {transparent && (
          <div style={styles.tabsRow}>
            <span style={styles.tabItem}>Places to stay</span>
            <span style={styles.tabItem}>Experiences</span>
            <span style={styles.tabItem}>Online Experiences</span>
          </div>
        )}
        {searchForm}
      </div>

      {authEl}
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
    backgroundColor: '#fff',
    gap: '16px',
  },
  centerCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '60px',
    flex: 1,
  },
  tabsRow: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
    marginTop: '16px',
  },
  tabItem: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
    cursor: 'pointer',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    alignSelf: 'flex-start',
    marginTop: '-20px',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ddd',
    borderRadius: '40px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    width: '560px',
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
  dateDropdown: {
    position: 'absolute',
    top: '56px',
    left: '-20px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '16px',
    boxShadow: '0 8px 28px rgba(0,0,0,0.15)',
    zIndex: 300,
    padding: '20px',
    minWidth: '300px',
  },
  dateDropdownTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#717171',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '16px',
  },
  dateFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  dateField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  dateFieldLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#222',
  },
  dateInput: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    color: '#222',
    outline: 'none',
    cursor: 'pointer',
  },
  dateApplyBtn: {
    marginTop: '16px',
    width: '100%',
    padding: '10px',
    backgroundColor: '#FF385C',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  guestDropdown: {
    position: 'absolute',
    top: '56px',
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '16px',
    boxShadow: '0 8px 28px rgba(0,0,0,0.15)',
    zIndex: 300,
    padding: '20px',
    minWidth: '260px',
  },
  guestDropdownTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#717171',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '16px',
  },
  guestRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guestType: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#222',
    marginBottom: '2px',
  },
  guestSub: {
    fontSize: '13px',
    color: '#717171',
  },
  counter: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  counterBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#222',
  },
  counterNum: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#222',
    minWidth: '16px',
    textAlign: 'center',
  },
  authArea: {
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  becomeHost: {
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
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
  avatarBtnTransparent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    border: '1px solid #fff',
    borderRadius: '20px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  hamburger: {
    fontSize: '18px',
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
