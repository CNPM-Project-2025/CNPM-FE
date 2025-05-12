// contexts/UserContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  // name: string;
  avatar: string;
  role: string;
  phone: string;
  first_name: string;
  last_name: string;
  created_at: string;
  email: string;
  auth: string;
  access_token: string;
  refresh_token: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  logout: () => void;  
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Simulate delay (optional)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // hoặc bỏ setTimeout nếu không cần giả lập
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  // Hàm logout để xóa thông tin người dùng
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

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
