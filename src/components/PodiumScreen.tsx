import React, { useEffect, useRef } from 'react';
import { Trophy, RotateCcw, Home, Award, Crown } from 'lucide-react';
import { GradeLevel, TeamGameState } from '../config/quizConfig';
import { HagiaSophiaSilhouette, OttomanStarIcon } from './OttomanDecorations';

interface PodiumScreenProps {
  packageName: string;
  gradeLevel?: GradeLevel;
  totalQuestions: number;
  teams: TeamGameState[];
  onPlayAgain: () => void;
  onBackHome: () => void;
}

export const PodiumScreen: React.FC<PodiumScreenProps> = ({
  packageName,
  gradeLevel,
  totalQuestions,
  teams,
  onPlayAgain,
  onBackHome,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sortedTeams = [...teams].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.correctCount - a.correctCount;
  });

  const firstPlace = sortedTeams[0];
  const secondPlace = sortedTeams[1];
  const thirdPlace = sortedTeams[2];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#F2B705', '#C8102E', '#10B981', '#3B82F6', '#FFFDF7', '#A855F7'];
    const particles = Array.from({ length: 110 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: Math.random() * 2.2 + 1.2,
      vx: (Math.random() - 0.5) * 1.5,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.08,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.angle += p.spin;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F1B3D] px-3 py-6 sm:px-6 sm:py-8 lg:px-10">
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-10"
        aria-hidden="true"
      />

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 text-[#F2B705] hidden sm:block">
        <HagiaSophiaSilhouette className="w-full h-auto" />
      </div>

      <div className="relative z-20 mx-auto max-w-6xl space-y-6 sm:space-y-8">
        <div className="text-center space-y-1.5 sm:space-y-2 animate-fade-slide-up">
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F2B705]">
            <OttomanStarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>HASIL AKHIR PERMAINAN</span>
            <span aria-hidden="true">·</span>
            <span>{packageName}</span>
            {gradeLevel && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-white/80 font-semibold">Kelas {gradeLevel} MA</span>
              </>
            )}
          </div>

          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide text-[#FFFDF7]">
            Podium Juara Peradaban Islam
          </h1>
          <p className="text-xs sm:text-base text-slate-300">
            Apresiasi untuk seluruh kelompok yang telah berdiskusi dan menyelesaikan {totalQuestions} soal!
          </p>
        </div>

        {/* PODIUM CARDS: Stack Juara 1 on top on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4 sm:gap-6 pt-2 sm:pt-6">
          {/* JUARA 2 */}
          {secondPlace && (
            <div className="order-2 md:order-1 flex flex-col items-center animate-fade-slide-up">
              <div className="mb-2 sm:mb-3 flex flex-col items-center text-center">
                <span className="text-4xl sm:text-5xl">{secondPlace.emoji}</span>
                <h2 className="mt-1 text-lg sm:text-2xl font-extrabold text-[#FFFDF7]">{secondPlace.name}</h2>
                <p className="font-mono-tabular text-2xl sm:text-3xl font-extrabold text-slate-200">
                  {secondPlace.score} <span className="text-xs sm:text-sm font-normal">poin</span>
                </p>
              </div>
              <div
                className="flex h-28 sm:h-44 w-full flex-col items-center justify-between rounded-2xl sm:rounded-t-3xl border-t-4 border-slate-300 bg-gradient-to-b from-[#1E293B] to-[#0F172A] p-3 sm:p-5 shadow-2xl"
                style={{ borderTopColor: secondPlace.color }}
              >
                <div className="flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-300/20 text-slate-200 ring-2 ring-slate-300">
                  <span className="font-display text-base sm:text-2xl font-extrabold">2</span>
                </div>
                <div className="text-center text-[10px] sm:text-xs font-semibold text-slate-300">
                  Juara II · {secondPlace.correctCount} Benar
                </div>
              </div>
            </div>
          )}

          {/* JUARA 1 */}
          {firstPlace && (
            <div className="order-1 md:order-2 flex flex-col items-center animate-pop-correct">
              <div className="mb-2 sm:mb-3 flex flex-col items-center text-center">
                <Crown className="mb-1 h-8 w-8 sm:h-10 sm:w-10 text-[#F2B705] drop-shadow" />
                <span className="text-5xl sm:text-6xl">{firstPlace.emoji}</span>
                <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#F2B705]">{firstPlace.name}</h2>
                <p className="font-mono-tabular text-3xl sm:text-4xl font-extrabold text-[#FFFDF7]">
                  {firstPlace.score} <span className="text-sm sm:text-base font-normal text-[#F2B705]">poin</span>
                </p>
              </div>
              <div className="flex h-36 sm:h-56 w-full flex-col items-center justify-between rounded-2xl sm:rounded-t-3xl border-2 border-[#F2B705] bg-gradient-to-b from-[#C8102E] via-[#8E0B20] to-[#162654] p-4 sm:p-6 shadow-2xl">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#F2B705] text-[#0F1B3D] shadow-lg ring-2 sm:ring-4 ring-white/40">
                  <Trophy className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div className="text-center">
                  <div className="font-display text-sm sm:text-lg font-extrabold tracking-wider text-[#F2B705]">
                    JUARA UTAMA
                  </div>
                  <div className="mt-0.5 text-[10px] sm:text-xs font-semibold text-white/90">
                    {firstPlace.correctCount} Benar dari {totalQuestions} Soal
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* JUARA 3 */}
          {thirdPlace ? (
            <div className="order-3 flex flex-col items-center animate-fade-slide-up">
              <div className="mb-2 sm:mb-3 flex flex-col items-center text-center">
                <span className="text-4xl sm:text-5xl">{thirdPlace.emoji}</span>
                <h2 className="mt-1 text-lg sm:text-2xl font-extrabold text-[#FFFDF7]">{thirdPlace.name}</h2>
                <p className="font-mono-tabular text-2xl sm:text-3xl font-extrabold text-amber-400">
                  {thirdPlace.score} <span className="text-xs sm:text-sm font-normal">poin</span>
                </p>
              </div>
              <div
                className="flex h-24 sm:h-36 w-full flex-col items-center justify-between rounded-2xl sm:rounded-t-3xl border-t-4 border-amber-600 bg-gradient-to-b from-[#27201C] to-[#16192B] p-3 sm:p-5 shadow-2xl"
                style={{ borderTopColor: thirdPlace.color }}
              >
                <div className="flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 ring-2 ring-amber-500">
                  <span className="font-display text-sm sm:text-xl font-extrabold">3</span>
                </div>
                <div className="text-center text-[10px] sm:text-xs font-semibold text-slate-300">
                  Juara III · {thirdPlace.correctCount} Benar
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:block" />
          )}
        </div>

        {/* LEADERBOARD TABLE */}
        <section
          aria-label="Daftar Peringkat Lengkap"
          className="rounded-2xl sm:rounded-3xl border border-white/15 bg-[#162654]/95 p-3.5 sm:p-6 shadow-2xl"
        >
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-lg font-bold text-[#FFFDF7]">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-[#F2B705]" />
              <span>Klasemen Lengkap</span>
            </h3>
            <span className="text-[11px] sm:text-xs font-medium text-slate-300">
              Total {totalQuestions} Soal
            </span>
          </div>

          <div className="overflow-x-auto -mx-3.5 sm:mx-0 px-3.5 sm:px-0">
            <table className="w-full text-left border-collapse min-w-[320px]">
              <thead>
                <tr className="border-b border-white/15 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                  <th className="py-2 sm:py-3 px-2 sm:px-4">Pos</th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4">Tim</th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-center">Benar</th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-center">Salah</th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-right">Skor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs sm:text-base">
                {sortedTeams.map((team, idx) => (
                  <tr
                    key={team.id}
                    className={`transition-colors ${
                      idx === 0 ? 'bg-[#F2B705]/10 font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <td className="py-2 sm:py-3.5 px-2 sm:px-4 font-mono-tabular">
                      <span
                        className={`inline-flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded font-extrabold text-xs sm:text-sm ${
                          idx === 0
                            ? 'bg-[#F2B705] text-[#0F1B3D]'
                            : idx === 1
                              ? 'bg-slate-300 text-[#0F1B3D]'
                              : idx === 2
                                ? 'bg-amber-600 text-white'
                                : 'bg-white/10 text-slate-200'
                        }`}
                      >
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3.5 px-2 sm:px-4">
                      <div className="flex items-center gap-1.5 sm:gap-3">
                        <span className="text-lg sm:text-2xl">{team.emoji}</span>
                        <span className="font-bold text-xs sm:text-base text-[#FFFDF7]">{team.name}</span>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3.5 px-2 sm:px-4 text-center font-mono-tabular font-bold text-[#34D399]">
                      {team.correctCount}
                    </td>
                    <td className="py-2 sm:py-3.5 px-2 sm:px-4 text-center font-mono-tabular text-[#FCA5A5]">
                      {team.wrongCount}
                    </td>
                    <td className="py-2 sm:py-3.5 px-2 sm:px-4 text-right font-mono-tabular text-base sm:text-2xl font-extrabold text-[#F2B705]">
                      {team.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 pb-6">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-[#F2B705] px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-extrabold text-[#0F1B3D] shadow-xl hover:bg-[#facc15] active:scale-95 whitespace-nowrap"
          >
            <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
            <span>Main Lagi</span>
          </button>

          <button
            type="button"
            onClick={onBackHome}
            className="flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-white/25 sm:border-2 bg-[#162654] px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-lg font-bold text-[#FFFDF7] shadow-xl hover:bg-white/15 whitespace-nowrap"
          >
            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </div>
    </div>
  );
};
