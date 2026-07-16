import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DataProvider } from './contexts/DataContext';
import { ModalProvider } from './contexts/ModalContext';
import AppLayout from './layouts/AppLayout';

/**
 * App
 *
 * Application shell — hanya menyusun Provider tree dan merender AppLayout.
 * Tidak ada state, tidak ada hooks, tidak ada business logic.
 *
 * Urutan Provider (dari luar ke dalam):
 *   AuthProvider       → user session, login/logout
 *   NavigationProvider → active plan/room/item IDs (depends on auth for reset)
 *   DataProvider       → Firestore data + CRUD (depends on auth + navigation)
 *   ModalProvider      → modal state (depends on nothing, tapi dipakai oleh layout)
 */
export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <DataProvider>
          <ModalProvider>
            <AppLayout />
          </ModalProvider>
        </DataProvider>
      </NavigationProvider>
    </AuthProvider>
  );
}
