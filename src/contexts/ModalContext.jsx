import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

/**
 * ModalContext
 *
 * Tanggung jawab:
 *   - Menyimpan state modal yang sedang aktif (type + data yang akan diedit)
 *   - Menyediakan openModal(type, data?) dan closeModal() via useModal() hook
 *
 * Yang TIDAK boleh ada di sini:
 *   - Form rendering
 *   - Service calls / CRUD logic
 *   - Navigation logic
 *   - Data fetching
 *
 * Kenapa Context, bukan prop?
 *   Modal adalah concern global UI — bisa dipanggil dari komponen manapun di
 *   kedalaman tree manapun. Menempatkannya di Context menghilangkan kebutuhan
 *   meneruskan openModal sebagai prop melalui setiap lapisan komponen.
 */

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: null,   // 'plan' | 'room' | 'item' | 'maintenance'
    data: null,   // null = mode tambah baru, object = mode edit
  });

  const openModal = useCallback((type, data = null) => {
    setModalConfig({ isOpen: true, type, data });
  }, []);

  const closeModal = useCallback(() => {
    setModalConfig({ isOpen: false, type: null, data: null });
  }, []);

  const value = useMemo(() => ({
    modalConfig,
    openModal,
    closeModal,
  }), [modalConfig, openModal, closeModal]);

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

/**
 * useModal()
 *
 * Hook untuk membuka/menutup modal dari komponen manapun
 * tanpa perlu prop drilling openModal ke seluruh tree.
 *
 * Contoh penggunaan:
 *   const { openModal } = useModal();
 *   openModal('plan');
 *   openModal('room', existingRoom);
 */
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal harus digunakan di dalam ModalProvider');
  }
  return context;
}
