// Home page — shows all listings, handles search/filter by location, and displays the static sections below

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Static data for the extra sections
const destinations = [
  { name: 'Cape Town', country: 'South Africa', color: '#FFE8D6' },
  { name: 'Johannesburg', country: 'South Africa', color: '#D6EAF8' },
  { name: 'Durban', country: 'South Africa', color: '#D5F5E3' },
  { name: 'Pretoria', country: 'South Africa', color: '#F9EBEA' },
  { name: 'George', country: 'South Africa', color: '#EDE7F6' },
  { name: 'Knysna', country: 'South Africa', color: '#FFF9C4' },
  { name: 'Stellenbosch', country: 'South Africa', color: '#FCE4EC' },
  { name: 'Port Elizabeth', country: 'South Africa', color: '#E0F7FA' },
];

const experiences = [
  { title: 'Arts & writing', emoji: '🎨', bg: '#FFF3E0' },
  { title: 'Entertainment', emoji: '🎭', bg: '#F3E5F5' },
  { title: 'Food & drink', emoji: '🍷', bg: '#FCE4EC' },
  { title: 'Sports', emoji: '⚽', bg: '#E8F5E9' },
  { title: 'Tours', emoji: '🗺️', bg: '#E3F2FD' },
  { title: 'Wellness', emoji: '🧘', bg: '#F1F8E9' },
];

const getaways = [
  { label: 'Beach', desc: 'Sun, sand and sea', image: `${API_URL}/images/beach%20-inspo.jpg` },
  { label: 'Mountains', desc: 'Fresh air and views', image: `${API_URL}/images/mountains%20-%20inspo.jpg` },
  { label: 'City breaks', desc: 'Culture and nightlife', image: `${API_URL}/images/citybreaks%20-%20inspo.jpg` },
  { label: 'Countryside', desc: 'Peace and quiet', image: `${API_URL}/images/countrylife%20-%20inspo.jpg` },
];

