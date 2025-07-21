import React from 'react';

type User = {
  idUser: number;
  f_name: string;
  l_name: string;
  phone_num: number;
};

type SidebarProps = {
  users: User[];
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ users, isOpen, onClose, onEdit, onDelete }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : '-320px',
        width: '300px',
        height: '100%',
        backgroundColor: '#f8f9fa',
        padding: '1rem',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        transition: 'left 0.3s ease-in-out',
        zIndex: 1000,
      }}
    >
      <button onClick={onClose} style={{ float: 'right', border: 'none', background: 'none' }}>
        ✖
      </button>
      <h3>Users</h3>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map(user => (
          <div key={user.idUser} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
            <strong>{user.f_name} {user.l_name}</strong>
            <p>{user.phone_num}</p>
            <button onClick={() => onEdit(user)} style={{ marginRight: '0.5rem' }}>Edit</button>
            <button onClick={() => onDelete(user.idUser)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Sidebar;
