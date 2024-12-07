import { useState, useEffect } from 'react';

const useAuth = () => {
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (token && role) {
      setAuthState({
        token,
        role,
        isAuthenticated: true,
      });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setAuthState({
      token: null,
      role: null,
      isAuthenticated: false,
    });
  };

  return {
    authState,
    logout,
  };
};

export default useAuth;
