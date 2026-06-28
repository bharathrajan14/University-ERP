import { useEffect, useRef, useState } from 'react';
import styles from './StatsBar.module.css';

const STATS = [
  { value: 1200, suffix: '+', label: 'Students Enrolled',  icon: '🎓' },
  { value: 180,  suffix: '+', label: 'Faculty Members',    icon: '👨‍🏫' },
  { value: 12,   suffix: '',  label: 'Departments',        icon: '🏛'  },
  { value: 300,  suffix: '+', label: 'Courses Offered',    icon: '📚'  },
];

/** Animates a number from 0 to `end` over `duration` ms */
function useCountUp(end, duration = 1800, active = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, end, duration]);

  return count;
}

const StatItem = ({ value, suffix, label, icon, delay }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 1800, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.statItem} ${visible ? styles.visible : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className={styles.icon} aria-hidden="true">{icon}</span>
      <span className={styles.value}>
        {visible ? count.toLocaleString() : '0'}{suffix}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
};

const StatsBar = () => {
  return (
    <section className={styles.statsBar} aria-label="University statistics">
      <div className={styles.inner}>
        {STATS.map(({ value, suffix, label, icon }, i) => (
          <StatItem
            key={label}
            value={value}
            suffix={suffix}
            label={label}
            icon={icon}
            delay={i * 120}
          />
        ))}
      </div>
    </section>
  );
};

export default StatsBar;
