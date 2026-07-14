import React from 'react';
import { ArrowLeft, Plus, FolderOpen, Edit2, Trash2 } from 'lucide-react';

export default function PlanView({ activePlan, filteredRooms, items, openModal, handleDelete, setActivePlanId, setActiveRoomId }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <button onClick={() => setActivePlanId(null)} className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 text-sm mb-2">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Ruangan di {activePlan?.name}</h1>
          <p className="text-slate-500">Representasi visual ruangan di rumah Anda.</p>
        </div>
        <button onClick={() => openModal('room')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium">
          <Plus className="w-4 h-4" /> Tambah Ruangan
        </button>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-700">Belum ada ruangan</h3>
          <p className="text-slate-500 mt-1">Tambahkan ruangan untuk mulai mengorganisir barang.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredRooms.map(room => (
            <div key={room.id} className="bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex flex-col h-40" onClick={() => setActiveRoomId(room.id)}>
              <div className="p-4 flex-1 flex flex-col justify-center items-center text-center">
                <FolderOpen className="w-8 h-8 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-slate-800">{room.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{room.description || 'Tidak ada deskripsi'}</p>
              </div>
              <div className="bg-slate-50 px-3 py-2 border-t border-slate-100 flex justify-between items-center rounded-b-xl" onClick={e => e.stopPropagation()}>
                <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
                  {items.filter(i => i.roomId === room.id).length} Barang
                </span>
                <div className="flex gap-1">
                  <button onClick={() => openModal('room', room)} className="p-1 text-slate-400 hover:text-indigo-600"><Edit2 className="w-3 h-3" /></button>
                  <button onClick={() => handleDelete('room', room.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}