// Main admin page — shows all listings in a grid with options to create, edit or delete each one

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchListings = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/accommodations');
      setListings(data);
    } catch (err) {
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/accommodations/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setListings(listings.filter((listing) => listing._id !== id));
    } catch (err) {
      alert('Failed to delete listing');
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div style={styles.pageWrapper}>
      <Header />

      <div style={styles.page}>
        {/* Page header */}
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.title}>My Listings</h1>
            <p style={styles.subtitle}>{listings.length} propert{listings.length === 1 ? 'y' : 'ies'} listed</p>
          </div>
          <button style={styles.createBtn} onClick={() => navigate('/create')}>
            + New Listing
          </button>
        </div>

        {loading && (
          <div style={styles.statusBox}>
            <p style={styles.statusText}>Loading your listings...</p>
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}

        {!loading && listings.length === 0 && (
          <div style={styles.emptyBox}>
            <span style={styles.emptyIcon}>🏠</span>
            <p style={styles.emptyTitle}>No listings yet</p>
            <p style={styles.emptySub}>Create your first listing to start hosting</p>
            <button style={styles.createBtn} onClick={() => navigate('/create')}>
              Create your first listing
            </button>
          </div>
        )}

        <div style={styles.grid}>
          {listings.map((listing) => (
            <div key={listing._id} style={styles.card}>
              <div style={styles.imageBox}>
                {listing.images && listing.images.length > 0 ? (
                  <img src={listing.images[0]} alt={listing.title} style={styles.image} />
                ) : (
                  <div style={styles.noImage}>
                    <span style={{ fontSize: '32px' }}>🏠</span>
                    <p style={{ fontSize: '13px', color: '#aaa', marginTop: '8px' }}>No photo</p>
                  </div>
                )}
                <div style={styles.priceBadge}>${listing.price}/night</div>
              </div>

              <div style={styles.cardBody}>
                <p style={styles.listingType}>{listing.type}</p>
                <h3 style={styles.listingTitle}>{listing.title}</h3>
                <p style={styles.listingLocation}>📍 {listing.location}</p>

                <div style={styles.metaRow}>
                  <span style={styles.metaItem}>👤 {listing.guests} guests</span>
                  <span style={styles.metaItem}>🛏 {listing.bedrooms} bed</span>
                  <span style={styles.metaItem}>🚿 {listing.bathrooms} bath</span>
                </div>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.editBtn}
                  onClick={() => navigate(`/update/${listing._id}`)}
                >
                  Edit listing
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(listing._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
  },
  page: {
    padding: '32px 40px 60px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#222',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#717171',
  },
  createBtn: {
    padding: '12px 22px',
    backgroundColor: '#FF385C',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  statusBox: {
    textAlign: 'center',
    padding: '60px',
  },
  statusText: {
    color: '#717171',
    fontSize: '16px',
  },
  emptyBox: {
    textAlign: 'center',
    padding: '80px 40px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    border: '2px dashed #ebebeb',
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#222',
    marginBottom: '8px',
  },
  emptySub: {
    fontSize: '15px',
    color: '#717171',
    marginBottom: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #f0f0f0',
    transition: 'box-shadow 0.2s',
  },
  imageBox: {
    height: '200px',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImage: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#fff',
    color: '#222',
    fontSize: '13px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
  cardBody: {
    padding: '16px 20px',
  },
  listingType: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#FF385C',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  listingTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#222',
    marginBottom: '6px',
  },
  listingLocation: {
    fontSize: '13px',
    color: '#717171',
    marginBottom: '12px',
  },
  metaRow: {
    display: 'flex',
    gap: '12px',
  },
  metaItem: {
    fontSize: '13px',
    color: '#444',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    padding: '0 20px 20px',
  },
  editBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#222',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '10px 16px',
    backgroundColor: '#fff',
    color: '#FF385C',
    border: '1px solid #FF385C',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  error: {
    color: '#FF385C',
  },
};

export default Listings;
