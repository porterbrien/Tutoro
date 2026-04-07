import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function VerifyPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { userId: number; email: string } | null;

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no state
  useEffect(() => {
    if (!state?.userId) navigate('/login');
  }, [state]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // numbers only
    const newCode = [...code];
    newCode[index] = value.slice(-1); // only last character
    setCode(newCode);

    // Auto advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all 6 digits entered
    if (newCode.every(d => d !== '') && value) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
      handleVerify(pasted);
    }
  };

  const handleVerify = async (codeStr?: string) => {
    const finalCode = codeStr || code.join('');
    if (finalCode.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: state?.userId, code: finalCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Verification failed');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }
      login(data.token, data.user);
      if (data.user.role === 'admin') navigate('/admin');
      else navigate('/client');
    } catch {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMessage('');
    try {
      const response = await fetch(`${API_URL}/api/auth/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: state?.userId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to resend code');
        return;
      }
      setResendMessage('New code sent!');
      setCountdown(60);
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch {
      setError('Could not connect to server');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --rose: #c97384; --rose-light: #f0d4da; --rose-dark: #a85868;
          --teal: #73C9B8; --teal-light: #d4f0eb; --teal-dark: #4fa898;
          --white: #fdfcfb; --dark: #1a1a2e; --gray: #6b7280;
        }
        .code-input {
          width: 52px; height: 60px;
          font-family: 'DM Sans', sans-serif; font-size: 1.5rem; font-weight: 500;
          text-align: center; color: var(--dark);
          border: 2px solid rgba(0,0,0,0.1); border-radius: 12px;
          background: white; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.1s;
          caret-color: var(--rose);
        }
        .code-input:focus {
          border-color: var(--rose);
          box-shadow: 0 0 0 3px rgba(201,115,132,0.12);
          transform: scale(1.05);
        }
        .code-input.filled {
          border-color: var(--teal);
          background: rgba(115,201,184,0.05);
        }
        .verify-btn {
          width: 100%; padding: 0.95rem;
          font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 500;
          color: white; background: var(--rose);
          border: none; border-radius: 12px; cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(201,115,132,0.3);
        }
        .verify-btn:hover:not(:disabled) {
          background: var(--rose-dark);
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(201,115,132,0.4);
        }
        .verify-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate { animation: slideUp 0.6s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .shake { animation: shake 0.4s ease; }
      `}</style>

      {/* Left panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '3rem',
        position: 'relative', overflow: 'hidden',
      }}
        className="left-panel"
      >
        <style>{`.left-panel { display: flex; } @media(max-width:768px){.left-panel{display:none!important;}}`}</style>
        <div style={{
          position: 'absolute', width: '350px', height: '350px',
          background: 'rgba(115,201,184,0.15)', borderRadius: '50%',
          filter: 'blur(60px)', top: '-50px', right: '-50px',
        }} />
        <div style={{
          position: 'absolute', width: '250px', height: '250px',
          background: 'rgba(201,115,132,0.15)', borderRadius: '50%',
          filter: 'blur(60px)', bottom: '100px', left: '-30px',
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
          {/* Shield icon */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '20px',
            background: 'rgba(115,201,184,0.15)',
            border: '1px solid rgba(115,201,184,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', marginBottom: '1.5rem',
          }}>🔐</div>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.5rem', fontWeight: 300,
            color: 'white', lineHeight: 1.3, marginBottom: '1rem',
          }}>
            "Your security is our <em style={{ color: '#73C9B8' }}>priority.</em>"
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: 300,
          }}>
            Two-factor authentication keeps your health data safe.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: i === 1 ? '24px' : '8px', height: '8px',
              borderRadius: '100px',
              background: i === 1 ? '#73C9B8' : 'rgba(255,255,255,0.2)',
            }} />
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '2rem',
        background: 'var(--white)',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <div className="animate" style={{ marginBottom: '2.5rem' }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.8rem', fontWeight: 300,
              color: 'var(--dark)', marginBottom: '0.5rem',
            }}>
              Check your <em style={{ color: '#73C9B8' }}>email</em>
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.95rem', color: 'var(--gray)', fontWeight: 300,
              lineHeight: 1.6,
            }}>
              We sent a 6-digit code to{' '}
              <strong style={{ color: 'var(--dark)' }}>{state?.email}</strong>.
              Enter it below to sign in.
            </p>
          </div>

          {error && (
            <div className="shake" style={{
              background: 'var(--rose-light)', color: 'var(--rose-dark)',
              padding: '0.8rem 1rem', borderRadius: '10px',
              fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif",
              marginBottom: '1.5rem',
            }}>{error}</div>
          )}

          {resendMessage && (
            <div style={{
              background: 'var(--teal-light)', color: 'var(--teal-dark)',
              padding: '0.8rem 1rem', borderRadius: '10px',
              fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif",
              marginBottom: '1.5rem',
            }}>✓ {resendMessage}</div>
          )}

          {/* Code inputs */}
          <div className="animate delay-1" style={{
            display: 'flex', gap: '0.6rem',
            justifyContent: 'center', marginBottom: '2rem',
          }}
            onPaste={handlePaste}
          >
            {code.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                className={`code-input ${digit ? 'filled' : ''}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleCodeChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
              />
            ))}
          </div>

          <div className="animate delay-2">
            <button
              className="verify-btn"
              onClick={() => handleVerify()}
              disabled={loading || code.some(d => !d)}
            >
              {loading ? 'Verifying...' : 'Verify code'}
            </button>
          </div>

          {/* Resend */}
          <div className="animate delay-3" style={{
            textAlign: 'center', marginTop: '1.5rem',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.9rem', color: 'var(--gray)',
          }}>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                style={{
                  background: 'none', border: 'none',
                  color: '#c97384', fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.9rem', fontWeight: 500,
                  cursor: 'pointer', padding: 0,
                }}
              >
                {resendLoading ? 'Sending...' : 'Resend code'}
              </button>
            ) : (
              <span>Resend code in <strong style={{ color: 'var(--dark)' }}>{countdown}s</strong></span>
            )}
          </div>

          <div className="animate delay-4" style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/login" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.85rem', color: 'var(--gray)', textDecoration: 'none',
            }}>← Back to sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyPage;