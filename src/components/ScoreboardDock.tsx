import React, { useEffect, useState } from 'react';
import {
  Check,
  Zap,
  Plus,
  Minus,
  RotateCcw,
  Clock,
  Trophy,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { AnswerLetter, TeamGameState } from '../config/quizConfig';

interface AnimatedScoreProps {
  value: number;
}

export const AnimatedScore: React.FC<AnimatedScoreProps> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (displayValue === value) return;
    const diff = value - displayValue;
    const duration = 450;
    const steps = 15;
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
  const [adjustingTeamId, setAdjustingTeamId] = useState<string | null>(null);

  const leadingScore = Math.max(...teams.map((t) => t.score));
  const activeAdjustingTeam = teams.find((t) => t.id === adjustingTeamId) || null;

  return (
    <section
      aria-label="Papan Skor Tim Teratas"
      className="w-full rounded-xl sm:rounded-2xl border border-white/15 bg-gradient-to-r from-[#0B142E] via-[#122047] to-[#0B142E] p-2 sm:p-2.5 shadow-xl transition-all"
    >
      {/* Horizontal Flex / Grid for Teams */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2">
        {teams.map((team) => {
          const hasAnswered = team.selectedAnswer !== null;
          const isCorrect = isRevealed && team.selectedAnswer === correctAnswer;
          const isWrong =
            isRevealed && team.selectedAnswer !== null && team.selectedAnswer !== correctAnswer;
          const isLeader = teams.length > 1 && team.score === leadingScore && leadingScore > 0;

          return (
            <div
              key={team.id}
              className={`relative flex flex-col justify-between rounded-lg sm:rounded-xl border p-2 transition-all ${
                isCorrect
                  ? 'border-[#10B981] bg-[#064E3B]/70 ring-1 ring-[#10B981]'
                  : isWrong
                    ? 'border-[#EF4444]/70 bg-[#7F1D1D]/40'
                    : hasAnswered
                      ? 'border-[#F2B705]/80 bg-[#162654]'
                      : 'border-white/10 bg-[#0F1B3D]/80'
              }`}
            >
              {/* Top Accent Strip */}
              <div
                className="absolute inset-x-0 top-0 h-1 rounded-t-lg sm:rounded-t-xl"
                style={{ backgroundColor: team.color }}
              />

              {/* Team Info Header */}
              <div className="flex items-center justify-between gap-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  <span className="text-base sm:text-lg shrink-0 leading-none" aria-hidden="true">
                    {team.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span
                        className="truncate text-xs sm:text-sm font-bold text-[#FFFDF7]"
                        title={team.name}
                      >
                        {team.name}
                      </span>
                      {isLeader && (
                        <span title="Memimpin perolehan skor" className="inline-flex">
                          <Trophy
                            className="h-3 w-3 text-[#F2B705] shrink-0 fill-current"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div className="text-xs sm:text-base font-extrabold text-[#F2B705]">
                    <AnimatedScore value={team.score} />
                    <span className="text-[10px] font-normal text-slate-300 ml-0.5">p</span>
                  </div>
                </div>
              </div>

              {/* Status and Action Row */}
              <div className="mt-1.5 flex items-center justify-between gap-1 border-t border-white/10 pt-1 text-[10px] sm:text-[11px]">
                {/* Answer State */}
                <div className="min-w-0 flex-1">
                  {!isRevealed ? (
                    hasAnswered ? (
                      <span className="inline-flex items-center gap-0.5 text-[#F2B705] font-extrabold truncate">
                        <Check className="h-3 w-3 stroke-[3]" />
                        <span>Kunci</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-slate-400 font-medium truncate">
                        <Clock className="h-2.5 w-2.5 text-slate-500" />
                        <span>Menjawab</span>
                      </span>
                    )
                  ) : hasAnswered ? (
                    <span
                      className={`inline-flex items-center gap-1 font-bold truncate ${
                        isCorrect ? 'text-[#34D399]' : 'text-[#FCA5A5]'
                      }`}
                    >
                      <span
                        className={`inline-flex h-4 w-4 items-center justify-center rounded font-mono-tabular text-[9px] font-extrabold ${
                          isCorrect ? 'bg-[#10B981] text-[#0F1B3D]' : 'bg-[#EF4444] text-white'
                        }`}
                      >
                        {team.selectedAnswer}
                      </span>
                      <span>{isCorrect ? `+${team.lastPointsDelta}p` : 'Salah'}</span>
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium">Lewat</span>
                  )}
                </div>

                {/* Teacher Adjust Button */}
                <div className="flex items-center gap-0.5 shrink-0">
                  {hasAnswered && !isRevealed && (
                    <button
                      type="button"
                      onClick={() => onResetSingleTeamAnswer(team.id)}
                      title={`Reset jawaban ${team.name}`}
                      className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                      aria-label={`Reset jawaban ${team.name}`}
                    >
                      <RotateCcw className="h-2.5 w-2.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setAdjustingTeamId(adjustingTeamId === team.id ? null : team.id)
                    }
                    title={`Ubah skor / Power-up ${team.name}`}
                    className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-[#F2B705] transition-colors"
                    aria-label={`Atur poin ${team.name}`}
                  >
                    <SlidersHorizontal className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* QUICK TEACHER POPUP CONTROLLER (Only shows when teacher clicks adjust on a team) */}
      {activeAdjustingTeam && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#F2B705]/40 bg-[#0F1B3D] px-3 py-1.5 text-xs animate-fade-slide-up">
          <div className="flex items-center gap-2">
            <span className="text-base">{activeAdjustingTeam.emoji}</span>
            <span className="font-bold text-[#FFFDF7]">
              Pengaturan Skor: {activeAdjustingTeam.name}
            </span>
            <span className="font-mono-tabular font-extrabold text-[#F2B705]">
              ({activeAdjustingTeam.score} poin)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {doublePointsPowerUpEnabled && (
              <button
                type="button"
                disabled={
                  isRevealed ||
                  (activeAdjustingTeam.doublePointsUsed &&
                    !activeAdjustingTeam.doublePointsActiveThisRound)
                }
                onClick={() => onToggleDoublePoints(activeAdjustingTeam.id)}
                className={`flex items-center gap-1 rounded px-2 py-1 text-[11px] font-bold ${
                  activeAdjustingTeam.doublePointsActiveThisRound
                    ? 'bg-[#F2B705] text-[#0F1B3D] ring-1 ring-white'
                    : activeAdjustingTeam.doublePointsUsed
                      ? 'bg-white/5 text-slate-500 line-through'
                      : 'bg-[#F2B705]/20 text-[#F2B705] hover:bg-[#F2B705]/30'
                }`}
              >
                <Zap className="h-3 w-3" />
                <span>Power-up 2x</span>
              </button>
            )}

            <div className="flex items-center rounded border border-white/20 bg-black/40">
              <button
                type="button"
                onClick={() => onManualScoreAdjust(activeAdjustingTeam.id, -25)}
                className="flex items-center gap-0.5 px-2 py-1 text-slate-200 hover:bg-white/10 hover:text-white"
                title="Kurang 25 poin"
              >
                <Minus className="h-3 w-3" />
                <span>25</span>
              </button>
              <div className="h-4 w-px bg-white/20" />
              <button
                type="button"
                onClick={() => onManualScoreAdjust(activeAdjustingTeam.id, 25)}
                className="flex items-center gap-0.5 px-2 py-1 text-[#F2B705] hover:bg-white/10 hover:text-[#facc15]"
                title="Tambah 25 poin"
              >
                <Plus className="h-3 w-3" />
                <span>25</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setAdjustingTeamId(null)}
              className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white ml-1"
              aria-label="Tutup pengaturan skor"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
