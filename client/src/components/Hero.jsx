import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

const modules = [
  { icon: '🎓', label: 'Students',   sub: '1,200+ enrolled'  },
  { icon: '📚', label: 'Courses',    sub: '300+ active'      },
  { icon: '👨‍🏫', label: 'Faculty',    sub: '180+ members'     },
];

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.textContent}>
          <p className={styles.eyebrow} aria-label="For students, faculty, and administration">
            <span>Students</span>
            <span className={styles.dot} aria-hidden="true">·</span>
            <span>Faculty</span>
            <span className={styles.dot} aria-hidden="true">·</span>
            <span>Administration</span>
          </p>

          <h1 className={styles.headline}>
            One System.<br />
            <em>Every Campus</em><br />
            Operation.
          </h1>

          <p className={styles.subtext}>
            A unified platform for managing students, courses,
            faculty, and departments — built for universities that
            run on precision.
          </p>

          <div className={styles.actions}>
            <Link to="/login" className={styles.btnPrimary}>
              Log In to Portal
            </Link>
            <Link to="/register" className={styles.btnSecondary}>
              Create Account →
            </Link>
          </div>

          <div className={styles.trustBadge}>
            <span className={styles.trustDot} aria-hidden="true" />
            <span>System is live · Secure portal · 24/7 access</span>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.ring} />
          <div className={styles.ring} />
          <div className={styles.ring} />
          <div className={styles.ringCenter}>🏛</div>

          {modules.map((mod) => (
            <div key={mod.label} className={styles.moduleCard}>
              <span className={styles.moduleIcon}>{mod.icon}</span>
              <div>
                <div className={styles.moduleLabel}>{mod.label}</div>
                <div className={styles.moduleSub}>{mod.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