const Home = () => {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/api/accommodations`)
      .then(({ data }) => {
        setListings(data);
        setFiltered(data);
        // Extract unique locations from listings
        const unique = [...new Set(data.map((l) => l.location).filter(Boolean))];
        setLocations(unique);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (query) => {
    const q = query.toLowerCase();
    const results = listings.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q)
    );
    setFiltered(results);
  };

  return (
    <div>
      <Header onSearch={handleSearch} locations={locations} />

      <div style={styles.page}>

        {/* Hero banner */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Find your next stay</h1>
          <p style={styles.heroSubtitle}>
            Discover unique homes, apartments and experiences around the world.
          </p>
        </div>

        {/* Listings grid */}
        <h2 style={styles.sectionTitle}>All Listings</h2>

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
                <div style={styles.cardTop}>
                  <p style={styles.location}>{listing.location}</p>
                  {listing.rating && <span style={styles.rating}>★ {listing.rating}</span>}
                </div>
                <p style={styles.cardTitle}>{listing.title}</p>
                <p style={styles.type}>{listing.type}</p>
                <p style={styles.price}><strong>${listing.price}</strong> / night</p>
              </div>
            </div>
          ))}
        </div>

        {/* Inspiration section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Inspiration for your next trip</h2>
          <div style={styles.destinationGrid}>
            {destinations.map((d) => (
              <div key={d.name} style={{ ...styles.destinationCard, backgroundColor: d.color }}>
                <p style={styles.destName}>{d.name}</p>
                <p style={styles.destCountry}>{d.country}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Experiences section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Experiences</h2>
          <p style={styles.sectionSub}>Book activities led by local hosts</p>
          <div style={styles.experienceRow}>
            {experiences.map((e) => (
              <div key={e.title} style={{ ...styles.experienceCard, backgroundColor: e.bg }}>
                <span style={styles.experienceEmoji}>{e.emoji}</span>
                <p style={styles.experienceTitle}>{e.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ShopAirbnb section */}
        <section style={styles.shopSection}>
          <div style={styles.shopContent}>
            <h2 style={styles.shopTitle}>Shop Airbnb</h2>
            <p style={styles.shopSub}>
              Discover and buy unique items from hosts around the world — handmade goods,
              local art, pantry staples and more.
            </p>
            <button style={styles.shopBtn}>Browse the shop</button>
          </div>
          <div style={styles.shopEmojis}>
            <span style={styles.shopEmoji}>🛍️</span>
            <span style={styles.shopEmoji}>🎁</span>
            <span style={styles.shopEmoji}>🏺</span>
          </div>
        </section>

        {/* Future getaways section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Plan your future getaways</h2>
          <p style={styles.sectionSub}>Dream, explore and save your favourite spots</p>
          <div style={styles.getawayRow}>
            {getaways.map((g) => (
              <div
                key={g.label}
                style={{
                  ...styles.getawayCard,
                  backgroundImage: g.image ? `url(${g.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {g.image && <div style={styles.getawayOverlay} />}
                {!g.image && <span style={styles.getawayEmoji}>{g.emoji}</span>}
                <p style={{ ...styles.getawayLabel, color: g.image ? '#fff' : '#222', position: 'relative' }}>{g.label}</p>
                <p style={{ ...styles.getawayDesc, color: g.image ? 'rgba(255,255,255,0.85)' : '#717171', position: 'relative' }}>{g.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
};

const styles = {
  page: {
    padding: '0 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  hero: {
    background: 'linear-gradient(135deg, #FF385C 0%, #ff6b35 100%)',
    borderRadius: '16px',
    padding: '60px 40px',
    margin: '32px 0',
    color: '#fff',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '42px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: '18px',
    opacity: 0.9,
  },
  section: {
    marginTop: '56px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#222',
    marginBottom: '8px',
  },
  sectionSub: {
    fontSize: '15px',
    color: '#717171',
    marginBottom: '24px',
  },
  statusText: {
    color: '#717171',
    fontSize: '16px',
  },

  // Listings
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    marginTop: '24px',
  },
  card: {
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  imageBox: {
    height: '220px',
    backgroundColor: '#f0f0f0',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  image: {
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
    fontSize: '14px',
  },
  cardBody: {
    padding: '12px 4px',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  location: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#222',
  },
  rating: {
    fontSize: '14px',
    color: '#222',
  },
  cardTitle: {
    fontSize: '14px',
    color: '#717171',
    marginBottom: '2px',
  },
  type: {
    fontSize: '14px',
    color: '#717171',
    marginBottom: '4px',
  },
  price: {
    fontSize: '14px',
    color: '#222',
  },

  // Inspiration
  destinationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginTop: '24px',
  },
  destinationCard: {
    borderRadius: '12px',
    padding: '24px 20px',
    cursor: 'pointer',
  },
  destName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#222',
    marginBottom: '4px',
  },
  destCountry: {
    fontSize: '14px',
    color: '#717171',
  },

  // Experiences
  experienceRow: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  experienceCard: {
    minWidth: '160px',
    borderRadius: '12px',
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  experienceEmoji: {
    fontSize: '32px',
  },
  experienceTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
  },

  // ShopAirbnb
  shopSection: {
    marginTop: '56px',
    backgroundColor: '#f7f7f7',
    borderRadius: '16px',
    padding: '48px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopContent: {
    maxWidth: '480px',
  },
  shopTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#222',
    marginBottom: '12px',
  },
  shopSub: {
    fontSize: '15px',
    color: '#717171',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  shopBtn: {
    padding: '12px 24px',
    backgroundColor: '#222',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  shopEmojis: {
    display: 'flex',
    gap: '16px',
  },
  shopEmoji: {
    fontSize: '48px',
  },

  // Getaways
  getawayRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginTop: '24px',
  },
  getawayCard: {
    border: '1px solid #ebebeb',
    borderRadius: '12px',
    padding: '24px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    minHeight: '160px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getawayOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 100%)',
  },
  getawayEmoji: {
    fontSize: '36px',
    display: 'block',
    marginBottom: '12px',
  },
  getawayLabel: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#222',
    marginBottom: '4px',
  },
  getawayDesc: {
    fontSize: '14px',
    color: '#717171',
  },
};

export default Home;
