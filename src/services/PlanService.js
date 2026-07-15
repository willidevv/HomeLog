import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Mendapatkan basis path array untuk dokumen user
 * @param {string} appId 
 * @param {string} userId 
 * @returns {string[]}
 */
const getBasePath = (appId, userId) => ['artifacts', appId, 'users', userId];

/**
 * Membuat rencana rumah (home plan) baru.
 * @param {import("firebase/firestore").Firestore} db 
 * @param {{appId: string, userId: string}} authConfig 
 * @param {{name: string}} planData 
 */
export async function createPlan(db, { appId, userId }, { name }) {
  if (!userId || !appId) throw new Error('Missing authentication configuration');
  if (!name?.trim()) throw new Error('Plan name is required');
  try {
    const path = collection(db, ...getBasePath(appId, userId), 'homePlans');

    const docRef = await addDoc(path, {
      name: name.trim(),
      createdAt: serverTimestamp(), // Menggunakan waktu server (Best Practice)
    });
    return docRef.id;
  } catch (error) {
    console.error('Failed to create plan inside service:', error);
    throw error; // Lempar balik ke UI agar UI tahu ada error
  }
}

/**
 * Memperbarui rencana rumah yang sudah ada.
 * @param {import("firebase/firestore").Firestore} db 
 * @param {{appId: string, userId: string}} authConfig 
 * @param {string} planId 
 * @param {{name: string}} planData 
 */
export async function updatePlan(db, { appId, userId }, planId, { name }) {
  if (!userId || !appId || !planId) throw new Error('Missing required identifiers');
  if (!name?.trim()) throw new Error('Plan name is required');

  try {
    const docRef = doc(db, ...getBasePath(appId, userId), 'homePlans', planId);
    await updateDoc(docRef, {
      name: name.trim(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Failed to update plan ${planId} inside service:`, error);
    throw error;
  }
}

/**
 * Menghapus rencana rumah (CRUD Lengkap).
 * @param {import("firebase/firestore").Firestore} db 
 * @param {{appId: string, userId: string}} authConfig 
 * @param {string} planId 
 */
export async function deletePlan(db, { appId, userId }, planId) {
  if (!userId || !appId || !planId) throw new Error('Missing required identifiers');
  try {
    const docRef = doc(db, ...getBasePath(appId, userId), 'homePlans', planId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Failed to delete plan ${planId}:`, error);
    throw error;
  }
}