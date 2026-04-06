import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#1e3a5f',
      color: 'white',
    }}>
      <h2 style={{ margin: 0 }}>Tutoro</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>Welcome, {user?.f_name}</span>
        <span style={{
          backgroundColor: user?.role === 'admin' ? '#e74c3c' : '#27ae60',
          padding: '2px 10px',
          borderRadius: '12px',
          fontSize: '0.8rem',
          textTransform: 'uppercase',
        }}>
          {user?.role}
        </span>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid white',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;