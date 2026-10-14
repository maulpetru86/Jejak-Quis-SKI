import React, { useRef, useState } from 'react';
import {
  Trophy,
  RotateCcw,
  Home,
  Award,
  Crown,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Printer,
  ChevronDown,
  ChevronUp,
  Sparkles,
  User,
  Download,
  Copy,
  Check,
  X,
  FileText,
  AlertCircle,
  Share2,
  FileDown,
} from 'lucide-react';
import { AnswerLetter, GradeLevel, SoloGameState } from '../config/quizConfig';
import { HagiaSophiaSilhouette, OttomanStarIcon } from './OttomanDecorations';
import {
  generateOfficialReportHtml,
  printReportWithIframe,
  downloadReportHtml,
  exportReportToPdf,
  generateReportSummaryText,
  getFormattedDate,
  ReportPrintData,
} from '../utils/printReport';

interface SoloResultScreenProps {
  packageName: string;
  gradeLevel?: GradeLevel;
  totalQuestions: number;
  soloState: SoloGameState;
  onPlayAgain: () => void;
  onBackHome: () => void;
}

export const SoloResultScreen: React.FC<SoloResultScreenProps> = ({
  packageName,
  gradeLevel,
  totalQuestions,
  soloState,
  onPlayAgain,
  onBackHome,
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printStatus, setPrintStatus] = useState<'idle' | 'printing' | 'success' | 'blocked'>('idle');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const printablePaperRef = useRef<HTMLDivElement>(null);

  const percentage = Math.round((soloState.correctCount / Math.max(totalQuestions, 1)) * 100);
  const avgTimeSeconds =
    soloState.answers.length > 0
      ? (soloState.totalTimeMs / soloState.answers.length / 1000).toFixed(1)
      : '0';

  // Predikat Nilai SKI
  let predikatArab = 'ممتاز';
  let predikatIndo = 'Mumtaz (Istimewa / Luar Biasa)';
  let predikatColor = 'text-[#F2B705] border-[#F2B705]/50 bg-[#F2B705]/10';
  let predikatBadge = 'bg-[#F2B705] text-[#0F1B3D]';

  if (percentage >= 90) {
    predikatArab = 'ممتاز (Mumtaz)';
    predikatIndo = 'Istimewa — Pemahaman materi sangat sempurna!';
    predikatColor = 'text-[#F2B705] border-[#F2B705]/60 bg-[#F2B705]/15';
    predikatBadge = 'bg-[#F2B705] text-[#0F1B3D]';
  } else if (percentage >= 80) {
    predikatArab = 'جيد جداً (Jayyid Jiddan)';
    predikatIndo = 'Sangat Baik — Pemahaman materi mendalam.';
    predikatColor = 'text-[#34D399] border-[#34D399]/60 bg-[#34D399]/15';
    predikatBadge = 'bg-[#10B981] text-[#0F1B3D]';
  } else if (percentage >= 70) {
    predikatArab = 'جيد (Jayyid)';
    predikatIndo = 'Baik — Memenuhi ketuntasan belajar minimal.';
    predikatColor = 'text-[#60A5FA] border-[#60A5FA]/60 bg-[#60A5FA]/15';
    predikatBadge = 'bg-[#3B82F6] text-white';
  } else {
    predikatArab = 'مقبول (Maqbul)';
    predikatIndo = 'Cukup — Disarankan mengulang materi bab ini.';
    predikatColor = 'text-[#FCA5A5] border-[#EF4444]/60 bg-[#EF4444]/15';
    predikatBadge = 'bg-[#EF4444] text-white';
  }

  const reportData: ReportPrintData = {
    packageName,
    gradeLevel,
    totalQuestions,
    soloState,
    percentage,
    predikatArab,
    predikatIndo,
    avgTimeSeconds,
  };

  const handlePrint = async () => {
    setIsPrintModalOpen(true);
    setPrintStatus('printing');
    const html = generateOfficialReportHtml(reportData);
    const ok = await printReportWithIframe(html);
    setPrintStatus(ok ? 'success' : 'blocked');
  };

  const handleDirectPrintAgain = async () => {
    setPrintStatus('printing');
    const html = generateOfficialReportHtml(reportData);
    const ok = await printReportWithIframe(html);
    setPrintStatus(ok ? 'success' : 'blocked');
  };

  const handleDownloadPdf = async () => {
    if (!printablePaperRef.current) return;
    setIsGeneratingPdf(true);
    const student = (soloState.studentName || 'Siswa').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const bab = packageName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 25);
    const filename = `Rapor_SKI_${student}_${bab}.pdf`;

    const ok = await exportReportToPdf(printablePaperRef.current, filename);
    setIsGeneratingPdf(false);
    if (!ok) {
      // Fallback to HTML download if PDF generation encounters browser restriction
      handleDownloadHtml();
    }
  };

  const handleDownloadHtml = () => {
    const html = generateOfficialReportHtml(reportData);
    const student = (soloState.studentName || 'Siswa').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const bab = packageName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 25);
    const filename = `Rapor_SKI_${student}_${bab}.html`;
    downloadReportHtml(html, filename);
  };

  const handleCopySummary = async () => {
    const text = generateReportSummaryText(reportData);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch (err) {
      console.warn('Gagal menyalin teks:', err);
    }
  };

  const formattedDate = getFormattedDate();
  const studentDisplayName = soloState.studentName?.trim() || 'Siswa Peserta';
  const gradeDisplayLabel = gradeLevel ? `Kelas ${gradeLevel} MA` : 'Madrasah Aliyah';


  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-x-hidden bg-[#0F1B3D] py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-6 sm:space-y-8 animate-fade-slide-up">
        {/* TOP BANNER */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#F2B705]/50 bg-gradient-to-br from-[#162654] via-[#122047] to-[#0F1B3D] p-5 sm:p-8 text-center shadow-2xl">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-[#F2B705]">
            <OttomanStarIcon className="h-4 w-4 shrink-0" />
            <span>RAPOR EVALUASI MANDIRI</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-200">{packageName}</span>
            {gradeLevel && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-white/80 font-semibold">Kelas {gradeLevel} MA</span>
              </>
            )}
          </div>

          <h1 className="mt-2 font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#FFFDF7]">
            Hasil Latihan Kuis Siswa
          </h1>

          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs sm:text-sm font-semibold text-slate-200">
            <User className="h-3.5 w-3.5 text-[#F2B705]" />
            <span>Nama Siswa: <strong className="text-[#FFFDF7]">{soloState.studentName}</strong></span>
          </div>

          {/* GRAND SCORE DISPLAY */}
          <div className="mt-6 flex flex-col items-center justify-center">
            <div className="relative flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-full border-4 border-[#F2B705] bg-[#0F1B3D] shadow-2xl ring-4 ring-[#F2B705]/30">
              <div className="flex flex-col items-center justify-center text-center">
                <span className="font-mono-tabular text-3xl sm:text-5xl font-black text-[#FFFDF7]">
                  {percentage}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#F2B705]">
                  Skor Nilai
                </span>
              </div>
            </div>

            {/* PREDIKAT BADGE */}
            <div className={`mt-4 rounded-xl border p-3 text-center max-w-md w-full shadow-lg ${predikatColor}`}>
              <div className="font-display text-lg sm:text-xl font-extrabold tracking-wide">
                {predikatArab}
              </div>
              <p className="text-xs sm:text-sm font-medium mt-0.5">
                {predikatIndo}
              </p>
            </div>
          </div>

          {/* STATS 4-GRID */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-left">
            <div className="rounded-xl border border-white/10 bg-[#0F1B3D]/80 p-3">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4 text-[#34D399]" />
                <span>Benar</span>
              </div>
              <div className="mt-1 font-mono-tabular text-xl sm:text-2xl font-extrabold text-[#34D399]">
                {soloState.correctCount} <span className="text-xs text-slate-400 font-normal">/ {totalQuestions}</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0F1B3D]/80 p-3">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <XCircle className="h-4 w-4 text-[#EF4444]" />
                <span>Salah</span>
              </div>
              <div className="mt-1 font-mono-tabular text-xl sm:text-2xl font-extrabold text-[#FCA5A5]">
                {soloState.wrongCount} <span className="text-xs text-slate-400 font-normal">soal</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0F1B3D]/80 p-3">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <Trophy className="h-4 w-4 text-[#F2B705]" />
                <span>Total Poin</span>
              </div>
              <div className="mt-1 font-mono-tabular text-xl sm:text-2xl font-extrabold text-[#F2B705]">
                {soloState.score}p
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0F1B3D]/80 p-3">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <Clock className="h-4 w-4 text-[#60A5FA]" />
                <span>Rata-rata</span>
              </div>
              <div className="mt-1 font-mono-tabular text-xl sm:text-2xl font-extrabold text-[#93C5FD]">
                {avgTimeSeconds}s <span className="text-xs text-slate-400 font-normal">/ soal</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onPlayAgain}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F2B705] to-[#F59E0B] px-5 py-3 text-sm sm:text-base font-extrabold text-[#0F1B3D] shadow-lg hover:brightness-105 active:scale-95 transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Ulangi Kuis</span>
            </button>

            <button
              type="button"
              onClick={onBackHome}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm sm:text-base font-bold text-white hover:bg-white/20 active:scale-95 transition-all"
            >
              <Home className="h-4 w-4" />
              <span>Pilih Materi Lain</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl border border-[#F2B705]/60 bg-[#0F1B3D] px-5 py-3 text-sm sm:text-base font-bold text-[#F2B705] hover:bg-[#F2B705]/15 active:scale-95 transition-all shadow-md"
              title="Cetak atau Unduh Lembar Rapor Siswa"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Hasil</span>
            </button>
          </div>
        </div>

        {/* DETAILED QUESTION-BY-QUESTION REVIEW */}
        <div className="rounded-2xl border border-white/15 bg-[#162654]/90 p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#FFFDF7] flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#F2B705]" />
                <span>Pembahasan & Analisis Butir Soal</span>
              </h2>
              <p className="text-xs text-slate-300">
                Tinjau kembali butir soal yang telah Anda kerjakan untuk memperdalam pemahaman.
              </p>
            </div>
            <span className="text-xs font-mono-tabular font-bold text-[#F2B705]">
              {soloState.answers.length} Butir
            </span>
          </div>

          <div className="space-y-3">
            {soloState.answers.map((ans, idx) => {
              const isExpanded = expandedQuestionId === ans.questionId || !ans.isCorrect;

              return (
                <div
                  key={ans.questionId}
                  className={`rounded-xl border transition-all ${
                    ans.isCorrect
                      ? 'border-[#10B981]/40 bg-[#064E3B]/25'
                      : 'border-[#EF4444]/60 bg-[#7F1D1D]/25'
                  } p-3 sm:p-4`}
                >
                  <div
                    className="flex items-start justify-between gap-3 cursor-pointer"
                    onClick={() =>
                      setExpandedQuestionId(isExpanded ? null : ans.questionId)
                    }
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <span
                        className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                          ans.isCorrect
                            ? 'bg-[#10B981] text-[#0F1B3D]'
                            : 'bg-[#EF4444] text-white'
                        }`}
                      >
                        {idx + 1}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold text-[#FFFDF7] leading-relaxed break-words">
                          {ans.questionText}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                          <span
                            className={`font-semibold ${
                              ans.isCorrect ? 'text-[#34D399]' : 'text-[#FCA5A5]'
                            }`}
                          >
                            Jawaban Anda:{' '}
                            {ans.selectedAnswer === '-'
                              ? 'Tidak Dijawab (Waktu Habis)'
                              : `${ans.selectedAnswer} (${ans.options[ans.selectedAnswer as AnswerLetter] || '-'})`}
                          </span>

                          {!ans.isCorrect && (
                            <span className="font-bold text-[#34D399]">
                              · Kunci: {ans.correctAnswer} ({ans.options[ans.correctAnswer] || '-'})
                            </span>
                          )}

                          {ans.pageReference && (
                            <span className="text-slate-400">· {ans.pageReference}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-white shrink-0"
                      aria-label="Lihat penjelasan"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Expanded Explanation */}
                  {isExpanded && ans.explanation && (
                    <div className="mt-3 border-t border-white/10 pt-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#0F1B3D]/60 p-2.5 rounded-lg">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#F2B705] mb-1">
                        <Sparkles className="h-3 w-3" />
                        <span>Penjelasan Materi:</span>
                      </div>
                      <p className="break-words">{ans.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CETAK & UNDUH RAPOR MODAL */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl border border-[#F2B705]/50 bg-[#0F1B3D] text-[#FFFDF7] shadow-2xl overflow-hidden animate-fade-slide-up">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-[#162654]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F2B705]/20 text-[#F2B705] border border-[#F2B705]/40">
                  <Printer className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base sm:text-lg font-extrabold text-[#FFFDF7]">
                    Cetak & Unduh Rapor Kuis Siswa
                  </h3>
                  <p className="text-xs text-slate-300">
                    Format Resmi Evaluasi SKI Madrasah Aliyah · Kemenag RI
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Tutup modal cetak"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ACTION TOOLBAR */}
            <div className="border-b border-white/10 bg-[#122047] p-4">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={handleDirectPrintAgain}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F2B705] to-[#F59E0B] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#0F1B3D] shadow-md hover:brightness-105 active:scale-95 transition-all"
                  title="Buka dialog printer browser atau cetak ke PDF"
                >
                  <Printer className="h-4 w-4" />
                  <span>
                    {printStatus === 'printing'
                      ? 'Menyiapkan Printer...'
                      : 'Cetak ke Printer'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 transition-all"
                  title="Simpan langsung lembar rapor sebagai dokumen PDF resmi"
                >
                  <FileDown className="h-4 w-4" />
                  <span>
                    {isGeneratingPdf ? 'Membuat PDF...' : 'Simpan PDF Resmi (.PDF)'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadHtml}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 transition-all"
                  title="Unduh berkas HTML siap cetak mandiri"
                >
                  <Download className="h-4 w-4" />
                  <span>Unduh Lembar (.HTML)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 active:scale-95 transition-all"
                >
                  {copiedSummary ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Rangkuman Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Salin Ringkasan (WhatsApp)</span>
                    </>
                  )}
                </button>
              </div>

              {printStatus === 'blocked' && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-2.5 text-xs text-emerald-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <div>
                    <span>
                      Dialog printer fisik peramban mungkin terhalang oleh proteksi frame. Anda dapat langsung mengklik{' '}
                      <strong className="text-rose-300 font-bold">Simpan PDF Resmi (.PDF)</strong> untuk langsung mengunduh berkas PDF ke perangkat Anda, atau{' '}
                      <strong className="text-emerald-300 font-bold">Unduh Lembar (.HTML)</strong> untuk membuka dan mencetak langsung di tab mandiri.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* LIVE PAPER PREVIEW CONTAINER */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/50">
              <div
                ref={printablePaperRef}
                className="mx-auto max-w-3xl rounded-xl border border-slate-300 bg-white p-6 sm:p-8 text-slate-900 shadow-2xl font-serif print:border-none print:shadow-none print:p-0"
              >
                {/* KOP RESMI */}
                <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
                  <div className="text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-700">
                    KEMENTERIAN AGAMA REPUBLIK INDONESIA
                  </div>
                  <div className="text-base sm:text-xl font-black uppercase text-slate-900 mt-0.5">
                    LEMBAR HASIL EVALUASI PEMBELAJARAN MANDIRI
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-emerald-800 mt-0.5">
                    MATA PELAJARAN SEJARAH KEBUDAYAAN ISLAM (SKI)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Sesuai Standar Kurikulum Madrasah Aliyah Kemenag RI · Jejak SKI
                  </div>
                </div>

                {/* METADATA SISWA */}
                <div className="rounded-lg border border-slate-300 bg-slate-50 p-3 mb-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 font-sans">Nama Siswa:</span>{' '}
                      <strong className="font-sans text-slate-900">{studentDisplayName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-sans">Materi:</span>{' '}
                      <strong className="font-sans text-slate-900">{packageName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-sans">Jenjang / Kelas:</span>{' '}
                      <strong className="font-sans text-slate-900">{gradeDisplayLabel}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-sans">Waktu Pengerjaan:</span>{' '}
                      <strong className="font-sans text-slate-900">{formattedDate}</strong>
                    </div>
                  </div>
                </div>

                {/* HASIL & PREDIKAT */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-center font-sans">
                  <div className="rounded-lg border border-amber-400 bg-amber-50 p-2.5">
                    <div className="text-2xl font-black text-amber-700">{percentage}</div>
                    <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                      Nilai Akhir
                    </div>
                  </div>
                  <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-2.5">
                    <div className="text-2xl font-black text-emerald-700">
                      {soloState.correctCount} / {totalQuestions}
                    </div>
                    <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      Jawaban Benar
                    </div>
                  </div>
                  <div className="rounded-lg border border-rose-300 bg-rose-50 p-2.5">
                    <div className="text-2xl font-black text-rose-700">{soloState.wrongCount}</div>
                    <div className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                      Jawaban Salah
                    </div>
                  </div>
                  <div className="rounded-lg border border-blue-300 bg-blue-50 p-2.5">
                    <div className="text-2xl font-black text-blue-700">{avgTimeSeconds}s</div>
                    <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                      Rata-Rata Waktu
                    </div>
                  </div>
                </div>

                {/* PREDIKAT BOX */}
                <div className="rounded-lg border border-amber-300 bg-amber-50/70 p-2.5 text-center mb-5 font-sans">
                  <div className="text-base font-bold text-amber-900 font-serif">
                    {predikatArab}
                  </div>
                  <div className="text-xs text-amber-800 font-medium">
                    {predikatIndo}
                  </div>
                </div>

                {/* RINCIAN SOAL TABEL */}
                <div className="mb-6 font-sans">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
                    Rekapitulasi Butir Soal & Kunci Jawaban
                  </h4>
                  <div className="space-y-2">
                    {soloState.answers.map((ans, idx) => (
                      <div
                        key={ans.questionId}
                        className="rounded border border-slate-200 p-2.5 text-xs bg-white"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <span className="font-bold text-slate-900 mr-1.5">{idx + 1}.</span>
                            <span className="text-slate-800 font-serif">{ans.questionText}</span>
                          </div>
                          <span
                            className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-black ${
                              ans.isCorrect
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {ans.isCorrect ? 'BENAR' : 'SALAH'}
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
                          <span>
                            <strong>Jawaban Anda:</strong>{' '}
                            {ans.selectedAnswer === '-'
                              ? 'Tidak Dijawab'
                              : `${ans.selectedAnswer} (${ans.options[ans.selectedAnswer as AnswerLetter] || '-'})`}
                          </span>
                          {!ans.isCorrect && (
                            <span className="text-emerald-700 font-bold">
                              Kunci: {ans.correctAnswer} ({ans.options[ans.correctAnswer] || '-'})
                            </span>
                          )}
                        </div>
                        {ans.pageReference && (
                          <div className="mt-0.5 text-[10px] text-slate-400 italic">
                            Rujukan: {ans.pageReference}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* KOLOM TANDA TANGAN */}
                <div className="flex justify-between pt-4 border-t border-slate-300 text-xs font-sans">
                  <div className="text-center w-48">
                    <div>Mengetahui,</div>
                    <div className="font-bold">Guru Mata Pelajaran SKI</div>
                    <div className="h-16"></div>
                    <div className="border-b border-slate-700 font-semibold">
                      ..............................................
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">NIP. .................................</div>
                  </div>

                  <div className="text-center w-48">
                    <div>Peserta Didik,</div>
                    <div className="font-bold">Madrasah Aliyah</div>
                    <div className="h-16"></div>
                    <div className="border-b border-slate-700 font-semibold">{studentDisplayName}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Siswa Peserta Kuis</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex items-center justify-between border-t border-white/10 px-5 py-3.5 bg-[#162654]">
              <span className="text-xs text-slate-300">
                Pencetakan mendukung orientasi A4 tegak (Portrait)
              </span>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-white/20 active:scale-95 transition-all"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none inset-x-0 bottom-0 mt-6 text-[#F2B705] hidden sm:block">
        <HagiaSophiaSilhouette className="w-full h-auto max-h-20" />
      </div>
    </div>
  );
};

