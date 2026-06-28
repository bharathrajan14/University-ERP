import PropTypes from 'prop-types';
import styles from '../../pages/Dashboard.module.css';

/**
 * FacultyDashboard Component
 * Teaching overview for Faculty members.
 * Displays metrics for My Classes, Students Assigned, Today's Schedule, and Assignments.
 */
const FacultyDashboard = ({ _user }) => {
  // Dummy faculty metrics data
  const stats = [
    {
      id: 'my-classes',
      label: 'My Classes',
      value: '4',
      subText: 'Active courses this term',
      icon: 'ti ti-notebook',
    },
    {
      id: 'students-assigned',
      label: 'Students Assigned',
      value: '142',
      subText: 'Across all sections',
      icon: 'ti ti-users',
    },
    {
      id: 'todays-schedule',
      label: "Today's Schedule",
      value: '3 Lectures',
      subText: 'Next class at 10:00 AM',
      icon: 'ti ti-calendar-event',
    },
    {
      id: 'assignments',
      label: 'Assignments',
      value: '28 Pending',
      subText: 'Requires grading & feedback',
      icon: 'ti ti-clipboard-list',
    },
  ];

  return (
    <div>
      {/* FACULTY STATS CARDS GRID */}
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

      {/* FACULTY CONTENT GRID */}
      <div className={styles.contentGrid}>
        {/* TODAY'S SCHEDULE & MY CLASSES */}
        <div className={styles.panel}>
          <div className={styles.panelTitle}>
            <i className="ti ti-clock" aria-hidden="true"></i> Today's Lecture Schedule & My Classes
          </div>

          <div className={styles.courseItem}>
            <div className={styles.courseIcon}>
              <i className="ti ti-code" aria-hidden="true"></i>
            </div>
            <div>
              <div className={styles.courseName}>CS-301: Data Structures & Algorithms</div>
              <div className={styles.courseCode}>Lecture Hall A • 10:00 AM - 11:30 AM</div>
            </div>
            <span className={`${styles.courseBadge} ${styles.badgeGreen}`}>Today</span>
          </div>

          <div className={styles.courseItem}>
            <div className={styles.courseIcon}>
              <i className="ti ti-database" aria-hidden="true"></i>
            </div>
            <div>
              <div className={styles.courseName}>CS-405: Advanced Database Systems</div>
              <div className={styles.courseCode}>Lab 3 • 01:30 PM - 03:00 PM</div>
            </div>
            <span className={`${styles.courseBadge} ${styles.badgeGreen}`}>Today</span>
          </div>

          <div className={styles.courseItem}>
            <div className={styles.courseIcon}>
              <i className="ti ti-world" aria-hidden="true"></i>
            </div>
            <div>
              <div className={styles.courseName}>CS-490: Web Engineering Lab</div>
              <div className={styles.courseCode}>Computer Center • 03:30 PM - 05:00 PM</div>
            </div>
            <span className={`${styles.courseBadge} ${styles.badgeGold}`}>Today</span>
          </div>
        </div>

        {/* ASSIGNMENTS & GRADING TASKS */}
        <div className={styles.panel}>
          <div className={styles.panelTitle}>
            <i className="ti ti-file-certificate" aria-hidden="true"></i> Coursework & Assignments Review
          </div>

          <div className={styles.activityItem}>
            <div className={styles.activityDot}></div>
            <div>
              <div className={styles.activityText}>
                <strong>CS-301 Assignment 2 (Binary Trees):</strong> 15 submissions ready for review.
              </div>
              <div className={styles.activityTime}>Due for grading by tomorrow</div>
            </div>
          </div>

          <div className={styles.activityItem}>
            <div className={styles.activityDot}></div>
            <div>
              <div className={styles.activityText}>
                <strong>CS-405 SQL Project Phase 1:</strong> 13 student teams submitted final repositories.
              </div>
              <div className={styles.activityTime}>Submitted 4 hours ago</div>
            </div>
          </div>

          <div className={styles.activityItem}>
            <div className={styles.activityDot}></div>
            <div>
              <div className={styles.activityText}>
                Mid-term grade submission portal opens on <strong>July 5th</strong>.
              </div>
              <div className={styles.activityTime}>Academic Announcement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FacultyDashboard.propTypes = {
  _user: PropTypes.object,
};

export default FacultyDashboard;
