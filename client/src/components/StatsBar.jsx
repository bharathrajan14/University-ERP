import styles from './StatsBar.module.css';

const STATS = [
  { value: '1,200+', label: 'Students Enrolled' },
  { value: '180+',   label: 'Faculty Members'   },
  { value: '12',     label: 'Departments'        },
  { value: '300+',   label: 'Courses Offered'    },
];

const StatsBar = () => {
  return (
    <section className={styles.statsBar} aria-label="University statistics">
      <div className={styles.inner}>
        {STATS.map(({ value, label }) => (
          <div key={label} className={styles.statItem}>
            <span className={styles.value}>{value}</span>
            <span className={styles.label}>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsBar;
