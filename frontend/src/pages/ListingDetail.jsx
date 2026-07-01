import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Reservation form state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [reserving, setReserving] = useState(false);
  const [reserveError, setReserveError] = useState('');
  const [reserveSuccess, setReserveSuccess] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/accommodations/${id}`)
      .then(({ data }) => setListing(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // Calculate number of nights between check-in and check-out
  const getNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    const nights = Math.floor(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  // Calculate total cost breakdown
  const nights = getNights();
  const baseTotal = listing ? listing.price * nights : 0;
  const cleaning = listing ? listing.cleaningFee || 0 : 0;
  const service = listing ? listing.serviceFee || 0 : 0;
  const taxes = listing ? listing.occupancyTaxes || 0 : 0;
  const grandTotal = baseTotal + cleaning + service + taxes;

  const handleReserve = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!checkIn || !checkOut || nights === 0) {
      setReserveError('Please select valid check-in and check-out dates');
      return;
    }
    try {
      setReserving(true);
      setReserveError('');
      await axios.post(
        'http://localhost:5000/api/reservations',
        {
          accommodation: listing._id,
          checkIn,
          checkOut,
          guests: Number(guests),
          totalPrice: grandTotal,
          host_id: listing.host_id,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setReserveSuccess(true);
    } catch (err) {
      setReserveError(err.response?.data?.message || 'Reservation failed');
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <p style={{ padding: '40px', color: '#717171' }}>Loading...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div>
        <Header />
        <p style={{ padding: '40px', color: '#FF385C' }}>Listing not found.</p>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div style={styles.page}>
        {/* Title */}
        <h1 style={styles.title}>{listing.title}</h1>
        <p style={styles.meta}>{listing.type} · {listing.location}</p>

        {/* Image gallery */}
        <div style={styles.gallery}>
          <div style={styles.mainImageBox}>
            {listing.images && listing.images.length > 0 ? (
              <img
                src={listing.images[activeImage]}
                alt={listing.title}
                style={styles.mainImage}
              />
            ) : (
              <div style={styles.noImage}>No photos available</div>
            )}
          </div>

          {listing.images && listing.images.length > 1 && (
            <div style={styles.thumbnails}>
              {listing.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  style={{
                    ...styles.thumbnail,
                    border: i === activeImage ? '3px solid #FF385C' : '3px solid transparent',
                  }}
                  onClick={() => setActiveImage(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Main content + booking card side by side */}
        <div style={styles.contentRow}>
          {/* Left: details */}
          <div style={styles.details}>
            <h2 style={styles.sectionHeading}>
              {listing.guests} guests · {listing.bedrooms} bedrooms · {listing.bathrooms} bathrooms
            </h2>

            <hr style={styles.divider} />

            {/* Badges */}
            <div style={styles.badges}>
              {listing.selfCheckIn && (
                <div style={styles.badge}>
                  <span style={styles.badgeIcon}>🔑</span>
                  <div>
                    <p style={styles.badgeTitle}>Self check-in</p>
                    <p style={styles.badgeSub}>Check yourself in with the lockbox.</p>
                  </div>
                </div>
              )}
              {listing.enhancedCleaning && (
                <div style={styles.badge}>
                  <span style={styles.badgeIcon}>✨</span>
                  <div>
                    <p style={styles.badgeTitle}>Enhanced cleaning</p>
                    <p style={styles.badgeSub}>This host follows Airbnb's 5-step cleaning process.</p>
                  </div>
                </div>
              )}
            </div>

            <hr style={styles.divider} />

            <h3 style={styles.subHeading}>About this place</h3>
            <p style={styles.description}>{listing.description}</p>

            <hr style={styles.divider} />

            <h3 style={styles.subHeading}>What this place offers</h3>
            <div style={styles.amenitiesGrid}>
              {listing.amenities && listing.amenities.length > 0 ? (
                listing.amenities.map((a, i) => (
                  <div key={i} style={styles.amenityItem}>✓ {a}</div>
                ))
              ) : (
                <p style={{ color: '#717171' }}>No amenities listed.</p>
              )}
            </div>
          </div>

          {/* Right: booking card */}
          <div style={styles.bookingCard}>
            <p style={styles.priceDisplay}>
              <strong style={{ fontSize: '22px' }}>${listing.price}</strong> / night
            </p>

            {reserveSuccess ? (
              <div style={styles.successBox}>
                <p style={{ fontWeight: '600', marginBottom: '4px' }}>Reservation confirmed!</p>
                <p style={{ fontSize: '14px', color: '#717171' }}>
                  Your stay has been booked successfully.
                </p>
                <button style={styles.successBtn} onClick={() => navigate('/')}>
                  Back to listings
                </button>
              </div>
            ) : (
              <>
                <div style={styles.dateRow}>
                  <div style={styles.dateField}>
                    <label style={styles.dateLabel}>CHECK-IN</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      style={styles.dateInput}
                    />
                  </div>
                  <div style={styles.dateField}>
                    <label style={styles.dateLabel}>CHECK-OUT</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      style={styles.dateInput}
                    />
                  </div>
                </div>

                <div style={styles.guestsField}>
                  <label style={styles.dateLabel}>GUESTS</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    style={styles.dateInput}
                  >
                    {Array.from({ length: listing.guests }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                {reserveError && <p style={styles.reserveError}>{reserveError}</p>}

                <button
                  style={styles.reserveBtn}
                  onClick={handleReserve}
                  disabled={reserving}
                >
                  {reserving ? 'Reserving...' : user ? 'Reserve' : 'Log in to reserve'}
                </button>

                {/* Cost breakdown — only show if dates are selected */}
                {nights > 0 && (
                  <div style={styles.priceBreakdown}>
                    <div style={styles.priceRow}>
                      <span>${listing.price} × {nights} night{nights > 1 ? 's' : ''}</span>
                      <span>${baseTotal}</span>
                    </div>
                    {cleaning > 0 && (
                      <div style={styles.priceRow}>
                        <span>Cleaning fee</span>
                        <span>${cleaning}</span>
                      </div>
                    )}
                    {service > 0 && (
                      <div style={styles.priceRow}>
                        <span>Service fee</span>
                        <span>${service}</span>
                      </div>
                    )}
                    {taxes > 0 && (
                      <div style={styles.priceRow}>
                        <span>Occupancy taxes</span>
                        <span>${taxes}</span>
                      </div>
                    )}
                    <hr style={styles.divider} />
                    <div style={{ ...styles.priceRow, fontWeight: '700' }}>
                      <span>Total</span>
                      <span>${grandTotal}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '24px 40px 60px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#222',
    marginBottom: '6px',
  },
  meta: {
    fontSize: '15px',
    color: '#717171',
    marginBottom: '24px',
  },
  gallery: {
    marginBottom: '32px',
  },
  mainImageBox: {
    width: '100%',
    height: '400px',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    marginBottom: '12px',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImage: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#aaa',
    fontSize: '16px',
  },
  thumbnails: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
  },
  thumbnail: {
    width: '80px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '8px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  contentRow: {
    display: 'flex',
    gap: '48px',
    alignItems: 'flex-start',
  },
  details: {
    flex: 1,
  },
  sectionHeading: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#222',
    marginBottom: '16px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #ebebeb',
    margin: '24px 0',
  },
  badges: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  badge: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  badgeIcon: {
    fontSize: '24px',
    flexShrink: 0,
  },
  badgeTitle: {
    fontWeight: '600',
    fontSize: '15px',
    color: '#222',
    marginBottom: '2px',
  },
  badgeSub: {
    fontSize: '14px',
    color: '#717171',
  },
  subHeading: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#222',
    marginBottom: '12px',
  },
  description: {
    fontSize: '15px',
    color: '#444',
    lineHeight: '1.6',
  },
  amenitiesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  amenityItem: {
    fontSize: '15px',
    color: '#222',
  },
  bookingCard: {
    width: '360px',
    flexShrink: 0,
    border: '1px solid #ddd',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: '100px',
  },
  priceDisplay: {
    fontSize: '16px',
    color: '#222',
    marginBottom: '16px',
  },
  dateRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '0',
  },
  dateField: {
    padding: '10px 12px',
    borderRight: '1px solid #ddd',
  },
  dateLabel: {
    display: 'block',
    fontSize: '10px',
    fontWeight: '700',
    color: '#222',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  dateInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#222',
    backgroundColor: 'transparent',
  },
  guestsField: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginTop: '8px',
    marginBottom: '16px',
  },
  reserveBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#FF385C',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '16px',
  },
  reserveError: {
    color: '#FF385C',
    fontSize: '13px',
    marginBottom: '8px',
  },
  priceBreakdown: {
    marginTop: '8px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '15px',
    color: '#222',
    marginBottom: '10px',
  },
  successBox: {
    backgroundColor: '#f0fff4',
    border: '1px solid #b2dfdb',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
    color: '#222',
  },
  successBtn: {
    marginTop: '12px',
    padding: '10px 20px',
    backgroundColor: '#FF385C',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default ListingDetail;
