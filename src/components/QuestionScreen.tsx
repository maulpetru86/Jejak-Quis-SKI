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
  Zap,
  Sparkles,
  ZoomIn,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import {
  AnswerLetter,
  GradeLevel,
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
    <div className="w-full min-h-screen bg-islamic-pattern text-[#FFFDF7] flex flex-col justify-between py-2 sm:py-3 lg:py-5 pb-40 sm:pb-48 lg:pb-56">
      {/* Central Container */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 max-w-6xl xl:max-w-7xl 2xl:max-w-[1400px] w-full flex-1 flex flex-col justify-start gap-3 sm:gap-4">
        {/* ========================================================= */}
        {/* 1. TOP BAR: STATUS, TIMER, QUICK CONTROLS                */}
        {/* ========================================================= */}
        <header className="w-full space-y-2">
          <div className="flex items-center justify-between gap-2 rounded-xl sm:rounded-2xl border border-white/10 bg-[#121E3E]/95 px-3 py-2 sm:px-4 sm:py-2.5 shadow-md">
            {/* Left: Question counter & Package Name */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[#F2B705] shrink-0">
                <OttomanStarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-mono-tabular text-xs sm:text-sm font-bold tracking-wide text-white">
                  Soal #{questionIndex + 1}/{totalQuestions}
                </span>
              </div>
              <span className="text-white/30 hidden min-[480px]:inline" aria-hidden="true">
                ·
              </span>
              <span
                className="truncate max-w-[160px] sm:max-w-[280px] md:max-w-md lg:max-w-none text-xs sm:text-sm font-medium text-slate-200 min-w-0"
                title={packageName}
              >
                {packageName}
              </span>
              {gradeLevel && (
                <span className="hidden sm:inline text-xs text-slate-400 font-medium shrink-0">
                  (Kelas {gradeLevel})
                </span>
              )}
            </div>

            {/* Center: Solo Score Stats */}
            {isSolo && (
              <div className="flex items-center gap-2.5 sm:gap-3 px-2.5 py-1 rounded-lg bg-[#0A122A] border border-white/10 font-mono-tabular shrink-0 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-medium hidden sm:inline">Skor:</span>
                  <span className="font-bold text-[#F2B705]">{soloScore}p</span>
                </div>
                <div className="h-3 w-px bg-white/20" />
                <div className="flex items-center gap-1">
                  <span className="text-[#34D399] font-bold">{soloCorrectCount} B</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-[#F87171] font-bold">{soloWrongCount} S</span>
                </div>
              </div>
            )}

            {/* Right: Quick Controls & Timer */}
            <div className="flex items-center gap-1.5 shrink-0">
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
                  className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-semibold transition-colors ${
                    isPaused
                      ? 'border-[#F2B705] bg-[#F2B705] text-[#0A122C]'
                      : 'border-white/15 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{isPaused ? 'Jalan' : 'Jeda'}</span>
                </button>
              )}

              {/* Reset Answers Button (Group Mode) */}
              {!isRevealed && !isSolo && (
                <button
                  type="button"
                  onClick={onResetAllAnswers}
                  disabled={lockedCount === 0}
                  className="rounded-lg border border-white/15 bg-white/5 p-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30"
                  title="Reset Jawaban Soal Ini"
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
                  className="rounded-lg border border-white/15 bg-white/5 p-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={onToggleSound}
                className="rounded-lg border border-white/15 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                title={settings.soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
              >
                {settings.soundEnabled ? (
                  <Volume2 className="h-3.5 w-3.5 text-[#F2B705]" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5 text-slate-400" />
                )}
              </button>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={onToggleFullscreen}
                className="rounded-lg border border-white/15 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors hidden sm:block"
                title="Layar Penuh"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-3.5 w-3.5 text-[#F2B705]" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" />
                )}
              </button>

              {/* Home / Exit Button */}
              <button
                type="button"
                onClick={onRequestExitHome}
                className="flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-950/30 p-1.5 sm:px-2.5 text-xs font-semibold text-rose-200 hover:bg-rose-900/50 transition-colors"
                title="Kembali ke Beranda"
              >
                <Home className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Beranda</span>
              </button>
            </div>
          </div>

          {/* Thin Gold Progress Bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#D97706] to-[#F2B705] transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Scoreboard for Team Mode */}
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
        {/* 2. MAIN STAGE: SOAL & PILIHAN OPSI                       */}
        {/* ========================================================= */}
        <main className="w-full flex-1 flex flex-col justify-start gap-3 sm:gap-4">
          {/* Question Card */}
          <div className="relative w-full rounded-xl sm:rounded-2xl border border-[#F2B705]/40 bg-gradient-to-b from-[#14234C] via-[#0F1B3E] to-[#0A122C] p-4 sm:p-6 shadow-xl space-y-3">
            <ArabesqueCorner className="absolute left-1.5 top-1.5 h-6 w-6 sm:h-8 sm:w-8 text-[#F2B705]/25 pointer-events-none" />
            <ArabesqueCorner className="absolute right-1.5 top-1.5 h-6 w-6 sm:h-8 sm:w-8 -scale-x-100 text-[#F2B705]/25 pointer-events-none" />

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F2B705]">
                <span>SOAL #{questionIndex + 1}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">
                  {isSolo ? (settings.studentName || 'Siswa SKI') : `${lockedCount}/${teams.length} Tim Terkunci`}
                </span>
                {settings.speedBonusEnabled && !isSolo && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#34D399] flex items-center gap-1">
                      <Zap className="h-3 w-3" /> Bonus Kilat Aktif
                    </span>
                  </>
                )}
              </div>

              <h1
                key={question.id}
                className="text-base sm:text-xl md:text-2xl font-semibold leading-relaxed text-slate-50 break-words animate-fade-slide-up"
                style={{ textWrap: 'balance' }}
              >
                {question.question}
              </h1>
            </div>

            {/* Historical Supporting Image */}
            {hasImage && question.imageUrl && (
              <div className="mt-2 flex flex-col items-center justify-center rounded-lg border border-white/10 bg-[#0A122A] p-2">
                <div className="relative group max-h-48 sm:max-h-64 overflow-hidden rounded-md">
                  <img
                    src={question.imageUrl}
                    alt={question.imageCaption || 'Gambar Soal'}
                    referrerPolicy="no-referrer"
                    onError={() => setImageLoadFailed(true)}
                    className="max-h-48 sm:max-h-64 max-w-full h-auto object-contain rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setIsImageZoomed(true)}
                    className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded bg-[#0A122A]/90 px-2 py-1 text-xs font-bold text-[#F2B705] border border-[#F2B705]/40 hover:bg-[#F2B705] hover:text-[#0A122A] transition-all"
                  >
                    <ZoomIn className="h-3 w-3" />
                    <span>Perbesar</span>
                  </button>
                </div>
                {question.imageCaption && (
                  <p className="mt-1 text-center text-xs text-slate-400 italic">
                    {question.imageCaption}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* MULTIPLE CHOICE OPTIONS: HARMONIOUS, BALANCED, COHESIVE */}
          {/* ======================================================= */}
          <div
            className={`grid gap-2.5 sm:gap-3 w-full ${
              isTrueFalse ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {activeLetters.map((letter) => {
              const optionText = question.options[letter];
              const isCorrectOption = question.correctAnswer === letter;
              const isSoloPicked = isSolo && soloSelectedAnswer === letter;

              const teamsWhoPickedThis =
                isRevealed && !isSolo
                  ? teams.filter((t) => t.selectedAnswer === letter)
                  : [];

              // Aesthetic styling states:
              // - Normal: Deep navy slate, subtle border, comfortable reading
              // - Solo Selected: Warm golden border & soft blue highlight
              // - Revealed Correct: Emerald green codex
              // - Revealed Wrong (if picked): Muted crimson
              // - Revealed Unselected: Softly dimmed
              let cardClass =
                'border border-white/15 bg-[#121E3E]/90 hover:border-[#F2B705]/50 hover:bg-[#18264E] text-slate-100';
              let badgeClass =
                'border border-[#F2B705]/40 bg-[#0A122A] text-[#F2B705]';

              if (isRevealed) {
                if (isCorrectOption) {
                  cardClass =
                    'border-2 border-[#10B981] bg-[#064E3B]/80 text-white ring-2 ring-[#10B981]/30 shadow-lg scale-[1.01] animate-pop-correct';
                  badgeClass = 'bg-[#10B981] text-[#0A122C] font-black border-[#10B981]';
                } else if (isSoloPicked) {
                  cardClass =
                    'border-2 border-[#EF4444] bg-[#7F1D1D]/75 text-white ring-2 ring-[#EF4444]/30 animate-shake-wrong';
                  badgeClass = 'bg-[#EF4444] text-white font-black border-[#EF4444]';
                } else {
                  cardClass =
                    'border border-white/5 bg-[#0A122A]/40 text-slate-400 opacity-40';
                  badgeClass = 'border-white/10 bg-[#0A122A] text-slate-500';
                }
              } else if (isSolo) {
                if (isSoloPicked) {
                  cardClass =
                    'border-[#F2B705] bg-[#1E336A] ring-2 ring-[#F2B705]/50 text-white shadow-md';
                  badgeClass = 'bg-[#F2B705] text-[#0A122C] font-black border-[#F2B705]';
                } else {
                  cardClass += ' cursor-pointer active:scale-[0.99]';
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
                  className={`relative flex min-h-[56px] sm:min-h-[64px] items-center justify-between gap-3 rounded-xl p-3 sm:p-3.5 transition-all ${
                    isFifthCard ? 'sm:col-span-2' : ''
                  } ${cardClass}`}
                  role={isSolo && !isRevealed ? 'button' : undefined}
                  tabIndex={isSolo && !isRevealed ? 0 : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Letter Badge (A, B, C, D, E) */}
                    <div
                      className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg font-mono-tabular text-sm sm:text-base font-bold shadow-xs ${badgeClass}`}
                    >
                      {letter}
                    </div>

                    {/* Option Text */}
                    <span className="text-xs sm:text-sm md:text-base font-medium leading-relaxed break-words min-w-0 flex-1">
                      {optionText}
                    </span>
                  </div>

                  {/* Feedback Indicators in Solo Mode */}
                  {isRevealed && isSolo && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isCorrectOption ? (
                        <div className="flex items-center gap-1 rounded bg-[#0A122A] px-2 py-1 text-[11px] font-bold text-[#34D399] border border-[#10B981]/50">
                          <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                          <span>KUNCI BENAR</span>
                        </div>
                      ) : isSoloPicked ? (
                        <div className="flex items-center gap-1 rounded bg-[#0A122A] px-2 py-1 text-[11px] font-bold text-[#FCA5A5] border border-[#EF4444]/50">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>PILIHAN ANDA</span>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Feedback Indicators in Group Mode */}
                  {isRevealed && !isSolo && (
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {isCorrectOption && (
                        <div className="flex items-center gap-1 rounded bg-[#0A122A] px-2 py-0.5 text-[11px] font-bold text-[#34D399] border border-[#10B981]/50">
                          <CheckCircle2 className="h-3 w-3 stroke-[2.5]" />
                          <span>BENAR</span>
                        </div>
                      )}

                      {teamsWhoPickedThis.length > 0 && (
                        <div className="flex flex-wrap justify-end gap-1">
                          {teamsWhoPickedThis.map((t) => (
                            <span
                              key={t.id}
                              className="inline-flex items-center gap-1 rounded bg-[#0A122A] px-1.5 py-0.5 text-[10px] font-semibold text-white border border-white/20"
                            >
                              <span>{t.emoji}</span>
                              <span className="hidden sm:inline">{t.name}</span>
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

          {/* ======================================================= */}
          {/* PEMBAHASAN MATERI & EDUKASI (REVEALED STATE)           */}
          {/* ======================================================= */}
          {isRevealed && (
            <section
              aria-label="Pembahasan Soal"
              className="w-full rounded-xl sm:rounded-2xl border border-[#F2B705]/50 bg-gradient-to-r from-[#14234C] via-[#162754] to-[#14234C] p-4 sm:p-5 shadow-xl animate-fade-slide-up space-y-3"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#F2B705]">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span className="uppercase tracking-wider">Pembahasan Materi & Analisis Kunci</span>
                  {question.pageReference && (
                    <>
                      <span aria-hidden="true" className="text-white/30">·</span>
                      <span className="inline-flex items-center gap-1 text-[#6EE7B7] bg-[#0A122A] px-2 py-0.5 rounded border border-[#6EE7B7]/30">
                        <BookOpen className="h-3 w-3" />
                        <span>Rujukan: {question.pageReference}</span>
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs sm:text-sm md:text-base font-medium leading-relaxed text-slate-100 break-words pt-1">
                  {question.explanation ||
                    `Jawaban yang tepat untuk pertanyaan ini adalah pilihan ${question.correctAnswer}.`}
                </p>
              </div>

              {/* Feedback Summary Banner */}
              <div className="rounded-lg border border-white/10 bg-[#0A122A]/70 p-3 text-xs">
                {isSolo ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      {soloSelectedAnswer === question.correctAnswer ? (
                        <div className="text-[#34D399] font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Alhamdulillah! Jawaban Anda Benar (+{settings.baseCorrectPoints} poin)</span>
                        </div>
                      ) : (
                        <div className="text-[#FCA5A5] font-medium flex items-center gap-1.5 text-xs sm:text-sm">
                          <XCircle className="h-4 w-4 text-[#EF4444]" />
                          <span>Pilihan Anda ({soloSelectedAnswer || '-'}) belum tepat. Kunci jawaban adalah {question.correctAnswer}.</span>
                        </div>
                      )}
                    </div>
                    <div className="text-slate-300 font-medium">
                      Kunci: <strong className="text-[#F2B705] font-bold text-sm">{question.correctAnswer}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="text-xs space-y-0.5">
                      <div className="text-[#34D399] font-medium">
                        <strong>Tim Benar:</strong>{' '}
                        {correctTeams.length > 0
                          ? correctTeams.map((t) => `${t.emoji} ${t.name}`).join(', ')
                          : 'Tidak ada regu yang menjawab benar'}
                      </div>
                      {wrongTeams.length > 0 && (
                        <div className="text-slate-400">
                          <strong>Tim Belum Tepat:</strong>{' '}
                          {wrongTeams.map((t) => `${t.emoji} ${t.name} (${t.selectedAnswer})`).join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="text-slate-300 font-medium shrink-0">
                      Kunci: <strong className="text-[#F2B705] font-bold text-sm">{question.correctAnswer}</strong>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ======================================================= */}
          {/* GROUP MODE: DIRECT TEAM SELECTION PANEL                 */}
          {/* ======================================================= */}
          {!isRevealed && !isSolo && (
            <section
              aria-label="Panel Pemilihan Jawaban Regu"
              className="w-full rounded-xl sm:rounded-2xl border border-white/15 bg-[#0F1B3E]/95 p-3.5 sm:p-5 shadow-xl space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <Hand className="h-4 w-4 text-[#F2B705]" />
                  <span className="text-xs sm:text-sm md:text-base font-bold text-white">
                    Pilih Jawaban Regu ({lockedCount}/{teams.length} Terkunci)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 hidden md:inline">
                    Pintasan: Klik opsi di bawah atau gunakan tombol keyboard regu
                  </span>
                  {lockedCount > 0 && (
                    <button
                      type="button"
                      onClick={onResetAllAnswers}
                      className="text-xs text-slate-300 hover:text-white underline transition-colors"
                    >
                      Reset Semua
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of Team Selection Cards: 3 columns for 6 teams ensures wide, comfortable cards on desktop without text clipping */}
              <div
                className={`grid gap-2.5 sm:gap-3 ${
                  teams.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : teams.length === 3
                      ? 'grid-cols-1 sm:grid-cols-3'
                      : teams.length === 4
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {teams.map((team) => {
                  const isLocked = team.selectedAnswer !== null;

                  return (
                    <div
                      key={team.id}
                      className={`relative flex items-center justify-between gap-2.5 sm:gap-3 rounded-xl border p-2.5 sm:p-3 transition-all ${
                        isLocked
                          ? 'border-[#F2B705]/70 bg-[#162754] shadow-md'
                          : 'border-white/15 bg-[#0A122A]/85 hover:border-white/30'
                      }`}
                    >
                      {/* Left color bar */}
                      <div
                        className="absolute inset-y-0 left-0 w-1.5 rounded-l-xl"
                        style={{ backgroundColor: team.color }}
                      />

                      <div className="flex items-center gap-2 pl-1.5 min-w-0 flex-1">
                        <span className="text-lg sm:text-xl shrink-0 leading-none" aria-hidden="true">
                          {team.emoji}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-bold text-white truncate" title={team.name}>
                            {team.name}
                          </div>
                          <div className="text-[11px] text-slate-300 font-mono-tabular whitespace-nowrap">
                            {isLocked ? (
                              <span className="text-[#34D399] font-medium flex items-center gap-1">
                                <Lock className="h-3 w-3 text-[#F2B705]" /> Terkunci
                              </span>
                            ) : (
                              <span className="text-slate-400">Pilih opsi:</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Team Option Buttons or Secret Badge */}
                      {isLocked ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="flex h-8 items-center gap-1.5 rounded-lg bg-[#0A122A] border border-white/20 px-2.5 text-xs font-mono-tabular font-bold text-[#F2B705]">
                            <Lock className="h-3 w-3 text-[#F2B705]" />
                            <span>{revealedSecrets[team.id] ? team.selectedAnswer : '••••'}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setRevealedSecrets((prev) => ({
                                ...prev,
                                [team.id]: !prev[team.id],
                              }))
                            }
                            className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                            title="Intip jawaban regu ini"
                          >
                            {revealedSecrets[team.id] ? (
                              <EyeOff className="h-3.5 w-3.5 text-[#F2B705]" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => onResetSingleTeamAnswer(team.id)}
                            className="h-8 rounded-lg bg-white/10 hover:bg-white/20 px-2.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
                          >
                            Ubah
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                          {activeLetters.map((letter) => (
                            <button
                              key={letter}
                              type="button"
                              onClick={() => onSelectTeamAnswer(team.id, letter)}
                              className="h-8 w-8 rounded-lg font-mono-tabular text-xs sm:text-sm font-bold bg-[#14234C] hover:bg-[#F2B705] hover:text-[#0A122C] text-slate-200 border border-white/15 transition-all active:scale-95 shadow-xs"
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
      {/* 3. DOCKED BOTTOM ACTION BAR (ERGONOMIC & CLEAN)          */}
      {/* ========================================================= */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-[#0A122A]/95 px-4 py-2.5 sm:px-6 lg:px-8 backdrop-blur-md shadow-2xl">
        <div className="container mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1400px] flex items-center justify-between gap-3">
          {/* Left: Context Status */}
          <div className="text-xs sm:text-sm font-medium text-slate-300 min-w-0 flex-1">
            {!isRevealed ? (
              isSolo ? (
                soloSelectedAnswer ? (
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
                    <span>
                      Pilihan Anda:{' '}
                      <strong className="text-[#F2B705] font-bold text-sm">
                        {soloSelectedAnswer}
                      </strong>
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-400 truncate">
                    <span className="h-2 w-2 rounded-full bg-[#F2B705] shrink-0" />
                    <span>Pilih opsi (A–{hasOptionE ? 'E' : 'D'}) atau tekan angka keyboard 1–{hasOptionE ? '5' : '4'}</span>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      lockedCount === teams.length ? 'bg-[#10B981]' : 'bg-[#F2B705] animate-pulse'
                    }`}
                  />
                  <span>
                    <strong className="text-[#F2B705] font-bold">{lockedCount}</strong> dari{' '}
                    <strong className="text-white">{teams.length} Regu</strong> telah mengunci jawaban
                  </span>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2 truncate">
                <span className="rounded bg-[#059669] px-2 py-0.5 text-xs font-bold text-white shrink-0">
                  Kunci: {question.correctAnswer}
                </span>
                <span className="hidden sm:inline text-xs text-slate-300 truncate">
                  {isSolo
                    ? soloSelectedAnswer === question.correctAnswer
                      ? 'Jawaban Anda benar!'
                      : 'Simak rujukan dan penjelasan di atas.'
                    : `${correctTeams.length} regu menjawab dengan tepat.`}
                </span>
              </div>
            )}
          </div>

          {/* Right: Primary Action Button */}
          <div className="shrink-0 flex items-center">
            {!isRevealed ? (
              <button
                type="button"
                onClick={onRevealAnswer}
                disabled={isSolo && soloSelectedAnswer === null}
                title="Buka Jawaban (Spasi)"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F2B705] to-[#E5A800] px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-[#0A122C] shadow-md hover:brightness-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Eye className="h-4 w-4 shrink-0" />
                <span>Buka Jawaban</span>
                <span className="hidden md:inline text-[11px] opacity-75 font-normal">
                  (Spasi)
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onNextQuestion}
                title={
                  isLastQuestion
                    ? 'Lihat Hasil Akhir (Spasi / Enter)'
                    : 'Lanjut ke Soal Berikutnya (Spasi / Enter)'
                }
                className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:brightness-105 active:scale-95 transition-all"
              >
                {isLastQuestion ? (
                  <>
                    <Trophy className="h-4 w-4 fill-current text-[#F2B705]" />
                    <span>Lihat Hasil Akhir</span>
                  </>
                ) : (
                  <>
                    <span>Soal Berikutnya</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
                <span className="hidden md:inline text-[11px] opacity-75 font-normal">
                  (Enter)
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FULLSCREEN IMAGE MODAL */}
      {isImageZoomed && question.imageUrl && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-fade-slide-up"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center">
            <button
              type="button"
              onClick={() => setIsImageZoomed(false)}
              className="absolute -top-10 right-0 flex items-center gap-1 rounded bg-white/20 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/30"
            >
              <X className="h-4 w-4" />
              <span>Tutup</span>
            </button>

            <img
              src={question.imageUrl}
              alt="Gambar Soal Diperbesar"
              className="max-h-[80vh] max-w-full rounded-xl border border-white/20 object-contain shadow-2xl"
            />

            {question.imageCaption && (
              <p className="mt-2 text-center text-xs sm:text-sm font-semibold text-slate-200">
                {question.imageCaption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
