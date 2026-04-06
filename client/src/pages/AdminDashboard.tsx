import { useEffect, useState } from 'react';
import { MenuIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import TextBox from '../components/TextBox';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

function AdminDashboard() {
  const { token } = useAuth();
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fields, setFields] = useState<Field[]>([
    { name: 'f_name', label: 'First Name', value: '' },
    { name: 'l_name', label: 'Last Name', value: '' },
    { name: 'phone_num', label: 'Phone', value: '' },
  ]);

  // Authenticated fetch helper
  const authFetch = (url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  };

  const fetchUsers = async () => {
    try {
      const res = await authFetch(`${API_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setMessage('Error fetching users');
    }
  };

  useEffect(() => {
    fetchUsers();
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
      ? `${API_URL}/api/users/${editingId}`
      : `${API_URL}/api/users`;

    try {
      const response = await authFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save user');

      setMessage('User saved successfully');
      setEditingId(null);
      setFields(fields.map(field => ({ ...field, value: '' })));
      fetchUsers();
    } catch (error) {
      setMessage('Error saving user');
    }
  };

  const handleEdit = (user: User) => {
    setFields([
      { name: 'f_name', label: 'First Name', value: user.f_name },
      { name: 'l_name', label: 'Last Name', value: user.l_name },
      { name: 'phone_num', label: 'Phone', value: user.phone_num.toString() },
    ]);
    setEditingId(user.idUser);
    setSidebarOpen(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await authFetch(`${API_URL}/api/users/${id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(user => user.idUser !== id));
    } catch (error) {
      setMessage('Error deleting user');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <Navbar />

      <div style={{ position: 'relative', padding: '2rem' }}>
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
          }}
          aria-label="Open Sidebar"
        >
          <MenuIcon />
        </button>

        <Sidebar
          users={users}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <main style={{
          maxWidth: '400px',
          margin: '2rem auto',
          padding: '1.5rem',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
            {editingId ? 'Edit User' : 'Add User'}
          </h2>

          {message && (
            <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>
          )}

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
    </div>
  );
}

export default AdminDashboard;