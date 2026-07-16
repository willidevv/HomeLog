import React from 'react';
import { ArrowLeft, Box, Edit2, Calendar, FolderOpen, Wrench, Plus, Clock, Trash2 } from 'lucide-react';

export default function ItemDetailView({ activeRoom, activeItem, filteredRecords, openModal, handleDelete, setActiveItemId }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
      <button onClick={() => setActiveItemId(null)} className="flex items-center gap-2 text-navy-300 hover:text-gold-400 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Kembali ke {activeRoom?.name}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Item Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-navy-900/40 backdrop-blur-sm border border-navy-800/50 rounded-2xl p-6 sticky top-24">
            <div className="flex justify-between items-start mb-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center">
                <Box className="w-7 h-7 text-gold-400" />
              </div>
              <button onClick={() => openModal('item', activeItem)} className="p-2 text-navy-400 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg transition-all duration-200" title="Edit Item">
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-cream-50 mb-2 tracking-tight">{activeItem?.name}</h2>
            {activeItem?.description && (
              <div className="mt-5 mb-6">
                <span className="text-xs font-medium text-navy-400 uppercase tracking-wider mb-2 block">Deskripsi</span>
                <div className="p-4 rounded-xl bg-navy-800/30 border border-navy-700/30 text-sm text-navy-200 leading-relaxed">
                  {activeItem.description}
                </div>
              </div>
            )}
            
            <div className="space-y-4 mt-6 border-t border-navy-800/30 pt-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-navy-800/50 flex items-center justify-center border border-navy-700/30 shrink-0">
                  <Calendar className="w-4 h-4 text-navy-300" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-navy-400 uppercase tracking-wider mb-1">Tanggal Beli</p>
                  <p className="text-sm font-medium text-cream-50">{activeItem?.purchaseDate || 'Tidak ada data'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-navy-800/50 flex items-center justify-center border border-navy-700/30 shrink-0">
                  <FolderOpen className="w-4 h-4 text-navy-300" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-navy-400 uppercase tracking-wider mb-1">Lokasi</p>
                  <p className="text-sm font-medium text-cream-50">{activeRoom?.name}</p>
                </div>
              </div>
              
              {filteredRecords.length > 0 && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-navy-800/50 flex items-center justify-center border border-navy-700/30 shrink-0">
                    <Wrench className="w-4 h-4 text-navy-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-navy-400 uppercase tracking-wider mb-1">Maintenance</p>
                    <p className="text-sm font-medium text-green-400">{filteredRecords.length} catatan perawatan</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Maintenance History */}
        <div className="lg:col-span-2">
          <div className="bg-navy-900/40 backdrop-blur-sm border border-navy-800/50 rounded-2xl p-6 min-h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 pb-5 border-b border-navy-800/30">
              <div>
                <h3 className="text-2xl font-bold text-cream-50 flex items-center gap-3">
                  <Wrench className="w-6 h-6 text-gold-400" /> Riwayat Perawatan
                </h3>
                <p className="text-sm text-navy-300 mt-1">Catat dan pantau aktivitas perawatan barang ini untuk memperpanjang umur aset.</p>
              </div>
              <button onClick={() => openModal('maintenance')} className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-gold-500/25 hover:shadow-gold-500/35 hover:-translate-y-0.5 active:translate-y-0 font-medium text-sm">
                <Plus className="w-4 h-4" /> Tambah Catatan
              </button>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-navy-800/30 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-navy-400" />
                </div>
                <h4 className="text-xl font-bold text-cream-50 mb-2">Belum ada riwayat perawatan</h4>
                <p className="text-navy-300 max-w-md mx-auto mb-8">Mulai catat perawatan untuk memperpanjang umur barang dan menjaga nilai aset.</p>
                <button onClick={() => openModal('maintenance')} className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-gold-500/25 mx-auto font-medium text-sm">
                  <Plus className="w-4 h-4" /> Catat Perawatan Pertama
                </button>
              </div>
            ) : (
              <div className="relative border-l-2 border-gold-500/20 ml-4 pl-8 space-y-8 mt-6">
                {filteredRecords.sort((a, b) => new Date(b.maintenanceDate) - new Date(a.maintenanceDate)).map((record, index) => (
                  <div key={record.id} className="relative">
                    <div className="absolute -left-[39px] top-0 w-4 h-4 rounded-full bg-navy-900 border-2 border-gold-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold-500"></div>
                    </div>
                    
                    <div className="group bg-navy-800/30 hover:bg-navy-800/50 rounded-xl p-5 border border-navy-700/30 hover:border-gold-500/30 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/20">
                          <Wrench className="w-3 h-3" /> {record.maintenanceType}
                        </span>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm font-medium text-navy-300 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> {record.maintenanceDate}
                          </span>
                          <div className="flex gap-1.5">
                            <button onClick={() => openModal('maintenance', record)} className="p-1.5 text-navy-400 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg transition-all duration-200" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete('maintenance', record.id)} className="p-1.5 text-navy-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200" title="Hapus">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {record.notes && (
                        <p className="text-navy-200 text-sm leading-relaxed whitespace-pre-wrap">{record.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}