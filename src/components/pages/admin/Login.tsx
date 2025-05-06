import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';

const Login = () => {
  const { setUser } = useUser();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (name && role) {
      const user = { name, role };
      setUser(user); // Lưu thông tin người dùng vào context
      localStorage.setItem('user', JSON.stringify(user)); // Lưu vào localStorage
      navigate('/admin/home'); // Chuyển hướng đến trang Admin sau khi login thành công
    } else {
      alert('Vui lòng nhập đầy đủ thông tin!');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Đăng nhập</h2>
      <div style={styles.form}>
        <div>
          <label htmlFor="name">Tên:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </div>
        <div>
          <label htmlFor="role">Vai trò:</label>
          <input
            type="text"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.input}
          />
        </div>
        <button onClick={handleLogin} style={styles.button}>Đăng nhập</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f7f7f7',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '200px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '4px',
    backgroundColor: '#36d7b7',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Login;
