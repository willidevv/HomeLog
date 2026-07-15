import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const getBasePath = (appId, userId) => ['artifacts', appId, 'users', userId];

/**
 * Membuat catatan pemeliharaan baru di bawah barang tertentu.
 * @param {import("firebase/firestore").Firestore} db 
 * @param {{appId: string, userId: string}} authConfig 
 * @param {{itemId: string, maintenanceDate: string, maintenanceType: string, notes: string}} recordData 
 */
export async function createMaintenanceRecord(db, { appId, userId }, { itemId, maintenanceDate, maintenanceType, notes }) {
  if (!userId || !appId || !itemId) throw new Error('Missing required identifiers');

  try {
    const path = collection(db, ...getBasePath(appId, userId), 'maintenanceRecords');
    const docRef = await addDoc(path, {
      itemId,
      maintenanceDate: maintenanceDate || '',
      maintenanceType: maintenanceType || '',
      notes: notes || '',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Failed to create maintenance record inside service:', error);
    throw error;
  }
}

/**
 * Memperbarui catatan pemeliharaan.
 * @param {import("firebase/firestore").Firestore} db 
 * @param {{appId: string, userId: string}} authConfig 
 * @param {string} recordId 
 * @param {{maintenanceDate: string, maintenanceType: string, notes: string}} recordData 
 */
export async function updateMaintenanceRecord(db, { appId, userId }, recordId, { maintenanceDate, maintenanceType, notes }) {
  if (!userId || !appId || !recordId) throw new Error('Missing required identifiers');

  try {
    const docRef = doc(db, ...getBasePath(appId, userId), 'maintenanceRecords', recordId);
    await updateDoc(docRef, {
      maintenanceDate: maintenanceDate || '',
      maintenanceType: maintenanceType || '',
      notes: notes || '',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Failed to update maintenance record ${recordId} inside service:`, error);
    throw error;
  }
}

/**
 * Menghapus catatan pemeliharaan.
 * @param {import("firebase/firestore").Firestore} db 
 * @param {{appId: string, userId: string}} authConfig 
 * @param {string} recordId 
 */
export async function deleteMaintenanceRecord(db, { appId, userId }, recordId) {
  if (!userId || !appId || !recordId) throw new Error('Missing required identifiers');
  try {
    const docRef = doc(db, ...getBasePath(appId, userId), 'maintenanceRecords', recordId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Failed to delete maintenance record ${recordId}:`, error);
    throw error;
  }
}