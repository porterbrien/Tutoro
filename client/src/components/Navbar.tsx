import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .dash-nav {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1rem 2.5rem;
          background: rgba(253,252,251,0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(201,115,132,0.1);
          position: sticky; top: 0; z-index: 100;
        }
        .dash-nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem; font-weight: 600;
          color: #1a1a2e; text-decoration: none;
        }
        .dash-nav-logo span { color: #c97384; font-style: italic; }
        .dash-nav-right { display: flex; align-items: center; gap: 1rem; }
        .dash-role-badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem; font-weight: 500;
          padding: 0.3rem 0.8rem; border-radius: 100px;
          letter-spacing: 0.05em; text-transform: uppercase;
        }
        .dash-welcome {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; color: #6b7280; font-weight: 300;
        }
        .dash-logout-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem; font-weight: 500;
          padding: 0.5rem 1.2rem; border-radius: 100px;
          border: 1.5px solid rgba(201,115,132,0.3);
          background: transparent; color: #c97384;
          cursor: pointer; transition: all 0.2s;
        }
        .dash-logout-btn:hover {
          background: #c97384; color: white;
          border-color: #c97384;
        }
      `}</style>
      <nav className="dash-nav">
        <Link to="/" className="dash-nav-logo">
          Tutoro<span>Health</span>
        </Link>
        <div className="dash-nav-right">
          <span className="dash-welcome">Hello, {user?.f_name}</span>
          <span className="dash-role-badge" style={{
            background: user?.role === 'admin'
              ? 'rgba(201,115,132,0.12)' : 'rgba(115,201,184,0.12)',
            color: user?.role === 'admin' ? '#a85868' : '#4fa898',
          }}>
            {user?.role}
          </span>
          <button className="dash-logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;