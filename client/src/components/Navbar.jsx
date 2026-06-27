import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={closeMenu}>
          <span className={styles.brandIcon} aria-hidden="true">🏛</span>
          <span className={styles.brandText}>
            <span className={styles.brandAccent}>Uni</span>ERP
          </span>
        </Link>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="navActions"
        >
          <span />
          <span />
          <span />
        </button>

        <div
          id="navActions"
          className={`${styles.navActions} ${menuOpen ? styles.open : ''}`}
        >
          <Link
            to="/login"
            className={styles.btnLogin}
            onClick={closeMenu}
          >
            Log In
          </Link>

          <Link
            to="/register"
            className={styles.btnRegister}
            onClick={closeMenu}
          >
            Create Account
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
