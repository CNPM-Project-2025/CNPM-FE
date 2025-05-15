// contexts/UserContext.tsx
import config from '../config/config';
import { createContext, useContext, useState, useEffect, ReactNode, use } from 'react';

interface User {
  // name: string;
  avatar: string;
  role: string;
  phone: string;
  first_name: string;
  last_name: string;
  created_at: string;
  email: string;
  // auth: string;
  access_token: string;
  refresh_token: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  logout: () => void;  
}

const url = config.API_URL;

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchCheckLogin();
    // const storedUser = localStorage.getItem('user');
    // if (storedUser) {
    //   setUser(JSON.parse(storedUser));
    // }

    // Simulate delay (optional)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // hoặc bỏ setTimeout nếu không cần giả lập
  }, []);

  // useEffect(() => {
  //   // if (user) localStorage.setItem('user', JSON.stringify(user));
  //   else localStorage.removeItem('user');
  // }, [user]);

  // Hàm logout để xóa thông tin người dùng
  const logout = () => {
    setUser(null);
    localStorage.removeItem('refresh_token');
  };

  const fetchCheckLogin = async () => {
    console.log('fetchCheckLogin');

  const response = await fetch(`${url}auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: JSON.stringify({
      refresh_token: localStorage.getItem('refresh_token'),
    }),
  });

  if (response.ok) {
    const data = await response.json();
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
  } else {
    localStorage.removeItem('refresh_token');
    setUser(null);
  }

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  // return response.json();
}

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};


