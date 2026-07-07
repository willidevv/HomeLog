import React from 'react';
import { ArrowLeft, Box, Edit2, Calendar, FolderOpen, Wrench, Plus, Clock, Trash2 } from 'lucide-react';

export default function ItemDetailView({ activeRoom, activeItem, filteredRecords, openModal, handleDelete, setActiveItemId }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
      <button onClick={() => setActiveItemId(null)} className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 text-sm mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali ke {activeRoom?.name}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Item Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-24">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                <Box className="w-8 h-8" />
              </div>
              <button onClick={() => openModal('item', activeItem)} className="text-slate-400 hover:text-indigo-600"><Edit2 className="w-5 h-5" /></button>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{activeItem?.name}</h2>
            {activeItem?.description && (
              <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 mb-4 border border-slate-100">
                {activeItem.description}
              </div>
            )}
            
            <div className="space-y-3 mt-6 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><Calendar className="w-4 h-4" /></div>
                <div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Tanggal Beli</p>
                  <p className="text-slate-800 font-medium">{activeItem?.purchaseDate || 'Tidak ada data'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><FolderOpen className="w-4 h-4" /></div>
                <div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Lokasi</p>
                  <p className="text-slate-800 font-medium">{activeRoom?.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm min-h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-indigo-500" /> Riwayat Perawatan
                </h3>
                <p className="text-sm text-slate-500 mt-1">Catat dan pantau aktivitas perawatan barang ini.</p>
              </div>
              <button onClick={() => openModal('maintenance')} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm">
                <Plus className="w-4 h-4" /> Tambah Catatan
              </button>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="font-medium text-slate-700">Belum ada riwayat perawatan</h4>
                <p className="text-sm text-slate-500 mt-1">Mulai catat perawatan untuk memperpanjang umur barang.</p>
              </div>
            ) : (
              <div className="relative border-l-2 border-indigo-100 ml-3 pl-6 space-y-8 mt-4">
                {filteredRecords.sort((a, b) => new Date(b.maintenanceDate) - new Date(a.maintenanceDate)).map(record => (
                  <div key={record.id} className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-2 border-indigo-500"></div>
                    
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-800">
                          {record.maintenanceType}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-slate-500">{record.maintenanceDate}</span>
                          <div className="flex gap-1">
                            <button onClick={() => openModal('maintenance', record)} className="text-slate-400 hover:text-indigo-600"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDelete('maintenance', record.id)} className="text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      </div>
                      {record.notes && (
                        <p className="text-slate-600 text-sm mt-2 whitespace-pre-wrap">{record.notes}</p>
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