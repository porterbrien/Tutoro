import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = (location.state as any)?.message;
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  if (!phone || !password) {
    setError('Please enter your phone number and password');
    return;
  }
  setLoading(true);
  setError('');
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_num: phone, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'Login failed');
      return;
    }
    // Redirect to verify page with userId and masked email
    navigate('/verify', {
      state: { userId: data.userId, email: data.email }
    });
  } catch {
    setError('Could not connect to server');
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --rose: #c97384;
          --rose-light: #f0d4da;
          --rose-dark: #a85868;
          --teal: #73C9B8;
          --teal-light: #d4f0eb;
          --teal-dark: #4fa898;
          --white: #fdfcfb;
          --dark: #1a1a2e;
          --gray: #6b7280;
        }
        .auth-input {
          width: 100%;
          padding: 0.85rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          border: 1.5px solid rgba(0,0,0,0.1);
          border-radius: 12px;
          background: white;
          color: var(--dark);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-input:focus {
          border-color: var(--rose);
          box-shadow: 0 0 0 3px rgba(201,115,132,0.12);
        }
        .auth-input::placeholder { color: #aaa; }
        .auth-btn {
          width: 100%;
          padding: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: white;
          background: var(--rose);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(201,115,132,0.3);
        }
        .auth-btn:hover:not(:disabled) {
          background: var(--rose-dark);
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(201,115,132,0.4);
        }
        .auth-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate { animation: slideUp 0.6s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }
      `}</style>

      {/* Left panel */}
      <div style={{
        flex: 1,
        background: `linear-gradient(135deg, var(--dark) 0%, #2d1b4e 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
      }}
        className="left-panel"
      >
        <style>{`
          @media (max-width: 768px) { .left-panel { display: none; } }
        `}</style>

        {/* Blobs */}
        <div style={{
          position: 'absolute', width: '350px', height: '350px',
          background: 'rgba(201,115,132,0.15)', borderRadius: '50%',
          filter: 'blur(60px)', top: '-50px', right: '-50px',
        }} />
        <div style={{
          position: 'absolute', width: '250px', height: '250px',
          background: 'rgba(115,201,184,0.15)', borderRadius: '50%',
          filter: 'blur(60px)', bottom: '100px', left: '-30px',
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.6rem',
            fontWeight: 600,
            color: 'white',
            textDecoration: 'none',
          }}>
            Tutoro<span style={{ color: '#c97384', fontStyle: 'italic' }}>Health</span>
          </Link>
        </div>

        {/* Center quote */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.5rem',
            fontWeight: 300,
            color: 'white',
            lineHeight: 1.3,
            marginBottom: '1rem',
          }}>
            "Care that <em style={{ color: '#73C9B8' }}>moves</em><br />with you."
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 300,
          }}>
            Connecting caregivers and clients seamlessly.
          </p>
        </div>

        {/* Bottom dots */}
        <div style={{ display: 'flex', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: i === 0 ? '24px' : '8px',
              height: '8px',
              borderRadius: '100px',
              background: i === 0 ? '#c97384' : 'rgba(255,255,255,0.2)',
            }} />
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--white)',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <div className="animate" style={{ marginBottom: '2.5rem' }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.8rem',
              fontWeight: 300,
              color: 'var(--dark)',
              marginBottom: '0.5rem',
            }}>
              Welcome <em style={{ color: '#c97384' }}>back</em>
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.95rem',
              color: 'var(--gray)',
              fontWeight: 300,
            }}>
              Sign in to your account to continue
            </p>
          </div>

          {successMessage && (
            <div className="animate" style={{
              background: 'var(--teal-light)',
              color: 'var(--teal-dark)',
              padding: '0.8rem 1rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: '1.5rem',
            }}>
              ✓ {successMessage}
            </div>
          )}

          {error && (
            <div style={{
              background: 'var(--rose-light)',
              color: 'var(--rose-dark)',
              padding: '0.8rem 1rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: '1.5rem',
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="animate delay-1">
              <label style={{
                display: 'block',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'var(--dark)',
                marginBottom: '0.5rem',
              }}>Phone number</label>
              <input
                className="auth-input"
                type="text"
                placeholder="10-digit phone number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div className="animate delay-2">
              <label style={{
                display: 'block',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'var(--dark)',
                marginBottom: '0.5rem',
              }}>Password</label>
              <input
                className="auth-input"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div className="animate delay-3">
              <button className="auth-btn" onClick={handleLogin} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <p className="animate delay-4" style={{
              textAlign: 'center',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.9rem',
              color: 'var(--gray)',
            }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#c97384', textDecoration: 'none', fontWeight: 500 }}>
                Create one
              </Link>
            </p>

            <p className="animate delay-5" style={{
              textAlign: 'center',
            }}>
              <Link to="/" style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.85rem',
                color: 'var(--gray)',
                textDecoration: 'none',
              }}>
                ← Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;