import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TextBox from '../components/TextBox';
import Button from '../components/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function SignupPage() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    f_name: '',
    l_name: '',
    phone_num: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    if (!fields.f_name || !fields.l_name || !fields.phone_num || !fields.password) {
      setError('All fields are required');
      return;
    }

    if (fields.phone_num.length !== 10) {
      setError('Phone number must be 10 digits');
      return;
    }

    if (fields.password !== fields.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (fields.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          f_name: fields.f_name,
          l_name: fields.l_name,
          phone_num: fields.phone_num,
          password: fields.password,
          role: 'client',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      navigate('/login', { state: { message: 'Account created! Please sign in.' } });
    } catch {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '4rem auto',
      padding: '2rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h1>

      {error && (
        <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>First Name</label>
        <TextBox value={fields.f_name} onChange={val => handleChange('f_name', val)} placeholder="First name" />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Last Name</label>
        <TextBox value={fields.l_name} onChange={val => handleChange('l_name', val)} placeholder="Last name" />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Phone Number</label>
        <TextBox value={fields.phone_num} onChange={val => handleChange('phone_num', val)} placeholder="10-digit phone number" />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Password</label>
        <TextBox value={fields.password} onChange={val => handleChange('password', val)} placeholder="Min 8 characters" type="password" />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Confirm Password</label>
        <TextBox value={fields.confirmPassword} onChange={val => handleChange('confirmPassword', val)} placeholder="Confirm password" type="password" />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <Button onClick={handleSignup}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#555' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#1e3a5f' }}>Sign in</Link>
      </p>
    </div>
  );
}

export default SignupPage;