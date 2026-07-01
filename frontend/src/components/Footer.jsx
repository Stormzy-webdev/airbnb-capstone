const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.columns}>
          <div style={styles.column}>
            <h4 style={styles.heading}>Support</h4>
            <ul style={styles.list}>
              <li>Help Centre</li>
              <li>AirCover</li>
              <li>Anti-discrimination</li>
              <li>Disability support</li>
              <li>Cancellation options</li>
              <li>Report neighbourhood concern</li>
            </ul>
          </div>

          <div style={styles.column}>
            <h4 style={styles.heading}>Hosting</h4>
            <ul style={styles.list}>
              <li>Airbnb your home</li>
              <li>AirCover for Hosts</li>
              <li>Hosting resources</li>
              <li>Community forum</li>
              <li>Hosting responsibly</li>
              <li>Airbnb-friendly apartments</li>
            </ul>
          </div>

          <div style={styles.column}>
            <h4 style={styles.heading}>Airbnb</h4>
            <ul style={styles.list}>
              <li>Newsroom</li>
              <li>New features</li>
              <li>Careers</li>
              <li>Investors</li>
              <li>Gift cards</li>
              <li>Airbnb.org emergency stays</li>
            </ul>
          </div>
        </div>

        <hr style={styles.divider} />

        <div style={styles.bottom}>
          <p style={styles.copy}>© 2026 Airbnb, Inc. · Privacy · Terms · Sitemap</p>
          <div style={styles.socials}>
            <span style={styles.socialIcon}>f</span>
            <span style={styles.socialIcon}>t</span>
            <span style={styles.socialIcon}>in</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#f7f7f7',
    borderTop: '1px solid #ebebeb',
    marginTop: '60px',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '48px 40px 24px',
  },
  columns: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px',
    marginBottom: '32px',
  },
  column: {},
  heading: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#222',
    marginBottom: '16px',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #ebebeb',
    marginBottom: '24px',
  },
  bottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copy: {
    fontSize: '14px',
    color: '#717171',
  },
  socials: {
    display: 'flex',
    gap: '16px',
  },
  socialIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#222',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};

export default Footer;
