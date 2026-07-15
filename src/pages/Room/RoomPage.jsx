import React from 'react';
import { ArrowLeft, Plus, Box, Calendar, Wrench, Edit2, Trash2, ChevronRight } from 'lucide-react';

export default function RoomView({ activePlan, activeRoom, filteredItems, maintenanceRecords, openModal, handleDelete, setActiveRoomId, setActiveItemId }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <button onClick={() => setActiveRoomId(null)} className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 text-sm mb-2">
            <ArrowLeft className="w-4 h-4" /> Kembali ke {activePlan?.name}
          </button>
          <h1 className="text-2xl font-bold text-slate-800">{activeRoom?.name}</h1>
          <p className="text-slate-500">{activeRoom?.description || 'Inventaris barang di ruangan ini.'}</p>
        </div>
        <button onClick={() => openModal('item')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium">
          <Plus className="w-4 h-4" /> Tambah Barang
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
          <Box className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-700">Ruangan masih kosong</h3>
          <p className="text-slate-500 mt-1">Tambahkan barang ke ruangan ini.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <ul className="divide-y divide-slate-200">
            {filteredItems.map(item => {
              const itemRecords = maintenanceRecords.filter(m => m.itemId === item.id);
              const lastMaintenance = itemRecords.sort((a, b) => new Date(b.maintenanceDate) - new Date(a.maintenanceDate))[0];

              return (
                <li key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer" onClick={() => setActiveItemId(item.id)}>
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-50 p-3 rounded-lg text-indigo-500 shrink-0">
                      <Box className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                      {item.description && <p className="text-sm text-slate-500 line-clamp-1">{item.description}</p>}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                        {item.purchaseDate && (
                          <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                            <Calendar className="w-3 h-3" /> Beli: {item.purchaseDate}
                          </span>
                        )}
                        <span className={`flex items-center gap-1 px-2 py-1 rounded ${lastMaintenance ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                          <Wrench className="w-3 h-3" /> 
                          {lastMaintenance ? `Dirawat: ${lastMaintenance.maintenanceDate}` : 'Belum pernah dirawat'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center" onClick={e => e.stopPropagation()}>
                    <button onClick={() => openModal('item', item)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete('item', item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
                    <button onClick={() => setActiveItemId(item.id)} className="text-indigo-600 font-medium text-sm px-3 py-1.5 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1">
                      Detail <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}