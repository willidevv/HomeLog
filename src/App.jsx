// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App
import React, { useState, useEffect, useMemo } from 'react';
import { signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

// Konfigurasi & Layout global
import { auth, db, appId } from './config/firebase';
import Header from './components/layout/Header';
import ModalForm from './components/ui/ModalForm';

// Import Views Terpisah
import DashboardView from './components/views/DashboardView';
import PlanView from './components/views/PlanView';
import RoomView from './components/views/RoomView';
import ItemDetailView from './components/views/ItemDetailView';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // --- AUTHENTICATION ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- DATA FETCHING (Real-Time Listener) ---
  useEffect(() => {
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-slate-500 animate-pulse">Memuat HomeLog...</p></div>;

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