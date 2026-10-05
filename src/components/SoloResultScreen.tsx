import React, { useState } from 'react';
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
} from 'lucide-react';
import { AnswerLetter, SoloGameState } from '../config/quizConfig';
import { HagiaSophiaSilhouette, OttomanStarIcon } from './OttomanDecorations';

interface SoloResultScreenProps {
  packageName: string;
  totalQuestions: number;
  soloState: SoloGameState;
  onPlayAgain: () => void;
  onBackHome: () => void;
}

export const SoloResultScreen: React.FC<SoloResultScreenProps> = ({
  packageName,
  totalQuestions,
  soloState,
  onPlayAgain,
  onBackHome,
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

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

  const handlePrint = () => {
    window.print();
  };

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
              className="flex items-center gap-2 rounded-xl border border-[#F2B705]/40 bg-[#0F1B3D] px-4 py-3 text-sm font-bold text-[#F2B705] hover:bg-white/5 active:scale-95 transition-all"
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

      <div className="pointer-events-none inset-x-0 bottom-0 mt-6 text-[#F2B705] hidden sm:block">
        <HagiaSophiaSilhouette className="w-full h-auto max-h-20" />
      </div>
    </div>
  );
};
