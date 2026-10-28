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
    setIsGeneratingPdf(true);
    const student = (soloState.studentName || 'Siswa').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const bab = packageName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 25);
    const filename = `Rapor_SKI_${student}_${bab}.pdf`;

    const html = generateOfficialReportHtml(reportData);
    const ok = await exportReportToPdf(html, filename);
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl space-y-6 sm:space-y-8 animate-fade-slide-up">
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
              <div className="font-arabic text-xl sm:text-2xl font-bold tracking-wide">
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
                    Format Evaluasi SKI Madrasah Aliyah
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
                {/* KOP RESMI MADRASAH ALIYAH KEMENAG RI */}
                <div className="flex items-center justify-between gap-3 sm:gap-4 pb-2 border-b-2 border-slate-900 font-sans">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <circle cx="50" cy="50" r="47" stroke="#D97706" strokeWidth="2" strokeDasharray="3 2"/>
                      <rect x="25" y="25" width="50" height="50" rx="4" fill="#047857" stroke="#F59E0B" strokeWidth="2"/>
                      <rect x="25" y="25" width="50" height="50" rx="4" transform="rotate(45 50 50)" fill="#047857" stroke="#F59E0B" strokeWidth="2"/>
                      <circle cx="50" cy="50" r="23" fill="#064E3B" stroke="#F59E0B" strokeWidth="1.5"/>
                      <path d="M38 52C42 49 47 50 50 53C53 50 58 49 62 52V42C58 39 53 40 50 43C47 40 42 39 38 42V52Z" fill="#FFFDF7" stroke="#F59E0B" strokeWidth="1.2" strokeLinejoin="round"/>
                      <path d="M50 33C48 33 46 34.5 46 36.5C46 38.5 48 40 50 40C49 39.5 48.5 38 48.5 36.5C48.5 35 49 33.5 50 33Z" fill="#F59E0B"/>
                      <polygon points="52,35.5 53,37 54.5,37 53.2,38 53.7,39.5 52.5,38.5 51.3,39.5 51.8,38 50.5,37 52,37" fill="#F59E0B"/>
                      <path d="M50 53L50 63M48.5 63L51.5 63" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>

                  <div className="flex-1 text-center">
                    <div className="text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase text-slate-700">
                      KEMENTERIAN AGAMA REPUBLIK INDONESIA
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-slate-500">
                      DIREKTORAT JENDERAL PENDIDIKAN ISLAM · KANTOR WILAYAH MADRASAH
                    </div>
                    <div className="text-sm sm:text-base font-black uppercase text-slate-900 tracking-wide mt-0.5">
                      MADRASAH ALIYAH SEJARAH KEBUDAYAAN ISLAM
                    </div>
                    <div className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-tight mt-0.5">
                      LEMBAR HASIL ASESMEN EVALUASI PEMBELAJARAN MANDIRI (CBT)
                    </div>
                    <div className="text-[9.5px] sm:text-[10px] text-slate-500 italic">
                      Berdasarkan Capaian Pembelajaran Kurikulum Resmi Kemenag RI
                    </div>
                  </div>

                  <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 hidden min-[480px]:flex items-center justify-center">
                    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <circle cx="40" cy="40" r="38" stroke="#047857" strokeWidth="1.5"/>
                      <polygon points="40,6 48,26 68,26 52,40 58,60 40,48 22,60 28,40 12,26 32,26" fill="#047857" opacity="0.12"/>
                      <circle cx="40" cy="40" r="22" stroke="#D97706" strokeWidth="1.5"/>
                      <text x="40" y="38" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#047857" textAnchor="middle">MA</text>
                      <text x="40" y="47" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#D97706" textAnchor="middle">SKI</text>
                    </svg>
                  </div>
                </div>

                {/* DOUBLE DIVIDER */}
                <div className="mt-1.5 mb-3 border-t-2 border-slate-900 border-b border-amber-500 h-1"></div>

                {/* METADATA STRIP */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-sans mb-3 px-0.5">
                  <div>
                    <span>ID Berkas: </span>
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                      SKI-MA-{Date.now().toString(36).toUpperCase().slice(-6)}
                    </span>
                  </div>
                  <div>
                    <span>Status: </span>
                    <strong className="text-emerald-700 font-bold">TERVALIDASI SISTEM CBT</strong>
                  </div>
                  <div>
                    <span>Waktu: </span>
                    <strong>{formattedDate}</strong>
                  </div>
                </div>

                {/* METADATA SISWA CARD */}
                <div className="rounded-lg border border-slate-300 bg-white mb-3.5 overflow-hidden text-xs font-sans">
                  <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 font-bold uppercase text-[10px] text-slate-700 flex justify-between">
                    <span>A. Data Identitas Peserta Didik</span>
                    <span className="text-slate-400 font-normal">Formatif Mandiri</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 p-2.5 sm:p-3 gap-2">
                    <div className="flex items-baseline gap-1">
                      <span className="w-24 text-slate-500 shrink-0 font-medium">Nama Siswa:</span>
                      <strong className="text-slate-900 font-bold">{studentDisplayName}</strong>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="w-24 text-slate-500 shrink-0 font-medium">Mata Pelajaran:</span>
                      <span className="text-slate-900 font-bold">Sejarah Kebudayaan Islam (SKI)</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="w-24 text-slate-500 shrink-0 font-medium">Tingkat / Kelas:</span>
                      <span className="text-slate-900 font-bold">{gradeDisplayLabel}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="w-24 text-slate-500 shrink-0 font-medium">Materi Pokok:</span>
                      <span className="text-emerald-800 font-bold truncate">{packageName}</span>
                    </div>
                  </div>
                </div>

                {/* HASIL & PREDIKAT SHOWCASE PANEL */}
                <div className="rounded-lg border-2 border-amber-500/80 bg-amber-50/40 p-3 sm:p-4 mb-4 font-sans shadow-xs">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-300/80 pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full border-2 border-amber-500 bg-white shadow-xs flex flex-col items-center justify-center shrink-0">
                        <span className="text-2xl font-black text-slate-900 leading-none">{percentage}</span>
                        <span className="text-[8px] font-bold text-amber-700 uppercase tracking-widest mt-0.5">/ 100</span>
                      </div>
                      <div className="space-y-1 text-left">
                        <span
                          className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                            percentage >= 75
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                              : 'bg-rose-100 text-rose-800 border-rose-400'
                          }`}
                        >
                          {percentage >= 75 ? '✓ TUNTAS KKM (MEMENUHI SYARAT)' : '⚠ PERLU PENDAMPINGAN (REMIDI)'}
                        </span>
                        <div className="text-[11px] text-slate-600">
                          Standar Kriteria Ketuntasan Minimal (KKM): <strong className="text-slate-900">75.00</strong>
                        </div>
                      </div>
                    </div>

                    <div className="text-center sm:text-right">
                      <div className="font-arabic text-xl sm:text-2xl font-bold text-blue-950">
                        {predikatArab}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">
                        {predikatIndo}
                      </div>
                      <div className="text-[10px] text-slate-500 max-w-xs mt-0.5">
                        {percentage >= 90
                          ? 'Sangat memuaskan, menguasai substansi materi dan ibrah peristiwa sejarah Islam secara mendalam.'
                          : percentage >= 75
                            ? 'Kompeten dan tuntas. Disarankan mencermati kembali butir soal yang belum tepat.'
                            : 'Belum mencapai ketuntasan minimum. Disarankan mengulang materi bab dan berlatih kembali.'}
                      </div>
                    </div>
                  </div>

                  {/* 4 STATS ROW */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="rounded bg-white border border-slate-200 p-2 shadow-2xs">
                      <div className="text-base font-black text-emerald-700">{soloState.correctCount} / {totalQuestions}</div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Jawaban Benar</div>
                    </div>
                    <div className="rounded bg-white border border-slate-200 p-2 shadow-2xs">
                      <div className="text-base font-black text-rose-700">{soloState.wrongCount} Butir</div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Jawaban Salah</div>
                    </div>
                    <div className="rounded bg-white border border-slate-200 p-2 shadow-2xs">
                      <div className="text-base font-black text-amber-600">{soloState.score} Poin</div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Total Skor Poin</div>
                    </div>
                    <div className="rounded bg-white border border-slate-200 p-2 shadow-2xs">
                      <div className="text-base font-black text-blue-700">{avgTimeSeconds}s</div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Rata-Rata Waktu</div>
                    </div>
                  </div>
                </div>

                {/* RINCIAN SOAL TABEL */}
                <div className="mb-6 font-sans">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-200 pb-1">
                    <span>B. Rincian & Analisis Butir Soal Evaluasi</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{totalQuestions} Butir Soal</span>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-slate-300">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead className="bg-slate-900 text-white font-bold text-[11px]">
                        <tr>
                          <th className="p-2 text-center w-8">No</th>
                          <th className="p-2">Pertanyaan & Analisis Materi</th>
                          <th className="p-2 w-32">Pilihan Siswa</th>
                          <th className="p-2 w-28">Kunci Resmi</th>
                          <th className="p-2 text-center w-16">Hasil</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {soloState.answers.map((ans, idx) => (
                          <tr key={ans.questionId} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                            <td className="p-2.5 text-center font-bold text-slate-500 align-top">{idx + 1}</td>
                            <td className="p-2.5 align-top">
                              <div className="font-bold text-slate-900 leading-snug">{ans.questionText}</div>
                              {ans.explanation && (
                                <div className="mt-1.5 p-1.5 bg-slate-100 rounded border-l-2 border-slate-800 text-[11px] text-slate-700 leading-relaxed">
                                  <strong>Pembahasan:</strong> {ans.explanation}
                                </div>
                              )}
                              {ans.pageReference && (
                                <div className="mt-1 text-[10px] text-slate-500">
                                  📖 <em>Rujukan Resmi: {ans.pageReference}</em>
                                </div>
                              )}
                            </td>
                            <td className="p-2.5 align-top text-[11px]">
                              {ans.selectedAnswer === '-' ? (
                                <span className="text-slate-400 italic">Tidak Dijawab</span>
                              ) : (
                                <span className={ans.isCorrect ? 'text-emerald-800 font-semibold' : 'text-rose-800 font-semibold'}>
                                  <strong>{ans.selectedAnswer}</strong> — {ans.options[ans.selectedAnswer as AnswerLetter] || '-'}
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 align-top text-[11px] text-emerald-800 font-semibold">
                              <strong>{ans.correctAnswer}</strong> — {ans.options[ans.correctAnswer] || '-'}
                            </td>
                            <td className="p-2.5 text-center align-top">
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                                  ans.isCorrect
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                                }`}
                              >
                                {ans.isCorrect ? '✓ BENAR' : '✗ SALAH'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* KOLOM TANDA TANGAN */}
                <div className="pt-2 font-sans text-xs">
                  <div className="text-right text-[11px] text-slate-500 mb-3">
                    Diterbitkan di: <strong>Madrasah Aliyah</strong>, {formattedDate}
                  </div>
                  <div className="flex justify-between px-4 sm:px-8">
                    <div className="text-center w-52">
                      <div className="text-slate-500 text-[11px]">Mengetahui,</div>
                      <div className="font-bold text-slate-900 mt-0.5">Guru Pengampu Mata Pelajaran SKI</div>
                      <div className="h-14 relative flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[8px] text-slate-400">
                          Stempel
                        </div>
                      </div>
                      <div className="border-b-2 border-slate-800 font-bold text-slate-900 pb-0.5">
                        ...................................................
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">NIP. ..........................................</div>
                    </div>

                    <div className="text-center w-52">
                      <div className="text-slate-500 text-[11px]">Peserta Didik yang Dinilai,</div>
                      <div className="font-bold text-slate-900 mt-0.5">Madrasah Aliyah</div>
                      <div className="h-14"></div>
                      <div className="border-b-2 border-slate-800 font-bold text-slate-900 pb-0.5">
                        {studentDisplayName}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">NIS / NISN: ................................</div>
                    </div>
                  </div>

                  <div className="mt-6 pt-2 border-t border-slate-200 text-[9.5px] text-slate-400 flex justify-between">
                    <span>* Dokumen hasil evaluasi resmi diterbitkan melalui Sistem CBT Kuis SKI Madrasah Aliyah.</span>
                    <span className="font-mono">Terverifikasi Resmi</span>
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

