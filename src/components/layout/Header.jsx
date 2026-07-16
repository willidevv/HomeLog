import React, { useState, useRef, useEffect } from 'react';
import { Home, Map, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { useData } from '../../contexts/DataContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { user, logout } = useAuth();
  const { activePlanId, activeRoomId, activeItemId, goBack } = useNavigation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-navy-800/50 text-cream-100 shadow-lg shadow-navy-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Logo & Branding */}
        <div
          className="flex items-center gap-4 flex-1 cursor-pointer"
          onClick={() => goBack('dashboard')}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 transition-all duration-300">
            <Map className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cream-50 to-cream-200 bg-clip-text text-transparent tracking-wide">
              HomeLog
            </span>
            <span className="text-[10px] sm:text-xs text-navy-300 font-medium tracking-wider uppercase">
              Asset Management System
            </span>
          </div>
        </div>

        {/* Breadcrumbs — hanya tampil jika ada navigasi aktif */}
        {(activePlanId || activeRoomId || activeItemId) && (
          <HeaderBreadcrumbs />
        )}

        {/* User Menu */}
        <div ref={menuRef} className="relative flex items-center gap-4 pl-4 border-l border-navy-800/50">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-medium text-cream-50">
              {user?.email?.split('@')[0] || 'User'}
            </span>
            <span className="text-[10px] text-navy-300">Administrator</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-700 to-navy-900 border-2 border-gold-500/30 flex items-center justify-center shadow-lg shadow-navy-900/50">
            <User className="w-5 h-5 text-gold-400" />
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-navy-300 hover:text-gold-400 hover:bg-cream-100/5 rounded-lg transition-all duration-200 focus:outline-none"
            aria-label="User Menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Dropdown Panel */}
          <div
            className={`absolute right-0 top-full mt-2 w-48 bg-navy-900 border border-navy-700/50 rounded-xl shadow-xl py-1 z-50 origin-top-right transition-all duration-200 ease-out
              ${isMenuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
          >
            <div className="px-4 py-3 border-b border-navy-700/30 bg-cream-50/5 rounded-t-xl">
              <p className="text-[10px] text-navy-400 font-medium uppercase tracking-wider">User Profile</p>
              <p className="text-sm text-cream-100 truncate mt-0.5">{user?.email}</p>
            </div>
            <button
              onClick={() => { logout(); setIsMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-medium flex items-center gap-2.5 transition-all duration-150"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * HeaderBreadcrumbs
 *
 * Dipisah agar Header utama tetap bersih.
 * Mengambil nama entitas aktif langsung dari DataContext —
 * tidak ada lagi label statis "Plan / Room / Item".
 */
function HeaderBreadcrumbs() {
  const { activePlanId, activeRoomId, activeItemId, goBack } = useNavigation();
  const { activePlan, activeRoom, activeItem } = useData();

  return (
    <nav className="hidden lg:flex items-center gap-2 text-sm flex-1 overflow-x-auto no-scrollbar px-8">
      <button
        onClick={() => goBack('dashboard')}
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-cream-100/10 text-navy-300"
      >
        <Home className="w-3.5 h-3.5" /> Dashboard
      </button>

      {activePlanId && (
        <>
          <span className="text-navy-500 mx-1">/</span>
          <button
            onClick={() => goBack('plan')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-cream-100/10 ${
              !activeRoomId && !activeItemId
                ? 'bg-cream-100/20 text-gold-400 font-medium'
                : 'text-navy-300'
            }`}
          >
            {activePlan?.name ?? '...'}
          </button>
        </>
      )}

      {activeRoomId && (
        <>
          <span className="text-navy-500 mx-1">/</span>
          <button
            onClick={() => goBack('room')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-cream-100/10 ${
              !activeItemId
                ? 'bg-cream-100/20 text-gold-400 font-medium'
                : 'text-navy-300'
            }`}
          >
            {activeRoom?.name ?? '...'}
          </button>
        </>
      )}

      {activeItemId && (
        <>
          <span className="text-navy-500 mx-1">/</span>
          <span className="px-4 py-2 bg-cream-100/20 text-gold-400 font-medium rounded-lg truncate max-w-[250px]">
            {activeItem?.name ?? '...'}
          </span>
        </>
      )}
    </nav>
  );
}
