import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TextBox from '../components/TextBox';
import Button from '../components/Button';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3001';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
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

      login(data.token, data.user);

      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/client');
      }
    } catch {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '380px',
      margin: '6rem auto',
      padding: '2rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Sign In</h1>

      {error && (
        <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
          Phone Number
        </label>
        <TextBox
          value={phone}
          onChange={setPhone}
          placeholder="10-digit phone number"
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
          Password
        </label>
        <TextBox
          value={password}
          onChange={setPassword}
          placeholder="Password"
          type="password"
        />
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#555', marginTop: '1rem' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: '#1e3a5f' }}>Create one</Link>
      </p>

      <div style={{ textAlign: 'center' }}>
        <Button onClick={handleLogin}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </div>
    </div>
  );
}

export default LoginPage;