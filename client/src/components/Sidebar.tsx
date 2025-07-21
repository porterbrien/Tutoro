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
};

const Sidebar: React.FC<SidebarProps> = ({ users, isOpen, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : '-300px',
        height: '100vh',
        width: '300px',
        backgroundColor: '#f4f4f4',
        boxShadow: '2px 0 5px rgba(0,0,0,0.3)',
        transition: 'left 0.3s ease-in-out',
        padding: '20px',
        zIndex: 1000,
      }}
    >
      <button onClick={onClose} style={{ marginBottom: '20px' }}>
        Close ✖
      </button>
      <h3>Users</h3>
      {users.map(user => (
        <div key={user.idUser} style={{ marginBottom: '10px' }}>
          <p>{user.f_name} {user.l_name}</p>
          <p>{user.phone_num}</p>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
