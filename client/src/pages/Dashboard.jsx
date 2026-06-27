import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await api.get('/auth/profile');
        if (res.data && res.data.success) {
          setUser(res.data.data);
          localStorage.setItem('user', JSON.stringify(res.data.data));
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading && !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
        <p>Loading your portal dashboard...</p>
      </div>
    );
  }

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'User';
  const roleDisplay = user?.role ? user.role.replace('_', ' ') : 'Student';
  const deptDisplay = user?.department || 'General Academic';
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className={styles.dashboardLayout}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.navbarBrand}>
          University <span>ERP</span>
        </div>
        <div className={styles.navUser}>
          <div className={styles.navAvatar}>{initials}</div>
          <div>
            <div className={styles.navName}>{user?.fullName || 'User'}</div>
            <div className={styles.navRole}>{roleDisplay}</div>
          </div>
          <button className={styles.btnLogout} onClick={handleLogout}>
            <i className="ti ti-logout" aria-hidden="true"></i> Logout
          </button>
        </div>
      </nav>

      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarUser}>
          <div className={styles.suName}>{user?.fullName || 'User'}</div>
          <div className={styles.suDept}>{deptDisplay}</div>
          <span className={styles.suBadge}>{roleDisplay}</span>
        </div>

        <div className={styles.sidebarSection}>
          <div className={styles.sidebarLabel}>Main</div>
          <button className={`${styles.navItem} ${styles.active}`}>
            <i className="ti ti-layout-dashboard" aria-hidden="true"></i> Dashboard
          </button>
          <button className={styles.navItem}>
            <i className="ti ti-calendar" aria-hidden="true"></i> Schedule
          </button>
          <button className={styles.navItem}>
            <i className="ti ti-book" aria-hidden="true"></i> Courses
          </button>
          <button className={styles.navItem}>
            <i className="ti ti-chart-bar" aria-hidden="true"></i> Grades
          </button>
        </div>

        <div className={styles.sidebarDivider}></div>

        <div className={styles.sidebarSection}>
          <div className={styles.sidebarLabel}>Account</div>
          <button className={styles.navItem}>
            <i className="ti ti-user" aria-hidden="true"></i> Profile
          </button>
          <button className={styles.navItem}>
            <i className="ti ti-settings" aria-hidden="true"></i> Settings
          </button>
          <button className={styles.navItem}>
            <i className="ti ti-bell" aria-hidden="true"></i> Notifications
          </button>
        </div>

        <div className={styles.sidebarDivider}></div>

        <div className={styles.sidebarSection}>
          <button className={styles.navItem} onClick={handleLogout} style={{ color: '#c0392b' }}>
            <i className="ti ti-logout" aria-hidden="true"></i> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.main}>
        <div className={styles.jwtBanner}>
          <i className="ti ti-shield-lock" aria-hidden="true"></i>
          <span>
            Protected by JWT — active session retrieved from Express backend (`/api/auth/profile`). Unauthorized requests redirect to login.
          </span>
        </div>

        {/* WELCOME */}
        <div className={styles.welcomeBanner}>
          <h1>
            Good day, <span>{firstName}</span>
          </h1>
          <p>Here's what's happening in your university portal today.</p>
          <div className={styles.welcomeMeta}>
            <div className={styles.metaChip}>
              <i className="ti ti-user" aria-hidden="true"></i> <span>{roleDisplay}</span>
            </div>
            <div className={styles.metaChip}>
              <i className="ti ti-building" aria-hidden="true"></i> <span>{deptDisplay}</span>
            </div>
            <div className={styles.metaChip}>
              <i className="ti ti-calendar" aria-hidden="true"></i> <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              <i className="ti ti-book" aria-hidden="true"></i> Courses
            </div>
            <div className={styles.statVal}>6</div>
            <div className={styles.statSub}>This semester</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              <i className="ti ti-clipboard-check" aria-hidden="true"></i> Assignments
            </div>
            <div className={styles.statVal}>3</div>
            <div className={styles.statSub}>Due this week</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              <i className="ti ti-chart-line" aria-hidden="true"></i> GPA
            </div>
            <div className={styles.statVal}>3.8</div>
            <div className={styles.statSub}>Current standing</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              <i className="ti ti-users" aria-hidden="true"></i> Credits
            </div>
            <div className={styles.statVal}>18</div>
            <div className={styles.statSub}>Enrolled this term</div>
          </div>
        </div>

        {/* CONTENT PANELS */}
        <div className={styles.contentGrid}>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>
              <i className="ti ti-clock" aria-hidden="true"></i> Recent activity
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityDot}></div>
              <div>
                <div className={styles.activityText}>Assignment submitted — Data Structures</div>
                <div className={styles.activityTime}>2 hours ago</div>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityDot}></div>
              <div>
                <div className={styles.activityText}>Grade posted — Calculus II: A−</div>
                <div className={styles.activityTime}>Yesterday</div>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityDot}></div>
              <div>
                <div className={styles.activityText}>New announcement in Operating Systems</div>
                <div className={styles.activityTime}>2 days ago</div>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityDot}></div>
              <div>
                <div className={styles.activityText}>Enrolled in Advanced Algorithms</div>
                <div className={styles.activityTime}>3 days ago</div>
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>
              <i className="ti ti-book-2" aria-hidden="true"></i> My courses
            </div>
            <div className={styles.courseItem}>
              <div className={styles.courseIcon}>
                <i className="ti ti-code" aria-hidden="true"></i>
              </div>
              <div>
                <div className={styles.courseName}>Data Structures</div>
                <div className={styles.courseCode}>CS301</div>
              </div>
              <span className={`${styles.courseBadge} ${styles.badgeGreen}`}>Active</span>
            </div>
            <div className={styles.courseItem}>
              <div className={styles.courseIcon}>
                <i className="ti ti-math" aria-hidden="true"></i>
              </div>
              <div>
                <div className={styles.courseName}>Calculus II</div>
                <div className={styles.courseCode}>MA201</div>
              </div>
              <span className={`${styles.courseBadge} ${styles.badgeGreen}`}>Active</span>
            </div>
            <div className={styles.courseItem}>
              <div className={styles.courseIcon}>
                <i className="ti ti-cpu" aria-hidden="true"></i>
              </div>
              <div>
                <div className={styles.courseName}>Operating Systems</div>
                <div className={styles.courseCode}>CS410</div>
              </div>
              <span className={`${styles.courseBadge} ${styles.badgeGold}`}>Pending</span>
            </div>
            <div className={styles.courseItem}>
              <div className={styles.courseIcon}>
                <i className="ti ti-network" aria-hidden="true"></i>
              </div>
              <div>
                <div className={styles.courseName}>Advanced Algorithms</div>
                <div className={styles.courseCode}>CS501</div>
              </div>
              <span className={`${styles.courseBadge} ${styles.badgeGreen}`}>Active</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
