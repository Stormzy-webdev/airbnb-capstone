// In-app confirmation dialog — replaces window.confirm() so there's no browser-native popup/title

const ConfirmModal = ({ open, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.card} onClick={(e) => e.stopPropagation()}>
        <p style={styles.message}>{message}</p>
        <div style={styles.buttons}>
          <button style={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button style={styles.confirmBtn} onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '28px',
    width: '100%',
    maxWidth: '360px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  message: {
    fontSize: '16px',
    color: '#222',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#fff',
    color: '#222',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  confirmBtn: {
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

export default ConfirmModal;
