import React from 'react';
import { Plus, Map, Edit2, Trash2 } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useModal } from '../../contexts/ModalContext';
import { useData } from '../../contexts/DataContext';

export default function DashboardView() {
  const { navigateTo } = useNavigation();
  const { openModal } = useModal();
  const { homePlans, rooms, handleDelete } = useData();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/10 text-gold-400 rounded-full text-xs font-medium tracking-wider uppercase mb-4">
          <Map className="w-3 h-3" /> Home Management Dashboard
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-cream-50 mb-2 tracking-tight">
              Denah Rumah Anda
            </h1>
            <p className="text-navy-300 text-lg">Kelola inventaris dan maintenance setiap ruangan secara efisien.</p>
          </div>
          <button
            onClick={() => openModal('plan')}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-6 py-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 shadow-lg shadow-gold-500/25 hover:shadow-gold-500/35 hover:-translate-y-0.5 active:translate-y-0 font-medium text-base"
          >
            <Plus className="w-5 h-5" /> Buat Denah Baru
          </button>
        </div>
      </div>

      {homePlans.length === 0 ? (
        <div className="text-center py-24 bg-gradient-to-b from-navy-900/50 to-transparent rounded-2xl border border-navy-800/30 border-dashed">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-navy-800/30 flex items-center justify-center">
            <Map className="w-10 h-10 text-navy-400" />
          </div>
          <h3 className="text-2xl font-bold text-cream-50 mb-3">Belum ada denah</h3>
          <p className="text-navy-300 text-lg max-w-md mx-auto mb-8">
            Buat denah pertama Anda untuk memulai pelacakan inventaris dan maintenance rumah.
          </p>
          <button
            onClick={() => openModal('plan')}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-8 py-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 shadow-lg shadow-gold-500/25 hover:shadow-gold-500/35 mx-auto font-medium"
          >
            <Plus className="w-5 h-5" /> Buat Denah Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homePlans.map(plan => (
            <div
              key={plan.id}
              className="group relative bg-navy-900/40 backdrop-blur-sm border border-navy-800/50 rounded-2xl p-6 hover:border-gold-500/50 hover:shadow-xl hover:shadow-gold-500/10 transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => navigateTo('plan', plan.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-navy-900/40 to-navy-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Map className="w-7 h-7 text-gold-400" />
                    </div>
                    <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => openModal('plan', plan)}
                        className="p-2 text-navy-400 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg transition-all duration-200"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('plan', plan.id)}
                        className="p-2 text-navy-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-cream-50 mb-2 group-hover:text-gold-300 transition-colors">
                    {plan.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="px-3 py-1.5 bg-navy-800/50 rounded-lg border border-navy-700/30">
                      <span className="text-sm text-navy-300">
                        {rooms.filter(r => r.homePlanId === plan.id).length} ruangan
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-navy-800/30 flex items-center justify-between">
                  <span className="text-sm text-navy-400 group-hover:text-gold-400 transition-colors">
                    Klik untuk melihat detail
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
                    <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
