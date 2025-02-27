import { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import environment from '../environment/environment';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  COLLECTION_OFFICER = 'collection_officer',
  MANAGER = 'manager',
}

interface AuthProps {
  authState: {
    authenticated: boolean | null;
    username: string | null;
    role: Role | null;
  };
  onLogin: (username: string, password: string) => void;
  onLogout: () => void;
}

const AuthContext = createContext<Partial<AuthProps>>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    authenticated: boolean | null;
    username: string | null;
    role: Role | null;
  }>({
    authenticated: null,
    username: null,
    role: null,
  });

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(
        `${environment.API_BASE_URL}api/collection-officer/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            empId: username, // assuming username is empId
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid username or password');
      }

      const { token, jobRole, empId } = data;

      // Save token and user role to AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('jobRole', jobRole);
      await AsyncStorage.setItem('empid', empId.toString());

      // Update the auth state
      setAuthState({
        authenticated: true,
        username,
        role: jobRole === 'admin' ? Role.ADMIN : jobRole === 'user' ? Role.USER : jobRole === 'collection_officer' ? Role.COLLECTION_OFFICER : Role.MANAGER,
      });
    } catch (error) {
      setAuthState({ authenticated: false, username: null, role: null });
    }
  };

  const logout = async () => {
    // Remove token and user data from AsyncStorage
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('jobRole');
    await AsyncStorage.removeItem('empid');

    // Update the auth state
    setAuthState({
      authenticated: false,
      username: null,
      role: null,
    });
  };

  const value = {
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
