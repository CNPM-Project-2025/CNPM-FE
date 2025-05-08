import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';

type LoginForm = {
  email: string;
  password: string;
}

const Login = () => {
  const { setUser } = useUser();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const fetchauth = async () => {
    // Gửi post loginForm lên server
    const response = await fetch('http://localhost:9999/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginForm),
    });
    const data = await response.json();
    if (response.ok) {
      // Lưu thông tin người dùng vào context
      setUser({
        avatar: data.user.avatar,
        role: data.user.role,
        phone: data.user.phone,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        created_at: data.user.created_at,
        email: data.user.email,
        auth: data.user.auth,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      // Chuyển hướng đến trang Admin sau khi login thành công
      navigate('/admin/home');
    } else {
      alert('Đăng nhập không thành công!');
    }
    if (response.ok) {
      console.log('Login successful:', data);
    }
  };

  const handleLogin = () => {
    if (loginForm.email && loginForm.password) {
      fetchauth();
      // navigate('/admin/home'); // Chuyển hướng đến trang Admin sau khi login thành công
    } else {
      alert('Vui lòng nhập đầy đủ thông tin!');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Đăng nhập</h2>
      <div style={styles.form}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            style={styles.input}
          />
        </div>
        <div>
          <label htmlFor="pass">Pass :</label>
          <input
            type="password"
            id="pass"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
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
