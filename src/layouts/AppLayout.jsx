import React from 'react';
import Header from '../components/layout/Header';
import ModalForm from '../components/common/Modal/ModalForm';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useData } from '../contexts/DataContext';

import LoginView from '../pages/Login/LoginPage';
import DashboardView from '../pages/Dashboard/DashboardPage';
import PlanView from '../pages/Plan/PlanPage';
import RoomView from '../pages/Room/RoomPage';
import ItemDetailView from '../pages/ItemDetail/ItemDetailPage';

/**
 * AppLayout
 *
 * Tanggung jawab:
 *   - Menentukan apa yang dirender berdasarkan auth + navigation state
 *   - Menyusun struktur visual: Header / main / ModalForm
 *   - Menampilkan loading screen dan login gate
 *
 * Yang TIDAK boleh ada di sini:
 *   - Business logic
 *   - CRUD operations
 *   - State management
 *   - Context definitions
 *
 * Ini adalah satu-satunya tempat di mana "view mana yang aktif" diputuskan.
 * Setiap view yang dirender tidak menerima props — mereka self-contained
 * via context hooks masing-masing.
 */
export default function AppLayout() {
  const { user, loading: authLoading } = useAuth();
  const { loading: dataLoading } = useData();
  const { activePlanId, activeRoomId, activeItemId } = useNavigation();

  // Loading screen — ditampilkan saat auth belum settled atau data belum tiba
  if (authLoading || (user && dataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-900 to-cream-50">
        <p className="text-gold-400 animate-pulse font-medium">Memuat sistem HomeLog...</p>
      </div>
    );
  }

  // Login gate — redirect ke login jika belum autentikasi
  if (!user) return <LoginView />;

  // View resolver — menentukan halaman aktif berdasarkan navigation depth
  const ActiveView = () => {
    if (activeItemId) return <ItemDetailView />;
    if (activeRoomId) return <RoomView />;
    if (activePlanId) return <PlanView />;
    return <DashboardView />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-900 to-cream-50 font-sans text-cream-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
        <ActiveView />
      </main>
      <ModalForm />
    </div>
  );
}
