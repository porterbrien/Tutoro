import { Routes, Route, Navigate, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import HomePage from './pages/HomePage';
import VerifyPage from './pages/VerifyPage';
import HealthPage from './pages/HealthPage';
import ContactsPage from './pages/ContactsPage';

const Unauthorized = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: '#fdfcfb', fontFamily: "'DM Sans', sans-serif",
    textAlign: 'center', padding: '2rem',
  }}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
    <div style={{
      fontSize: '6rem', fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 300, color: '#f0d4da', lineHeight: 1, marginBottom: '1rem',
    }}>403</div>
    <h1 style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: '2.5rem', fontWeight: 300, color: '#1a1a2e', marginBottom: '0.75rem',
    }}>
      Access <em style={{ color: '#c97384' }}>denied</em>
    </h1>
    <p style={{
      fontSize: '1rem', color: '#6b7280', fontWeight: 300,
      maxWidth: '380px', lineHeight: 1.7, marginBottom: '2rem',
    }}>
      You don't have permission to view this page. Please contact your administrator if you think this is a mistake.
    </p>
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Link to="/login" style={{
        padding: '0.8rem 1.8rem', borderRadius: '100px',
        background: '#c97384', color: 'white',
        textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500,
        transition: 'all 0.2s',
      }}>Sign in</Link>
      <Link to="/" style={{
        padding: '0.8rem 1.8rem', borderRadius: '100px',
        border: '1.5px solid rgba(0,0,0,0.1)', color: '#6b7280',
        textDecoration: 'none', fontSize: '0.95rem',
        transition: 'all 0.2s',
      }}>Go home</Link>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/admin/*" element={
        <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
      } />
      <Route
        path="/health"
        element={
          <ProtectedRoute requiredRole="client">
            <HealthPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contacts"
        element={
          <ProtectedRoute requiredRole="client">
            <ContactsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/client/*" element={
        <ProtectedRoute requiredRole="client"><ClientDashboard /></ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;