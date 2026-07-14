import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

// Konfigurasi & Layout global
import { db, appId } from './config/Firebase';
import Header from './components/layout/Header';
import ModalForm from './components/common/Modal/ModalForm';

// Import Auth Context & Views Terpisah
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginView from './pages/Login/LoginPage';
import DashboardView from './pages/Dashboard/DashboardPage';
import PlanView from './pages/Plan/PlanPage';
import RoomView from './pages/Room/RoomPage';
import ItemDetailView from './pages/ItemDetail/ItemDetailPage';

function MainApp() {
  // Mengambil state dan fungsi autentikasi global dari AuthContext
  const { user, logout, loading } = useAuth();

  // Data States
  const [homePlans, setHomePlans] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [items, setItems] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);

  // Navigation States
  const [activePlanId, setActivePlanId] = useState(null);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);

  // Modal States
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, data: null });

  // --- DATA FETCHING (Real-Time Listener) ---
  useEffect(() => {
    // Hanya lakukan fetching jika user telah berhasil login
    if (!user) return;
    
    const basePath = ['artifacts', appId, 'users', user.uid];

    const unsubPlans = onSnapshot(collection(db, ...basePath, 'homePlans'), (snap) => setHomePlans(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.createdAt - a.createdAt)));
    const unsubRooms = onSnapshot(collection(db, ...basePath, 'rooms'), (snap) => setRooms(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.createdAt - a.createdAt)));
    const unsubItems = onSnapshot(collection(db, ...basePath, 'items'), (snap) => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.createdAt - a.createdAt)));
    const unsubRecords = onSnapshot(collection(db, ...basePath, 'maintenanceRecords'), (snap) => setMaintenanceRecords(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.createdAt - a.createdAt)));

    return () => { unsubPlans(); unsubRooms(); unsubItems(); unsubRecords(); };
  }, [user]);

  // --- DERIVED DATA & MEMO ---
  const activePlan = homePlans.find(p => p.id === activePlanId);
  const activeRoom = rooms.find(r => r.id === activeRoomId);
  const activeItem = items.find(i => i.id === activeItemId);

  const filteredRooms = useMemo(() => rooms.filter(r => r.homePlanId === activePlanId), [rooms, activePlanId]);
  const filteredItems = useMemo(() => items.filter(i => i.roomId === activeRoomId), [items, activeRoomId]);
  const filteredRecords = useMemo(() => maintenanceRecords.filter(m => m.itemId === activeItemId), [maintenanceRecords, activeItemId]);

  // --- CRUD OPERATIONS ---
  const handleSaveData = async (formData) => {
    if (!user) return;
    const basePath = ['artifacts', appId, 'users', user.uid];
    
    try {
      if (modalConfig.type === 'plan') {
        const path = collection(db, ...basePath, 'homePlans');
        modalConfig.data?.id 
          ? await updateDoc(doc(db, ...basePath, 'homePlans', modalConfig.data.id), { name: formData.name })
          : await addDoc(path, { name: formData.name, createdAt: Date.now() });
      } 
      else if (modalConfig.type === 'room') {
        const path = collection(db, ...basePath, 'rooms');
        modalConfig.data?.id
          ? await updateDoc(doc(db, ...basePath, 'rooms', modalConfig.data.id), { name: formData.name, description: formData.description })
          : await addDoc(path, { homePlanId: activePlanId, name: formData.name, description: formData.description, createdAt: Date.now() });
      }
      else if (modalConfig.type === 'item') {
        const path = collection(db, ...basePath, 'items');
        modalConfig.data?.id
          ? await updateDoc(doc(db, ...basePath, 'items', modalConfig.data.id), { name: formData.name, description: formData.description, purchaseDate: formData.purchaseDate })
          : await addDoc(path, { roomId: activeRoomId, name: formData.name, description: formData.description, purchaseDate: formData.purchaseDate, createdAt: Date.now() });
      }
      else if (modalConfig.type === 'maintenance') {
        const path = collection(db, ...basePath, 'maintenanceRecords');
        modalConfig.data?.id
          ? await updateDoc(doc(db, ...basePath, 'maintenanceRecords', modalConfig.data.id), { maintenanceDate: formData.maintenanceDate, maintenanceType: formData.maintenanceType, notes: formData.notes })
          : await addDoc(path, { itemId: activeItemId, maintenanceDate: formData.maintenanceDate, maintenanceType: formData.maintenanceType, notes: formData.notes, createdAt: Date.now() });
      }
      closeModal();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleDelete = async (type, id) => {
    if (!user) return;
    const basePath = ['artifacts', appId, 'users', user.uid];
    try {
      const collectionMap = { plan: 'homePlans', room: 'rooms', item: 'items', maintenance: 'maintenanceRecords' };
      await deleteDoc(doc(db, ...basePath, collectionMap[type], id));
      
      if (type === 'plan' && activePlanId === id) setActivePlanId(null);
      if (type === 'room' && activeRoomId === id) setActiveRoomId(null);
      if (type === 'item' && activeItemId === id) setActiveItemId(null);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const openModal = (type, data = null) => setModalConfig({ isOpen: true, type, data });
  const closeModal = () => setModalConfig({ isOpen: false, type: null, data: null });

  // --- PROTEKSI RUTE DAN AUTENTIKASI ---
  // 1. Tampilkan indikator memuat jika status autentikasi masih dicek oleh Firebase Auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 animate-pulse font-medium">Memuat Autentikasi HomeLog...</p>
      </div>
    );
  }

  // 2. Jika tidak ada sesi pengguna yang aktif, tampilkan form login
  if (!user) {
    return <LoginView />;
  }

  // --- ROUTING / CONDITIONAL VIEW RENDER ---
  const renderActiveView = () => {
    if (activeItemId) {
      return (
        <ItemDetailView 
          activeRoom={activeRoom} activeItem={activeItem} filteredRecords={filteredRecords}
          openModal={openModal} handleDelete={handleDelete} setActiveItemId={setActiveItemId}
        />
      );
    }
    if (activeRoomId) {
      return (
        <RoomView 
          activePlan={activePlan} activeRoom={activeRoom} filteredItems={filteredItems} maintenanceRecords={maintenanceRecords}
          openModal={openModal} handleDelete={handleDelete} setActiveRoomId={setActiveRoomId} setActiveItemId={setActiveItemId}
        />
      );
    }
    if (activePlanId) {
      return (
        <PlanView 
          activePlan={activePlan} filteredRooms={filteredRooms} items={items}
          openModal={openModal} handleDelete={handleDelete} setActivePlanId={setActivePlanId} setActiveRoomId={setActiveRoomId}
        />
      );
    }
    return (
      <DashboardView 
        homePlans={homePlans} rooms={rooms} 
        openModal={openModal} handleDelete={handleDelete} setActivePlanId={setActivePlanId}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header 
        user={user} activePlan={activePlan} activeRoom={activeRoom} activeItem={activeItem}
        setActivePlanId={setActivePlanId} setActiveRoomId={setActiveRoomId} setActiveItemId={setActiveItemId}
      />

      <main className="max-w-6xl mx-auto px-4 py-8 pb-24">
        {renderActiveView()}
      </main>

      <ModalForm 
        modalConfig={modalConfig} closeModal={closeModal} handleSaveData={handleSaveData} 
      />
    </div>
  );
}

// Ekspor default membungkus MainApp dengan AuthProvider global agar context bekerja dengan baik
export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}