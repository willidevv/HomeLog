import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
// Mengimpor auth dengan ekstensi file eksplisit untuk membantu resolusi modul di lingkungan bundler
import { auth } from '../config/Firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const AuthContext = createContext();

const TIMEOUT_LIMIT = 60000; // 1 minute in ms

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const lastActiveRef = useRef(Date.now());
  const lastSavedRef = useRef(0); // Throttle for localStorage writes

  const logout = async () => {
    localStorage.removeItem('lastActiveTimestamp');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const login = async (email, password) => {
    localStorage.setItem('lastActiveTimestamp', Date.now().toString());
    lastActiveRef.current = Date.now();
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password) => {
    localStorage.setItem('lastActiveTimestamp', Date.now().toString());
    lastActiveRef.current = Date.now();
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Check if session is expired
  const checkSession = () => {
    const lastActive = localStorage.getItem('lastActiveTimestamp');
    if (lastActive) {
      const elapsed = Date.now() - parseInt(lastActive, 10);
      if (elapsed >= TIMEOUT_LIMIT) {
        logout();
        return true;
      }
    }
    return false;
  };

  // Reset the timer and write to localStorage (throttled)
  const handleActivity = () => {
    const now = Date.now();
    lastActiveRef.current = now;

    // Reset local timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      logout();
    }, TIMEOUT_LIMIT);

    // Throttle writing to localStorage to once every 1000ms
    if (now - lastSavedRef.current > 1000) {
      localStorage.setItem('lastActiveTimestamp', now.toString());
      lastSavedRef.current = now;
    }
  };

  // Sync session across tabs
  const handleStorageChange = (e) => {
    if (e.key === 'lastActiveTimestamp') {
      const newTimestamp = parseInt(e.newValue, 10);
      if (newTimestamp) {
        const elapsed = Date.now() - newTimestamp;
        if (elapsed >= TIMEOUT_LIMIT) {
          logout();
        } else {
          // Reset timer for this tab as well since user was active in another tab
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            logout();
          }, TIMEOUT_LIMIT - elapsed);
        }
      }
    }
  };

  // Focus / visibility change check
  const handleVisibilityOrFocusChange = () => {
    if (document.visibilityState === 'visible' || document.hasFocus()) {
      checkSession();
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Initial load / refresh check
        const lastActive = localStorage.getItem('lastActiveTimestamp');
        if (lastActive) {
          const elapsed = Date.now() - parseInt(lastActive, 10);
          if (elapsed >= TIMEOUT_LIMIT) {
            signOut(auth);
            setUser(null);
            localStorage.removeItem('lastActiveTimestamp');
            setLoading(false);
            return;
          }
        } else {
          // No timestamp set yet
          localStorage.setItem('lastActiveTimestamp', Date.now().toString());
        }
        setUser(currentUser);
      } else {
        setUser(null);
        localStorage.removeItem('lastActiveTimestamp');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Monitor user activity when logged in
  useEffect(() => {
    if (!user) {
      // Clean up timers if logged out
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Set initial timestamp and reset timer
    const now = Date.now();
    lastActiveRef.current = now;
    lastSavedRef.current = now;
    localStorage.setItem('lastActiveTimestamp', now.toString());

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      logout();
    }, TIMEOUT_LIMIT);

    // Periodic check every 5 seconds (handles background tabs, system sleep, etc.)
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      checkSession();
    }, 5000);

    // Event listeners
    const events = ['mousemove', 'click', 'keypress', 'scroll'];
    events.forEach((event) => window.addEventListener(event, handleActivity));
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityOrFocusChange);
    window.addEventListener('focus', handleVisibilityOrFocusChange);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocusChange);
      window.removeEventListener('focus', handleVisibilityOrFocusChange);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook kustom untuk mempermudah pemanggilan fungsi login di View
export const useAuth = () => useContext(AuthContext);