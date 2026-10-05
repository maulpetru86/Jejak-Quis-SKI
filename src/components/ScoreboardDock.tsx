import React, { useEffect, useState } from 'react';
import { Check, Zap, Plus, Minus, RotateCcw, Clock, ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { AnswerLetter, TeamGameState } from '../config/quizConfig';

interface AnimatedScoreProps {
  value: number;
}

export const AnimatedScore: React.FC<AnimatedScoreProps> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (displayValue === value) return;
    const diff = value - displayValue;
    const duration = 500;
    const steps = 18;
    const stepTime = duration / steps;
    let currentStep = 0;
    const startVal = displayValue;

    const timer = window.setInterval(() => {
      currentStep += 1;
      if (currentStep >= steps) {
        setDisplayValue(value);
        window.clearInterval(timer);
      } else {
        const eased = 1 - Math.pow(1 - currentStep / steps, 3);
        setDisplayValue(Math.round(startVal + diff * eased));
      }
    }, stepTime);

    return () => window.clearInterval(timer);
  }, [value, displayValue]);

  return <span className="font-mono-tabular">{displayValue}</span>;
};

interface ScoreboardDockProps {
  teams: TeamGameState[];
  isRevealed: boolean;
  correctAnswer: AnswerLetter;
  doublePointsPowerUpEnabled: boolean;
  onToggleDoublePoints: (teamId: string) => void;
  onManualScoreAdjust: (teamId: string, delta: number) => void;
  onResetSingleTeamAnswer: (teamId: string) => void;
}

