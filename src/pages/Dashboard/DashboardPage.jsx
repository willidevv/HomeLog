import React from 'react';
import { Plus, Map, Edit2, Trash2 } from 'lucide-react';

export default function DashboardView({ homePlans, rooms, openModal, handleDelete, setActivePlanId }) { 
  return ( 
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"> 
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"> 
        <div> 
          <h1 className="text-2xl font-bold text-slate-800">Denah Rumah Anda</h1> 
          <p className="text-slate-500">Pilih atau buat denah rumah untuk mulai melacak inventaris.</p> 
        </div> 

        <button 
          onClick={() => openModal('plan')} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium"
        > 
          <Plus className="w-4 h-4" /> Buat Denah 
        </button> 
      </div> 

      {homePlans.length === 0 ? ( 
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300"> 
          <Map className="w-12 h-12 text-slate-300 mx-auto mb-3" /> 
          <h3 className="text-lg font-medium text-slate-700">Belum ada denah</h3> 
          <p className="text-slate-500 mt-1">Buat denah pertama Anda untuk memulai.</p> 
        </div> 
      ) : ( 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> 
          {homePlans.map(plan => ( 
            <div 
              key={plan.id} 
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between" 
              onClick={() => setActivePlanId(plan.id)}
            > 
              <div> 
                <div className="flex justify-between items-start mb-3"> 
                  <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"> 
                    <Map className="w-6 h-6" /> 
                  </div> 
                  <div className="flex gap-1" onClick={e => e.stopPropagation()}> 
                    <button 
                      onClick={() => openModal('plan', plan)} 
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button> 
                    <button 
                      onClick={() => handleDelete('plan', plan.id)} 
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button> 
                  </div> 
                </div> 

                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {plan.name}
                </h3> 
                <p className="text-sm text-slate-500 mt-1">
                  {rooms.filter(r => r.homePlanId === plan.id).length} Ruangan terdaftar
                </p> 
              </div> 
            </div> 
          ))} 
        </div> 
      )} 
    </div> 
  ); 
}