import { createContext, useContext, useState, ReactNode } from 'react';
import { createUser, findUserByCredentials, emailExists, User } from '../repositories/usersRepository';

type AuthContextType = {
  user: User | null;
  signUp: (fullName: string, shopName: string, email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signUp = async (fullName: string, shopName: string, email: string, password: string) => {
    if (await emailExists(email)) {
      throw new Error('An account with that email already exists.');
    }
    const newUser = await createUser({ fullName, shopName, email, password });
    setUser(newUser);
  };

  const logIn = async (email: string, password: string) => {
    const found = await findUserByCredentials(email, password);
    if (!found) throw new Error('Invalid email or password.');
    setUser(found);
  };

  const logOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
