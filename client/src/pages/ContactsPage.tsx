import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

type Contact = {
  id: number;
  contact_name: string;
  relationship_type: string;
  phone_number: string;
  email: string;
  address: string;
  notes: string;
};

const emptyContact = {
  contact_name: '',
  relationship_type: '',
  phone_number: '',
  email: '',
  address: '',
  notes: '',
};

const relationshipTypes = [
  '', 'Parent', 'Spouse', 'Partner', 'Sibling', 'Child',
  'Friend', 'Doctor', 'Caregiver', 'Emergency Contact', 'Other'
];

function ContactsPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyContact);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const authFetch = (url: string, options: RequestInit = {}) =>
    fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

  const showMsg = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchContacts = async () => {
    if (!user) return;
    try {
      const res = await authFetch(`${API_URL}/api/contacts/${user.idUser}`);
      const data = await res.json();
      setContacts(data);
    } catch {
      showMsg('Error loading contacts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, [user]);

  const handleSave = async () => {
    if (!form.contact_name.trim()) {
      showMsg('Contact name is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const url = editingId
        ? `${API_URL}/api/contacts/${user?.idUser}/${editingId}`
        : `${API_URL}/api/contacts/${user?.idUser}`;
      const method = editingId ? 'PUT' : 'POST';
      const response = await authFetch(url, { method, body: JSON.stringify(form) });
      if (!response.ok) throw new Error();
      showMsg(editingId ? 'Contact updated' : 'Contact added');
      setForm(emptyContact);
      setEditingId(null);
      setShowForm(false);
      fetchContacts();
    } catch {
      showMsg('Error saving contact', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (contact: Contact) => {
    setForm({
      contact_name: contact.contact_name,
      relationship_type: contact.relationship_type,
      phone_number: contact.phone_number,
      email: contact.email,
      address: contact.address,
      notes: contact.notes,
    });
    setEditingId(contact.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (contactId: number) => {
    try {
      await authFetch(`${API_URL}/api/contacts/${user?.idUser}/${contactId}`, {
        method: 'DELETE'
      });
      showMsg('Contact deleted');
      setContacts(prev => prev.filter(c => c.id !== contactId));
    } catch {
      showMsg('Error deleting contact', 'error');
    }
  };

  const handleCancel = () => {
    setForm(emptyContact);
    setEditingId(null);
    setShowForm(false);
  };

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const relationshipColors: Record<string, { bg: string; color: string }> = {
    'Parent': { bg: 'rgba(201,115,132,0.1)', color: '#a85868' },
    'Spouse': { bg: 'rgba(115,201,184,0.1)', color: '#4fa898' },
    'Partner': { bg: 'rgba(115,201,184,0.1)', color: '#4fa898' },
    'Sibling': { bg: 'rgba(201,115,132,0.08)', color: '#c97384' },
    'Child': { bg: 'rgba(115,201,184,0.08)', color: '#73C9B8' },
    'Friend': { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' },
    'Doctor': { bg: 'rgba(26,26,46,0.08)', color: '#1a1a2e' },
    'Caregiver': { bg: 'rgba(201,115,132,0.12)', color: '#a85868' },
    'Emergency Contact': { bg: 'rgba(201,115,132,0.15)', color: '#a85868' },
    'Other': { bg: 'rgba(107,114,128,0.08)', color: '#6b7280' },
  };

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
        }}>Loading your contacts...</div>
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
        .contact-input {
          width: 100%; padding: 0.8rem 1rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
          border: 1.5px solid rgba(0,0,0,0.08); border-radius: 12px;
          background: white; color: var(--dark); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .contact-input:focus {
          border-color: var(--rose);
          box-shadow: 0 0 0 3px rgba(201,115,132,0.1);
        }
        .contact-input::placeholder { color: #bbb; }
        .contact-select {
          width: 100%; padding: 0.8rem 1rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
          border: 1.5px solid rgba(0,0,0,0.08); border-radius: 12px;
          background: white; color: var(--dark); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none; cursor: pointer;
        }
        .contact-select:focus {
          border-color: var(--rose);
          box-shadow: 0 0 0 3px rgba(201,115,132,0.1);
        }
        .contact-textarea {
          width: 100%; padding: 0.8rem 1rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
          border: 1.5px solid rgba(0,0,0,0.08); border-radius: 12px;
          background: white; color: var(--dark); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          resize: vertical;
        }
        .contact-textarea:focus {
          border-color: var(--rose);
          box-shadow: 0 0 0 3px rgba(201,115,132,0.1);
        }
        .contact-textarea::placeholder { color: #bbb; }
        .primary-btn {
          padding: 0.8rem 1.8rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 500;
          color: white; background: var(--rose);
          border: none; border-radius: 100px; cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(201,115,132,0.25);
        }
        .primary-btn:hover:not(:disabled) {
          background: var(--rose-dark); transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(201,115,132,0.35);
        }
        .primary-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .secondary-btn {
          padding: 0.8rem 1.5rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          color: var(--gray); background: transparent;
          border: 1.5px solid rgba(0,0,0,0.08); border-radius: 100px;
          cursor: pointer; transition: all 0.2s;
        }
        .secondary-btn:hover { border-color: var(--gray); color: var(--dark); }
        .contact-card {
          background: white; border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.06); overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          margin-bottom: 1rem;
        }
        .contact-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .field-label {
          display: block; font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; font-weight: 500;
          color: var(--dark); margin-bottom: 0.4rem;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-card { animation: slideDown 0.3s ease both; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate { animation: slideUp 0.5s ease both; }
        @keyframes fadeMessage {
          0% { opacity: 0; transform: translateY(-10px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; } 100% { opacity: 0; }
        }
        .message-toast {
          animation: fadeMessage 3s ease forwards;
          position: fixed; top: 5rem; right: 2rem; z-index: 200;
          padding: 0.8rem 1.4rem; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .icon-btn {
          padding: 0.4rem 0.9rem; border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
          cursor: pointer; transition: all 0.2s; border: 1px solid;
          background: transparent;
        }
        .expand-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
          color: var(--gray); padding: 0; transition: color 0.2s;
        }
        .expand-btn:hover { color: var(--dark); }
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
        <div className="animate" style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: '2.5rem',
        }}>
          <div>
            <button className="secondary-btn" onClick={() => navigate(-1)}
              style={{ marginBottom: '1rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              ← Back
            </button>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.5rem', fontWeight: 300, color: '#1a1a2e',
            }}>
              My <em style={{ color: '#c97384' }}>Contacts</em>
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.95rem', color: '#6b7280', fontWeight: 300,
            }}>
              {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'} saved
            </p>
          </div>
          {!showForm && (
            <button className="primary-btn" onClick={() => setShowForm(true)}
              style={{ marginTop: '3rem' }}>
              + Add contact
            </button>
          )}
        </div>

        {/* Add/Edit form */}
        {showForm && (
          <div className="form-card" style={{
            background: 'white', borderRadius: '20px',
            border: '1px solid rgba(201,115,132,0.15)',
            padding: '2rem', marginBottom: '2rem',
            boxShadow: '0 8px 32px rgba(201,115,132,0.1)',
          }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.5rem', fontWeight: 600, color: '#1a1a2e',
              marginBottom: '1.5rem',
            }}>
              {editingId ? 'Edit contact' : 'New contact'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="field-label">Full name *</label>
                <input className="contact-input" type="text" placeholder="Jane Doe"
                  value={form.contact_name}
                  onChange={e => setForm(prev => ({ ...prev, contact_name: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Relationship</label>
                <div style={{ position: 'relative' }}>
                  <select className="contact-select"
                    value={form.relationship_type}
                    onChange={e => setForm(prev => ({ ...prev, relationship_type: e.target.value }))}>
                    {relationshipTypes.map(r => (
                      <option key={r} value={r}>{r || 'Select relationship'}</option>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="field-label">Phone number</label>
                <input className="contact-input" type="text" placeholder="555-123-4567"
                  value={form.phone_number}
                  onChange={e => setForm(prev => ({ ...prev, phone_number: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Email address</label>
                <input className="contact-input" type="email" placeholder="jane@email.com"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="field-label">Address</label>
              <input className="contact-input" type="text" placeholder="123 Main St, City, State"
                value={form.address}
                onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="field-label">Notes</label>
              <textarea className="contact-textarea" rows={3}
                placeholder="Any additional notes about this contact..."
                value={form.notes}
                onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="secondary-btn" onClick={handleCancel}>Cancel</button>
              <button className="primary-btn" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update contact' : 'Add contact'}
              </button>
            </div>
          </div>
        )}

        {/* Contacts list */}
        {contacts.length === 0 && !showForm ? (
          <div style={{
            background: 'white', borderRadius: '20px', padding: '4rem 2rem',
            border: '1px solid rgba(0,0,0,0.06)', textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.5rem', fontWeight: 300, color: '#1a1a2e', marginBottom: '0.5rem',
            }}>No contacts yet</h3>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.9rem', color: '#6b7280', marginBottom: '1.5rem',
            }}>Add your first contact to get started</p>
            <button className="primary-btn" onClick={() => setShowForm(true)}>
              + Add your first contact
            </button>
          </div>
        ) : (
          contacts.map((contact, i) => {
            const relColor = relationshipColors[contact.relationship_type] ||
              { bg: 'rgba(107,114,128,0.08)', color: '#6b7280' };
            const isExpanded = expandedId === contact.id;

            return (
              <div key={contact.id} className="contact-card animate"
                style={{ animationDelay: `${i * 0.05}s` }}>
                {/* Card header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1.2rem 1.5rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      background: `linear-gradient(135deg, rgba(201,115,132,0.15), rgba(115,201,184,0.15))`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1rem', color: '#c97384', fontWeight: 600, flexShrink: 0,
                    }}>
                      {getInitials(contact.contact_name || '?')}
                    </div>
                    <div>
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.95rem', fontWeight: 500, color: '#1a1a2e',
                      }}>
                        {contact.contact_name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                        {contact.relationship_type && (
                          <span style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.75rem', fontWeight: 500,
                            padding: '0.2rem 0.6rem', borderRadius: '100px',
                            background: relColor.bg, color: relColor.color,
                          }}>
                            {contact.relationship_type}
                          </span>
                        )}
                        {contact.phone_number && (
                          <span style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.8rem', color: '#6b7280',
                          }}>
                            {contact.phone_number}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button className="icon-btn" onClick={() => handleEdit(contact)}
                      style={{ borderColor: 'rgba(115,201,184,0.3)', color: '#4fa898' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#73C9B8';
                        (e.currentTarget as HTMLButtonElement).style.color = 'white';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        (e.currentTarget as HTMLButtonElement).style.color = '#4fa898';
                      }}>
                      Edit
                    </button>
                    <button className="icon-btn" onClick={() => handleDelete(contact.id)}
                      style={{ borderColor: 'rgba(201,115,132,0.3)', color: '#c97384' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#c97384';
                        (e.currentTarget as HTMLButtonElement).style.color = 'white';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        (e.currentTarget as HTMLButtonElement).style.color = '#c97384';
                      }}>
                      Delete
                    </button>
                    <button className="expand-btn"
                      onClick={() => setExpandedId(isExpanded ? null : contact.id)}>
                      {isExpanded ? '▲' : '▼'}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{
                    padding: '0 1.5rem 1.5rem',
                    borderTop: '1px solid rgba(0,0,0,0.04)',
                    paddingTop: '1rem',
                  }}>
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
                    }}>
                      {contact.email && (
                        <div>
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.2rem',
                          }}>Email</div>
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.9rem', color: '#1a1a2e',
                          }}>{contact.email}</div>
                        </div>
                      )}
                      {contact.address && (
                        <div>
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.2rem',
                          }}>Address</div>
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.9rem', color: '#1a1a2e',
                          }}>{contact.address}</div>
                        </div>
                      )}
                      {contact.notes && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.2rem',
                          }}>Notes</div>
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.9rem', color: '#1a1a2e', lineHeight: 1.6,
                          }}>{contact.notes}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ContactsPage;