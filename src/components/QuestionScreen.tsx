import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  SkipForward,
  RotateCcw,
  Home,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Eye,
  ArrowRight,
  Trophy,
  BookOpen,
  Hand,
  ChevronDown,
  ChevronUp,
  Zap,
  Sparkles,
  ZoomIn,
  X,
  Image as ImageIcon,
  MoreVertical,
} from 'lucide-react';
import {
  AnswerLetter,
  OPTION_STYLES,
  QuizQuestion,
  QuizSettings,
  TeamGameState,
} from '../config/quizConfig';
import { CircularTimer } from './CircularTimer';
import { ScoreboardDock } from './ScoreboardDock';
import { OttomanStarIcon } from './OttomanDecorations';

interface QuestionScreenProps {
  packageName: string;
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  teams: TeamGameState[];
  settings: QuizSettings;
  remainingSeconds: number;
  isPaused: boolean;
  isRevealed: boolean;
  isFullscreen: boolean;
  soloSelectedAnswer?: AnswerLetter | null;
  onSelectSoloAnswer?: (answer: AnswerLetter) => void;
  soloScore?: number;
  soloCorrectCount?: number;
  soloWrongCount?: number;
  onSelectTeamAnswer: (teamId: string, answer: AnswerLetter) => void;
  onResetAllAnswers: () => void;
  onResetSingleTeamAnswer: (teamId: string) => void;
  onToggleDoublePoints: (teamId: string) => void;
  onManualScoreAdjust: (teamId: string, delta: number) => void;
  onRevealAnswer: () => void;
  onNextQuestion: () => void;
  onSkipQuestion: () => void;
  onTogglePause: () => void;
  onToggleSound: () => void;
  onToggleFullscreen: () => void;
  onRequestExitHome: () => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  packageName,
  question,
  questionIndex,
  totalQuestions,
  teams,
  settings,
  remainingSeconds,
  isPaused,
  isRevealed,
  isFullscreen,
  soloSelectedAnswer = null,
  onSelectSoloAnswer,
  soloScore = 0,
  soloCorrectCount = 0,
  soloWrongCount = 0,
  onSelectTeamAnswer,
  onResetAllAnswers,
  onResetSingleTeamAnswer,
  onToggleDoublePoints,
  onManualScoreAdjust,
  onRevealAnswer,
  onNextQuestion,
  onSkipQuestion,
  onTogglePause,
  onToggleSound,
  onToggleFullscreen,
  onRequestExitHome,
}) => {
  const [showTouchPanel, setShowTouchPanel] = useState(false);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isSolo = settings.gameMode === 'solo';
  const isTrueFalse = question.type === 'true_false';
  const hasOptionE = Boolean(
    !isTrueFalse &&
      question.options?.E &&
      question.options.E.trim() !== '' &&
      question.options.E !== '-'
  );
  const activeLetters: AnswerLetter[] = isTrueFalse
    ? ['A', 'B']
    : hasOptionE
      ? ['A', 'B', 'C', 'D', 'E']
      : ['A', 'B', 'C', 'D'];
  const progressPercent = ((questionIndex + 1) / Math.max(totalQuestions, 1)) * 100;
  const lockedCount = teams.filter((t) => t.selectedAnswer !== null).length;
  const isLastQuestion = questionIndex + 1 >= totalQuestions;

  // Keyboard shortcut for Solo Mode (A, B, C, D, E or 1, 2, 3, 4, 5)
  React.useEffect(() => {
    if (!isSolo || isRevealed) return;

    const handleSoloKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toUpperCase();
      let picked: AnswerLetter | null = null;

      if (key === 'A' || key === '1') picked = 'A';
      else if (key === 'B' || key === '2') picked = 'B';
      else if ((key === 'C' || key === '3') && !isTrueFalse) picked = 'C';
      else if ((key === 'D' || key === '4') && !isTrueFalse) picked = 'D';
      else if ((key === 'E' || key === '5') && hasOptionE) picked = 'E';

      if (picked && onSelectSoloAnswer) {
        e.preventDefault();
        onSelectSoloAnswer(picked);
      }
    };

    window.addEventListener('keydown', handleSoloKeyDown);
    return () => window.removeEventListener('keydown', handleSoloKeyDown);
  }, [isSolo, isRevealed, isTrueFalse, hasOptionE, onSelectSoloAnswer]);

  const correctTeams = teams.filter((t) => t.selectedAnswer === question.correctAnswer);
  const wrongTeams = teams.filter(
    (t) => t.selectedAnswer !== null && t.selectedAnswer !== question.correctAnswer
  );
  const unansweredTeams = teams.filter((t) => t.selectedAnswer === null);

  const hasImage = Boolean(question.imageUrl && !imageLoadFailed);

  return (
    <div className="w-full min-h-screen overflow-x-hidden overflow-y-auto bg-[#0F1B3D] flex flex-col justify-between py-2 sm:py-3 lg:py-4">
      {/* Central Responsive Container with Tailwind Utilities */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 max-w-7xl w-full flex-1 flex flex-col justify-between gap-2.5 sm:gap-4">
        {/* TOP BAR: Progress + Package Info + Responsive Controls */}
        <header className="w-full flex flex-col gap-1.5 sm:gap-2">
          <div className="flex items-center justify-between gap-2 rounded-xl sm:rounded-2xl border border-white/15 bg-[#162654]/95 px-2.5 py-2 sm:px-4 sm:py-2.5 shadow-lg min-w-0">
            {/* Left: Question counter & Package (with safe truncation) */}
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[#F2B705] shrink-0">
                <OttomanStarIcon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span className="font-mono-tabular text-xs sm:text-base font-extrabold tracking-wide text-[#FFFDF7]">
                  #{questionIndex + 1}/{totalQuestions}
                </span>
              </div>
              <span className="text-white/30 hidden min-[420px]:inline" aria-hidden="true">
                ·
              </span>
              <span
                className="truncate text-xs sm:text-sm font-semibold text-slate-200 min-w-0 max-w-[110px] min-[420px]:max-w-[170px] sm:max-w-xs md:max-w-md"
                title={packageName}
              >
                {packageName}
              </span>
              {hasImage && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded bg-[#10B981]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#6EE7B7] shrink-0">
                  <ImageIcon className="h-3 w-3" />
                  <span>Foto</span>
                </span>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Primary Action Button (Big on both mobile & desktop, no clipping) */}
              {!isRevealed ? (
                <button
                  type="button"
                  onClick={onRevealAnswer}
                  title="Buka Jawaban Benar (Pintasan: Spasi)"
                  className="flex items-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl bg-[#F2B705] px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-extrabold text-[#0F1B3D] shadow-md hover:bg-[#facc15] active:scale-95 transition-all whitespace-nowrap shrink-0 min-h-[34px] sm:min-h-[38px]"
                >
                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span>Buka Jawaban</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNextQuestion}
                  title="Lanjut ke soal berikutnya (Pintasan: Spasi)"
                  className="flex items-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl bg-[#10B981] px-2.5 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-extrabold text-[#0F1B3D] shadow-lg hover:bg-[#34D399] active:scale-95 transition-all whitespace-nowrap shrink-0 min-h-[34px] sm:min-h-[38px]"
                >
                  {isLastQuestion ? (
                    <>
                      <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                      <span>Lihat Podium</span>
                    </>
                  ) : (
                    <>
                      <span>Lanjut</span>
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                    </>
                  )}
                </button>
              )}

              {/* Desktop-only Quick Buttons */}
              <div className="hidden lg:flex items-center gap-1.5">
                {!isRevealed && settings.timerEnabled && (
                  <button
                    type="button"
                    onClick={onTogglePause}
                    title="Jeda / Lanjutkan Timer (P)"
                    className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                      isPaused
                        ? 'border-[#F2B705] bg-[#F2B705] text-[#0F1B3D]'
                        : 'border-white/20 bg-white/10 text-[#FFFDF7] hover:bg-white/20'
                    }`}
                  >
                    {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                    <span>{isPaused ? 'Lanjut' : 'Jeda'}</span>
                  </button>
                )}

                {!isRevealed && (
                  <button
                    type="button"
                    onClick={onResetAllAnswers}
                    disabled={lockedCount === 0}
                    className="rounded-xl border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-bold text-[#FFFDF7] hover:bg-white/20 disabled:opacity-40"
                    title="Reset Jawaban Soal Ini"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}

                {!isRevealed && !isLastQuestion && (
                  <button
                    type="button"
                    onClick={onSkipQuestion}
                    title="Lewati soal ini"
                    className="rounded-xl border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/15"
                  >
                    <SkipForward className="h-3.5 w-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={onToggleSound}
                  className="rounded-xl border border-white/15 bg-white/5 p-1.5 text-slate-200 hover:bg-white/15"
                  title="Suara"
                >
                  {settings.soundEnabled ? <Volume2 className="h-4 w-4 text-[#F2B705]" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
                </button>

                <button
                  type="button"
                  onClick={onToggleFullscreen}
                  className="rounded-xl border border-white/15 bg-white/5 p-1.5 text-slate-200 hover:bg-white/15"
                  title="Layar Penuh"
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4 text-[#F2B705]" /> : <Maximize2 className="h-4 w-4" />}
                </button>

                <button
                  type="button"
                  onClick={onRequestExitHome}
                  className="flex items-center gap-1 rounded-xl border border-[#C8102E]/60 bg-[#C8102E]/25 px-2.5 py-1.5 text-xs font-bold text-[#FFE4E8] hover:bg-[#C8102E]"
                  title="Kembali ke Beranda"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>Beranda</span>
                </button>
              </div>

              {/* Mobile Overflow Menu Toggle */}
              <div className="relative lg:hidden">
                <button
                  type="button"
                  onClick={() => setShowMobileMenu((prev) => !prev)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-slate-200 hover:bg-white/20"
                  aria-label="Menu Opsi Guru"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {showMobileMenu && (
                  <div className="absolute right-0 top-10 z-50 w-48 rounded-xl border border-white/20 bg-[#162654] p-1.5 shadow-2xl space-y-1 animate-fade-slide-up">
                    {settings.timerEnabled && !isRevealed && (
                      <button
                        type="button"
                        onClick={() => {
                          onTogglePause();
                          setShowMobileMenu(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/10 text-left"
                      >
                        {isPaused ? <Play className="h-3.5 w-3.5 text-[#34D399]" /> : <Pause className="h-3.5 w-3.5 text-[#F2B705]" />}
                        <span>{isPaused ? 'Lanjutkan Timer' : 'Jeda Timer'}</span>
                      </button>
                    )}

                    {!isRevealed && (
                      <button
                        type="button"
                        onClick={() => {
                          onResetAllAnswers();
                          setShowMobileMenu(false);
                        }}
                        disabled={lockedCount === 0}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/10 text-left disabled:opacity-40"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Reset Jawaban Tim</span>
                      </button>
                    )}

                    {!isRevealed && !isLastQuestion && (
                      <button
                        type="button"
                        onClick={() => {
                          onSkipQuestion();
                          setShowMobileMenu(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/10 text-left"
                      >
                        <SkipForward className="h-3.5 w-3.5" />
                        <span>Lewati Soal</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        onToggleSound();
                        setShowMobileMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/10 text-left"
                    >
                      {settings.soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-[#F2B705]" /> : <VolumeX className="h-3.5 w-3.5" />}
                      <span>{settings.soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onToggleFullscreen();
                        setShowMobileMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/10 text-left"
                    >
                      {isFullscreen ? <Minimize2 className="h-3.5 w-3.5 text-[#F2B705]" /> : <Maximize2 className="h-3.5 w-3.5" />}
                      <span>{isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh'}</span>
                    </button>

                    <div className="border-t border-white/10 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowMobileMenu(false);
                          onRequestExitHome();
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#FCA5A5] hover:bg-[#C8102E]/30 text-left"
                      >
                        <Home className="h-3.5 w-3.5" />
                        <span>Kembali ke Beranda</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Golden Progress Bar */}
          <div className="h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#C8102E] via-[#F2B705] to-[#34D399] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </header>

        {/* MAIN STAGE: Question Card + Timer + Options */}
        <main className="w-full flex-1 flex flex-col justify-center gap-2.5 sm:gap-3.5">
          {/* Question Banner + Timer */}
          <div className="relative w-full rounded-xl sm:rounded-2xl lg:rounded-3xl border border-[#F2B705]/45 sm:border-2 bg-gradient-to-b from-[#162654] to-[#111E45] p-3 sm:p-5 lg:p-6 shadow-2xl space-y-2.5">
            <div className="flex flex-col-reverse min-[480px]:flex-row items-start justify-between gap-2.5 sm:gap-5 min-w-0">
              <div className="flex-1 space-y-1 sm:space-y-2 min-w-0 w-full">
                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-[#F2B705]">
                  <span>SOAL #{questionIndex + 1}</span>
                  <span aria-hidden="true">·</span>
                  {isSolo ? (
                    <span className="text-[#6EE7B7]">
                      Mode Individu · {settings.studentName || 'Siswa SKI'}
                    </span>
                  ) : (
                    <span className="text-slate-300">
                      {lockedCount}/{teams.length} Terkunci
                    </span>
                  )}
                  {settings.speedBonusEnabled && !isSolo && (
                    <>
                      <span aria-hidden="true" className="hidden sm:inline">·</span>
                      <span className="hidden sm:inline-flex items-center gap-1 text-[#34D399]">
                        <Zap className="h-3 w-3" /> Mode Cepat
                      </span>
                    </>
                  )}
                </div>

                {/* Question Text (fluid, wrapped, never clipped) */}
                <h1
                  key={question.id}
                  className="font-sans text-base sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-snug sm:leading-tight tracking-tight text-[#FFFDF7] break-words animate-fade-slide-up"
                  style={{ textWrap: 'balance' }}
                >
                  {question.question}
                </h1>
              </div>

              {/* Circular Countdown Timer */}
              <div className="shrink-0 self-end min-[480px]:self-start pt-0.5">
                <CircularTimer
                  totalSeconds={settings.timerSeconds}
                  remainingSeconds={remainingSeconds}
                  enabled={settings.timerEnabled}
                  isPaused={isPaused}
                  isRevealed={isRevealed}
                  compact={false}
                  onTogglePause={onTogglePause}
                />
              </div>
            </div>

            {/* SOAL BERGAMBAR: Responsive image preview with zoom modal */}
            {hasImage && question.imageUrl && (
              <div className="relative mt-1 flex flex-col items-center justify-center rounded-lg sm:rounded-xl border border-[#F2B705]/30 bg-[#0B142E]/80 p-1.5 sm:p-2 shadow-inner">
                <div className="relative group max-h-32 min-[420px]:max-h-40 sm:max-h-56 lg:max-h-68 overflow-hidden rounded-lg">
                  <img
                    src={question.imageUrl}
                    alt={question.imageCaption || 'Gambar Pendukung Soal'}
                    referrerPolicy="no-referrer"
                    onError={() => setImageLoadFailed(true)}
                    className="max-h-32 min-[420px]:max-h-40 sm:max-h-56 lg:max-h-68 max-w-full h-auto object-contain rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => setIsImageZoomed(true)}
                    title="Perbesar gambar"
                    className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded bg-[#0F1B3D]/90 px-2 py-1 text-[10px] sm:text-xs font-bold text-[#F2B705] border border-[#F2B705]/50 shadow hover:bg-[#F2B705] hover:text-[#0F1B3D] transition-all"
                  >
                    <ZoomIn className="h-3 w-3" />
                    <span>Perbesar</span>
                  </button>
                </div>

                {question.imageCaption && (
                  <p className="mt-1 text-center text-[10px] sm:text-xs font-semibold text-slate-300 italic break-words">
                    {question.imageCaption}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ANSWER CARDS: Responsive Flexible Grid (1 col on mobile, balanced 2 cols on sm/desktop with option E centered) */}
          <div
            className={`grid gap-2 sm:gap-3.5 w-full ${
              isTrueFalse
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {activeLetters.map((letter) => {
              const style = OPTION_STYLES[letter];
              const optionText = question.options[letter];
              const isCorrectOption = question.correctAnswer === letter;
              const isSoloPicked = isSolo && soloSelectedAnswer === letter;

              const teamsWhoPickedThis = isRevealed && !isSolo
                ? teams.filter((t) => t.selectedAnswer === letter)
                : [];

              let cardStateClasses = `${style.bg} ${style.border} border sm:border-2 shadow-md sm:shadow-lg`;
              if (isRevealed) {
                if (isCorrectOption) {
                  cardStateClasses =
                    'bg-[#059669] border-2 sm:border-4 border-[#6EE7B7] ring-2 sm:ring-4 ring-[#F2B705]/70 shadow-2xl scale-[1.01] animate-pop-correct';
                } else if (isSoloPicked) {
                  cardStateClasses =
                    'bg-[#7F1D1D] border-2 sm:border-4 border-[#EF4444] shadow-2xl ring-2 ring-[#EF4444]/60 animate-shake-wrong';
                } else {
                  cardStateClasses =
                    'bg-[#162654]/50 border border-white/10 opacity-45 grayscale-[40%]';
                }
              } else if (isSolo) {
                cardStateClasses +=
                  ' cursor-pointer hover:brightness-115 hover:border-[#F2B705] hover:ring-2 hover:ring-[#F2B705]/50 active:scale-[0.98]';
              }

              const isFifthCard = hasOptionE && letter === 'E';

              return (
                <div
                  key={letter}
                  onClick={() => {
                    if (isSolo && !isRevealed && onSelectSoloAnswer) {
                      onSelectSoloAnswer(letter);
                    }
                  }}
                  className={`relative flex min-h-[52px] sm:min-h-[72px] lg:min-h-[84px] items-center justify-between gap-2.5 sm:gap-4 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 transition-all duration-300 ${
                    isFifthCard ? 'sm:col-span-2 sm:max-w-2xl sm:mx-auto sm:w-full' : ''
                  } ${cardStateClasses}`}
                  role={isSolo && !isRevealed ? 'button' : undefined}
                  tabIndex={isSolo && !isRevealed ? 0 : undefined}
                >
                  <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-1">
                    {/* Option Letter Badge A/B/C/D */}
                    <div
                      className={`flex h-8 w-8 sm:h-11 sm:w-11 lg:h-13 lg:w-13 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border font-mono-tabular text-sm sm:text-xl lg:text-2xl font-extrabold shadow-sm ${
                        isRevealed && isCorrectOption
                          ? 'border-white bg-[#0F1B3D] text-[#34D399]'
                          : isRevealed && isSoloPicked
                            ? 'border-white bg-[#0F1B3D] text-[#EF4444]'
                            : 'border-white/40 bg-[#0F1B3D]/90 text-[#F2B705]'
                      }`}
                    >
                      {letter}
                    </div>

                    {/* Option Text (break-words prevents any overflow or clipping) */}
                    <span className="text-xs sm:text-base lg:text-xl font-bold leading-snug text-[#FFFDF7] break-words min-w-0 flex-1">
                      {optionText}
                    </span>
                  </div>

                  {/* Reveal Indicators in Solo Mode */}
                  {isRevealed && isSolo && (
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {isCorrectOption ? (
                        <div className="flex items-center gap-1 rounded bg-[#0F1B3D]/90 px-2 py-1 text-[10px] sm:text-xs font-extrabold text-[#34D399] border border-[#34D399]">
                          <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                          <span>KUNCI BENAR</span>
                        </div>
                      ) : isSoloPicked ? (
                        <div className="flex items-center gap-1 rounded bg-[#0F1B3D]/90 px-2 py-1 text-[10px] sm:text-xs font-extrabold text-[#FCA5A5] border border-[#EF4444]">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>PILIHAN ANDA</span>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Reveal Indicators in Group Mode */}
                  {isRevealed && !isSolo && (
                    <div className="flex flex-col items-end gap-1 shrink-0 max-w-[120px] sm:max-w-none">
                      {isCorrectOption ? (
                        <div className="flex items-center gap-1 rounded bg-[#0F1B3D]/90 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-extrabold text-[#34D399] border border-[#34D399]">
                          <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                          <span>BENAR</span>
                        </div>
                      ) : (
                        teamsWhoPickedThis.length > 0 && (
                          <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#FCA5A5]" />
                        )
                      )}

                      {teamsWhoPickedThis.length > 0 && (
                        <div className="flex flex-wrap justify-end gap-1">
                          {teamsWhoPickedThis.map((t) => (
                            <span
                              key={t.id}
                              className="inline-flex items-center gap-0.5 rounded bg-[#0F1B3D]/90 px-1.5 py-0.5 text-[9px] sm:text-xs font-bold text-[#FFFDF7] border border-white/25 truncate"
                            >
                              <span>{t.emoji}</span>
                              <span className="hidden min-[480px]:inline truncate">{t.name}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* LAYAR PEMBAHASAN */}
          {isRevealed && (
            <section
              aria-label="Pembahasan Soal"
              className="w-full rounded-xl sm:rounded-2xl border border-[#F2B705] bg-gradient-to-r from-[#162654] via-[#1B2E63] to-[#162654] p-3 sm:p-4 lg:p-5 shadow-2xl animate-fade-slide-up space-y-2"
            >
              <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-[#F2B705]">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    <span>PEMBAHASAN MATERI</span>
                    {question.pageReference && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 text-[#6EE7B7]">
                          <BookOpen className="h-3 w-3" />
                          <span>Rujukan: {question.pageReference}</span>
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-base lg:text-lg font-semibold leading-relaxed text-[#FFFDF7] break-words">
                    {question.explanation ||
                      'Jawaban yang tepat adalah pilihan ' + question.correctAnswer + '.'}
                  </p>
                </div>

                {isSolo ? (
                  <div className="flex flex-col gap-1 rounded-lg sm:rounded-xl border border-white/15 bg-[#0F1B3D]/80 p-2.5 sm:p-3 text-xs w-full lg:w-auto lg:min-w-[240px]">
                    <div className="font-bold text-slate-300 text-[10px] sm:text-[11px]">HASIL EVALUASI:</div>
                    <div className="text-xs space-y-1">
                      {soloSelectedAnswer === question.correctAnswer ? (
                        <div className="text-[#34D399] font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Jawaban Anda Benar! (+{settings.baseCorrectPoints}p)</span>
                        </div>
                      ) : (
                        <div className="text-[#FCA5A5] font-semibold flex items-center gap-1">
                          <XCircle className="h-4 w-4 text-[#EF4444]" />
                          <span>Pilihan Anda ({soloSelectedAnswer || '-'}) belum tepat.</span>
                        </div>
                      )}
                      <div className="text-slate-300 text-[11px]">
                        Kunci Jawaban: <strong className="text-[#F2B705]">{question.correctAnswer}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 rounded-lg sm:rounded-xl border border-white/15 bg-[#0F1B3D]/80 p-2 sm:p-3 text-xs w-full lg:w-auto lg:min-w-[280px]">
                    <div className="font-bold text-slate-300 text-[10px] sm:text-[11px]">HASIL TIM:</div>
                    <div className="text-[11px] sm:text-xs space-y-1">
                      <div className="text-[#34D399] break-words">
                        <strong>Benar:</strong>{' '}
                        {correctTeams.length > 0
                          ? correctTeams
                              .map((t) => `${t.emoji} ${t.name} (+${t.lastPointsDelta})`)
                              .join(', ')
                          : 'Belum ada'}
                      </div>
                      {wrongTeams.length > 0 && (
                        <div className="text-[#FCA5A5] break-words">
                          <strong>Salah:</strong>{' '}
                          {wrongTeams.map((t) => `${t.emoji} ${t.name} (${t.selectedAnswer})`).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* PANEL JAWABAN TIM (HANYA MODE KELOMPOK) */}
          {!isRevealed && !isSolo && (
            <div className="w-full rounded-xl border border-white/15 bg-[#132047]/90 px-3 py-2">
              <button
                type="button"
                onClick={() => setShowTouchPanel((prev) => !prev)}
                className="flex w-full items-center justify-between text-xs font-bold text-[#F2B705]"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Hand className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Panel Klik/Sentuh Jawaban Tim</span>
                </div>
                <div className="flex items-center gap-1 shrink-0 text-slate-300">
                  <span className="text-[10px] sm:text-xs">
                    {showTouchPanel ? 'Tutup' : 'Buka'}
                  </span>
                  {showTouchPanel ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </div>
              </button>

              {showTouchPanel && (
                <div className="mt-2 grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {teams.map((team) => {
                    const isLocked = team.selectedAnswer !== null;
                    return (
                      <div
                        key={team.id}
                        className="flex items-center justify-between gap-1.5 rounded-lg border border-white/10 bg-[#0F1B3D]/90 p-2 min-w-0"
                      >
                        <div className="flex items-center gap-1 min-w-0 flex-1">
                          <span className="text-base shrink-0">{team.emoji}</span>
                          <span className="truncate text-xs font-bold text-[#FFFDF7]">
                            {team.name}
                          </span>
                        </div>

                        {isLocked ? (
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[10px] font-extrabold text-[#F2B705]">Kunci ✓</span>
                            <button
                              type="button"
                              onClick={() => onResetSingleTeamAnswer(team.id)}
                              className="rounded bg-white/10 px-1.5 py-1 text-[10px] font-semibold text-slate-200 hover:bg-white/20 active:scale-95"
                            >
                              Ulang
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 shrink-0">
                            {activeLetters.map((letter) => (
                              <button
                                key={letter}
                                type="button"
                                onClick={() => onSelectTeamAnswer(team.id, letter)}
                                className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg font-mono-tabular text-xs font-extrabold text-white shadow active:scale-95 ${OPTION_STYLES[letter].bg} hover:brightness-110`}
                                title={`Pilih ${letter} untuk ${team.name}`}
                              >
                                {letter}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>

        {/* BOTTOM SCOREBOARD DOCK (SOLO / GROUP) */}
        <footer className="w-full">
          {isSolo ? (
            <div className="w-full rounded-xl sm:rounded-2xl border border-white/15 bg-[#0B142E]/95 p-2.5 sm:p-3.5 shadow-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F2B705] to-[#D99B00] text-[#0F1B3D] font-extrabold text-base sm:text-lg shadow">
                  👤
                </div>
                <div className="min-w-0">
                  <div className="truncate text-xs sm:text-base font-bold text-[#FFFDF7]">
                    {settings.studentName || 'Siswa Mandiri'}
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#F2B705] font-semibold">
                    Latihan Mandiri Perorangan
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-8 font-mono-tabular">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Skor Poin</div>
                  <div className="text-base sm:text-2xl font-black text-[#F2B705]">{soloScore}p</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Benar / Salah</div>
                  <div className="text-base sm:text-2xl font-extrabold text-[#34D399]">
                    {soloCorrectCount}{' '}
                    <span className="text-xs text-slate-400 font-normal">/</span>{' '}
                    <span className="text-[#FCA5A5]">{soloWrongCount}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ScoreboardDock
              teams={teams}
              isRevealed={isRevealed}
              correctAnswer={question.correctAnswer}
              doublePointsPowerUpEnabled={settings.doublePointsPowerUpEnabled}
              onToggleDoublePoints={onToggleDoublePoints}
              onManualScoreAdjust={onManualScoreAdjust}
              onResetSingleTeamAnswer={onResetSingleTeamAnswer}
            />
          )}
        </footer>
      </div>

      {/* FULLSCREEN ZOOM MODAL */}
      {isImageZoomed && question.imageUrl && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-3 backdrop-blur-md animate-fade-slide-up"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative flex max-h-[92vh] max-w-[96vw] flex-col items-center">
            <button
              type="button"
              onClick={() => setIsImageZoomed(false)}
              className="absolute -top-9 right-0 flex items-center gap-1 rounded bg-white/20 px-2.5 py-1 text-xs font-bold text-white hover:bg-white/30"
            >
              <X className="h-3.5 w-3.5" />
              <span>Tutup</span>
            </button>

            <img
              src={question.imageUrl}
              alt="Gambar Soal Diperbesar"
              className="max-h-[80vh] max-w-full rounded-xl border border-[#F2B705] object-contain shadow-2xl"
            />

            {question.imageCaption && (
              <p className="mt-2 text-center text-xs sm:text-sm font-bold text-[#F2B705] break-words">
                {question.imageCaption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
