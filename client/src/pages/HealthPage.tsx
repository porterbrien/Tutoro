import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

type HealthProfile = {
  medical_history: string;
  allergies: string;
  current_medications: string;
  previous_medications: string;
  blood_type: string;
  emergency_notes: string;
};

function HealthPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<HealthProfile>({
    medical_history: '',
    allergies: '',
    current_medications: '',
    previous_medications: '',
    blood_type: '',
    emergency_notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const authFetch = (url: string, options: RequestInit = {}) =>
    fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  useEffect(() => {
    if (!user) return;
    authFetch(`${API_URL}/api/health/${user.idUser}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        showMessage('Error loading health profile', 'error');
        setLoading(false);
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const response = await authFetch(`${API_URL}/api/health/${user.idUser}`, {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      if (!response.ok) throw new Error();
      showMessage('Health profile saved successfully');
    } catch {
      showMessage('Error saving health profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const bloodTypes = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#fdfcfb' }}>
      <Navbar />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 'calc(100vh - 65px)',
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.5rem', color: '#c97384', fontWeight: 300,
        }}>Loading your health profile...</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fdfcfb' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        :root {
          --rose: #c97384; --rose-light: #f0d4da; --rose-dark: #a85868;
          --teal: #73C9B8; --teal-light: #d4f0eb; --teal-dark: #4fa898;
          --dark: #1a1a2e; --gray: #6b7280; --white: #fdfcfb;
        }
        .health-input {
          width: 100%; padding: 0.85rem 1rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
          border: 1.5px solid rgba(0,0,0,0.08); border-radius: 12px;
          background: white; color: var(--dark); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          resize: vertical;
        }
        .health-input:focus {
          border-color: var(--rose);
          box-shadow: 0 0 0 3px rgba(201,115,132,0.1);
        }
        .health-input::placeholder { color: #bbb; }
        .health-select {
          width: 100%; padding: 0.85rem 1rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
          border: 1.5px solid rgba(0,0,0,0.08); border-radius: 12px;
          background: white; color: var(--dark); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none; cursor: pointer;
        }
        .health-select:focus {
          border-color: var(--rose);
          box-shadow: 0 0 0 3px rgba(201,115,132,0.1);
        }
        .save-btn {
          padding: 0.9rem 2.5rem;
          font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 500;
          color: white; background: var(--rose);
          border: none; border-radius: 100px; cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(201,115,132,0.3);
        }
        .save-btn:hover:not(:disabled) {
          background: var(--rose-dark);
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(201,115,132,0.4);
        }
        .save-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .back-btn {
          padding: 0.9rem 2rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
          color: var(--gray); background: transparent;
          border: 1.5px solid rgba(0,0,0,0.08); border-radius: 100px;
          cursor: pointer; transition: all 0.2s;
        }
        .back-btn:hover { border-color: var(--gray); color: var(--dark); }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate { animation: slideUp 0.5s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        @keyframes fadeMessage {
          0% { opacity: 0; transform: translateY(-10px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
        .message-toast {
          animation: fadeMessage 3s ease forwards;
          position: fixed; top: 5rem; right: 2rem; z-index: 200;
          padding: 0.8rem 1.4rem; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .section-card {
          background: white; border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.06); padding: 2rem;
          margin-bottom: 1.5rem;
        }
        .field-label {
          display: block; font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem; font-weight: 500;
          color: var(--dark); margin-bottom: 0.5rem;
        }
        .field-hint {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem; color: var(--gray);
          margin-top: 0.4rem; font-weight: 300;
        }
      `}</style>

      <Navbar />

      {message && (
        <div className="message-toast" style={{
          background: messageType === 'success' ? '#d4f0eb' : '#f0d4da',
          color: messageType === 'success' ? '#4fa898' : '#a85868',
        }}>
          {messageType === 'success' ? '✓' : '✕'} {message}
        </div>
      )}

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Header */}
        <div className="animate" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.5rem', fontWeight: 300, color: '#1a1a2e',
            marginTop: '1rem',
          }}>
            Health <em style={{ color: '#c97384' }}>Profile</em>
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.95rem', color: '#6b7280', fontWeight: 300,
          }}>
            Your medical information is private and securely stored.
          </p>
        </div>

        {/* Blood type */}
        <div className="section-card animate delay-1">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(201,115,132,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem',
            }}>🩸</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.3rem', fontWeight: 600, color: '#1a1a2e',
            }}>Basic Information</h2>
          </div>
          <div>
            <label className="field-label">Blood Type</label>
            <div style={{ position: 'relative' }}>
              <select
                className="health-select"
                value={profile.blood_type}
                onChange={e => setProfile(prev => ({ ...prev, blood_type: e.target.value }))}
              >
                {bloodTypes.map(t => (
                  <option key={t} value={t}>{t || 'Select blood type'}</option>
                ))}
              </select>
              <div style={{
                position: 'absolute', right: '1rem', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
                color: '#6b7280', fontSize: '0.8rem',
              }}>▼</div>
            </div>
          </div>
        </div>

        {/* Medical history */}
        <div className="section-card animate delay-2">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(115,201,184,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem',
            }}>📋</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.3rem', fontWeight: 600, color: '#1a1a2e',
            }}>Medical History</h2>
          </div>
          <div style={{ marginBottom: '1.2rem' }}>
            <label className="field-label">Medical History</label>
            <textarea
              className="health-input"
              rows={4}
              placeholder="Describe any past or current medical conditions, surgeries, or diagnoses..."
              value={profile.medical_history}
              onChange={e => setProfile(prev => ({ ...prev, medical_history: e.target.value }))}
            />
            <p className="field-hint">Include any chronic conditions, past surgeries, or significant medical events.</p>
          </div>
          <div>
            <label className="field-label">Allergies</label>
            <textarea
              className="health-input"
              rows={3}
              placeholder="List any known allergies (food, medications, environmental)..."
              value={profile.allergies}
              onChange={e => setProfile(prev => ({ ...prev, allergies: e.target.value }))}
            />
            <p className="field-hint">Separate multiple allergies with commas.</p>
          </div>
        </div>

        {/* Medications */}
        <div className="section-card animate delay-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(201,115,132,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem',
            }}>💊</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.3rem', fontWeight: 600, color: '#1a1a2e',
            }}>Medications</h2>
          </div>
          <div style={{ marginBottom: '1.2rem' }}>
            <label className="field-label">Current Medications</label>
            <textarea
              className="health-input"
              rows={3}
              placeholder="List medications you are currently taking with dosages..."
              value={profile.current_medications}
              onChange={e => setProfile(prev => ({ ...prev, current_medications: e.target.value }))}
            />
            <p className="field-hint">Include dosage and frequency where possible.</p>
          </div>
          <div>
            <label className="field-label">Previous Medications</label>
            <textarea
              className="health-input"
              rows={3}
              placeholder="List medications you have previously taken..."
              value={profile.previous_medications}
              onChange={e => setProfile(prev => ({ ...prev, previous_medications: e.target.value }))}
            />
          </div>
        </div>

        {/* Emergency notes */}
        <div className="section-card animate delay-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(201,115,132,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem',
            }}>🚨</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.3rem', fontWeight: 600, color: '#1a1a2e',
            }}>Emergency Notes</h2>
          </div>
          <div>
            <label className="field-label">Important Notes for Emergency Responders</label>
            <textarea
              className="health-input"
              rows={4}
              placeholder="Any critical information emergency responders should know immediately..."
              value={profile.emergency_notes}
              onChange={e => setProfile(prev => ({ ...prev, emergency_notes: e.target.value }))}
            />
            <p className="field-hint">This information may be shared with emergency services if needed.</p>
          </div>
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingBottom: '3rem' }}>
          <button className="back-btn" onClick={() => navigate(-1)}>Cancel</button>
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save health profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HealthPage;