import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './Dashboard.module.css';
import Sidebar from '../components/Sidebar';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import FacultyDashboard from '../components/dashboard/FacultyDashboard';
import StudentDashboard from '../components/dashboard/StudentDashboard';

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
      } catch {
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

  const renderRoleDashboard = () => {
    const normalizedRole = user?.role?.toLowerCase();
    switch (normalizedRole) {
      case 'admin':
        return <AdminDashboard user={user} />;
      case 'faculty':
        return <FacultyDashboard user={user} />;
      case 'student':
        return <StudentDashboard user={user} />;
      default:
        return <StudentDashboard user={user} />;
    }
  };

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

      {/* DYNAMIC ROLE SIDEBAR */}
      <Sidebar user={user} onLogout={handleLogout} />

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

        {/* DYNAMIC ROLE-BASED DASHBOARD RENDERING */}
        {renderRoleDashboard()}
      </main>
    </div>
  );
};

export default Dashboard;
