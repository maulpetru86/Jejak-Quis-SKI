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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-fade-slide-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-[#F2B705]/40 bg-[#162654] p-6 shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Tutup dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              variant === 'danger'
                ? 'bg-[#C8102E]/25 text-[#FF6B81] border border-[#C8102E]'
                : 'bg-[#F2B705]/20 text-[#F2B705] border border-[#F2B705]/50'
            }`}
          >
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h3 id="confirm-dialog-title" className="text-xl font-bold text-[#FFFDF7]">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-[#FFFDF7] hover:bg-white/15 transition-colors whitespace-nowrap"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-colors whitespace-nowrap ${
              variant === 'danger'
                ? 'bg-[#C8102E] hover:bg-[#a50d26]'
                : 'bg-[#D97706] hover:bg-[#b45309]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
