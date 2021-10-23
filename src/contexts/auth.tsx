import { createContext, useEffect, useState } from 'react';
import { api } from '../services/api';

type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
};

export const AuthContext = createContext({} as AuthContextData);

type Props = {
  children: React.ReactNode;
};

type AuthResponse = {
  token: string;
  user: User;
};

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
};

export function AuthProvider({ children }: Props) {
  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=58a72d943e910b0bc8a0`;

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token');

    if (token) {
      setToken(token);

      api.get<User>('/profile').then((response) => {
        setUser(response.data);
      });
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');

      window.history.pushState({}, '', urlWithoutCode);

      signIn(githubCode);
    }
  }, []);

  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    });

    const { token, user } = response.data;

    localStorage.setItem('@dowhile:token', token);
    setToken(token);

    setUser(user);
  }

  async function signOut() {
    setUser(null);
    localStorage.removeItem('@dowhile:token');
  }

  function setToken(token: string) {
    api.defaults.headers.common.authorization = `Bearer ${token}`;
  }

  return (
    <AuthContext.Provider value={{ user, signInUrl, signOut }}>{children}</AuthContext.Provider>
  );
}
