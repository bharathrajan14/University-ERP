import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const navStyle = ({ isActive }) => ({
    marginRight: '1rem',
    textDecoration: 'none',
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? '#646cff' : '#213547'
  });

  return (
    <header style={{ padding: '1rem 2rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0 }}>University ERP</h2>
      <nav>
        <NavLink to="/" style={navStyle}>Home</NavLink>
        <NavLink to="/about" style={navStyle}>About</NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
