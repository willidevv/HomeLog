import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc 
} from "firebase/firestore";

// 1. Kredensial Firebase Proyek HomeLog Anda
const firebaseConfig = {
    apiKey: "AIzaSyDBO-Ub2VcC9lX_TSgwEqlGYCRksOfbFuE",
    authDomain: "homelog-6ef4f.firebaseapp.com",
    projectId: "homelog-6ef4f",
    storageBucket: "homelog-6ef4f.firebasestorage.app",
    messagingSenderId: "522271513806",
    appId: "1:522271513806:web:0d36457caf6af1e207049f",
    measurementId: "G-8Y8X1S2VY7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = firebaseConfig.appId;

// Kredensial Akun Tester
const SEED_EMAIL = "developer@homelog.com";
const SEED_PASSWORD = "password123";

// 2. BLUEPRINT DATASET MOCKUP (Gaya Laravel Factory / Relasional)
const SEED_DATASET = [
  {
    planName: "Rumah Utama (Jakarta)",
    rooms: [
      {
        roomName: "Ruang Tamu",
        description: "Lantai 1, dekat pintu masuk utama",
        items: [
          {
            itemName: "AC Daikin Inverter 1 PK",
            description: "Unit pendingin ruangan keluarga",
            purchaseDate: "2025-06-10",
            maintenances: [
              { type: "Cuci AC Berkala", date: "2026-03-15", notes: "Filter dibersihkan, freon penuh." },
              { type: "Cek Remote & Sensor", date: "2026-06-20", notes: "Ganti baterai remote, sensor normal." }
            ]
          },
          {
            itemName: "Smart TV LG 55 Inch",
            description: "TV utama untuk keluarga",
            purchaseDate: "2025-08-12",
            maintenances: [
              { type: "Pembersihan Panel", date: "2026-01-10", notes: "Lap debu dan cek port HDMI." }
            ]
          }
        ]
      },
      {
        roomName: "Dapur Bersih",
        description: "Lantai 1, bersebelahan dengan ruang makan",
        items: [
          {
            itemName: "Kulkas Samsung 2 Pintu",
            description: "Lemari es penyimpan bahan makanan",
            purchaseDate: "2024-11-05",
            maintenances: [
              { type: "Kuras Defrost", date: "2025-12-01", notes: "Pembersihan bunga es dan karet pintu." }
            ]
          }
        ]
      }
    ]
  },
  {
    planName: "Villa Puncak (Bogor)",
    rooms: [
      {
        roomName: "Kamar Tidur Utama",
        description: "Lantai 2, menghadap langsung ke gunung",
        items: [
          {
            itemName: "Water Heater Ariston",
            description: "Pemanas air kamar mandi dalam",
            purchaseDate: "2025-01-20",
            maintenances: [
              { type: "Cek Kelistrikan & Anode", date: "2026-02-18", notes: "Anode magnesium masih bagus, pemanas aman." }
            ]
          }
        ]
      },
      {
        roomName: "Area Luar / Taman",
        description: "Halaman belakang dekat kolam renang",
        items: [
          {
            itemName: "Pompa Air Sumur Grundfos",
            description: "Pompa utama pengisi tandon air",
            purchaseDate: "2024-05-14",
            maintenances: [
              { type: "Pelumasan Bearing Motor", date: "2025-08-22", notes: "Suara pompa halus kembali setelah diberi oli." }
            ]
          }
        ]
      }
    ]
  }
];

async function runBulkSeeder() {
  console.log("=== MEMULAI BULK SEEDING (GAYA MULTI-RELASI LARAVEL) ===");
  let uid = null;

  // PROSES AUTENTIKASI OTOMATIS
  try {
    console.log(`Memeriksa akun tester: ${SEED_EMAIL}...`);
    const userCredential = await signInWithEmailAndPassword(auth, SEED_EMAIL, SEED_PASSWORD);
    uid = userCredential.user.uid;
    console.log(` Akun ditemukan! UID: ${uid}`);
  } catch (error) {
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
      console.log("Akun belum ada. Membuat akun pengguna baru...");
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

  // PROSES LOOPING BULK DATA KE FIRESTORE
  try {
    console.log("\nMemulai injeksi bulk data ke Firestore...");
    const basePath = ['artifacts', appId, 'users', uid];

    // LOOP 1: Menanam Banyak Denah Rumah (Plans)
    for (const planData of SEED_DATASET) {
      const planRef = await addDoc(collection(db, ...basePath, 'homePlans'), {
        name: planData.planName,
        createdAt: Date.now()
      });
      console.log(`[DENAH] Berhasil dibuat: "${planData.planName}" (ID: ${planRef.id})`);

      // LOOP 2: Menanam Banyak Ruangan (Rooms) di dalam Denah saat ini
      for (const roomData of planData.rooms) {
        const roomRef = await addDoc(collection(db, ...basePath, 'rooms'), {
          homePlanId: planRef.id,
          name: roomData.roomName,
          description: roomData.description,
          createdAt: Date.now()
        });
        console.log(`  └─ [RUANGAN] Berhasil dibuat: "${roomData.roomName}"`);

        // LOOP 3: Menanam Banyak Barang (Items) di dalam Ruangan saat ini
        for (const itemData of roomData.items) {
          const itemRef = await addDoc(collection(db, ...basePath, 'items'), {
            roomId: roomRef.id,
            name: itemData.itemName,
            description: itemData.description,
            purchaseDate: itemData.purchaseDate,
            createdAt: Date.now()
          });
          console.log(`      └─ [BARANG] Berhasil dibuat: "${itemData.itemName}"`);

          // LOOP 4: Menanam Banyak Riwayat Perawatan (Maintenance) di dalam Barang saat ini
          for (const maintData of itemData.maintenances) {
            await addDoc(collection(db, ...basePath, 'maintenanceRecords'), {
              itemId: itemRef.id,
              maintenanceDate: maintData.date,
              maintenanceType: maintData.type,
              notes: maintData.notes,
              createdAt: Date.now()
            });
            console.log(`          └─ [PERAWATAN] Catatan ditambahkan: "${maintData.type}"`);
          }
        }
      }
      console.log(""); // Spasi antar denah rumah
    }

    console.log("=== SEEDING BANYAK DATA SELESAI DENGAN SUKSES ===");
    console.log(`Silakan buka aplikasi dan login dengan:`);
    console.log(`Email    : ${SEED_EMAIL}`);
    console.log(`Password : ${SEED_PASSWORD}`);

  } catch (dbError) {
    console.error(" Gagal menanam bulk data ke Firestore:", dbError.message);
  }
}

runBulkSeeder();