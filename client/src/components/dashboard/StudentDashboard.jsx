import PropTypes from 'prop-types';
import styles from '../../pages/Dashboard.module.css';

/**
 * StudentDashboard Component
 * Student portal overview.
 * Displays metrics for Attendance, Courses, Fee Status, and Results.
 */
const StudentDashboard = ({ _user }) => {
  // Dummy student metrics data
  const stats = [
    {
      id: 'attendance',
      label: 'Attendance',
      value: '96%',
      subText: 'Above required 75% threshold',
      icon: 'ti ti-calendar-check',
    },
    {
      id: 'courses',
      label: 'Courses',
      value: '5 Enrolled',
      subText: '16 Credit hours active',
      icon: 'ti ti-books',
    },
    {
      id: 'fee-status',
      label: 'Fee Status',
      value: 'Paid',
      subText: 'Spring 2026 tuition cleared',
      icon: 'ti ti-receipt-tax',
    },
    {
      id: 'results',
      label: 'Results',
      value: '3.85 CGPA',
      subText: 'Semester 5 • Passed with Distinction',
      icon: 'ti ti-trophy',
    },
  ];

  return (
    <div>
      {/* STUDENT STATS CARDS GRID */}
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

      {/* STUDENT CONTENT GRID */}
      <div className={styles.contentGrid}>
        {/* ENROLLED COURSES & RESULTS OVERVIEW */}
        <div className={styles.panel}>
          <div className={styles.panelTitle}>
            <i className="ti ti-school" aria-hidden="true"></i> Registered Courses & Exam Results
          </div>

          <div className={styles.courseItem}>
            <div className={styles.courseIcon}>
              <i className="ti ti-code" aria-hidden="true"></i>
            </div>
            <div>
              <div className={styles.courseName}>CS-301: Data Structures & Algorithms</div>
              <div className={styles.courseCode}>Credits: 4 • Attendance: 98%</div>
            </div>
            <span className={`${styles.courseBadge} ${styles.badgeGreen}`}>Grade: A (4.0)</span>
          </div>

          <div className={styles.courseItem}>
            <div className={styles.courseIcon}>
              <i className="ti ti-cpu" aria-hidden="true"></i>
            </div>
            <div>
              <div className={styles.courseName}>CS-305: Computer Architecture</div>
              <div className={styles.courseCode}>Credits: 3 • Attendance: 94%</div>
            </div>
            <span className={`${styles.courseBadge} ${styles.badgeGreen}`}>Grade: A- (3.7)</span>
          </div>

          <div className={styles.courseItem}>
            <div className={styles.courseIcon}>
              <i className="ti ti-calculator" aria-hidden="true"></i>
            </div>
            <div>
              <div className={styles.courseName}>MATH-201: Discrete Mathematics</div>
              <div className={styles.courseCode}>Credits: 3 • Attendance: 95%</div>
            </div>
            <span className={`${styles.courseBadge} ${styles.badgeGold}`}>Grade: B+ (3.3)</span>
          </div>
        </div>

        {/* FEE ACCOUNTS & ANNOUNCEMENTS */}
        <div className={styles.panel}>
          <div className={styles.panelTitle}>
            <i className="ti ti-wallet" aria-hidden="true"></i> Fee Account & Academic Notices
          </div>

          <div className={styles.activityItem}>
            <div className={styles.activityDot}></div>
            <div>
              <div className={styles.activityText}>
                <strong>Spring 2026 Tuition Receipt:</strong> Receipt #REC-2026-8849 generated ($4,200 Paid).
              </div>
              <div className={styles.activityTime}>Transaction Verified</div>
            </div>
          </div>

          <div className={styles.activityItem}>
            <div className={styles.activityDot}></div>
            <div>
              <div className={styles.activityText}>
                Mid-Term exam schedule published for Department of Computer Science.
              </div>
              <div className={styles.activityTime}>Exams start July 12</div>
            </div>
          </div>

          <div className={styles.activityItem}>
            <div className={styles.activityDot}></div>
            <div>
              <div className={styles.activityText}>
                Library book renewal confirmed for <em>"Introduction to Algorithms, 4th Ed"</em>.
              </div>
              <div className={styles.activityTime}>2 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

StudentDashboard.propTypes = {
  _user: PropTypes.object,
};

export default StudentDashboard;
