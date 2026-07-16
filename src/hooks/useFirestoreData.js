import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';

/**
 * useFirestoreData
 *
 * Tanggung jawab:
 *   - Real-time listener untuk keempat collection Firestore milik user yang aktif
 *   - Mengembalikan raw data arrays + loading/error state
 *
 * Yang TIDAK boleh ada di sini:
 *   - CRUD write/delete operations
 *   - Filtering atau derived data
 *   - Navigation logic
 *   - UI concerns
 *
 * Catatan penamaan:
 *   Hook ini sebelumnya bernama useHomePlans. Nama diperbarui karena hook ini
 *   mengelola seluruh data aplikasi (plans, rooms, items, maintenance),
 *   bukan hanya plans.
 *
 * @param {Object} user   - Firebase Auth user object
 * @param {string} appId  - Firebase App ID (untuk Firestore path)
 * @param {Object} db     - Firestore instance
 */
export function useFirestoreData(user, appId, db) {
  const [homePlans, setHomePlans] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [items, setItems] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    // Memetakan dokumen dan menyortir berdasarkan createdAt secara defensif
    // (mengantisipasi Timestamp, Date, number, atau null dari optimistic writes)
    const processSnapshot = (snapshot) => {
      return snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const timeA = a.createdAt?.seconds ?? a.createdAt?.getTime?.() ?? a.createdAt ?? 0;
          const timeB = b.createdAt?.seconds ?? b.createdAt?.getTime?.() ?? b.createdAt ?? 0;
          return timeB - timeA;
        });
    };

    // Tracker: matikan loading hanya setelah semua listener pertama kali merespons
    const loadStatus = { plans: false, rooms: false, items: false, records: false };
    const checkAllLoaded = () => {
      if (loadStatus.plans && loadStatus.rooms && loadStatus.items && loadStatus.records) {
        setLoading(false);
      }
    };

    const unsubPlans = onSnapshot(
      collection(db, ...basePath, 'homePlans'),
      (snap) => { setHomePlans(processSnapshot(snap)); loadStatus.plans = true; checkAllLoaded(); },
      (err) => { console.error('Error fetching homePlans:', err); setError(err); }
    );

    const unsubRooms = onSnapshot(
      collection(db, ...basePath, 'rooms'),
      (snap) => { setRooms(processSnapshot(snap)); loadStatus.rooms = true; checkAllLoaded(); },
      (err) => { console.error('Error fetching rooms:', err); setError(err); }
    );

    const unsubItems = onSnapshot(
      collection(db, ...basePath, 'items'),
      (snap) => { setItems(processSnapshot(snap)); loadStatus.items = true; checkAllLoaded(); },
      (err) => { console.error('Error fetching items:', err); setError(err); }
    );

    const unsubRecords = onSnapshot(
      collection(db, ...basePath, 'maintenanceRecords'),
      (snap) => { setMaintenanceRecords(processSnapshot(snap)); loadStatus.records = true; checkAllLoaded(); },
      (err) => { console.error('Error fetching maintenanceRecords:', err); setError(err); }
    );

    return () => {
      unsubPlans();
      unsubRooms();
      unsubItems();
      unsubRecords();
    };
  }, [user, appId, db]);

  return { homePlans, rooms, items, maintenanceRecords, loading, error };
}
