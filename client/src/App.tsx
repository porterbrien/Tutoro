import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
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
  }, []);

  const handleChange = (name: string, value: string) => {
    setFields(prev =>
      prev.map(field => (field.name === name ? { ...field, value } : field))
    );
  };

  const handleSave = async () => {
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

      // const data = await response.json();
      setMessage('User saved successfully!');
      setEditingId(null);

      const updatedUsers = await fetch('http://localhost:3001/api/users').then(res => res.json());
      setUsers(updatedUsers);

      setFields(fields.map(field => ({ ...field, value: '' })));
    } catch (error) {
      console.error('❌ Error saving user:', error);
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
      console.error('❌ Error deleting user:', error);
    }
  };

  return (
    <div className="App">
      <h1>Tutoro Dev</h1>
      <p>{message}</p>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 1001,
          }}
          aria-label="Open Sidebar"
        >
          ☰
        </button>
        <Sidebar users={users} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {fields.map(field => (
        <div key={field.name} style={{ marginBottom: '12px' }}>
          <label>{field.label}</label>
          <TextBox
            value={field.value}
            onChange={val => handleChange(field.name, val)}
            placeholder={field.label}
          />
        </div>
      ))}

      <Button onClick={handleSave}>{editingId ? 'Update' : 'Save'}</Button>

      <hr />

      <h2>Users</h2>
      {users.map(user => (
        <div key={user.idUser}>
          <p>{user.f_name} {user.l_name} ({user.phone_num})</p>
          <button onClick={() => handleEdit(user)}>Edit</button>
          <button onClick={() => handleDelete(user.idUser)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
