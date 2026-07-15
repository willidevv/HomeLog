import React from 'react';

// 1. Import Config & Context (Perhatikan path ../../../ karena posisi file di dalam folder yang dalam)
import { db, appId } from '../../../config/Firebase';
import { useAuth } from '../../../context/AuthContext';

// 2. Import CRUD Services
import { createPlan, updatePlan } from '../../../services/PlanService';
import { createRoom, updateRoom } from '../../../services/RoomService';
import { createItem, updateItem } from '../../../services/ItemService';
import { createMaintenanceRecord, updateMaintenanceRecord } from '../../../services/MaintenanceService';

// Perhatikan prop handleSaveData Dihapus, diganti dengan activeIds
export default function ModalForm({ modalConfig, closeModal, activeIds }) {
  const { user } = useAuth();

  if (!modalConfig.isOpen) return null;

  // 3. Logika handleSaveData dipindahkan ke sini
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!user) return;

    const fd = new FormData(e.target);
    const formData = Object.fromEntries(fd.entries());
    
    const authConfig = { appId, userId: user.uid };
    const isEditMode = !!modalConfig.data?.id;
    const docId = modalConfig.data?.id;

    // Menutup modal segera tanpa menunggu respon database
    closeModal();

    // Menjalankan proses penyimpanan di background
    const savePromise = (async () => {
      switch (modalConfig.type) {
        case 'plan':
          if (isEditMode) await updatePlan(db, authConfig, docId, formData);
          else await createPlan(db, authConfig, formData);
          break;
        case 'room':
          if (isEditMode) await updateRoom(db, authConfig, docId, formData);
          else await createRoom(db, authConfig, { ...formData, homePlanId: activeIds.activePlanId });
          break;
        case 'item':
          if (isEditMode) await updateItem(db, authConfig, docId, formData);
          else await createItem(db, authConfig, { ...formData, roomId: activeIds.activeRoomId });
          break;
        case 'maintenance':
          if (isEditMode) await updateMaintenanceRecord(db, authConfig, docId, formData);
          else await createMaintenanceRecord(db, authConfig, { ...formData, itemId: activeIds.activeItemId });
          break;
      }
    })();

    savePromise.catch((error) => {
      console.error("Gagal menyimpan data:", error);
      alert(`Gagal menyimpan data: ${error.message}`);
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">
            {modalConfig.data ? 'Edit ' : 'Tambah '}
            {modalConfig.type === 'plan' && 'Denah Rumah'}
            {modalConfig.type === 'room' && 'Ruangan'}
            {modalConfig.type === 'item' && 'Barang'}
            {modalConfig.type === 'maintenance' && 'Riwayat Perawatan'}
          </h3>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
        </div>
        
        {/* Ubah onSubmit untuk memanggil handleFormSubmit lokal */}
        <form onSubmit={handleFormSubmit} className="p-6">
          <div className="space-y-4">
            {(modalConfig.type === 'plan' || modalConfig.type === 'room' || modalConfig.type === 'item') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama <span className="text-red-500">*</span></label>
                <input required name="name" defaultValue={modalConfig.data?.name} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Masukkan nama..." />
              </div>
            )}
            {(modalConfig.type === 'room' || modalConfig.type === 'item') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi (Opsional)</label>
                <textarea name="description" defaultValue={modalConfig.data?.description} rows={2} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Catatan tambahan..."></textarea>
              </div>
            )}
            {modalConfig.type === 'item' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Pembelian (Opsional)</label>
                <input type="date" name="purchaseDate" defaultValue={modalConfig.data?.purchaseDate} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            )}
            {modalConfig.type === 'maintenance' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Perawatan <span className="text-red-500">*</span></label>
                  <input required name="maintenanceType" defaultValue={modalConfig.data?.maintenanceType} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Misal: Servis AC, Ganti Filter..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Perawatan <span className="text-red-500">*</span></label>
                  <input type="date" required name="maintenanceDate" defaultValue={modalConfig.data?.maintenanceDate} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Catatan</label>
                  <textarea name="notes" defaultValue={modalConfig.data?.notes} rows={3} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Detail perawatan..."></textarea>
                </div>
              </>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Batal</button>
            <button type="submit" className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}