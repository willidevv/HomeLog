import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';

/**
 * NavigationContext
 *
 * Tanggung jawab:
 *   - Menyimpan active navigation IDs (plan, room, item)
 *   - Menyediakan API navigasi yang bersih: navigateTo(), goBack(), resetNavigation()
 *   - Mereset state saat user logout
 *
 * Yang TIDAK boleh ada di sini:
 *   - Data fetching
 *   - CRUD operations
 *   - UI rendering
 *   - Modal state
 */

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  const { user } = useAuth();

  const [activePlanId, setActivePlanId] = useState(null);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);

  // Reset semua navigation state saat user logout
  useEffect(() => {
    if (!user) {
      setActivePlanId(null);
      setActiveRoomId(null);
      setActiveItemId(null);
    }
  }, [user]);

  /**
   * Navigasi ke level tertentu.
   * Setiap kali masuk ke level yang lebih dalam, level di bawahnya di-reset.
   */
  const navigateTo = (level, id) => {
    switch (level) {
      case 'plan':
        setActivePlanId(id);
        setActiveRoomId(null);
        setActiveItemId(null);
        break;
      case 'room':
        setActiveRoomId(id);
        setActiveItemId(null);
        break;
      case 'item':
        setActiveItemId(id);
        break;
    }
  };

  /**
   * Kembali ke level tertentu.
   * Membersihkan semua level di bawah target.
   */
  const goBack = (level) => {
    switch (level) {
      case 'dashboard':
        setActivePlanId(null);
        setActiveRoomId(null);
        setActiveItemId(null);
        break;
      case 'plan':
        setActiveRoomId(null);
        setActiveItemId(null);
        break;
      case 'room':
        setActiveItemId(null);
        break;
    }
  };

  const value = useMemo(() => ({
    activePlanId,
    activeRoomId,
    activeItemId,
    navigateTo,
    goBack,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [activePlanId, activeRoomId, activeItemId]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * useNavigation()
 *
 * Hook untuk mengakses navigation state dan actions dari komponen manapun
 * tanpa perlu prop drilling.
 */
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation harus digunakan di dalam NavigationProvider');
  }
  return context;
}
