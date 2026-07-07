import React from 'react';
import { Home, Map, ChevronRight } from 'lucide-react';

export default function Header({ 
  user, 
  activePlan, 
  activeRoom, 
  activeItem, 
  setActivePlanId, 
  setActiveRoomId, 
  setActiveItemId 
}) {
  const resetAll = () => {
    setActivePlanId(null);
    setActiveRoomId(null);
    setActiveItemId(null);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl cursor-pointer" onClick={resetAll}>
          <Home className="w-6 h-6" />
          <span>HomeLog</span>
        </div>
        <div className="text-sm text-slate-400">
          {user?.uid.slice(0, 8)}
        </div>
      </div>
      
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 py-2 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-2 text-sm overflow-x-auto whitespace-nowrap">
          <button onClick={resetAll} className={`flex items-center gap-1 hover:text-indigo-600 ${!activePlan ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}>
            <Map className="w-4 h-4" /> Dashboard
          </button>
          
          {activePlan && (
            <>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <button onClick={() => { setActiveRoomId(null); setActiveItemId(null); }} className={`flex items-center gap-1 hover:text-indigo-600 ${activePlan && !activeRoom ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}>
                {activePlan.name}
              </button>
            </>
          )}
          
          {activeRoom && (
            <>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <button onClick={() => setActiveItemId(null)} className={`flex items-center gap-1 hover:text-indigo-600 ${activeRoom && !activeItem ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}>
                {activeRoom.name}
              </button>
            </>
          )}

          {activeItem && (
            <>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <span className="text-indigo-600 font-medium flex items-center gap-1">
                {activeItem.name}
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}