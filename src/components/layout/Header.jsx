import React, { useState, useRef, useEffect } from 'react';
import { Home, Map, ChevronRight, Menu, X, LogOut } from 'lucide-react';
// 1. FIX: Adjusted relative path to step out of components/layout/
import { useAuth } from '../../context/AuthContext'; 

export default function Header({ 
  user, 
  activePlan, 
  activeRoom, 
  activeItem, 
  setActivePlanId, 
  setActiveRoomId, 
  setActiveItemId 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  // 2. FIX: Call your auth hook to get the working logout function
  const { logout } = useAuth(); 

  const resetAll = () => {
    setActivePlanId(null);
    setActiveRoomId(null);
    setActiveItemId(null);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl cursor-pointer" onClick={resetAll}>
          <Home className="w-6 h-6" />
          <span>HomeLog</span>
        </div>

        {/* Dropdown Menu Container */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors duration-200 focus:outline-none"
            aria-label="User Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Smooth Dropdown Panel */}
          <div className={`absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20 origin-top-right transition-all duration-200 ease-out
            ${isMenuOpen 
              ? 'opacity-100 scale-100 pointer-events-auto' 
              : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-xs text-slate-400 font-medium">User ID</p>
              <p className="text-sm text-slate-700 truncate">{user?.uid.slice(0, 8)}</p>
            </div>

            {/* 3. FIX: Your functional logout button */}
            <button
              onClick={() => {
                logout(); // Now references the context function correctly
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 transition-colors duration-150"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
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