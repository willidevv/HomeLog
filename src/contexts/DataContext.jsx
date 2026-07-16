import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { db, appId } from '../config/Firebase';
import { useAuth } from './AuthContext';
import { useNavigation } from './NavigationContext';
import { useFirestoreData } from '../hooks/useFirestoreData';

// CRUD Services
import { deletePlan } from '../services/PlanService';
import { deleteRoom } from '../services/RoomService';
import { deleteItem } from '../services/ItemService';
import { deleteMaintenanceRecord } from '../services/MaintenanceService';

/**
 * DataContext
 *
 * Tanggung jawab:
 *   1. Data fetching — mengonsumsi useFirestoreData untuk raw data
 *   2. Active entity selectors — derivasi activePlan, activeRoom, activeItem
 *      dari navigation IDs + raw data
 *   3. Filtered selectors — data yang sudah difilter per view
 *      (filteredRooms, filteredItems, filteredRecords)
 *   4. CRUD delete — handleDelete dengan navigasi side-effect
 *   5. Loading/error state — diteruskan ke consumer
 *
 * Yang TIDAK boleh ada di sini:
 *   - UI rendering
 *   - Form state
 *   - Modal state
 *   - Create/Update operations (sudah ada di ModalForm via services langsung)
 *
 * Keputusan desain:
 *   Filtered selectors diletakkan di sini (bukan di setiap page) agar:
 *   - Filtering logic terpusat dan mudah diubah
 *   - Pages menjadi murni presentational tanpa logika derivasi
 *   - Konsisten: semua page mendapat data yang sudah siap pakai
 */

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const { activePlanId, activeRoomId, activeItemId, goBack } = useNavigation();

  // Raw data dari Firestore
  const { homePlans, rooms, items, maintenanceRecords, loading, error } = useFirestoreData(user, appId, db);

  // --- Active Entity Selectors ---
  // Memoized: hanya recompute saat array atau active ID berubah

  const activePlan = useMemo(
    () => homePlans.find(p => p.id === activePlanId) ?? null,
    [homePlans, activePlanId]
  );

  const activeRoom = useMemo(
    () => rooms.find(r => r.id === activeRoomId) ?? null,
    [rooms, activeRoomId]
  );

  const activeItem = useMemo(
    () => items.find(i => i.id === activeItemId) ?? null,
    [items, activeItemId]
  );

  // --- Filtered Selectors ---
  // Menyediakan data yang sudah siap pakai untuk setiap view

  const filteredRooms = useMemo(
    () => rooms.filter(r => r.homePlanId === activePlanId),
    [rooms, activePlanId]
  );

  const filteredItems = useMemo(
    () => items.filter(i => i.roomId === activeRoomId),
    [items, activeRoomId]
  );

  const filteredRecords = useMemo(
    () => maintenanceRecords.filter(m => m.itemId === activeItemId),
    [maintenanceRecords, activeItemId]
  );

  // --- CRUD Delete Dispatcher ---

  const handleDelete = useCallback(async (type, id) => {
    if (!user) return;
    const authConfig = { appId, userId: user.uid };

    try {
      switch (type) {
        case 'plan':
          await deletePlan(db, authConfig, id);
          if (activePlanId === id) goBack('dashboard');
          break;
        case 'room':
          await deleteRoom(db, authConfig, id);
          if (activeRoomId === id) goBack('plan');
          break;
        case 'item':
          await deleteItem(db, authConfig, id);
          if (activeItemId === id) goBack('room');
          break;
        case 'maintenance':
          await deleteMaintenanceRecord(db, authConfig, id);
          break;
        default:
          throw new Error(`Tipe data tidak dikenali: ${type}`);
      }
    } catch (err) {
      console.error(`Gagal menghapus ${type} [${id}]:`, err);
      alert(`Gagal menghapus data: ${err.message}`);
    }
  }, [user, activePlanId, activeRoomId, activeItemId, goBack]);

  const value = useMemo(() => ({
    // Raw collections (untuk komponen yang butuh semua data, misal: counter di DashboardPage)
    homePlans,
    rooms,
    items,
    maintenanceRecords,

    // Active entity objects (sudah resolved dari ID)
    activePlan,
    activeRoom,
    activeItem,

    // Pre-filtered data per view
    filteredRooms,
    filteredItems,
    filteredRecords,

    // Operations
    handleDelete,

    // State
    loading,
    error,
  }), [
    homePlans, rooms, items, maintenanceRecords,
    activePlan, activeRoom, activeItem,
    filteredRooms, filteredItems, filteredRecords,
    handleDelete,
    loading, error,
  ]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

/**
 * useData()
 *
 * Hook utama untuk mengakses semua data, active entities,
 * filtered selectors, dan CRUD operations dari komponen manapun.
 */
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData harus digunakan di dalam DataProvider');
  }
  return context;
}
