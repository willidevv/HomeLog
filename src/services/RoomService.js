import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const getBasePath = (appId, userId) => ['artifacts', appId, 'users', userId];

/**
 * Membuat ruangan baru di bawah plan tertentu.
 * @param {import("firebase/firestore").Firestore} db 
 * @param {{appId: string, userId: string}} authConfig 
 * @param {{homePlanId: string, name: string, description: string}} roomData 
 */
export async function createRoom(db, { appId, userId }, { homePlanId, name, description }) {
  if (!userId || !appId || !homePlanId) throw new Error('Missing required identifiers');
  if (!name?.trim()) throw new Error('Room name is required');

  try {
    const path = collection(db, ...getBasePath(appId, userId), 'rooms');
    const docRef = await addDoc(path, {
      homePlanId,
      name: name.trim(),
      description: description || '',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Failed to create room inside service:', error);
    throw error;
  }
}

/**
 * Memperbarui data ruangan.
 * @param {import("firebase/firestore").Firestore} db 
 * @param {{appId: string, userId: string}} authConfig 
 * @param {string} roomId 
 * @param {{name: string, description: string}} roomData 
 */
export async function updateRoom(db, { appId, userId }, roomId, { name, description }) {
  if (!userId || !appId || !roomId) throw new Error('Missing required identifiers');
  if (!name?.trim()) throw new Error('Room name is required');

  try {
    const docRef = doc(db, ...getBasePath(appId, userId), 'rooms', roomId);
    await updateDoc(docRef, {
      name: name.trim(),
      description: description || '',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Failed to update room ${roomId} inside service:`, error);
    throw error;
  }
}

/**
 * Menghapus ruangan.
 * @param {import("firebase/firestore").Firestore} db 
 * @param {{appId: string, userId: string}} authConfig 
 * @param {string} roomId 
 */
export async function deleteRoom(db, { appId, userId }, roomId) {
  if (!userId || !appId || !roomId) throw new Error('Missing required identifiers');
  try {
    const docRef = doc(db, ...getBasePath(appId, userId), 'rooms', roomId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Failed to delete room ${roomId}:`, error);
    throw error;
  }
}