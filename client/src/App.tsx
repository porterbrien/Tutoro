import { useEffect, useState } from 'react';
import { MenuIcon } from 'lucide-react';
import './App.css';
import Button from './components/Button';
import TextBox from './components/TextBox';
import Sidebar from './components/Sidebar';

type Field = {
  name: string;
  label: string;
  value: string;
};

type User = {
  idUser: number;
  f_name: string;
  l_name: string;
  phone_num: number;
};

function App() {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fields, setFields] = useState<Field[]>([
    { name: 'f_name', label: 'First Name', value: '' },
    { name: 'l_name', label: 'Last Name', value: '' },
    { name: 'phone_num', label: 'Phone', value: '' }
  ]);

  useEffect(() => {
    fetch('http://localhost:3001/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => setMessage('Error: ' + err.message));

      // for finding the user through GEOlocation API
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              console.log('📍 Location:', coords);

              fetch('http://localhost:3001/api/location', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(coords),
              })
                .then(res => res.json())
                .then(data => console.log('✅ Location saved:', data))
                .catch(err => console.error('❌ Failed to send location:', err));
            },
            (error) => {
              console.error('❌ Geolocation error:', error);
            }
          );
        } else {
          console.warn('Geolocation not supported by this browser.');
      }
  }, []);

  const handleChange = (name: string, value: string) => {
    setFields(prev =>
      prev.map(field => (field.name === name ? { ...field, value } : field))
    );
  };

  const handleSave = async () => {

    const errors: Record<string, string> = {};
    fields.forEach(field => {
      if (!field.value.trim()) {
      errors[field.name] = `${field.label} is required`;
    }
  });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setMessage('Please fill in all required fields');
      return;
    }

    setFieldErrors({});

    const payload = fields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {} as Record<string, string>);

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:3001/api/users/${editingId}`
      : 'http://localhost:3001/api/users';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save user');

      setMessage('User saved successfully');
      setEditingId(null);

      const updatedUsers = await fetch('http://localhost:3001/api/users').then(res => res.json());
      setUsers(updatedUsers);

      setFields(fields.map(field => ({ ...field, value: '' })));
    } catch (error) {
      console.error('Could not save user:', error);
      setMessage('Error saving user');
    }
  };

  const handleEdit = (user: User) => {
    setFields([
      { name: 'f_name', label: 'First Name', value: user.f_name },
      { name: 'l_name', label: 'Last Name', value: user.l_name },
      { name: 'phone_num', label: 'Phone', value: user.phone_num.toString() }
    ]);
    setEditingId(user.idUser);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:3001/api/users/${id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(user => user.idUser !== id));
    } catch (error) {
      console.error('could not delete user:', error);
    }
  };

return (
  <div className="App" style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
    <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
      <h1>Tutoro Dev</h1>
      <p style={{ color: 'green' }}>{message}</p>
    </header>
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setSidebarOpen(true)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 1001,
        }}
        aria-label="Open Sidebar"
      >
        <MenuIcon />
      </button>

      <Sidebar
        users={users}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onEdit={(user) => {
          handleEdit(user);
          setSidebarOpen(false);
        }}
        onDelete={handleDelete}
      />
    </div>
    <main style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '1.5rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        {editingId ? 'Edit User' : 'Add User'}
      </h2>

    {fields.map(field => (
      <div key={field.name} style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
          {field.label}
        </label>
        <TextBox
          value={field.value}
          onChange={val => handleChange(field.name, val)}
          placeholder={field.label}
        />
        {fieldErrors[field.name] && (
          <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '4px' }}>
            {fieldErrors[field.name]}
          </p>
        )}
      </div>
    ))}

      <div style={{ textAlign: 'center' }}>
        <Button onClick={handleSave}>
          {editingId ? 'Update' : 'Save'}
        </Button>
      </div>
    </main>
  </div>
)};



export default App;
