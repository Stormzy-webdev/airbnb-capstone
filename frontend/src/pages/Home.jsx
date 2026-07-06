// Home page — shows all listings, handles search/filter by location, and displays the static sections below

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Static data for the extra sections
const destinations = [
  { name: 'Cape Town', country: 'South Africa', image: 'capetown-inspo.jpg' },
  { name: 'Johannesburg', country: 'South Africa', image: 'joburg-inspo.jpg' },
  { name: 'Durban', country: 'South Africa', image: 'durban-inspo.jpg' },
  { name: 'Pretoria', country: 'South Africa', image: 'pretoria-inspo.jpg' },
  { name: 'Knysna', country: 'South Africa', image: 'knysna-inspo.jpg' },
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
  const [locations, setLocations] = useState([]);
  const [superhostHover, setSuperhostHover] = useState(false);
  const [expLeftHover, setExpLeftHover] = useState(false);
  const [expRightHover, setExpRightHover] = useState(false);
  const [flexibleHover, setFlexibleHover] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/api/accommodations`)
      .then(({ data }) => {
        const unique = [...new Set(data.map((l) => l.location).filter(Boolean))];
        setLocations(unique);
      })
      .catch(() => {});
  }, []);

  const handleSearch = (query) => {
    navigate(`/listings${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  };

  return (
    <div>
      {/* Black background section covers header + hero card */}
      <div style={styles.heroSection}>
        <Header onSearch={handleSearch} locations={locations} transparent={true} />
        <div style={styles.heroCenterWrapper}>
          <div style={styles.hero}>
            <div style={styles.heroOverlay} />
            <div style={styles.heroContent}>
              <h1 style={styles.heroTitle}>Find your next stay</h1>
              <p style={styles.heroSubtitle}>
                Discover unique homes, apartments and experiences around the world.
              </p>
            </div>
            <button
              style={{
                ...styles.superhostBtn,
                position: 'absolute',
                bottom: '78px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderRadius: '50px',
                backgroundColor: flexibleHover ? '#7B2D8B' : '#fff',
                color: flexibleHover ? '#fff' : '#222',
              }}
              onMouseEnter={() => setFlexibleHover(true)}
              onMouseLeave={() => setFlexibleHover(false)}
            >
              I'm flexible
            </button>
          </div>
        </div>
      </div>

      <div style={styles.page}>

        {/* Inspiration section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Inspiration for your next trip</h2>
          <div style={styles.destinationGrid}>
            {destinations.map((d) => (
              <div key={d.name} style={styles.destinationCard}>
                <div
                  style={{
                    ...styles.destImageBox,
                    backgroundImage: `url(${API_URL}/images/${encodeURIComponent(d.image)})`,
                  }}
                />
                <div style={styles.destInfo}>
                  <p style={styles.destName}>{d.name}</p>
                  <p style={styles.destCountry}>{d.country}</p>
                </div>
              </div>
            ))}
          </div>
        </section>



        {/* Experiences section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Discover Airbnb Experiences</h2>
          <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            <img
              src={`${API_URL}/images/discover-airbnb-experiences.png`}
              alt="Discover Airbnb Experiences"
              style={styles.experiencesImage}
            />
            <button
              style={{ ...styles.superhostBtn, top: '321px', bottom: 'auto', left: '80px', padding: '28px 54px', fontSize: '22px', backgroundColor: expLeftHover ? '#7B2D8B' : '#fff', color: expLeftHover ? '#fff' : '#222' }}
              onMouseEnter={() => setExpLeftHover(true)}
              onMouseLeave={() => setExpLeftHover(false)}
            >
              Experiences
            </button>
            <button
              style={{ ...styles.superhostBtn, top: '321px', bottom: 'auto', left: 'auto', right: '475px', padding: '28px 54px', fontSize: '22px', backgroundColor: expRightHover ? '#7B2D8B' : '#fff', color: expRightHover ? '#fff' : '#222' }}
              onMouseEnter={() => setExpRightHover(true)}
              onMouseLeave={() => setExpRightHover(false)}
            >
              Online Experiences
            </button>
          </div>
        </section>



        {/* Hosting section */}
        <section style={styles.section}>
          <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            <img
              src={`${API_URL}/images/hosting-image.png`}
              alt="Hosting"
              style={styles.experiencesImage}
            />
            <button
              style={{
                ...styles.superhostBtn,
                bottom: '113px',
                left: '80px',
                padding: '28px 54px',
                fontSize: '22px',
                backgroundColor: superhostHover ? '#7B2D8B' : '#fff',
                color: superhostHover ? '#fff' : '#222',
              }}
              onMouseEnter={() => setSuperhostHover(true)}
              onMouseLeave={() => setSuperhostHover(false)}
            >
              Ask a Superhost
            </button>
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
  },
  heroSection: {
    width: '100%',
    minHeight: '100vh',
    backgroundImage: `url(${API_URL}/images/black-image.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  heroCenterWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  hero: {
    width: '90%',
    height: '70vh',
    margin: '32px auto',
    borderRadius: '24px',
    backgroundImage: `url(${API_URL}/images/hero-image.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  heroContent: {
    position: 'relative',
    textAlign: 'center',
    color: '#fff',
    padding: '0 24px',
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: '800',
    marginBottom: '16px',
    color: '#fff',
    textShadow: '0 2px 12px rgba(0,0,0,0.3)',
  },
  heroSubtitle: {
    fontSize: '20px',
    color: 'rgba(255,255,255,0.9)',
    textShadow: '0 1px 6px rgba(0,0,0,0.3)',
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
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '16px',
    marginTop: '24px',
  },
  destinationCard: {
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  destImageBox: {
    height: '180px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  destInfo: {
    backgroundColor: '#FF5A5F',
    padding: '12px 16px',
  },
  destName: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '2px',
  },
  destCountry: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.85)',
  },

  superhostBtn: {
    position: 'absolute',
    bottom: '65px',
    left: '60px',
    backgroundColor: '#fff',
    color: '#222',
    border: 'none',
    borderRadius: '8px',
    padding: '20px 36px',
    fontSize: '17px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  experiencesImage: {
    width: '100%',
    borderRadius: '16px',
    marginTop: '16px',
    display: 'block',
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
    borderRadius: '16px',
    padding: '48px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundImage: `url(${API_URL}/images/gift-cards-image.png)`,
    backgroundSize: '40%',
    backgroundPosition: 'right center',
    backgroundRepeat: 'no-repeat',
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
