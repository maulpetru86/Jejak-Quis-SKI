import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { OttomanStarIcon } from './OttomanDecorations';

interface TeacherAuthModalProps {
  isOpen: boolean;
  targetFeatureName?: string;
  onSuccess: () => void;
  onClose: () => void;
  currentPin: string;
  onUpdatePin?: (newPin: string) => void;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  targetFeatureName = 'Pengelolaan Soal & Tim',
  onSuccess,
  onClose,
  currentPin,
  onUpdatePin,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);

  // States for changing PIN
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === currentPin.trim()) {
      setErrorMsg('');
      setPinInput('');
      onSuccess();
    } else {
      setErrorMsg('Sandi rahasia salah! Silakan periksa kembali.');
    }
  };

  const handleKeypadPress = (digit: string) => {
    if (pinInput.length < 8) {
      setPinInput((prev) => prev + digit);
      setErrorMsg('');
    }
  };

  const handleBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPinInput.trim() !== currentPin.trim()) {
      setErrorMsg('Sandi lama yang dimasukkan tidak cocok!');
      return;
    }
    if (newPinInput.length < 3) {
      setErrorMsg('Sandi baru minimal harus 3 karakter/digit.');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setErrorMsg('Konfirmasi sandi baru tidak sama!');
      return;
    }

    if (onUpdatePin) {
      onUpdatePin(newPinInput.trim());
    }
    setChangeSuccess(true);
    setErrorMsg('');
    setTimeout(() => {
      setChangeSuccess(false);
      setIsChangingPin(false);
      setOldPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-slide-up">
      <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl border border-[#F2B705]/50 bg-gradient-to-b from-[#162654] via-[#111E45] to-[#0F1B3D] p-5 sm:p-7 text-[#FFFDF7] shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Tutup"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Arabesque */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#F2B705]/60 bg-[#F2B705]/15 text-[#F2B705] shadow-lg ring-4 ring-[#F2B705]/20">
            {isChangingPin ? (
              <KeyRound className="h-7 w-7" />
            ) : (
              <Lock className="h-7 w-7" />
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#F2B705]">
            <OttomanStarIcon className="h-3.5 w-3.5" />
            <span>AKSES KHUSUS GURU</span>
            <OttomanStarIcon className="h-3.5 w-3.5" />
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#FFFDF7]">
            {isChangingPin ? 'Ubah Sandi Rahasia' : 'Otorisasi Pengelolaan'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xs">
            {isChangingPin
              ? 'Atur kode atau sandi rahasia baru untuk proteksi ruang kelola guru.'
              : `Masukkan kode/sandi rahasia guru untuk membuka ${targetFeatureName}.`}
          </p>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/50 bg-rose-500/15 p-2.5 text-xs text-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {changeSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-500/15 p-2.5 text-xs text-emerald-200">
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>Sandi rahasia guru berhasil diperbarui!</span>
          </div>
        )}

        {!isChangingPin ? (
          /* FORM VERIFIKASI SANDI */
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Kode / Sandi Rahasia Guru:
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  autoFocus
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Ketik kode sandi..."
                  className="w-full rounded-xl border border-white/20 bg-[#0F1B3D] px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-white placeholder-slate-500 focus:border-[#F2B705] focus:outline-none focus:ring-2 focus:ring-[#F2B705]/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white"
                  aria-label={showPin ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                <span>Sandi bawaan awal: <strong className="text-[#F2B705]">1234</strong></span>
                {onUpdatePin && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPin(true);
                      setErrorMsg('');
                    }}
                    className="text-xs text-[#60A5FA] hover:underline"
                  >
                    Ganti Sandi?
                  </button>
                )}
              </div>
            </div>

            {/* Numeric Quick Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    if (k === 'C') {
                      setPinInput('');
                      setErrorMsg('');
                    } else if (k === '⌫') {
                      handleBackspace();
                    } else {
                      handleKeypadPress(k);
                    }
                  }}
                  className="flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-base font-bold text-white hover:bg-white/15 active:scale-95 transition-all shadow-sm"
                >
                  {k}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 rounded-xl border border-white/20 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="w-1/2 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F2B705] to-[#F59E0B] py-2.5 text-xs font-extrabold text-[#0F1B3D] shadow-lg hover:brightness-105 active:scale-95 transition-transform"
              >
                <Unlock className="h-4 w-4" />
                <span>Buka Akses</span>
              </button>
            </div>
          </form>
        ) : (
          /* FORM UBAH SANDI BARU */
          <form onSubmit={handleChangePinSubmit} className="mt-5 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sandi Lama Saat Ini:
              </label>
              <input
                type="password"
                required
                value={oldPinInput}
                onChange={(e) => setOldPinInput(e.target.value)}
                placeholder="Masukkan sandi saat ini"
                className="w-full rounded-xl border border-white/20 bg-[#0F1B3D] px-3 py-2 text-sm text-white focus:border-[#F2B705] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sandi Baru:
              </label>
              <input
                type="password"
                required
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="Buat sandi baru (misal: 4321 atau guru123)"
                className="w-full rounded-xl border border-white/20 bg-[#0F1B3D] px-3 py-2 text-sm text-white focus:border-[#F2B705] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Ulangi Sandi Baru:
              </label>
              <input
                type="password"
                required
                value={confirmPinInput}
                onChange={(e) => setConfirmPinInput(e.target.value)}
                placeholder="Ketik ulang sandi baru"
                className="w-full rounded-xl border border-white/20 bg-[#0F1B3D] px-3 py-2 text-sm text-white focus:border-[#F2B705] focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPin(false);
                  setErrorMsg('');
                }}
                className="w-1/2 rounded-xl border border-white/20 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="w-1/2 rounded-xl bg-[#10B981] py-2.5 text-xs font-extrabold text-[#0F1B3D] shadow-lg hover:bg-[#34D399]"
              >
                Simpan Sandi Baru
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
