import React, { useState } from 'react';
// Memperbaiki jalur impor (import path) agar sesuai dengan struktur folder tiga tingkat
import { useAuth } from '../../context/AuthContext.jsx';
import { Home, Mail, Lock, LogIn, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginView() {
  const { login, register } = useAuth();
  
  // State untuk berpindah antara mode Login dan Daftar
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // State form input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State untuk interaktivitas UI
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Menangani pengiriman form (Submit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validasi dasar
    if (!email || !password) {
      setError('Semua bidang wajib diisi.');
      setLoading(false);
      return;
    }

    if (isRegisterMode && password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password harus minimal 6 karakter.');
      setLoading(false);
      return;
    }

    try {
      if (isRegisterMode) {
        // Melakukan pendaftaran akun baru
        await register(email, password);
      } else {
        // Melakukan proses masuk/login
        await login(email, password);
      }
    } catch (err) {
      console.error("Autentikasi bermasalah:", err);
      // Menerjemahkan pesan error Firebase yang umum agar mudah dipahami
      if (err.code === 'auth/invalid-credential') {
        setError('Email atau password salah.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email ini sudah terdaftar.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Format email tidak valid.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password terlalu lemah.');
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi nanti.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-900 to-cream-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto w-full max-w-md">
        {/* Logo & Judul Aplikasi */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-2xl shadow-gold-500/30">
            <Home className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-cream-50 tracking-tight">HomeLog</span>
            <span className="text-xs text-navy-300 font-medium tracking-wider uppercase">Asset Management System</span>
          </div>
        </div>
        <h2 className="text-center text-sm text-navy-300 font-medium tracking-wide uppercase mb-2">
          Sistem Manajemen Inventaris Rumah & Perawatan
        </h2>
        <p className="text-center text-cream-100/60 text-sm max-w-xs mx-auto">
          Kelola rumah Anda dengan efisien - inventaris, maintenance, dan lifecycle
        </p>
      </div>

      <div className="mt-6 sm:mx-auto w-full max-w-md px-4">
        {/* Card Form Autentikasi */}
        <div className="bg-navy-900/60 backdrop-blur-xl border border-navy-700/30 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-cream-50">
              {isRegisterMode ? 'Buat Akun Baru' : 'Masuk ke Akun Anda'}
            </h3>
            <p className="text-sm text-navy-300 mt-2">
              {isRegisterMode 
                ? 'Daftar sekarang untuk mulai mengelola denah dan barang.' 
                : 'Silakan masuk menggunakan email terdaftar Anda.'}
            </p>
          </div>

          {/* Alert Box untuk menampilkan error */}
          {error && (
            <div className="mb-5 bg-rose-500/10 border border-rose-500/20 text-rose-200 p-4 rounded-xl flex items-start gap-2.5 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Input Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-cream-50 mb-1.5">
                Alamat Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy-300">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-navy-600/30 rounded-xl placeholder-navy-400 text-cream-50 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all text-sm bg-navy-800/30 focus:bg-navy-800/50 disabled:opacity-50"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-cream-50 mb-1.5">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy-300">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-navy-600/30 rounded-xl placeholder-navy-400 text-cream-50 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all text-sm bg-navy-800/30 focus:bg-navy-800/50 disabled:opacity-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-navy-300 hover:text-gold-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Input Konfirmasi Password (Hanya muncul saat mendaftar) */}
            {isRegisterMode && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <label htmlFor="confirm-password" className="block text-sm font-semibold text-cream-50 mb-1.5">
                  Konfirmasi Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy-300">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={loading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-navy-600/30 rounded-xl placeholder-navy-400 text-cream-50 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all text-sm bg-navy-800/30 focus:bg-navy-800/50 disabled:opacity-50"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* Tombol Aksi Utama */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-gold-500/25 text-sm font-bold text-white bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:from-gold-500 disabled:hover:to-gold-600 disabled:transform-none hover:shadow-gold-500/35"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isRegisterMode ? (
                  <>
                    <UserPlus className="w-4 h-4" /> Daftar Akun
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> Masuk Aplikasi
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Pembatas Visual */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-navy-700/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-navy-900 px-3 text-navy-400 font-semibold tracking-wider">Atau</span>
              </div>
            </div>

            {/* Toggle Tombol Pindah Mode Form */}
            <div className="mt-6 text-center">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setError('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-sm font-semibold text-gold-400 hover:text-gold-300 hover:underline transition-colors focus:outline-none disabled:opacity-50"
              >
                {isRegisterMode 
                  ? 'Sudah punya akun? Masuk di sini' 
                  : 'Belum punya akun? Buat akun gratis'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