export const ScoreboardDock: React.FC<ScoreboardDockProps> = ({
  teams,
  isRevealed,
  correctAnswer,
  doublePointsPowerUpEnabled,
  onToggleDoublePoints,
  onManualScoreAdjust,
  onResetSingleTeamAnswer,
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(true);

  const gridColsClass =
    teams.length === 2
      ? 'grid-cols-1 min-[420px]:grid-cols-2'
      : teams.length === 3
        ? 'grid-cols-1 sm:grid-cols-3'
        : teams.length === 4
          ? 'grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4'
          : teams.length === 5
            ? 'grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
            : 'grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6';

  const leadingTeam = [...teams].sort((a, b) => b.score - a.score)[0];

  return (
    <section
      aria-label="Papan Skor Tim"
      className="w-full rounded-2xl border border-white/15 bg-[#0B142E]/95 p-2.5 sm:p-3 shadow-2xl transition-all"
    >
      {/* Mobile Top Toggle Header */}
      <div className="flex items-center justify-between pb-1.5 md:hidden">
        <button
          type="button"
          onClick={() => setIsMobileExpanded((prev) => !prev)}
          className="flex items-center gap-1.5 text-xs font-bold text-[#F2B705]"
        >
          <Trophy className="h-3.5 w-3.5" />
          <span>Papan Skor Tim ({teams.length} Kelompok)</span>
          {leadingTeam && (
            <span className="text-[11px] text-slate-300">
              · Memimpin: {leadingTeam.emoji} {leadingTeam.name} ({leadingTeam.score}p)
            </span>
          )}
          {isMobileExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </button>

        <span className="text-[10px] text-slate-400">
          {isMobileExpanded ? 'Klik sembunyikan' : 'Klik tampilkan'}
        </span>
      </div>

      {/* Scoreboard Cards Grid */}
      <div className={`${!isMobileExpanded ? 'hidden md:grid' : 'grid'} gap-2 sm:gap-3 ${gridColsClass}`}>
        {teams.map((team) => {
          const hasAnswered = team.selectedAnswer !== null;
          const isCorrect = isRevealed && team.selectedAnswer === correctAnswer;
          const isWrong =
            isRevealed && team.selectedAnswer !== null && team.selectedAnswer !== correctAnswer;

          return (
            <div
              key={team.id}
              className={`relative flex flex-col justify-between rounded-xl border p-2 sm:p-3 transition-all ${
                isCorrect
                  ? 'border-[#10B981] bg-[#064E3B]/55 animate-pop-correct'
                  : isWrong
                    ? 'border-[#EF4444]/80 bg-[#7F1D1D]/40 animate-shake-wrong'
                    : hasAnswered
                      ? 'border-[#F2B705] bg-[#162654]'
                      : 'border-white/15 bg-[#132047]/80'
              }`}
            >
              <div
                className="absolute inset-x-0 top-0 h-1.5 rounded-t-xl"
                style={{ backgroundColor: team.color }}
              />

              <div className="mt-1 flex items-start justify-between gap-1.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl sm:text-2xl leading-none" aria-hidden="true">
                      {team.emoji}
                    </span>
                    <h3 className="truncate text-xs sm:text-sm lg:text-base font-bold text-[#FFFDF7]" title={team.name}>
                      {team.name}
                    </h3>
                  </div>

                  <p className="mt-0.5 text-[10px] sm:text-xs font-medium text-slate-300 truncate">
                    Tombol:{' '}
                    <span className="font-mono-tabular font-bold text-[#F2B705]">
                      {team.keys.A}·{team.keys.B}·{team.keys.C}·{team.keys.D}{team.keys.E ? `·${team.keys.E}` : ''}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <div className="text-lg sm:text-2xl font-extrabold tracking-tight text-[#FFFDF7] xl:text-3xl">
                    <AnimatedScore value={team.score} />
                  </div>

                  {isRevealed && team.lastPointsDelta !== 0 && (
                    <span
                      className={`font-mono-tabular text-[10px] sm:text-xs font-extrabold ${
                        team.lastPointsDelta > 0 ? 'text-[#34D399]' : 'text-[#FCA5A5]'
                      }`}
                    >
                      {team.lastPointsDelta > 0
                        ? `+${team.lastPointsDelta}p`
                        : `${team.lastPointsDelta}p`}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-1 border-t border-white/10 pt-1.5">
                <div className="flex items-center gap-1 min-w-0">
                  {!isRevealed ? (
                    hasAnswered ? (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#F2B705] truncate">
                        <Check className="h-3.5 w-3.5 shrink-0 stroke-[3]" />
                        <span className="truncate">Terkunci ✓</span>
                        <button
                          type="button"
                          onClick={() => onResetSingleTeamAnswer(team.id)}
                          title={`Reset jawaban ${team.name}`}
                          className="rounded p-1 text-slate-300 hover:bg-white/15 hover:text-white active:scale-95"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-300 truncate">
                        <Clock className="h-3 w-3 shrink-0 text-slate-400" />
                        <span className="truncate">Menjawab...</span>
                      </div>
                    )
                  ) : hasAnswered ? (
                    <div className="flex items-center gap-1 text-[11px] font-bold">
                      <span
                        className={`inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded font-mono-tabular text-[10px] sm:text-xs font-extrabold ${
                          isCorrect ? 'bg-[#10B981] text-[#0F1B3D]' : 'bg-[#EF4444] text-white'
                        }`}
                      >
                        {team.selectedAnswer}
                      </span>
                      <span className={`text-[10px] sm:text-xs truncate ${isCorrect ? 'text-[#6EE7B7]' : 'text-[#FCA5A5]'}`}>
                        {isCorrect ? 'Benar' : 'Salah'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400">Lewat</span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-auto">
                  {doublePointsPowerUpEnabled && (
                    <button
                      type="button"
                      disabled={
                        isRevealed ||
                        (team.doublePointsUsed && !team.doublePointsActiveThisRound)
                      }
                      onClick={() => onToggleDoublePoints(team.id)}
                      title="Power-up 2x"
                      className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold transition-all whitespace-nowrap min-h-[26px] ${
                        team.doublePointsActiveThisRound
                          ? 'bg-[#F2B705] text-[#0F1B3D] shadow-md ring-1 ring-white'
                          : team.doublePointsUsed
                            ? 'bg-white/5 text-slate-500 line-through cursor-not-allowed'
                            : 'bg-[#F2B705]/20 text-[#F2B705] hover:bg-[#F2B705]/35'
                      }`}
                    >
                      <Zap className="h-2.5 w-2.5" />
                      <span>2x</span>
                    </button>
                  )}

                  <div className="flex items-center rounded border border-white/10 bg-black/25">
                    <button
                      type="button"
                      onClick={() => onManualScoreAdjust(team.id, -25)}
                      title={`Kurangi 25 poin (${team.name})`}
                      className="p-1 sm:p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
                      aria-label={`Kurangi skor ${team.name}`}
                    >
                      <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onManualScoreAdjust(team.id, 25)}
                      title={`Tambah 25 poin (${team.name})`}
                      className="p-1 sm:p-1.5 text-slate-300 hover:bg-white/10 hover:text-[#F2B705]"
                      aria-label={`Tambah skor ${team.name}`}
                    >
                      <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
