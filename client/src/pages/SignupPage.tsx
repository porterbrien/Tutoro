import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function SignupPage() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    f_name: '', l_name: '', phone_num: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    if (!fields.f_name || !fields.l_name || !fields.phone_num || !fields.password) {
      setError('All fields are required'); return;
    }
    if (fields.phone_num.length !== 10) {
      setError('Phone number must be 10 digits'); return;
    }
    if (fields.password !== fields.confirmPassword) {
      setError('Passwords do not match'); return;
    }
    if (fields.password.length < 8) {
      setError('Password must be at least 8 characters'); return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, role: 'client' }),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.error || 'Registration failed'); return; }
      navigate('/login', { state: { message: 'Account created! Please sign in.' } });
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
          --rose: #c97384; --rose-light: #f0d4da; --rose-dark: #a85868;
          --teal: #73C9B8; --teal-light: #d4f0eb; --teal-dark: #4fa898;
          --white: #fdfcfb; --dark: #1a1a2e; --gray: #6b7280;
        }
        .auth-input {
          width: 100%; padding: 0.85rem 1rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
          border: 1.5px solid rgba(0,0,0,0.1); border-radius: 12px;
          background: white; color: var(--dark); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-input:focus {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px rgba(115,201,184,0.12);
        }
        .auth-input::placeholder { color: #aaa; }
        .auth-btn {
          width: 100%; padding: 0.95rem;
          font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 500;
          color: white; background: linear-gradient(135deg, var(--rose), var(--teal));
          border: none; border-radius: 12px; cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(201,115,132,0.25);
        }
        .auth-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(201,115,132,0.35);
        }
        .auth-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
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
        @media (max-width: 768px) {
          .left-panel { display: none !important; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Left panel */}
      <div className="left-panel" style={{
        flex: 1,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', width: '300px', height: '300px',
          background: 'rgba(115,201,184,0.15)', borderRadius: '50%',
          filter: 'blur(60px)', top: '-30px', right: '-30px',
        }} />
        <div style={{
          position: 'absolute', width: '250px', height: '250px',
          background: 'rgba(201,115,132,0.15)', borderRadius: '50%',
          filter: 'blur(60px)', bottom: '80px', left: '-20px',
        }} />

        <Link to="/" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.6rem', fontWeight: 600,
          color: 'white', textDecoration: 'none',
          position: 'relative', zIndex: 1,
        }}>
          Tutoro<span style={{ color: '#c97384', fontStyle: 'italic' }}>Health</span>
        </Link>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.5rem', fontWeight: 300,
            color: 'white', lineHeight: 1.3, marginBottom: '1rem',
          }}>
            "Your journey to <em style={{ color: '#c97384' }}>better</em><br />care starts here."
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: 300,
          }}>
            Join thousands of families trusting Tutoro Health.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
          {[
            { num: '24/7', label: 'Monitoring' },
            { num: '100%', label: 'Secure' },
            { num: '∞', label: 'Care' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '12px', padding: '0.8rem 1.2rem',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.4rem', color: 'white', fontWeight: 300,
              }}>{s.num}</div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)',
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '2rem',
        background: 'var(--white)', overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '420px', padding: '1rem 0' }}>
          <div className="animate" style={{ marginBottom: '2rem' }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.8rem', fontWeight: 300,
              color: 'var(--dark)', marginBottom: '0.5rem',
            }}>
              Create your <em style={{ color: '#73C9B8' }}>account</em>
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.95rem', color: 'var(--gray)', fontWeight: 300,
            }}>
              Join Tutoro Health today — it's free
            </p>
          </div>

          {error && (
            <div style={{
              background: 'var(--rose-light)', color: 'var(--rose-dark)',
              padding: '0.8rem 1rem', borderRadius: '10px',
              fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif",
              marginBottom: '1.5rem',
            }}>{error}</div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div className="animate delay-1 form-row">
              <div>
                <label style={{
                  display: 'block', fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.85rem', fontWeight: 500,
                  color: 'var(--dark)', marginBottom: '0.4rem',
                }}>First name</label>
                <input className="auth-input" type="text" placeholder="Jane"
                  value={fields.f_name} onChange={e => handleChange('f_name', e.target.value)} />
              </div>
              <div>
                <label style={{
                  display: 'block', fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.85rem', fontWeight: 500,
                  color: 'var(--dark)', marginBottom: '0.4rem',
                }}>Last name</label>
                <input className="auth-input" type="text" placeholder="Doe"
                  value={fields.l_name} onChange={e => handleChange('l_name', e.target.value)} />
              </div>
            </div>

            <div className="animate delay-2">
              <label style={{
                display: 'block', fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.85rem', fontWeight: 500,
                color: 'var(--dark)', marginBottom: '0.4rem',
              }}>Phone number</label>
              <input className="auth-input" type="text" placeholder="10-digit phone number"
                value={fields.phone_num} onChange={e => handleChange('phone_num', e.target.value)} />
            </div>

            <div className="animate delay-3">
              <label style={{
                display: 'block', fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.85rem', fontWeight: 500,
                color: 'var(--dark)', marginBottom: '0.4rem',
              }}>Password</label>
              <input className="auth-input" type="password" placeholder="Min 8 characters"
                value={fields.password} onChange={e => handleChange('password', e.target.value)} />
            </div>

            <div className="animate delay-4">
              <label style={{
                display: 'block', fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.85rem', fontWeight: 500,
                color: 'var(--dark)', marginBottom: '0.4rem',
              }}>Confirm password</label>
              <input className="auth-input" type="password" placeholder="Confirm your password"
                value={fields.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignup()} />
            </div>

            <div className="animate delay-5">
              <button className="auth-btn" onClick={handleSignup} disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>

            <p style={{
              textAlign: 'center', fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.9rem', color: 'var(--gray)',
            }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#c97384', textDecoration: 'none', fontWeight: 500 }}>
                Sign in
              </Link>
            </p>

            <p style={{ textAlign: 'center' }}>
              <Link to="/" style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.85rem', color: 'var(--gray)', textDecoration: 'none',
              }}>← Back to home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;