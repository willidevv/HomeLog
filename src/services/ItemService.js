import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const getBasePath = (appId, userId) => ['artifacts', appId, 'users', userId];

/**
 * Membuat barang baru di bawah ruangan tertentu.
 * @param {import("firebase/firestore").Firestore} db 
 * @param {{appId: string, userId: string}} authConfig 
 * @param {{roomId: string, name: string, description: string, purchaseDate: string}} itemData 
 */
export async function createItem(db, { appId, userId }, { roomId, name, description, purchaseDate }) {
  if (!userId || !appId || !roomId) throw new Error('Missing required identifiers');
  if (!name?.trim()) throw new Error('Item name is required');

  try {
    const path = collection(db, ...getBasePath(appId, userId), 'items');
    const docRef = await addDoc(path, {
      roomId,
      name: name.trim(),
      description: description || '',
      purchaseDate: purchaseDate || '',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Failed to create item inside service:', error);
    throw error;
  }
}

/**
 * Memperbarui data barang.
 * @param {import("firebase/firestore").Firestore} db 
 * @param {{appId: string, userId: string}} authConfig 
 * @param {string} itemId 
 * @param {{name: string, description: string, purchaseDate: string}} itemData 
 */
export async function updateItem(db, { appId, userId }, itemId, { name, description, purchaseDate }) {
  if (!userId || !appId || !itemId) throw new Error('Missing required identifiers');
  if (!name?.trim()) throw new Error('Item name is required');

  try {
    const docRef = doc(db, ...getBasePath(appId, userId), 'items', itemId);
    await updateDoc(docRef, {
      name: name.trim(),
      description: description || '',
      purchaseDate: purchaseDate || '',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Failed to update item ${itemId} inside service:`, error);
    throw error;
  }
}

/**
 * Menghapus barang.
 * @param {import("firebase/firestore").Firestore} db 
 * @param {{appId: string, userId: string}} authConfig 
 * @param {string} itemId 
 */
export async function deleteItem(db, { appId, userId }, itemId) {
  if (!userId || !appId || !itemId) throw new Error('Missing required identifiers');
  try {
    const docRef = doc(db, ...getBasePath(appId, userId), 'items', itemId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Failed to delete item ${itemId}:`, error);
    throw error;
  }
}