import React, { useState, useMemo, useEffect } from 'react';
import { db, appId } from './config/Firebase';
import Header from './components/layout/Header';
import ModalForm from './components/common/Modal/ModalForm';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useHomePlans } from './hooks/UseHomePlans';

// Import Views / Pages
import LoginView from './pages/Login/LoginPage';
import DashboardView from './pages/Dashboard/DashboardPage';
import PlanView from './pages/Plan/PlanPage';
import RoomView from './pages/Room/RoomPage';
import ItemDetailView from './pages/ItemDetail/ItemDetailPage';

function MainApp() {
  const { user, loading: authLoading } = useAuth();
  const { homePlans, rooms, items, maintenanceRecords, loading: dataLoading } = useHomePlans(user, appId, db);

  const [activePlanId, setActivePlanId] = useState(null);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, data: null });

  // Kembalikan fungsi openModal agar tidak error di komponen anak
  const openModal = (type, data = null) => setModalConfig({ isOpen: true, type, data });

  // Reset view/route states when user logs out
  useEffect(() => {
    if (!user) {
      setActivePlanId(null);
      setActiveRoomId(null);
      setActiveItemId(null);
    }
  }, [user]);

  const activePlan = useMemo(() => homePlans.find(p => p.id === activePlanId), [homePlans, activePlanId]);
  const activeRoom = useMemo(() => rooms.find(r => r.id === activeRoomId), [rooms, activeRoomId]);
  const activeItem = useMemo(() => items.find(i => i.id === activeItemId), [items, activeItemId]);

  if (authLoading || (user && dataLoading)) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-slate-500 animate-pulse font-medium">Memuat sistem HomeLog...</p></div>;
  }
  if (!user) return <LoginView />;

  // Oper openModal (bukan setModalConfig) ke semua View
  const renderActiveView = () => {
    if (activeItemId) return <ItemDetailView activeRoom={activeRoom} activeItem={activeItem} filteredRecords={maintenanceRecords.filter(m => m.itemId === activeItemId)} openModal={openModal} setActiveItemId={setActiveItemId} />;
    if (activeRoomId) return <RoomView activePlan={activePlan} activeRoom={activeRoom} filteredItems={items.filter(i => i.roomId === activeRoomId)} maintenanceRecords={maintenanceRecords} openModal={openModal} setActiveRoomId={setActiveRoomId} setActiveItemId={setActiveItemId} />;
    if (activePlanId) return <PlanView activePlan={activePlan} filteredRooms={rooms.filter(r => r.homePlanId === activePlanId)} items={items} openModal={openModal} setActivePlanId={setActivePlanId} setActiveRoomId={setActiveRoomId} />;
    return <DashboardView homePlans={homePlans} rooms={rooms} openModal={openModal} setActivePlanId={setActivePlanId} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header user={user} activePlan={activePlan} activeRoom={activeRoom} activeItem={activeItem} setActivePlanId={setActivePlanId} setActiveRoomId={setActiveRoomId} setActiveItemId={setActiveItemId} />
      <main className="max-w-6xl mx-auto px-4 py-8 pb-24">{renderActiveView()}</main>
      <ModalForm modalConfig={modalConfig} closeModal={() => setModalConfig({ isOpen: false, type: null, data: null })} activeIds={{ activePlanId, activeRoomId, activeItemId }} />
    </div>
  );

}

export default function App() {
  return <AuthProvider><MainApp /></AuthProvider>;
}