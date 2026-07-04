import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const query = searchParams.get('q') || '';

  useEffect(() => {
    axios.get(`${API_URL}/api/accommodations`)
      .then(({ data }) => {
        setListings(data);
        const unique = [...new Set(data.map((l) => l.location).filter(Boolean))];
        setLocations(unique);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = query
    ? listings.filter((l) =>
        l.title.toLowerCase().includes(query.toLowerCase()) ||
        l.location.toLowerCase().includes(query.toLowerCase()) ||
        l.type.toLowerCase().includes(query.toLowerCase())
      )
    : listings;

  const handleSearch = (q) => {
    setSearchParams(q ? { q } : {});
  };

  return (
    <div>
      <Header onSearch={handleSearch} locations={locations} />
      <div style={styles.page}>
        <h2 style={styles.sectionTitle}>
          {query ? `Results for "${query}"` : 'All Listings'}
        </h2>

        {loading && <p style={styles.statusText}>Loading listings...</p>}

        {!loading && filtered.length === 0 && (
          <p style={styles.statusText}>No listings found.</p>
        )}

        <div style={styles.grid}>
          {filtered.map((listing) => (
            <div
              key={listing._id}
              style={styles.card}
              onClick={() => navigate(`/listing/${listing._id}`)}
            >
              <div style={styles.imageBox}>
                {listing.images && listing.images.length > 0 ? (
                  <img src={listing.images[0]} alt={listing.title} style={styles.image} />
                ) : (
                  <div style={styles.noImage}>No photo</div>
                )}
              </div>
              <div style={styles.cardBody}>
                <div>
                  <p style={styles.cardTitle}>{listing.title}</p>
                  <p style={styles.location}>{listing.location}</p>
                  <p style={styles.type}>{listing.type}</p>
                  {listing.rating && <p style={styles.rating}>★ {listing.rating}</p>}
                </div>
                <div style={styles.cardFooter}>
                  <p style={styles.price}><strong>${listing.price}</strong> / night</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '32px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#222',
    marginBottom: '24px',
  },
  statusText: {
    color: '#717171',
    fontSize: '16px',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    width: '1100px',
  },
  imageBox: {
    width: '200px',
    flexShrink: 0,
    height: '180px',
    backgroundColor: '#f7f7f7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
  },
  image: {
    width: '160px',
    height: '140px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  noImage: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#aaa',
    fontSize: '14px',
  },
  cardBody: {
    flex: 1,
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#222',
    marginBottom: '6px',
  },
  location: {
    fontSize: '14px',
    color: '#717171',
    marginBottom: '4px',
  },
  type: {
    fontSize: '14px',
    color: '#717171',
    marginBottom: '4px',
  },
  rating: {
    fontSize: '14px',
    color: '#222',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  price: {
    fontSize: '15px',
    color: '#222',
  },
};

export default SearchResults;
