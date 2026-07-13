import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc,
  writeBatch
} from "firebase/firestore";

// PERBAIKAN: Muat berkas .env secara manual untuk lingkungan Node.js terminal
import dotenv from "dotenv";
dotenv.config(); 

const firebaseConfig = {
    // Karena di .env Anda memakai prefix VITE_, di Node.js kita panggil via process.env memakai nama asli tersebut
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = firebaseConfig.appId;

// Anda bisa menambahkan variabel khusus seeder di .env Anda nanti jika ingin dinamis
const SEED_EMAIL = process.env.SEED_EMAIL || "developer@homelog.com";
const SEED_PASSWORD = process.env.SEED_PASSWORD || "password123";


// ... [SEED_DATASET Anda tetap sama] ...

async function runBulkSeeder() {
  console.log("=== MEMULAI BULK SEEDING DENGAN OPTIMALISASI BATCH ===");
  let uid = null;

  // PROSES AUTENTIKASI (Sudah optimal dengan logika Anda)
  try {
    const userCredential = await signInWithEmailAndPassword(auth, SEED_EMAIL, SEED_PASSWORD);
    uid = userCredential.user.uid;
    console.log(` Akun ditemukan! UID: ${uid}`);
  } catch (error) {
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, SEED_EMAIL, SEED_PASSWORD);
        uid = userCredential.user.uid;
        console.log(` Akun baru berhasil dibuat! UID: ${uid}`);
      } catch (createError) {
        console.error(" Gagal membuat akun baru:", createError.message);
        return;
      }
    } else {
      console.error(" Terjadi kendala autentikasi:", error.message);
      return;
    }
  }

  // PROSES INJEKSI DATA DENGAN FIRESTORE BATCH
  try {
    console.log("\nMemulai pembuatan dokumen dengan Firestore Batch...");
    
    // Menggunakan WriteBatch untuk menggabungkan banyak penulisan ke dalam 1 request jaringan
    const batch = writeBatch(db);
    const timestamp = Date.now();
    const basePath = `artifacts/${appId}/users/${uid}`;

    for (const planData of SEED_DATASET) {
      // Buat referensi dokumen baru kosong untuk mendapatkan ID-nya secara lokal sebelum dikirim
      const planRef = doc(collection(db, `${basePath}/homePlans`));
      batch.set(planRef, {
        name: planData.planName,
        createdAt: timestamp
      });
      console.log(`[BATCH ADD] Denah: "${planData.planName}"`);

      for (const roomData of planData.rooms) {
        const roomRef = doc(collection(db, `${basePath}/rooms`));
        batch.set(roomRef, {
          homePlanId: planRef.id,
          name: roomData.roomName,
          description: roomData.description,
          createdAt: timestamp
        });

        for (const itemData of roomData.items) {
          const itemRef = doc(collection(db, `${basePath}/items`));
          batch.set(itemRef, {
            roomId: roomRef.id,
            name: itemData.itemName,
            description: itemData.description,
            purchaseDate: itemData.purchaseDate,
            createdAt: timestamp
          });

          for (const maintData of itemData.maintenances) {
            const maintRef = doc(collection(db, `${basePath}/maintenanceRecords`));
            batch.set(maintRef, {
              itemId: itemRef.id,
              maintenanceDate: maintData.date,
              maintenanceType: maintData.type,
              notes: maintData.notes,
              createdAt: timestamp
            });
          }
        }
      }
    }

    // Eksekusi semua data sekaligus ke server
    console.log("\nMengirim batch data ke Firestore...");
    await batch.commit();
    
    console.log("=== SEEDING SELESAI DAN BERHASIL DIKOMIT ===");

  } catch (dbError) {
    console.error(" Gagal mengeksekusi Batch Seeder:", dbError.message);
  }
}

runBulkSeeder();