import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function ClientDashboard() {
  const { user, token } = useAuth();
  const [locationStatus, setLocationStatus] = useState('Locating...');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }

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
          setLocationStatus('Location recorded successfully');
        } catch {
          setLocationStatus('Failed to send location to server');
        }
      },
      (error) => {
        setLocationStatus(`Location error: ${error.message}`);
      }
    );
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <Navbar />

      <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1rem' }}>

        {/* Profile card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ marginBottom: '1rem' }}>My Profile</h2>
          <p><strong>Name:</strong> {user?.f_name}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>

        {/* Location card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ marginBottom: '1rem' }}>My Location</h2>
          <p style={{ color: coords ? 'green' : 'gray' }}>{locationStatus}</p>
          {coords && (
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#555' }}>
              <p><strong>Latitude:</strong> {coords.latitude}</p>
              <p><strong>Longitude:</strong> {coords.longitude}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ClientDashboard;