import PropTypes from 'prop-types';
import styles from '../../pages/Dashboard.module.css';

/**
 * AdminDashboard Component
 * Executive management overview for Admin users.
 * Displays metrics for Total Students, Total Faculty, Total Departments, and Total Courses.
 */
const AdminDashboard = ({ _user }) => {
  // Dummy metrics data (Backend connection avoided as requested)
  const stats = [
    {
      id: 'students',
      label: 'Total Students',
      value: '1,420',
      subText: '+45 enrolled this semester',
      icon: 'ti ti-users',
    },
    {
      id: 'faculty',
      label: 'Total Faculty',
      value: '88',
      subText: 'Across 12 departments',
      icon: 'ti ti-school',
    },
    {
      id: 'departments',
      label: 'Total Departments',
      value: '12',
      subText: '4 Academic divisions',
      icon: 'ti ti-building',
    },
    {
      id: 'courses',
      label: 'Total Courses',
      value: '145',
      subText: 'Active in 2026 catalogue',
      icon: 'ti ti-book',
    },
  ];

  return (
    <div>
      {/* EXECUTIVE STATS CARDS GRID */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.id} className={styles.statCard}>
            <div className={styles.statLabel}>
              <i className={stat.icon} aria-hidden="true"></i> {stat.label}
            </div>
            <div className={styles.statVal}>{stat.value}</div>
            <div className={styles.statSub}>{stat.subText}</div>
          </div>
        ))}
      </div>

      {/* ADMINISTRATIVE MANAGEMENT PANELS */}
      <div className={styles.contentGrid}>
        {/* QUICK MANAGEMENT MODULES */}
        <div className={styles.panel}>
          <div className={styles.panelTitle}>
            <i className="ti ti-settings" aria-hidden="true"></i> Administrative Control Center
          </div>

          <div className={styles.courseItem}>
            <div className={styles.courseIcon}>
              <i className="ti ti-user-plus" aria-hidden="true"></i>
            </div>
            <div>
              <div className={styles.courseName}>User Management & Roles</div>
              <div className={styles.courseCode}>Provision credentials for Students, Faculty & Admins</div>
            </div>
            <span className={`${styles.courseBadge} ${styles.badgeGold}`}>Manage</span>
          </div>

          <div className={styles.courseItem}>
            <div className={styles.courseIcon}>
              <i className="ti ti-building-community" aria-hidden="true"></i>
            </div>
            <div>
              <div className={styles.courseName}>Department Catalogues</div>
              <div className={styles.courseCode}>Assign department heads & allocate course subjects</div>
            </div>
            <span className={`${styles.courseBadge} ${styles.badgeGreen}`}>Active</span>
          </div>

          <div className={styles.courseItem}>
            <div className={styles.courseIcon}>
              <i className="ti ti-shield-lock" aria-hidden="true"></i>
            </div>
            <div>
              <div className={styles.courseName}>Security & JWT Audit Logs</div>
              <div className={styles.courseCode}>Monitor active sessions & system access control</div>
            </div>
            <span className={`${styles.courseBadge} ${styles.badgeGold}`}>Logs</span>
          </div>
        </div>

        {/* RECENT SYSTEM ACTIVITIES */}
        <div className={styles.panel}>
          <div className={styles.panelTitle}>
            <i className="ti ti-activity" aria-hidden="true"></i> System Events & Overview
          </div>

          <div className={styles.activityItem}>
            <div className={styles.activityDot}></div>
            <div>
              <div className={styles.activityText}>
                New academic department <strong>Data Science & AI</strong> registered.
              </div>
              <div className={styles.activityTime}>15 minutes ago</div>
            </div>
          </div>

          <div className={styles.activityItem}>
            <div className={styles.activityDot}></div>
            <div>
              <div className={styles.activityText}>
                Batch student enrollment approved for <strong>Semester 1 2026</strong>.
              </div>
              <div className={styles.activityTime}>1 hour ago</div>
            </div>
          </div>

          <div className={styles.activityItem}>
            <div className={styles.activityDot}></div>
            <div>
              <div className={styles.activityText}>
                Global permission matrix verified for all active <strong>Faculty</strong> profiles.
              </div>
              <div className={styles.activityTime}>Yesterday at 5:00 PM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

AdminDashboard.propTypes = {
  _user: PropTypes.object,
};

export default AdminDashboard;
