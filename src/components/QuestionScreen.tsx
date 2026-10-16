import React, { useEffect, useState } from 'react';
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
  EyeOff,
  Lock,
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
} from 'lucide-react';
import {
  AnswerLetter,
  GradeLevel,
  OPTION_STYLES,
  QuizQuestion,
  QuizSettings,
  TeamGameState,
} from '../config/quizConfig';
import { CircularTimer } from './CircularTimer';
import { ScoreboardDock } from './ScoreboardDock';
import { ArabesqueCorner, OttomanStarIcon } from './OttomanDecorations';

interface QuestionScreenProps {
  packageName: string;
  gradeLevel?: GradeLevel;
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
  gradeLevel,
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
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  // Conceal group answers: secret by default, optional peek for host/team
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setRevealedSecrets({});
  }, [questionIndex]);

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

  // Keyboard shortcut listener:
  // - In Solo mode: keys A, B, C, D, E or 1, 2, 3, 4, 5 to select options
  // - In any mode: Space to Reveal Answer, and Enter/Space to go to Next Question
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toUpperCase();

      // Keyboard option selection in Solo mode
      if (isSolo && !isRevealed) {
        let picked: AnswerLetter | null = null;
        if (key === 'A' || key === '1') picked = 'A';
        else if (key === 'B' || key === '2') picked = 'B';
        else if ((key === 'C' || key === '3') && !isTrueFalse) picked = 'C';
        else if ((key === 'D' || key === '4') && !isTrueFalse) picked = 'D';
        else if ((key === 'E' || key === '5') && hasOptionE) picked = 'E';

        if (picked && onSelectSoloAnswer) {
          e.preventDefault();
          onSelectSoloAnswer(picked);
          return;
        }
      }

      // Space / Enter for smooth progression
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
        if (!isRevealed) {
          // In Solo mode, require an answer to be picked before space reveals, or allow teacher anytime
          if (!isSolo || soloSelectedAnswer !== null) {
            e.preventDefault();
            onRevealAnswer();
          }
        } else {
          e.preventDefault();
          onNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    isSolo,
    isRevealed,
    isTrueFalse,
    hasOptionE,
    soloSelectedAnswer,
    onSelectSoloAnswer,
    onRevealAnswer,
    onNextQuestion,
  ]);

  const correctTeams = teams.filter((t) => t.selectedAnswer === question.correctAnswer);
  const wrongTeams = teams.filter(
    (t) => t.selectedAnswer !== null && t.selectedAnswer !== question.correctAnswer
  );
  const hasImage = Boolean(question.imageUrl && !imageLoadFailed);

  return (
    <div className="w-full min-h-screen bg-islamic-pattern text-[#FFFDF7] flex flex-col justify-between py-2 sm:py-3 lg:py-4 pb-20 sm:pb-24">
      {/* Central Container */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 max-w-7xl w-full flex-1 flex flex-col justify-start gap-3 sm:gap-4">
        {/* ========================================================= */}
        {/* TOP BAR & LIVE SCOREBOARD (DI PALING ATAS / TOP BAR)      */}
        {/* ========================================================= */}
        <header className="w-full space-y-2">
          {/* Main Top Header Bar */}
          <div className="flex items-center justify-between gap-2 rounded-xl sm:rounded-2xl border border-white/15 bg-[#162654]/95 px-3 py-2 sm:px-4 sm:py-2.5 shadow-lg min-w-0">
            {/* Left: Question counter & Package */}
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[#F2B705] shrink-0">
                <OttomanStarIcon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span className="font-mono-tabular text-xs sm:text-base font-extrabold tracking-wide text-[#FFFDF7]">
                  #{questionIndex + 1}/{totalQuestions}
                </span>
              </div>
              <span className="text-white/30 hidden min-[420px]:inline" aria-hidden="true">
                ·
              </span>
              <span
                className="truncate text-xs sm:text-sm font-semibold text-slate-200 min-w-0 max-w-[120px] min-[420px]:max-w-[180px] sm:max-w-xs md:max-w-md"
                title={packageName}
              >
                {packageName}
              </span>
              {gradeLevel && (
                <span className="hidden min-[480px]:inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-extrabold border bg-[#F2B705]/20 text-[#F2B705] border-[#F2B705]/40 shrink-0">
                  Kelas {gradeLevel}
                </span>
              )}
              {hasImage && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded bg-[#10B981]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#6EE7B7] shrink-0">
                  <ImageIcon className="h-3 w-3" />
                  <span>Foto</span>
                </span>
              )}
            </div>

            {/* Center: Solo Score Stats in Top Bar */}
            {isSolo && (
              <div className="flex items-center gap-2.5 sm:gap-4 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#0F1B3D]/90 border border-[#F2B705]/40 font-mono-tabular shrink-0">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase hidden min-[440px]:inline">
                    Poin:
                  </span>
                  <span className="text-xs sm:text-base font-black text-[#F2B705]">
                    {soloScore}p
                  </span>
                </div>
                <div className="h-3.5 w-px bg-white/20" />
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase hidden min-[440px]:inline">
                    Benar:
                  </span>
                  <span className="text-xs sm:text-base font-extrabold text-[#34D399]">
                    {soloCorrectCount}
                    <span className="text-slate-400 font-normal mx-0.5">/</span>
                    <span className="text-[#FCA5A5]">{soloWrongCount}</span>
                  </span>
                </div>
              </div>
            )}

            {/* Right: Quick Controls & Timer */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Circular Timer */}
              <div className="shrink-0">
                <CircularTimer
                  totalSeconds={settings.timerSeconds}
                  remainingSeconds={remainingSeconds}
                  enabled={settings.timerEnabled}
                  isPaused={isPaused}
                  isRevealed={isRevealed}
                  compact={true}
                  onTogglePause={onTogglePause}
                />
              </div>

              {/* Pause Toggle */}
              {!isRevealed && settings.timerEnabled && (
                <button
                  type="button"
                  onClick={onTogglePause}
                  title={isPaused ? 'Lanjutkan Timer (P)' : 'Jeda Timer (P)'}
                  className={`flex items-center gap-1 rounded-lg sm:rounded-xl border px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-bold transition-colors ${
                    isPaused
                      ? 'border-[#F2B705] bg-[#F2B705] text-[#0F1B3D]'
                      : 'border-white/20 bg-white/10 text-[#FFFDF7] hover:bg-white/20'
                  }`}
                >
                  {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{isPaused ? 'Jalan' : 'Jeda'}</span>
                </button>
              )}

              {/* Reset Answers Button */}
              {!isRevealed && !isSolo && (
                <button
                  type="button"
                  onClick={onResetAllAnswers}
                  disabled={lockedCount === 0}
                  className="rounded-lg sm:rounded-xl border border-white/20 bg-white/10 p-1.5 sm:px-2 sm:py-1.5 text-xs font-bold text-[#FFFDF7] hover:bg-white/20 disabled:opacity-40"
                  title="Reset Jawaban Soal Ini"
                  aria-label="Reset jawaban soal ini"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Skip Question Button */}
              {!isRevealed && !isLastQuestion && (
                <button
                  type="button"
                  onClick={onSkipQuestion}
                  title="Lewati soal ini"
                  className="rounded-lg sm:rounded-xl border border-white/15 bg-white/5 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/15"
                  aria-label="Lewati soal ini"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={onToggleSound}
                className="rounded-lg sm:rounded-xl border border-white/15 bg-white/5 p-1.5 sm:p-2 text-slate-200 hover:bg-white/15 transition-colors"
                title={settings.soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
                aria-label="Pengaturan Suara"
              >
                {settings.soundEnabled ? (
                  <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#F2B705]" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
                )}
              </button>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={onToggleFullscreen}
                className="rounded-lg sm:rounded-xl border border-white/15 bg-white/5 p-1.5 sm:p-2 text-slate-200 hover:bg-white/15 transition-colors hidden sm:block"
                title="Layar Penuh"
                aria-label="Layar Penuh"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#F2B705]" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </button>

              {/* Home / Exit Button */}
              <button
                type="button"
                onClick={onRequestExitHome}
                className="flex items-center gap-1 rounded-lg sm:rounded-xl border border-[#C8102E]/60 bg-[#C8102E]/25 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-bold text-[#FFE4E8] hover:bg-[#C8102E] transition-colors"
                title="Kembali ke Beranda"
                aria-label="Kembali ke Beranda"
              >
                <Home className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Beranda</span>
              </button>
            </div>
          </div>

          {/* Golden Progress Bar */}
          <div className="h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#C8102E] via-[#F2B705] to-[#34D399] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* TOP SCOREBOARD FOR TEAM MODE (CERDAS CERMAT DITARUH DI PALING ATAS) */}
          {!isSolo && (
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
        </header>

        {/* ========================================================= */}
        {/* MAIN STAGE: Question Card + Options + Explanation         */}
        {/* ========================================================= */}
        <main className="w-full flex-1 flex flex-col justify-start gap-3 sm:gap-4">
          {/* Question Card - Illuminated Royal Codex */}
          <div className="relative w-full rounded-xl sm:rounded-2xl lg:rounded-3xl border-2 border-[#F2B705]/60 bg-gradient-to-br from-[#162758]/98 via-[#111F45]/98 to-[#0B142E]/98 p-3.5 sm:p-5 lg:p-7 shadow-[0_0_35px_rgba(242,183,5,0.2)] space-y-3">
            <ArabesqueCorner className="absolute left-1.5 top-1.5 h-6 w-6 sm:h-10 sm:w-10 text-[#F2B705]/40 pointer-events-none" />
            <ArabesqueCorner className="absolute right-1.5 top-1.5 h-6 w-6 sm:h-10 sm:w-10 -scale-x-100 text-[#F2B705]/40 pointer-events-none" />
            <div className="flex items-start justify-between gap-3 min-w-0">
              <div className="flex-1 space-y-1 sm:space-y-1.5 min-w-0">
                {/* Meta Indicator */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-[#F2B705]">
                  <span>SOAL #{questionIndex + 1}</span>
                  <span aria-hidden="true">·</span>
                  {isSolo ? (
                    <span className="text-[#6EE7B7]">
                      Latihan Mandiri · {settings.studentName || 'Siswa SKI'}
                    </span>
                  ) : (
                    <span className="text-slate-300">
                      {lockedCount}/{teams.length} Tim Terkunci
                    </span>
                  )}
                  {settings.speedBonusEnabled && !isSolo && (
                    <>
                      <span aria-hidden="true" className="hidden sm:inline">
                        ·
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1 text-[#34D399]">
                        <Zap className="h-3 w-3" /> Mode Cepat
                      </span>
                    </>
                  )}
                </div>

                {/* Question Text */}
                <h1
                  key={question.id}
                  className="font-sans text-base sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-snug sm:leading-tight tracking-tight text-[#FFFDF7] break-words animate-fade-slide-up"
                  style={{ textWrap: 'balance' }}
                >
                  {question.question}
                </h1>
              </div>
            </div>

            {/* Supporting Question Image */}
            {hasImage && question.imageUrl && (
              <div className="relative mt-1 flex flex-col items-center justify-center rounded-lg sm:rounded-xl border border-[#F2B705]/30 bg-[#0B142E]/80 p-1.5 sm:p-2 shadow-inner">
                <div className="relative group max-h-36 min-[420px]:max-h-48 sm:max-h-60 lg:max-h-72 overflow-hidden rounded-lg">
                  <img
                    src={question.imageUrl}
                    alt={question.imageCaption || 'Gambar Pendukung Soal'}
                    referrerPolicy="no-referrer"
                    onError={() => setImageLoadFailed(true)}
                    className="max-h-36 min-[420px]:max-h-48 sm:max-h-60 lg:max-h-72 max-w-full h-auto object-contain rounded-lg"
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

          {/* Answer Options Grid */}
          <div
            className={`grid gap-2 sm:gap-3.5 w-full ${
              isTrueFalse ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {activeLetters.map((letter) => {
              const style = OPTION_STYLES[letter];
              const optionText = question.options[letter];
              const isCorrectOption = question.correctAnswer === letter;
              const isSoloPicked = isSolo && soloSelectedAnswer === letter;

              const teamsWhoPickedThis =
                isRevealed && !isSolo
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
                if (isSoloPicked) {
                  cardStateClasses +=
                    ' ring-2 ring-[#F2B705] border-[#F2B705] bg-[#1E3A8A] brightness-110';
                } else {
                  cardStateClasses +=
                    ' cursor-pointer hover:brightness-115 hover:border-[#F2B705] hover:ring-2 hover:ring-[#F2B705]/50 active:scale-[0.98]';
                }
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
                  className={`relative flex min-h-[52px] sm:min-h-[68px] lg:min-h-[78px] items-center justify-between gap-2.5 sm:gap-4 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 transition-all duration-300 ${
                    isFifthCard ? 'sm:col-span-2 sm:max-w-2xl sm:mx-auto sm:w-full' : ''
                  } ${cardStateClasses}`}
                  role={isSolo && !isRevealed ? 'button' : undefined}
                  tabIndex={isSolo && !isRevealed ? 0 : undefined}
                >
                  <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-1">
                    {/* Option Letter Badge A/B/C/D/E */}
                    <div
                      className={`flex h-8 w-8 sm:h-11 sm:w-11 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border font-mono-tabular text-sm sm:text-xl lg:text-2xl font-extrabold shadow-sm ${
                        isRevealed && isCorrectOption
                          ? 'border-white bg-[#0F1B3D] text-[#34D399]'
                          : isRevealed && isSoloPicked
                            ? 'border-white bg-[#0F1B3D] text-[#EF4444]'
                            : isSoloPicked
                              ? 'border-[#F2B705] bg-[#F2B705] text-[#0F1B3D]'
                              : 'border-white/40 bg-[#0F1B3D]/90 text-[#F2B705]'
                      }`}
                    >
                      {letter}
                    </div>

                    {/* Option Text */}
                    <span className="text-xs sm:text-base lg:text-xl font-bold leading-snug text-[#FFFDF7] break-words min-w-0 flex-1">
                      {optionText}
                    </span>
                  </div>

                  {/* Indicators in Solo Mode */}
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

                  {/* Indicators in Group Mode */}
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

          {/* Discussion & Explanation Section (Clean educational content, NO duplicate next button) */}
          {isRevealed && (
            <section
              aria-label="Pembahasan Soal"
              className="w-full rounded-xl sm:rounded-2xl border border-[#F2B705] bg-gradient-to-r from-[#162654] via-[#1B2E63] to-[#162654] p-3.5 sm:p-5 shadow-2xl animate-fade-slide-up space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#F2B705]">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span className="uppercase tracking-wider">Pembahasan Materi & Analisis Kunci</span>
                  {question.pageReference && (
                    <>
                      <span aria-hidden="true" className="text-white/40">·</span>
                      <span className="inline-flex items-center gap-1 text-[#6EE7B7] bg-[#0F1B3D]/80 px-2 py-0.5 rounded border border-[#6EE7B7]/40">
                        <BookOpen className="h-3 w-3" />
                        <span>Rujukan: {question.pageReference}</span>
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-base lg:text-lg font-semibold leading-relaxed text-[#FFFDF7] break-words">
                  {question.explanation ||
                    `Jawaban yang tepat adalah pilihan ${question.correctAnswer}.`}
                </p>
              </div>

              {/* Outcome feedback card */}
              <div className="rounded-xl border border-white/15 bg-[#0F1B3D]/80 p-3 text-xs">
                {isSolo ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      {soloSelectedAnswer === question.correctAnswer ? (
                        <div className="text-[#34D399] font-bold flex items-center gap-1.5 text-sm">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Alhamdulillah! Jawaban Anda Benar (+{settings.baseCorrectPoints} poin)</span>
                        </div>
                      ) : (
                        <div className="text-[#FCA5A5] font-semibold flex items-center gap-1.5 text-sm">
                          <XCircle className="h-4 w-4 text-[#EF4444]" />
                          <span>Pilihan Anda ({soloSelectedAnswer || '-'}) belum tepat. Tetap semangat!</span>
                        </div>
                      )}
                    </div>
                    <div className="text-slate-300 font-medium">
                      Kunci Jawaban: <strong className="text-[#F2B705] font-black text-sm">{question.correctAnswer}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="text-xs space-y-1">
                      <div className="text-[#34D399]">
                        <strong>Tim Menjawab Benar:</strong>{' '}
                        {correctTeams.length > 0
                          ? correctTeams
                              .map((t) => `${t.emoji} ${t.name} (+${t.lastPointsDelta}p)`)
                              .join(', ')
                          : 'Tidak ada tim yang benar'}
                      </div>
                      {wrongTeams.length > 0 && (
                        <div className="text-[#FCA5A5]">
                          <strong>Tim Belum Tepat:</strong>{' '}
                          {wrongTeams
                            .map((t) => `${t.emoji} ${t.name} (${t.selectedAnswer})`)
                            .join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="text-slate-300 font-medium shrink-0">
                      Kunci Jawaban: <strong className="text-[#F2B705] font-black text-sm">{question.correctAnswer}</strong>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Group Mode: Interactive Direct Team Answer Selection (Selalu Terbuka & Mudah Dijangkau) */}
          {!isRevealed && !isSolo && (
            <section
              aria-label="Panel Pemilihan Jawaban Tim"
              className="w-full rounded-xl sm:rounded-2xl border border-white/20 bg-gradient-to-r from-[#0F1B3D]/95 via-[#162654]/95 to-[#0F1B3D]/95 p-3 sm:p-4 shadow-xl space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-[#F2B705]/20 text-[#F2B705] shrink-0">
                    <Hand className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#FFFDF7] truncate">
                      Pilih Jawaban Tiap Kelompok
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-300 truncate">
                      Sentuh opsi A–{hasOptionE ? 'E' : 'D'} (jawaban otomatis dirahasiakan setelah dipilih)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] sm:text-xs font-bold text-[#F2B705] bg-[#F2B705]/15 border border-[#F2B705]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="h-2.5 w-2.5" />
                    {lockedCount} / {teams.length} Terkunci
                  </span>
                  {lockedCount > 0 && (
                    <button
                      type="button"
                      onClick={onResetAllAnswers}
                      className="text-[10px] sm:text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-lg transition-colors"
                      title="Reset semua jawaban tim untuk soal ini"
                    >
                      Reset Semua
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of Team Cards with Direct Option Buttons */}
              <div
                className={`grid gap-2 ${
                  teams.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : teams.length === 3
                      ? 'grid-cols-1 sm:grid-cols-3'
                      : 'grid-cols-1 min-[440px]:grid-cols-2 lg:grid-cols-4'
                }`}
              >
                {teams.map((team) => {
                  const isLocked = team.selectedAnswer !== null;
                  return (
                    <div
                      key={team.id}
                      className={`relative flex items-center justify-between gap-2 rounded-xl border p-2 sm:p-2.5 transition-all ${
                        isLocked
                          ? 'border-[#F2B705] bg-[#162654] shadow-md ring-1 ring-[#F2B705]/40'
                          : 'border-white/15 bg-[#0B142E]/80 hover:border-white/30'
                      }`}
                    >
                      {/* Colored bar on left */}
                      <div
                        className="absolute inset-y-0 left-0 w-1 rounded-l-xl"
                        style={{ backgroundColor: team.color }}
                      />

                      {/* Team Name & Status */}
                      <div className="flex items-center gap-1.5 pl-1.5 min-w-0 flex-1">
                        <span className="text-base sm:text-lg shrink-0 leading-none" aria-hidden="true">
                          {team.emoji}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs sm:text-sm font-bold text-[#FFFDF7]">
                            {team.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono-tabular">
                            {isLocked ? (
                              <span className="text-[#34D399] font-bold flex items-center gap-1">
                                <Lock className="h-2.5 w-2.5 text-[#F2B705]" />
                                Terkunci (Rahasia)
                              </span>
                            ) : (
                              <span>Pilih jawaban:</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Option Buttons A/B/C/D/(E) or Concealed Secret Answer */}
                      {isLocked ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Secret Masked Answer Badge (letter hidden by default) */}
                          <div
                            className="flex h-8 items-center gap-1.5 rounded-lg bg-[#0F1B3D] border border-[#F2B705]/60 px-2 sm:px-2.5 shadow text-xs"
                            title={
                              revealedSecrets[team.id]
                                ? `Jawaban dipilih: ${team.selectedAnswer}`
                                : 'Jawaban tersimpan dan disembunyikan agar regu lain tidak menyontek'
                            }
                          >
                            <Lock className="h-3 w-3 text-[#F2B705] shrink-0" />
                            <span className="font-mono-tabular font-black tracking-wider text-[#F2B705]">
                              {revealedSecrets[team.id] ? team.selectedAnswer : '••••'}
                            </span>
                          </div>

                          {/* Tombol Intip Rahasia (Opsional untuk Guru / Tim) */}
                          <button
                            type="button"
                            onClick={() =>
                              setRevealedSecrets((prev) => ({
                                ...prev,
                                [team.id]: !prev[team.id],
                              }))
                            }
                            className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all active:scale-95"
                            title={
                              revealedSecrets[team.id]
                                ? 'Sembunyikan kembali jawaban'
                                : 'Intip pilihan jawaban tim'
                            }
                            aria-label="Intip pilihan jawaban"
                          >
                            {revealedSecrets[team.id] ? (
                              <EyeOff className="h-3.5 w-3.5 text-[#F2B705]" />
                            ) : (
                              <Eye className="h-3.5 w-3.5 text-slate-300" />
                            )}
                          </button>

                          {/* Tombol Ganti Pilihan */}
                          <button
                            type="button"
                            onClick={() => {
                              setRevealedSecrets((prev) => ({ ...prev, [team.id]: false }));
                              onResetSingleTeamAnswer(team.id);
                            }}
                            className="h-8 rounded-lg bg-white/10 hover:bg-white/20 px-2.5 text-[11px] font-bold text-slate-200 hover:text-white transition-all active:scale-95"
                            title="Ganti pilihan jawaban tim ini"
                          >
                            Ganti
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 shrink-0">
                          {activeLetters.map((letter) => (
                            <button
                              key={letter}
                              type="button"
                              onClick={() => onSelectTeamAnswer(team.id, letter)}
                              className={`h-8 w-8 rounded-lg font-mono-tabular text-xs font-black text-white shadow transition-all active:scale-90 hover:brightness-125 ${OPTION_STYLES[letter].bg} ring-1 ring-white/20`}
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
            </section>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* ERGONOMIC COMPACT DOCKED BOTTOM ACTION BAR (SLEEK & BALANCED) */}
      {/* ========================================================= */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/20 bg-[#0B142E]/95 px-3 py-2 sm:px-6 sm:py-2.5 backdrop-blur-md shadow-2xl">
        <div className="container mx-auto max-w-7xl flex flex-row items-center justify-between gap-2 sm:gap-4">
          {/* Left Context / Status */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-200 min-w-0 flex-1 truncate">
            {!isRevealed ? (
              isSolo ? (
                soloSelectedAnswer ? (
                  <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                    <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
                    <span className="truncate">
                      Pilihan Anda:{' '}
                      <strong className="text-[#F2B705] font-black text-sm sm:text-base">
                        {soloSelectedAnswer}
                      </strong>
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-300 truncate">
                    <span className="h-2 w-2 rounded-full bg-[#F2B705] shrink-0" />
                    <span className="truncate">Pilih salah satu jawaban (A–{hasOptionE ? 'E' : 'D'})</span>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                  <span
                    className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                      lockedCount === teams.length ? 'bg-[#10B981]' : 'bg-[#F2B705] animate-pulse'
                    }`}
                  />
                  <span className="truncate text-xs sm:text-sm">
                    <strong className="text-[#F2B705] font-extrabold">{lockedCount}</strong> dari{' '}
                    <strong className="text-white font-extrabold">{teams.length}</strong> Tim mengunci jawaban
                  </span>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm truncate">
                <span className="rounded bg-[#059669] px-2 py-0.5 text-xs font-black text-white shrink-0">
                  KUNCI: {question.correctAnswer}
                </span>
                <span className="hidden min-[600px]:inline text-slate-300 text-xs truncate">
                  {isSolo
                    ? soloSelectedAnswer === question.correctAnswer
                      ? 'Jawaban Anda tepat!'
                      : 'Simak pembahasan materi di atas.'
                    : `${correctTeams.length} tim berhasil menjawab benar.`}
                </span>
              </div>
            )}
          </div>

          {/* Right: Sleek, compact action button (NEVER giant or full-width) */}
          <div className="shrink-0 flex items-center">
            {!isRevealed ? (
              /* State 1: Buka Jawaban Button - Compact & Proportional */
              <button
                type="button"
                onClick={onRevealAnswer}
                disabled={isSolo && soloSelectedAnswer === null}
                title="Buka Jawaban (Pintasan: Spasi)"
                className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#F2B705] to-[#D99B00] px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-extrabold text-[#0F1B3D] shadow-md hover:brightness-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap min-h-[38px] sm:min-h-[42px]"
              >
                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span>Buka Jawaban</span>
                <span className="hidden md:inline text-[10px] opacity-75 font-normal">
                  (Spasi)
                </span>
              </button>
            ) : (
              /* State 2: Lanjut ke Soal Berikutnya / Hasil Akhir - Compact & Ergonomic */
              <button
                type="button"
                onClick={onNextQuestion}
                title={
                  isLastQuestion
                    ? 'Lihat Hasil Akhir (Spasi / Enter)'
                    : 'Lanjut ke Soal Berikutnya (Spasi / Enter)'
                }
                className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg ring-1 sm:ring-2 ring-[#6EE7B7]/50 hover:brightness-110 active:scale-95 transition-all whitespace-nowrap min-h-[38px] sm:min-h-[42px]"
              >
                {isLastQuestion ? (
                  <>
                    <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current text-[#F2B705]" />
                    <span>Lihat Hasil Akhir</span>
                    <span className="hidden md:inline text-[10px] opacity-75 font-normal">
                      (Enter)
                    </span>
                  </>
                ) : (
                  <>
                    <span>Soal Berikutnya</span>
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden md:inline text-[10px] opacity-75 font-normal">
                      (Spasi)
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FULLSCREEN IMAGE ZOOM MODAL */}
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
