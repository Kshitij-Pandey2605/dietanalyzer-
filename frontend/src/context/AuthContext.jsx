import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (userData) => {
    const data = await authService.signup(userData);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  };

  const login = async (userData) => {
    const data = await authService.login(userData);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
