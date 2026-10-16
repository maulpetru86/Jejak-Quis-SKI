import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3.5 sm:p-4 backdrop-blur-sm animate-fade-slide-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl border border-[#F2B705]/40 bg-gradient-to-b from-[#162654] via-[#122047] to-[#0F1B3D] p-4.5 sm:p-6 shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute right-3.5 top-3.5 sm:right-4 sm:top-4 rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Tutup dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-3.5 sm:gap-4">
          <div
            className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl shadow-inner ${
              variant === 'danger'
                ? 'bg-[#C8102E]/25 text-[#FF6B81] border border-[#C8102E]/60'
                : 'bg-[#F2B705]/20 text-[#F2B705] border border-[#F2B705]/60'
            }`}
          >
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <h3 id="confirm-dialog-title" className="text-base sm:text-lg font-bold text-[#FFFDF7] leading-snug">
              {title}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-200">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#FFFDF7] transition-all text-center justify-center flex items-center active:scale-[0.98]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`w-full sm:w-auto rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg transition-all text-center justify-center flex items-center active:scale-[0.98] ${
              variant === 'danger'
                ? 'bg-[#C8102E] hover:bg-[#a50d26] ring-1 ring-red-400/50'
                : 'bg-[#D97706] hover:bg-[#b45309] ring-1 ring-amber-400/50'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
