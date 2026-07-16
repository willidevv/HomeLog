import React from 'react';
import { ArrowLeft, Plus, Box, Calendar, Wrench, Edit2, Trash2, ChevronRight } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useModal } from '../../contexts/ModalContext';
import { useData } from '../../contexts/DataContext';

export default function RoomView() {
  const { navigateTo, goBack } = useNavigation();
  const { openModal } = useModal();
  const { activePlan, activeRoom, filteredItems, maintenanceRecords, handleDelete } = useData();

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
      {/* Header Section */}
      <div className="mb-8">
        <button
          onClick={() => goBack('plan')}
          className="flex items-center gap-2 text-navy-300 hover:text-gold-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke {activePlan?.name}
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-cream-50 mb-2 tracking-tight">
              {activeRoom?.name}
            </h1>
            <p className="text-navy-300 text-lg">
              {activeRoom?.description || 'Kelola inventaris barang di ruangan ini.'}
            </p>
          </div>
          <button
            onClick={() => openModal('item')}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-6 py-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 shadow-lg shadow-gold-500/25 hover:shadow-gold-500/35 hover:-translate-y-0.5 active:translate-y-0 font-medium"
          >
            <Plus className="w-5 h-5" /> Tambah Barang
          </button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-24 bg-gradient-to-b from-navy-900/30 to-transparent rounded-2xl border border-navy-800/30 border-dashed">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-navy-800/30 flex items-center justify-center">
            <Box className="w-10 h-10 text-navy-400" />
          </div>
          <h3 className="text-2xl font-bold text-cream-50 mb-3">Ruangan masih kosong</h3>
          <p className="text-navy-300 text-lg max-w-md mx-auto mb-8">
            Tambahkan barang ke ruangan ini untuk mulai melacak inventaris dan maintenance.
          </p>
          <button
            onClick={() => openModal('item')}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-8 py-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 shadow-lg shadow-gold-500/25 mx-auto font-medium"
          >
            <Plus className="w-5 h-5" /> Tambah Barang Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredItems.map(item => {
            const itemRecords = maintenanceRecords.filter(m => m.itemId === item.id);
            const lastMaintenance = itemRecords.sort(
              (a, b) => new Date(b.maintenanceDate) - new Date(a.maintenanceDate)
            )[0];
            const hasMaintenance = !!lastMaintenance;

            const statusColor = hasMaintenance ? 'text-green-400' : 'text-amber-400';
            const statusBg = hasMaintenance
              ? 'bg-green-500/10 border-green-500/20'
              : 'bg-amber-500/10 border-amber-500/20';
            const statusText = hasMaintenance
              ? `Terakhir dirawat: ${lastMaintenance.maintenanceDate}`
              : 'Belum pernah dirawat';

            return (
              <div
                key={item.id}
                className="group relative bg-navy-900/40 backdrop-blur-sm border border-navy-800/50 rounded-2xl hover:border-gold-500/50 hover:shadow-xl hover:shadow-gold-500/10 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-navy-900/40 to-navy-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 p-6 flex flex-col gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Box className="w-7 h-7 text-gold-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-cream-50 mb-2 group-hover:text-gold-300 transition-colors">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-navy-300 line-clamp-2 mb-3">{item.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3">
                        {item.purchaseDate && (
                          <span className="flex items-center gap-2 text-sm px-3 py-1.5 bg-navy-800/50 rounded-lg border border-navy-700/30">
                            <Calendar className="w-4 h-4 text-navy-300" />
                            <span className="text-navy-300">Beli: {item.purchaseDate}</span>
                          </span>
                        )}
                        <span className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border ${statusBg}`}>
                          <Wrench className={`w-4 h-4 ${statusColor}`} />
                          <span className={statusColor}>{statusText}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-navy-800/30 flex items-center justify-between">
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => openModal('item', item)}
                        className="p-2 text-navy-400 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg transition-all duration-200"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('item', item.id)}
                        className="p-2 text-navy-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => navigateTo('item', item.id)}
                      className="text-gold-400 font-medium text-sm px-4 py-2 hover:bg-gold-500/10 rounded-lg transition-all duration-200 flex items-center gap-2 group-hover:gap-3"
                    >
                      Detail <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
