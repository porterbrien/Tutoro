import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function ClientDashboard() {
  const { user, token } = useAuth();
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setStatusMessage('Geolocation is not supported by your browser');
      return;
    }
    setLocationStatus('loading');
    setStatusMessage('Locating you...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        try {
          await fetch(`${API_URL}/api/location`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ latitude, longitude }),
          });
          setLocationStatus('success');
          setStatusMessage('Location recorded successfully');
        } catch {
          setLocationStatus('error');
          setStatusMessage('Failed to send location to server');
        }
      },
      (error) => {
        setLocationStatus('error');
        setStatusMessage(`Location error: ${error.message}`);
      }
    );
  }, []);

  const statusColors = {
    idle: { bg: 'rgba(107,114,128,0.08)', color: '#6b7280', dot: '#6b7280' },
    loading: { bg: 'rgba(115,201,184,0.08)', color: '#4fa898', dot: '#73C9B8' },
    success: { bg: 'rgba(115,201,184,0.08)', color: '#4fa898', dot: '#73C9B8' },
    error: { bg: 'rgba(201,115,132,0.08)', color: '#a85868', dot: '#c97384' },
  };

  const sc = statusColors[locationStatus];

  return (
    <div style={{ minHeight: '100vh', background: '#fdfcfb' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        :root {
          --rose: #c97384; --rose-light: #f0d4da; --rose-dark: #a85868;
          --teal: #73C9B8; --teal-light: #d4f0eb; --teal-dark: #4fa898;
          --dark: #1a1a2e; --gray: #6b7280; --white: #fdfcfb;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
        .client-card {
          background: white; border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.06); padding: 2rem;
          animation: slideUp 0.5s ease both;
        }
        .client-card:nth-child(2) { animation-delay: 0.1s; }
        .client-card:nth-child(3) { animation-delay: 0.2s; }
        .info-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.8rem 0;
          border-bottom: 1px solid rgba(0,0,0,0.04);
        }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-size: 0.85rem; color: var(--gray); font-weight: 400; }
        .info-value { font-size: 0.95rem; color: var(--dark); font-weight: 500; }
      `}</style>

      <Navbar />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem', animation: 'slideUp 0.4s ease both' }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.5rem', fontWeight: 300, color: '#1a1a2e',
          }}>
            Hello, <em style={{ color: '#c97384' }}>{user?.f_name}</em>
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: 300, marginTop: '0.25rem' }}>
            Here's your care dashboard
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Profile card */}
          <div className="client-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(201,115,132,0.15), rgba(115,201,184,0.15))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.4rem', color: '#c97384', fontWeight: 600,
              }}>
                {user?.f_name?.[0]}
              </div>
              <div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.3rem', fontWeight: 600, color: '#1a1a2e',
                }}>My Profile</h2>
                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Your account information</p>
              </div>
            </div>

            <div>
              <div className="info-row">
                <span className="info-label">Name</span>
                <span className="info-value">{user?.f_name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Role</span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.8rem', fontWeight: 500,
                  padding: '0.25rem 0.7rem', borderRadius: '100px',
                  background: 'rgba(115,201,184,0.12)', color: '#4fa898',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Location card */}
          <div className="client-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'rgba(115,201,184,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem',
              }}>📍</div>
              <div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.3rem', fontWeight: 600, color: '#1a1a2e',
                }}>My Location</h2>
                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Real-time GPS tracking</p>
              </div>
            </div>

            {/* Status indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '1rem 1.2rem', borderRadius: '12px',
              background: sc.bg, marginBottom: coords ? '1.2rem' : '0',
            }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: sc.dot, flexShrink: 0,
                animation: locationStatus === 'loading' ? 'pulse 1.5s ease infinite' : 'none',
              }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.9rem', color: sc.color, fontWeight: 400,
              }}>{statusMessage}</span>
            </div>

            {coords && (
              <div>
                <div className="info-row">
                  <span className="info-label">Latitude</span>
                  <span className="info-value" style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    {coords.latitude.toFixed(6)}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Longitude</span>
                  <span className="info-value" style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    {coords.longitude.toFixed(6)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Help card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(201,115,132,0.06), rgba(115,201,184,0.06))',
            borderRadius: '20px', padding: '1.5rem 2rem',
            border: '1px solid rgba(201,115,132,0.1)',
            animation: 'slideUp 0.5s ease 0.3s both',
          }}>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.1rem', fontWeight: 600, color: '#1a1a2e', marginBottom: '0.4rem',
            }}>Need help?</h3>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.88rem', color: '#6b7280', fontWeight: 300,
            }}>
              Contact your caregiver or administrator if you need to update your information or have any questions about your care plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;