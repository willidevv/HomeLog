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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto w-full max-w-md">
        {/* Logo & Judul Aplikasi */}
        <div className="flex justify-center items-center gap-3 text-indigo-600 font-extrabold text-3xl mb-2">
          <div className="bg-indigo-100 p-2.5 rounded-2xl text-indigo-600 shadow-sm">
            <Home className="w-8 h-8" />
          </div>
          <span>HomeLog</span>
        </div>
        <h2 className="text-center text-sm text-slate-500 font-medium tracking-wide uppercase mb-6">
          Sistem Manajemen Inventaris Rumah & Perawatan
        </h2>
      </div>

      <div className="mt-2 sm:mx-auto w-full max-w-md px-4">
        {/* Card Form Autentikasi */}
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-100 rounded-3xl sm:px-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="mb-6 text-center">
            <h3 className="text-xl font-bold text-slate-800">
              {isRegisterMode ? 'Buat Akun Baru' : 'Masuk ke Akun Anda'}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {isRegisterMode 
                ? 'Daftar sekarang untuk mulai mengelola denah dan barang.' 
                : 'Silakan masuk menggunakan email terdaftar Anda.'}
            </p>
          </div>

          {/* Alert Box untuk menampilkan error */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-2.5 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Input Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Alamat Email <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
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
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm bg-slate-50 focus:bg-white disabled:opacity-60"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
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
                  className="block w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm bg-slate-50 focus:bg-white disabled:opacity-60"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Input Konfirmasi Password (Hanya muncul saat mendaftar) */}
            {isRegisterMode && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <label htmlFor="confirm-password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Konfirmasi Password <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
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
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm bg-slate-50 focus:bg-white disabled:opacity-60"
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
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:bg-indigo-600 disabled:transform-none"
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
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">Atau</span>
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
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors focus:outline-none disabled:opacity-50"
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