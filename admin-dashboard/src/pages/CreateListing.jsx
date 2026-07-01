// Form for adding a new listing — converts comma-separated amenities and images into arrays before saving

import { useState } from 'react';
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

  const [form, setForm] = useState({
    title: '',
    type: '',
    location: '',
    description: '',
    guests: '',
    bedrooms: '',
    bathrooms: '',
    price: '',
    weeklyDiscount: '',
    cleaningFee: '',
    serviceFee: '',
    occupancyTaxes: '',
    amenities: '',
    images: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
          weeklyDiscount: Number(form.weeklyDiscount) || 0,
          cleaningFee: Number(form.cleaningFee) || 0,
          serviceFee: Number(form.serviceFee) || 0,
          occupancyTaxes: Number(form.occupancyTaxes) || 0,
          amenities: form.amenities ? form.amenities.split(',').map((a) => a.trim()) : [],
          images: form.images ? form.images.split(',').map((i) => i.trim()) : [],
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
    <div>
      <Header />

      <div style={styles.page}>
        <h1 style={styles.title}>Create New Listing</h1>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <Field label="Title *" name="title" value={form.title} onChange={handleChange} />
            <Field label="Type *" name="type" value={form.type} onChange={handleChange} placeholder="e.g. Entire apartment" />
            <Field label="Location *" name="location" value={form.location} onChange={handleChange} />
            <Field label="Price per night ($) *" name="price" type="number" value={form.price} onChange={handleChange} />
            <Field label="Guests *" name="guests" type="number" value={form.guests} onChange={handleChange} />
            <Field label="Bedrooms *" name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} />
            <Field label="Bathrooms *" name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} />
            <Field label="Weekly Discount ($)" name="weeklyDiscount" type="number" value={form.weeklyDiscount} onChange={handleChange} />
            <Field label="Cleaning Fee ($)" name="cleaningFee" type="number" value={form.cleaningFee} onChange={handleChange} />
            <Field label="Service Fee ($)" name="serviceFee" type="number" value={form.serviceFee} onChange={handleChange} />
            <Field label="Occupancy Taxes ($)" name="occupancyTaxes" type="number" value={form.occupancyTaxes} onChange={handleChange} />
            <Field label="Amenities (comma separated)" name="amenities" value={form.amenities} onChange={handleChange} placeholder="wifi, kitchen, parking" />
            <Field label="Image URLs (comma separated)" name="images" value={form.images} onChange={handleChange} placeholder="https://..." />
          </div>

          <div style={styles.fullWidth}>
            <label style={styles.label}>Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              style={styles.textarea}
              placeholder="Describe the property..."
            />
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

// Small reusable input field component
const Field = ({ label, name, value, onChange, type = 'text', placeholder }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={styles.input}
    />
  </div>
);

const styles = {
  page: {
    padding: '32px 40px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  title: {
    fontSize: '26px',
    color: '#222',
    marginBottom: '24px',
  },
  form: {
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  fullWidth: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '24px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#444',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '15px',
  },
  textarea: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '15px',
    resize: 'vertical',
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
  error: {
    color: '#FF385C',
    backgroundColor: '#fff0f2',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
};

export default CreateListing;
