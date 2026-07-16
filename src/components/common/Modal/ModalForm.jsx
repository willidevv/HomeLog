import React from 'react';
import { db, appId } from '../../../config/Firebase';
import { useAuth } from '../../../context/AuthContext';
import { useModal } from '../../../contexts/ModalContext';
import { useNavigation } from '../../../contexts/NavigationContext';

// CRUD Services
import { createPlan, updatePlan } from '../../../services/PlanService';
import { createRoom, updateRoom } from '../../../services/RoomService';
import { createItem, updateItem } from '../../../services/ItemService';
import { createMaintenanceRecord, updateMaintenanceRecord } from '../../../services/MaintenanceService';

/**
 * ModalForm
 *
 * Tanggung jawab:
 *   - Merender form dialog untuk create/edit semua entity
 *   - Mengambil state modal dari ModalContext (tidak ada props modal)
 *   - Mengambil active IDs dari NavigationContext untuk relasi data saat create
 *   - Memanggil service yang sesuai berdasarkan modalConfig.type
 *
 * Yang TIDAK boleh ada di sini:
 *   - Navigation logic
 *   - Delete operations (ada di DataContext / handleDelete)
 *   - State lokal selain yang diperlukan form
 */
export default function ModalForm() {
  const { user } = useAuth();
  const { modalConfig, closeModal } = useModal();
  const { activePlanId, activeRoomId, activeItemId } = useNavigation();

  if (!modalConfig.isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!user) return;

    const fd = new FormData(e.target);
    const formData = Object.fromEntries(fd.entries());

    const authConfig = { appId, userId: user.uid };
    const isEditMode = !!modalConfig.data?.id;
    const docId = modalConfig.data?.id;

    // Tutup modal segera — UI terasa responsif, operasi jalan di background
    closeModal();

    const savePromise = (async () => {
      switch (modalConfig.type) {
        case 'plan':
          if (isEditMode) await updatePlan(db, authConfig, docId, formData);
          else await createPlan(db, authConfig, formData);
          break;
        case 'room':
          if (isEditMode) await updateRoom(db, authConfig, docId, formData);
          else await createRoom(db, authConfig, { ...formData, homePlanId: activePlanId });
          break;
        case 'item':
          if (isEditMode) await updateItem(db, authConfig, docId, formData);
          else await createItem(db, authConfig, { ...formData, roomId: activeRoomId });
          break;
        case 'maintenance':
          if (isEditMode) await updateMaintenanceRecord(db, authConfig, docId, formData);
          else await createMaintenanceRecord(db, authConfig, { ...formData, itemId: activeItemId });
          break;
      }
    })();

    savePromise.catch((error) => {
      console.error('Gagal menyimpan data:', error);
      alert(`Gagal menyimpan data: ${error.message}`);
    });
  };

  return (
    <div className="fixed inset-0 bg-navy-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-navy-900/80 backdrop-blur-xl border border-navy-700/50 rounded-2xl w-full max-w-md shadow-2xl shadow-navy-900/50 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-navy-700/30 flex justify-between items-center bg-gradient-to-r from-navy-900 to-navy-800/50">
          <h3 className="text-lg font-bold text-cream-50">
            {modalConfig.data ? 'Edit ' : 'Tambah '}
            {modalConfig.type === 'plan' && 'Denah Rumah'}
            {modalConfig.type === 'room' && 'Ruangan'}
            {modalConfig.type === 'item' && 'Barang'}
            {modalConfig.type === 'maintenance' && 'Riwayat Perawatan'}
          </h3>
          <button
            onClick={closeModal}
            className="text-navy-300 hover:text-cream-50 hover:bg-cream-500/10 p-1.5 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleFormSubmit} className="p-6">
          <div className="space-y-4">
            {/* Field: Nama — untuk plan, room, item */}
            {(modalConfig.type === 'plan' || modalConfig.type === 'room' || modalConfig.type === 'item') && (
              <div>
                <label className="block text-sm font-semibold text-cream-50 mb-1.5">
                  Nama <span className="text-rose-400">*</span>
                </label>
                <input
                  required
                  name="name"
                  defaultValue={modalConfig.data?.name}
                  className="w-full border border-navy-600/30 rounded-xl px-4 py-3 text-cream-50 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none transition-all bg-navy-800/30 placeholder-navy-400"
                  placeholder="Masukkan nama..."
                />
              </div>
            )}

            {/* Field: Deskripsi — untuk room, item */}
            {(modalConfig.type === 'room' || modalConfig.type === 'item') && (
              <div>
                <label className="block text-sm font-semibold text-cream-50 mb-1.5">
                  Deskripsi (Opsional)
                </label>
                <textarea
                  name="description"
                  defaultValue={modalConfig.data?.description}
                  rows={2}
                  className="w-full border border-navy-600/30 rounded-xl px-4 py-3 text-cream-50 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none transition-all bg-navy-800/30 placeholder-navy-400"
                  placeholder="Catatan tambahan..."
                />
              </div>
            )}

            {/* Field: Tanggal Pembelian — untuk item */}
            {modalConfig.type === 'item' && (
              <div>
                <label className="block text-sm font-semibold text-cream-50 mb-1.5">
                  Tanggal Pembelian (Opsional)
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  defaultValue={modalConfig.data?.purchaseDate}
                  className="w-full border border-navy-600/30 rounded-xl px-4 py-3 text-cream-50 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none transition-all bg-navy-800/30 placeholder-navy-400"
                />
              </div>
            )}

            {/* Fields: Maintenance */}
            {modalConfig.type === 'maintenance' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-cream-50 mb-1.5">
                    Jenis Perawatan <span className="text-rose-400">*</span>
                  </label>
                  <input
                    required
                    name="maintenanceType"
                    defaultValue={modalConfig.data?.maintenanceType}
                    className="w-full border border-navy-600/30 rounded-xl px-4 py-3 text-cream-50 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none transition-all bg-navy-800/30 placeholder-navy-400"
                    placeholder="Misal: Servis AC, Ganti Filter..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-cream-50 mb-1.5">
                    Tanggal Perawatan <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    name="maintenanceDate"
                    defaultValue={modalConfig.data?.maintenanceDate}
                    className="w-full border border-navy-600/30 rounded-xl px-4 py-3 text-cream-50 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none transition-all bg-navy-800/30 placeholder-navy-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-cream-50 mb-1.5">Catatan</label>
                  <textarea
                    name="notes"
                    defaultValue={modalConfig.data?.notes}
                    rows={3}
                    className="w-full border border-navy-600/30 rounded-xl px-4 py-3 text-cream-50 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none transition-all bg-navy-800/30 placeholder-navy-400"
                    placeholder="Detail perawatan..."
                  />
                </div>
              </>
            )}
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end gap-3 bg-navy-950/30 rounded-xl p-4 -mx-6 -mb-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-3 text-navy-300 hover:text-cream-50 bg-navy-800/30 hover:bg-navy-700/50 border border-navy-700/30 hover:border-navy-600 rounded-xl transition-all duration-200 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-3 text-white bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 rounded-xl transition-all duration-300 shadow-lg shadow-gold-500/25 font-medium hover:shadow-gold-500/35 hover:-translate-y-0.5 active:translate-y-0"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
