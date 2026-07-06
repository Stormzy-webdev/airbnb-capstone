// Edit form for an existing listing — loads the current data, lets the host make changes, then saves them

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const UpdateListing = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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

  // Load the existing listing data when the page opens
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/accommodations/${id}`);
        setForm({
          title: data.title || '',
          type: data.type || '',
          location: data.location || '',
          description: data.description || '',
          guests: data.guests || '',
          bedrooms: data.bedrooms || '',
          bathrooms: data.bathrooms || '',
          price: data.price || '',
          weeklyDiscount: data.weeklyDiscount || '',
          cleaningFee: data.cleaningFee || '',
          serviceFee: data.serviceFee || '',
          occupancyTaxes: data.occupancyTaxes || '',
          amenities: data.amenities ? data.amenities.join(', ') : '',
          images: data.images ? data.images.join(', ') : '',
        });
      } catch (err) {
        setError('Failed to load listing');
      } finally {
        setFetching(false);
      }
    };

    fetchListing();
  }, [id]);

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
      await axios.put(
        `${API_URL}/api/accommodations/${id}`,
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
      setError(err.response?.data?.message || 'Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div><Header /><p style={{ padding: '40px' }}>Loading...</p></div>;

  return (
    <div>
      <Header />

      <div style={styles.page}>
        <h1 style={styles.title}>Edit Listing</h1>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <Field label="Title *" name="title" value={form.title} onChange={handleChange} />
            <Field label="Type *" name="type" value={form.type} onChange={handleChange} />
            <Field label="Location *" name="location" value={form.location} onChange={handleChange} />
            <Field label="Price per night ($) *" name="price" type="number" value={form.price} onChange={handleChange} />
            <Field label="Guests *" name="guests" type="number" value={form.guests} onChange={handleChange} />
            <Field label="Bedrooms *" name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} />
            <Field label="Bathrooms *" name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} />
            <Field label="Weekly Discount ($)" name="weeklyDiscount" type="number" value={form.weeklyDiscount} onChange={handleChange} />
            <Field label="Cleaning Fee ($)" name="cleaningFee" type="number" value={form.cleaningFee} onChange={handleChange} />
            <Field label="Service Fee ($)" name="serviceFee" type="number" value={form.serviceFee} onChange={handleChange} />
            <Field label="Occupancy Taxes ($)" name="occupancyTaxes" type="number" value={form.occupancyTaxes} onChange={handleChange} />
            <Field label="Amenities (comma separated)" name="amenities" value={form.amenities} onChange={handleChange} />
            <Field label="Image URLs (comma separated)" name="images" value={form.images} onChange={handleChange} />
          </div>

          <div style={styles.fullWidth}>
            <label style={styles.label}>Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              style={styles.textarea}
            />
          </div>

          <div style={styles.buttons}>
            <button type="button" style={styles.cancelBtn} onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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

export default UpdateListing;
