import { useEffect, useState } from 'react';
import { MenuIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

type Field = { name: string; label: string; value: string; };
type User = { idUser: number; f_name: string; l_name: string; phone_num: number; };

function AdminDashboard() {
  const { token } = useAuth();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [users, setUsers] = useState<User[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fields, setFields] = useState<Field[]>([
    { name: 'f_name', label: 'First Name', value: '' },
    { name: 'l_name', label: 'Last Name', value: '' },
    { name: 'phone_num', label: 'Phone Number', value: '' },
  ]);

  const authFetch = (url: string, options: RequestInit = {}) =>
    fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

  const fetchUsers = async () => {
    try {
      const res = await authFetch(`${API_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch { showMessage('Error fetching users', 'error'); }
  };

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleChange = (name: string, value: string) => {
    setFields(prev => prev.map(f => f.name === name ? { ...f, value } : f));
  };

  const handleSave = async () => {
    const errors: Record<string, string> = {};
    fields.forEach(f => { if (!f.value.trim()) errors[f.name] = `${f.label} is required`; });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showMessage('Please fill in all required fields', 'error');
      return;
    }
    setFieldErrors({});
    const payload = fields.reduce((acc, f) => ({ ...acc, [f.name]: f.value }), {} as Record<string, string>);
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/api/users/${editingId}` : `${API_URL}/api/users`;
    try {
      const response = await authFetch(url, { method, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error();
      showMessage(editingId ? 'User updated successfully' : 'User created successfully');
      setEditingId(null);
      setFields(fields.map(f => ({ ...f, value: '' })));
      fetchUsers();
    } catch { showMessage('Error saving user', 'error'); }
  };

  const handleEdit = (user: User) => {
    setFields([
      { name: 'f_name', label: 'First Name', value: user.f_name },
      { name: 'l_name', label: 'Last Name', value: user.l_name },
      { name: 'phone_num', label: 'Phone Number', value: user.phone_num.toString() },
    ]);
    setEditingId(user.idUser);
    setSidebarOpen(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await authFetch(`${API_URL}/api/users/${id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(u => u.idUser !== id));
      showMessage('User deleted');
    } catch { showMessage('Error deleting user', 'error'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fdfcfb', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        :root {
          --rose: #c97384; --rose-light: #f0d4da; --rose-dark: #a85868;
          --teal: #73C9B8; --teal-light: #d4f0eb; --teal-dark: #4fa898;
          --dark: #1a1a2e; --gray: #6b7280; --white: #fdfcfb;
        }
        .admin-input {
          width: 100%; padding: 0.8rem 1rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
          border: 1.5px solid rgba(0,0,0,0.08); border-radius: 10px;
          background: white; color: var(--dark); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .admin-input:focus {
          border-color: var(--rose);
          box-shadow: 0 0 0 3px rgba(201,115,132,0.1);
        }
        .admin-input::placeholder { color: #bbb; }
        .admin-save-btn {
          width: 100%; padding: 0.85rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 500;
          color: white; background: var(--rose);
          border: none; border-radius: 10px; cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(201,115,132,0.25);
        }
        .admin-save-btn:hover {
          background: var(--rose-dark);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(201,115,132,0.35);
        }
        .cancel-btn {
          width: 100%; padding: 0.85rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 400;
          color: var(--gray); background: transparent;
          border: 1.5px solid rgba(0,0,0,0.08); border-radius: 10px; cursor: pointer;
          transition: all 0.2s; margin-top: 0.5rem;
        }
        .cancel-btn:hover { border-color: var(--gray); color: var(--dark); }
        .stat-card {
          background: white; border-radius: 16px; padding: 1.5rem;
          border: 1px solid rgba(0,0,0,0.06);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: slideIn 0.4s ease both; }
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Header */}
        <div className="animate-in" style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '2.5rem',
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.5rem', fontWeight: 300, color: '#1a1a2e',
            }}>
              Admin <em style={{ color: '#c97384' }}>Dashboard</em>
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: 300, marginTop: '0.25rem' }}>
              Manage your clients and care network
            </p>
          </div>
          <button onClick={() => setSidebarOpen(true)} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.7rem 1.4rem', borderRadius: '100px',
            border: '1.5px solid rgba(201,115,132,0.3)',
            background: 'transparent', color: '#c97384',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem',
            fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#c97384';
              (e.currentTarget as HTMLButtonElement).style.color = 'white';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = '#c97384';
            }}
          >
            <MenuIcon size={16} /> View all users
          </button>
        </div>

        {/* Stats */}
        <div className="animate-in" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.2rem', marginBottom: '2.5rem',
        }}>
          {[
            { label: 'Total users', value: users.length, color: '#c97384', bg: 'rgba(201,115,132,0.08)' },
            { label: 'Clients', value: users.filter((u: any) => u.role === 'client').length, color: '#73C9B8', bg: 'rgba(115,201,184,0.08)' },
            { label: 'Admins', value: users.filter((u: any) => u.role === 'admin').length, color: '#a85868', bg: 'rgba(168,88,104,0.08)' },
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.5rem', fontWeight: 300,
                color: stat.color, lineHeight: 1,
              }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.4rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>

          {/* User list */}
          <div className="animate-in" style={{
            background: 'white', borderRadius: '20px',
            border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '1.5rem 2rem',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.4rem', fontWeight: 600, color: '#1a1a2e',
              }}>All users</h2>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.8rem', color: '#6b7280',
              }}>{users.length} total</span>
            </div>

            {users.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                No users yet. Add one using the form.
              </div>
            ) : (
              users.map((user, i) => (
                <div key={user.idUser} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1rem 2rem',
                  borderBottom: i < users.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#fafafa'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: 'rgba(201,115,132,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1rem', color: '#c97384', fontWeight: 600,
                    }}>
                      {user.f_name[0]}{user.l_name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#1a1a2e' }}>
                        {user.f_name} {user.l_name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {user.phone_num}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button onClick={() => handleEdit(user)} style={{
                      padding: '0.4rem 0.9rem', borderRadius: '8px',
                      border: '1px solid rgba(115,201,184,0.3)',
                      background: 'transparent', color: '#4fa898',
                      fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#73C9B8';
                        (e.currentTarget as HTMLButtonElement).style.color = 'white';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        (e.currentTarget as HTMLButtonElement).style.color = '#4fa898';
                      }}
                    >Edit</button>
                    <button onClick={() => handleDelete(user.idUser)} style={{
                      padding: '0.4rem 0.9rem', borderRadius: '8px',
                      border: '1px solid rgba(201,115,132,0.3)',
                      background: 'transparent', color: '#c97384',
                      fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#c97384';
                        (e.currentTarget as HTMLButtonElement).style.color = 'white';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        (e.currentTarget as HTMLButtonElement).style.color = '#c97384';
                      }}
                    >Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Form */}
          <div className="animate-in" style={{
            background: 'white', borderRadius: '20px',
            border: '1px solid rgba(0,0,0,0.06)', padding: '2rem',
            position: 'sticky', top: '5rem',
          }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.4rem', fontWeight: 600, color: '#1a1a2e',
              marginBottom: '1.5rem',
            }}>
              {editingId ? 'Edit user' : 'Add new user'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {fields.map(field => (
                <div key={field.name}>
                  <label style={{
                    display: 'block', fontSize: '0.82rem', fontWeight: 500,
                    color: '#1a1a2e', marginBottom: '0.4rem',
                  }}>{field.label}</label>
                  <input
                    className="admin-input"
                    type="text"
                    value={field.value}
                    onChange={e => handleChange(field.name, e.target.value)}
                    placeholder={field.label}
                  />
                  {fieldErrors[field.name] && (
                    <p style={{ color: '#c97384', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                      {fieldErrors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              <button className="admin-save-btn" onClick={handleSave}>
                {editingId ? 'Update user' : 'Add user'}
              </button>

              {editingId && (
                <button className="cancel-btn" onClick={() => {
                  setEditingId(null);
                  setFields(fields.map(f => ({ ...f, value: '' })));
                }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Sidebar
        users={users}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default AdminDashboard;