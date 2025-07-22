import React, { createContext, useState , useContext} from 'react';

// Create the context
export const AuthContext = createContext();

// Restore auth state from localStorage
const loadStoredAuth = () => {
  try {
    const token = localStorage.getItem('token');
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userData = localStorage.getItem('user');
    if (!token || !accessToken || !refreshToken || !userData) {
      return {
        isAuthenticated: false,
        user: null,
        tokens: null
      };
    }
    return {
      isAuthenticated: true,
      user: JSON.parse(userData),
      tokens: {
        token,
        accessToken,
        refreshToken
      }
    };
  } catch (error) {
    console.error('Error loading stored auth:', error);
    return {
      isAuthenticated: false,
      user: null,
      tokens: null
    };
  }
};

// AuthProvider component
const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(loadStoredAuth);

  const login = (authData) => {
    try {
      const { token, user, cognitoTokens } = authData;
      localStorage.setItem('token', token);
      localStorage.setItem('accessToken', cognitoTokens.accessToken);
      localStorage.setItem('refreshToken', cognitoTokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthState({
        isAuthenticated: true,
        user,
        tokens: {
          token,
          accessToken: cognitoTokens.accessToken,
          refreshToken: cognitoTokens.refreshToken
        }
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    // Remove only what you set
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      tokens: null
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        tokens: authState.tokens,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
