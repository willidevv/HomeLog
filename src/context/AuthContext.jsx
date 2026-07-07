import React, { createContext, useContext, useEffect, useState } from 'react';
// Mengimpor auth dengan ekstensi file eksplisit untuk membantu resolusi modul di lingkungan bundler
import { auth } from '../config/firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi-fungsi Autentikasi
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  // Memantau status login pengguna secara real-time
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook kustom untuk mempermudah pemanggilan fungsi login di View
export const useAuth = () => useContext(AuthContext);