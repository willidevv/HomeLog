import React from 'react';
import { ArrowLeft, Plus, FolderOpen, Edit2, Trash2 } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useModal } from '../../contexts/ModalContext';
import { useData } from '../../contexts/DataContext';

export default function PlanView() {
  const { navigateTo, goBack } = useNavigation();
  const { openModal } = useModal();
  const { activePlan, filteredRooms, items, handleDelete } = useData();

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
      {/* Header Section */}
      <div className="mb-8">
        <button
          onClick={() => goBack('dashboard')}
          className="flex items-center gap-2 text-navy-300 hover:text-gold-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-cream-50 mb-2 tracking-tight">
              Ruangan di {activePlan?.name}
            </h1>
            <p className="text-navy-300 text-lg">Kelola setiap ruangan dan inventarisnya secara efisien.</p>
          </div>
          <button
            onClick={() => openModal('room')}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-6 py-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 shadow-lg shadow-gold-500/25 hover:shadow-gold-500/35 hover:-translate-y-0.5 active:translate-y-0 font-medium"
          >
            <Plus className="w-5 h-5" /> Tambah Ruangan
          </button>
        </div>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="text-center py-24 bg-gradient-to-b from-navy-900/30 to-transparent rounded-2xl border border-navy-800/30 border-dashed">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-navy-800/30 flex items-center justify-center">
            <FolderOpen className="w-10 h-10 text-navy-400" />
          </div>
          <h3 className="text-2xl font-bold text-cream-50 mb-3">Belum ada ruangan</h3>
          <p className="text-navy-300 text-lg max-w-md mx-auto mb-8">
            Tambahkan ruangan untuk mulai mengorganisir barang-barang inventaris Anda.
          </p>
          <button
            onClick={() => openModal('room')}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-8 py-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 shadow-lg shadow-gold-500/25 mx-auto font-medium"
          >
            <Plus className="w-5 h-5" /> Buat Ruangan Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map(room => (
            <div
              key={room.id}
              className="group relative bg-navy-900/40 backdrop-blur-sm border border-navy-800/50 rounded-2xl hover:border-gold-500/50 hover:shadow-xl hover:shadow-gold-500/10 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
              onClick={() => navigateTo('room', room.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-navy-900/40 to-navy-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10 p-6 flex-1 flex flex-col justify-center items-center text-center">
                <div className="w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-gold-500/30">
                  <FolderOpen className="w-10 h-10 text-gold-400" />
                </div>
                <h3 className="text-xl font-bold text-cream-50 mb-2 group-hover:text-gold-300 transition-colors">
                  {room.name}
                </h3>
                {room.description && (
                  <p className="text-sm text-navy-300 line-clamp-2 mb-4 px-2">{room.description}</p>
                )}
                <div className="w-full px-4 py-2 bg-navy-800/50 rounded-lg border border-navy-700/30 inline-block">
                  <span className="text-sm font-medium text-navy-300">
                    {items.filter(i => i.roomId === room.id).length} barang
                  </span>
                </div>
              </div>

              <div
                className="relative z-10 px-6 py-3 border-t border-navy-800/30 bg-navy-900/50 flex justify-between items-center"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex gap-1">
                  <button
                    onClick={() => openModal('room', room)}
                    className="p-2 text-navy-400 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg transition-all duration-200"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('room', room.id)}
                    className="p-2 text-navy-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-gold-500/20">
                  <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
