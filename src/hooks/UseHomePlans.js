import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';

/**
 * Custom Hook untuk melakukan real-time fetching data home plans, rooms, items, 
 * dan maintenance records berdasarkan user yang sedang aktif.
 * 
 * @param {Object} user - Objek user dari Firebase Auth
 * @param {string} appId - ID aplikasi Anda
 * @param {Object} db - Instance Firestore database Anda
 */
export function useHomePlans(user, appId, db) {
  const [homePlans, setHomePlans] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [items, setItems] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Validasi Awal: Jika user belum login atau DB belum siap, kosongkan state
    if (!user || !appId || !db) {
      setHomePlans([]);
      setRooms([]);
      setItems([]);
      setMaintenanceRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const basePath = ['artifacts', appId, 'users', user.uid];

    // Helper untuk memetakan dokumen & menyortir berdasarkan tanggal secara aman
    const processSnapshot = (snapshot) => {
      return snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          // Mengantisipasi jika createdAt berupa Firebase Timestamp, Date, atau masih null (pending write)
          const timeA = a.createdAt?.seconds || a.createdAt?.getTime?.() || a.createdAt || 0;
          const timeB = b.createdAt?.seconds || b.createdAt?.getTime?.() || b.createdAt || 0;
          return timeB - timeA; // Urutan DESC (terbaru dahulu)
        });
    };

    // Tracker untuk memastikan semua snapshot pertama kali sudah masuk sebelum mematikan loading
    const loadStatus = {
      plans: false,
      rooms: false,
      items: false,
      records: false,
    };

    const checkLoadingFinished = () => {
      if (
        loadStatus.plans &&
        loadStatus.rooms &&
        loadStatus.items &&
        loadStatus.records
      ) {
        setLoading(false);
      }
    };

    // 2. Real-Time Listeners dengan Penanganan Error
    const unsubPlans = onSnapshot(
      collection(db, ...basePath, 'homePlans'),
      (snap) => {
        setHomePlans(processSnapshot(snap));
        loadStatus.plans = true;
        checkLoadingFinished();
      },
      (err) => {
        console.error('Error fetching homePlans:', err);
        setError(err);
      }
    );

    const unsubRooms = onSnapshot(
      collection(db, ...basePath, 'rooms'),
      (snap) => {
        setRooms(processSnapshot(snap));
        loadStatus.rooms = true;
        checkLoadingFinished();
      },
      (err) => {
        console.error('Error fetching rooms:', err);
        setError(err);
      }
    );

    const unsubItems = onSnapshot(
      collection(db, ...basePath, 'items'),
      (snap) => {
        setItems(processSnapshot(snap));
        loadStatus.items = true;
        checkLoadingFinished();
      },
      (err) => {
        console.error('Error fetching items:', err);
        setError(err);
      }
    );

    const unsubRecords = onSnapshot(
      collection(db, ...basePath, 'maintenanceRecords'),
      (snap) => {
        setMaintenanceRecords(processSnapshot(snap));
        loadStatus.records = true;
        checkLoadingFinished();
      },
      (err) => {
        console.error('Error fetching maintenanceRecords:', err);
        setError(err);
      }
    );

    // 3. Cleanup Function: Memutus semua listener saat komponen unmount atau dependensi berubah
    return () => {
      unsubPlans();
      unsubRooms();
      unsubItems();
      unsubRecords();
    };
  }, [user, appId, db]); // Dependensi yang memicu pembaruan listener jika berubah

  return {
    homePlans,
    rooms,
    items,
    maintenanceRecords,
    loading,
    error,
  };
}