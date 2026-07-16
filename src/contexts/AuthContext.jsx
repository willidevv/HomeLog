/**
 * Re-export dari lokasi lama agar semua import baru ke 'contexts/AuthContext'
 * tetap berfungsi selama migrasi bertahap.
 *
 * File asli di src/context/AuthContext.jsx akan dihapus di Phase 5
 * setelah semua import sudah diperbarui.
 */
export { AuthProvider, useAuth } from '../context/AuthContext';
