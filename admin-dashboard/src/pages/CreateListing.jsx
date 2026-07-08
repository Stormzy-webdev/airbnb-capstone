import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CreateListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);

  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const fileInputRef = useRef(null);

  const readAsDataURL = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const dataUrls = await Promise.all(files.map(readAsDataURL));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...dataUrls] }));
  };

  const removePreview = (dataUrl) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((i) => i !== dataUrl) }));
  };

  const [form, setForm] = useState({
    title: '',
    type: '',
    location: '',
    description: '',
    guests: '',
    bedrooms: '',
    bathrooms: '',
    price: '',
    amenities: '',
    images: [],
    enhancedCleaning: false,
    selfCheckIn: false,
  });

  useEffect(() => {
    axios.get(`${API_URL}/api/accommodations`)
      .then(({ data }) => {
        const unique = [...new Set(data.map((l) => l.location).filter(Boolean))];
        setLocations(unique);
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { title, type, location, description, guests, bedrooms, bathrooms, price } = form;
    if (!title || !type || !location || !description || !guests || !bedrooms || !bathrooms || !price) {
      setError('Please fill in all required fields');
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/api/accommodations`,
        {
          ...form,
          guests: Number(form.guests),
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          price: Number(form.price),
          amenities: form.amenities ? form.amenities.split(',').map((a) => a.trim()) : [],
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Header />
      <div style={styles.page}>
        <h1 style={styles.pageTitle}>Create New Listing</h1>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.twoCol}>

            {/* LEFT COLUMN */}
            <div style={styles.col}>

              <div style={styles.field}>
                <label style={styles.label}>Listing Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Cozy Cape Town Apartment"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Location *</label>
                <select
                  name="location"
                  value={showCustomLocation ? 'other' : form.location}
                  onChange={(e) => {
                    if (e.target.value === 'other') {
                      setShowCustomLocation(true);
                      setForm({ ...form, location: '' });
                    } else {
                      setShowCustomLocation(false);
                      setForm({ ...form, location: e.target.value });
                    }
                  }}
                  style={styles.select}
                >
                  <option value="">Select a location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                  <option value="other">Other</option>
                </select>
                {showCustomLocation && (
                  <input
                    type="text"
                    placeholder="Enter new location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    style={{ ...styles.input, marginTop: '8px' }}
                  />
                )}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the property..."
                  style={styles.textarea}
                />
              </div>

              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="enhancedCleaning"
                    checked={form.enhancedCleaning}
                    onChange={handleChange}
                    style={styles.checkbox}
                  />
                  Enhanced Cleaning
                </label>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="selfCheckIn"
                    checked={form.selfCheckIn}
                    onChange={handleChange}
                    style={styles.checkbox}
                  />
                  Self Check-in
                </label>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Amenities (comma separated)</label>
                <input
                  type="text"
                  name="amenities"
                  value={form.amenities}
                  onChange={handleChange}
                  placeholder="wifi, kitchen, parking"
                  style={styles.input}
                />
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div style={styles.col}>

              <div style={styles.inlineRow}>
                <div style={{ ...styles.field, flex: 1 }}>
                  <label style={styles.label}>Price per night ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={{ ...styles.field, flex: 1 }}>
                  <label style={styles.label}>Type *</label>
                  <select name="type" value={form.type} onChange={handleChange} style={styles.select}>
                    <option value="">Select type</option>
                    <option value="Entire unit">Entire unit</option>
                    <option value="Room">Room</option>
                    <option value="Whole Villa">Whole Villa</option>
                  </select>
                </div>
              </div>

              <div style={styles.inlineRow}>
                <div style={{ ...styles.field, flex: 1 }}>
                  <label style={styles.label}>Guests *</label>
                  <input type="number" name="guests" value={form.guests} onChange={handleChange} style={styles.input} />
                </div>
                <div style={{ ...styles.field, flex: 1 }}>
                  <label style={styles.label}>Bedrooms *</label>
                  <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} style={styles.input} />
                </div>
                <div style={{ ...styles.field, flex: 1 }}>
                  <label style={styles.label}>Bathrooms *</label>
                  <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} style={styles.input} />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Photos</label>
                <div style={styles.uploadBox}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    style={styles.uploadBtn}
                    onClick={() => fileInputRef.current.click()}
                  >
                    + Upload Images
                  </button>

                  {form.images.length > 0 ? (
                    <div style={styles.previewGrid}>
                      {form.images.map((dataUrl, index) => (
                        <div key={index} style={styles.previewItem}>
                          <img src={dataUrl} alt="preview" style={styles.previewImg} />
                          <button
                            type="button"
                            style={styles.removeBtn}
                            onClick={() => removePreview(dataUrl)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={styles.uploadHint}>No images uploaded yet</p>
                  )}
                </div>
              </div>

            </div>
          </div>

          <div style={styles.buttons}>
            <button type="button" style={styles.cancelBtn} onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '32px 40px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  pageTitle: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#222',
    marginBottom: '24px',
  },
  form: {
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    marginBottom: '24px',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#222',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '15px',
    color: '#222',
    backgroundColor: '#fff',
    outline: 'none',
  },
  select: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '15px',
    color: '#222',
    backgroundColor: '#fff',
    outline: 'none',
    cursor: 'pointer',
  },
  textarea: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '15px',
    color: '#222',
    backgroundColor: '#fff',
    resize: 'vertical',
    outline: 'none',
  },
  checkboxRow: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#222',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: '#FF385C',
  },
  inlineRow: {
    display: 'flex',
    gap: '16px',
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '10px 24px',
    backgroundColor: '#fff',
    color: '#222',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '10px 24px',
    backgroundColor: '#FF385C',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  uploadBox: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#fafafa',
    minHeight: '160px',
    position: 'relative',
  },
  uploadBtn: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    padding: '8px 16px',
    backgroundColor: '#fff',
    color: '#222',
    border: '1px solid #d0d0d0',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  uploadHint: {
    color: '#aaa',
    fontSize: '14px',
    textAlign: 'center',
    marginTop: '48px',
  },
  previewGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '48px',
  },
  previewItem: {
    position: 'relative',
    width: '80px',
    height: '80px',
  },
  previewImg: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  removeBtn: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#FF385C',
    color: '#fff',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  },
  error: {
    color: '#FF385C',
    backgroundColor: '#fff0f2',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
};

export default CreateListing;
