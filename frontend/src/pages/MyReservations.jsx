// Guest-facing page — view your own bookings and cancel them

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import ConfirmModal from '../components/ConfirmModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MyReservations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchReservations = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/reservations/user`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setReservations(data);
      } catch (err) {
        setError('Failed to load reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user, navigate]);

  const handleCancel = async () => {
    const id = cancelTarget;
    setCancelTarget(null);
    try {
      await axios.delete(`${API_URL}/api/reservations/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setReservations(reservations.filter((r) => r._id !== id));
    } catch (err) {
      setError('Failed to cancel reservation');
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <div>
      <Header />

      <div style={styles.page}>
        <h1 style={styles.title}>My Reservations</h1>

        {loading && <p style={styles.status}>Loading reservations...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && reservations.length === 0 && (
          <p style={styles.status}>You have no reservations yet.</p>
        )}

        {reservations.length > 0 && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Property</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Check In</th>
                  <th style={styles.th}>Check Out</th>
                  <th style={styles.th}>Guests</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r._id} style={styles.row}>
                    <td style={styles.td}>{r.accommodation?.title || 'N/A'}</td>
                    <td style={styles.td}>{r.accommodation?.location || 'N/A'}</td>
                    <td style={styles.td}>{formatDate(r.checkIn)}</td>
                    <td style={styles.td}>{formatDate(r.checkOut)}</td>
                    <td style={styles.td}>{r.guests}</td>
                    <td style={styles.td}>${r.totalPrice}</td>
                    <td style={styles.td}>
                      <button style={styles.cancelBtn} onClick={() => setCancelTarget(r._id)}>
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!cancelTarget}
        message="Are you sure you want to cancel this reservation?"
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
};

const styles = {
  page: {
    padding: '32px 40px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#222',
    marginBottom: '24px',
  },
  status: {
    color: '#717171',
    fontSize: '16px',
  },
  tableWrapper: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: '#f7f7f7',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#444',
    borderBottom: '1px solid #ebebeb',
  },
  row: {
    borderBottom: '1px solid #ebebeb',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#222',
  },
  cancelBtn: {
    padding: '6px 14px',
    backgroundColor: '#fff',
    color: '#FF385C',
    border: '1px solid #FF385C',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  error: {
    color: '#FF385C',
  },
};

export default MyReservations;
