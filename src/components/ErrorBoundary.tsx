import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Quiz Sejarah Islam:', error, errorInfo);
  }

  private handleResetApp = () => {
    try {
      this.setState({ hasError: false, error: null });
      window.location.reload();
    } catch {
      window.location.href = '/';
    }
  };

  private handleClearStorageAndReload = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F1B3D] text-[#FFFDF7] flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl border border-[#F2B705]/40 bg-[#162654] p-6 sm:p-8 text-center shadow-2xl space-y-5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#C8102E]/20 text-[#F2B705] ring-2 ring-[#F2B705]/50">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-xl sm:text-2xl font-black text-[#FFFDF7]">
                Terjadi Kendala Teknis
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Aplikasi mendeteksi gangguan saat memuat tampilan kuis. Anda dapat memuat ulang aplikasi dengan aman.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleResetApp}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F2B705] to-[#D97706] py-2.5 px-4 text-xs sm:text-sm font-extrabold text-[#0F1B3D] shadow-lg hover:brightness-110 transition-all"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Muat Ulang Halaman</span>
              </button>

              <button
                type="button"
                onClick={this.handleClearStorageAndReload}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-2 px-4 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Reset Cache & Kembali ke Awal</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
