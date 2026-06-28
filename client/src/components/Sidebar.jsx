import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../pages/Dashboard.module.css';

/**
 * Sidebar Component
 * Dynamically renders role-based navigation links for Admin, Faculty, and Student users.
 */
const Sidebar = ({ user, onLogout }) => {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const normalizedRole = user?.role?.toLowerCase();
  const roleDisplay = user?.role ? user.role.replace('_', ' ') : 'Student';
  const deptDisplay = user?.department || 'General Academic';

  // Role-based menu configuration matrix
  const getMenuItems = () => {
    switch (normalizedRole) {
      case 'admin':
        return [
          { id: 'Dashboard', label: 'Dashboard', icon: 'ti ti-layout-dashboard' },
          { id: 'Students', label: 'Students', icon: 'ti ti-user-check' },
          { id: 'Faculty', label: 'Faculty', icon: 'ti ti-school' },
          { id: 'Departments', label: 'Departments', icon: 'ti ti-building' },
          { id: 'Courses', label: 'Courses', icon: 'ti ti-book' },
        ];
      case 'faculty':
        return [
          { id: 'Dashboard', label: 'Dashboard', icon: 'ti ti-layout-dashboard' },
          { id: 'Attendance', label: 'Attendance', icon: 'ti ti-calendar-event' },
          { id: 'Students', label: 'Students', icon: 'ti ti-users' },
          { id: 'Assignments', label: 'Assignments', icon: 'ti ti-clipboard-list' },
        ];
      case 'student':
      default:
        return [
          { id: 'Dashboard', label: 'Dashboard', icon: 'ti ti-layout-dashboard' },
          { id: 'Attendance', label: 'Attendance', icon: 'ti ti-calendar-check' },
          { id: 'Results', label: 'Results', icon: 'ti ti-trophy' },
          { id: 'Courses', label: 'Courses', icon: 'ti ti-books' },
          { id: 'Profile', label: 'Profile', icon: 'ti ti-user' },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className={styles.sidebar}>
      {/* USER HEADER IN SIDEBAR */}
      <div className={styles.sidebarUser}>
        <div className={styles.suName}>{user?.fullName || 'User'}</div>
        <div className={styles.suDept}>{deptDisplay}</div>
        <span className={styles.suBadge}>{roleDisplay}</span>
      </div>

      {/* DYNAMIC ROLE MENU ITEMS */}
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarLabel}>Navigation</div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeItem === item.id ? styles.active : ''}`}
            onClick={() => setActiveItem(item.id)}
          >
            <i className={item.icon} aria-hidden="true"></i> {item.label}
          </button>
        ))}
      </div>

      <div className={styles.sidebarDivider}></div>

      {/* LOGOUT ACTION */}
      <div className={styles.sidebarSection}>
        <button
          className={styles.navItem}
          onClick={onLogout}
          style={{ color: '#c0392b' }}
        >
          <i className="ti ti-logout" aria-hidden="true"></i> Logout
        </button>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired,
};

export default Sidebar;
