import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const data = await api.get('/');
      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (loginCredential, password) => {
    const data = await api.post('/auth/login', { login: loginCredential, password });
    if (data?.user) {
      const userData = {
        ...data.user,
        _id: data.user._id || data.user.id,
      };
      setUser(userData);
      return userData;
    }
    throw new Error(data?.message || 'Login failed');
  };

  const signup = async ({ name, userName, email, password }) => {
    const data = await api.post('/auth/signup', { name, userName, email, password });
    if (data?.user) {
      setUser(data.user);
      return data.user;
    }
    throw new Error(data?.message || 'Signup failed');
  };

  const logout = async () => {
    try {
      await api.get('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (formData) => {
    const data = await api.patchForm('/profile', formData);
    if (data?.user) {
      setUser(data.user);
      return data.user;
    }
    throw new Error(data?.message || 'Profile update failed');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
