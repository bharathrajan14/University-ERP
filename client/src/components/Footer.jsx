const Footer = () => {
  return (
    <footer style={{ padding: '1rem 2rem', borderTop: '1px solid #eee', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
      <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
        &copy; {new Date().getFullYear()} University ERP System. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
