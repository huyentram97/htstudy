import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMaker: boolean;
  isChecker: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  isMaker: false,
  isChecker: false,

  login: (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({
      token,
      user,
      isAuthenticated: true,
      isAdmin: user.roles.includes('Admin'),
      isMaker: user.roles.includes('Maker'),
      isChecker: user.roles.includes('Checker'),
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isMaker: false,
      isChecker: false,
    });
  },

  loadFromStorage: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          token,
          user,
          isAuthenticated: true,
          isAdmin: user.roles?.includes('Admin') || false,
          isMaker: user.roles?.includes('Maker') || false,
          isChecker: user.roles?.includes('Checker') || false,
        });
      } catch { /* invalid stored data */ }
    }
  },
}));
