import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import backgroundURL from '../../../assets/images/animated-svg-background-example.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '../../../config/config.ts';
import { height, width } from '@fortawesome/free-solid-svg-icons/faCartShopping';


type LoginForm = {
  email: string;
  password: string;
}

const url = config.API_URL;

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
    const response = await fetch(`${url}auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginForm),
    });
    const data = await response.json();
    if (response.ok) {
      // Lưu thông tin người dùng vào context
      localStorage.setItem('refresh_token', data.refresh_token);
      setUser({
        avatar: data.user.avatar,
        role: data.user.role,
        phone: data.user.phone,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        created_at: data.user.created_at,
        email: data.user.email,
        // auth: data.user.auth,
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
        <div className='d-flex gap-3 justify-content-between align-items-center'>
          <div>
            <label htmlFor="email">Email:</label>
          </div>
          
          <div>
            <input
              type="text"
              id="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              style={styles.input}
            />
          </div>
        </div>
        <div className='d-flex gap-3 justify-content-between align-items-center'>
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
    width: '100%',
    height: '100vh',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#f7f7f7',
    backgroundImage: `url(${backgroundURL})`,
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
