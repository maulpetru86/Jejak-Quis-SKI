import React, { useState, useMemo } from 'react';
import {
  Play,
  BookOpen,
  Users,
  User,
  Clock,
  Zap,
  Shuffle,
  Keyboard,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  GraduationCap,
  ListOrdered,
  Lock,
  Shield,
  Sliders,
  ArrowRight,
  Search,
  Check,
  Trophy,
} from 'lucide-react';
import {
  GradeLevel,
  QuestionPackage,
  QuizSettings,
  TeamConfig,
} from '../config/quizConfig';
import {
  ArabesqueCorner,
  ArabesqueBorderDivider,
  HagiaSophiaSilhouette,
  OttomanStarIcon,
} from './OttomanDecorations';

interface HomeViewProps {
  packages: QuestionPackage[];
  selectedPackageId: string;
  teams: TeamConfig[];
  settings: QuizSettings;
  onSelectPackage: (id: string) => void;
  onUpdateSettings: (settings: QuizSettings) => void;
  onStartQuiz: () => void;
  onOpenQuestionManager: () => void;
  onOpenTeamSettings: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  packages,
  selectedPackageId,
  teams,
  settings,
  onSelectPackage,
  onUpdateSettings,
  onStartQuiz,
  onOpenQuestionManager,
  onOpenTeamSettings,
}) => {
  const selectedPackage =
    packages.find((p) => p.id === selectedPackageId) || packages[0] || null;

  // Grade selection tab state: default to currently selected package grade or 'X'
  const [activeGrade, setActiveGrade] = useState<GradeLevel>(() => {
    return (selectedPackage?.gradeLevel as GradeLevel) || 'X';
  });

  const [searchQuery, setSearchQuery] = useState('');

  const isSolo = settings.gameMode === 'solo';
  const activeTeams = teams.slice(0, settings.teamCount);
  const questionCount = selectedPackage?.questions.length || 0;
  const canStartQuiz = questionCount > 0 && (isSolo || activeTeams.length >= 2);

  // Grade statistics
  const countX = packages.filter((p) => (p.gradeLevel || 'XI') === 'X').length;
  const countXI = packages.filter((p) => (p.gradeLevel || 'XI') === 'XI').length;
  const countXII = packages.filter((p) => (p.gradeLevel || 'XI') === 'XII').length;

  // Filtered packages by active grade tab & optional search
  const visiblePackages = useMemo(() => {
    return packages.filter((p) => {
      const matchGrade = (p.gradeLevel || 'XI') === activeGrade;
      if (!searchQuery.trim()) return matchGrade;
      const q = searchQuery.toLowerCase();
      return (
        matchGrade &&
        (p.name.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q))
      );
    });
  }, [packages, activeGrade, searchQuery]);

  const handleGradeChange = (grade: GradeLevel) => {
    setActiveGrade(grade);
    // Auto-select the first package of this grade if current package is from another grade
    if (!selectedPackage || (selectedPackage.gradeLevel || 'XI') !== grade) {
      const firstInGrade = packages.find((p) => (p.gradeLevel || 'XI') === grade);
      if (firstInGrade) {
        onSelectPackage(firstInGrade.id);
      }
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-x-hidden flex flex-col justify-between py-5 sm:py-8 pb-14">
      {/* Central Focused Container */}
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl w-full flex-1 flex flex-col justify-start space-y-6 sm:space-y-8 animate-fade-slide-up">
        {/* ======================================================== */}
        {/* 1. HERO HEADER: REFINED, DIGNIFIED, INFORMATIVE          */}
        {/* ======================================================== */}
        <header className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#F2B705] tracking-widest uppercase">
            <OttomanStarIcon className="h-4 w-4 text-[#F2B705]" />
            <span>KUIS SEJARAH KEBUDAYAAN ISLAM · MADRASAH ALIYAH</span>
            <OttomanStarIcon className="h-4 w-4 text-[#F2B705]" />
          </div>

          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-wide gold-gradient-text drop-shadow-md">
            Quiz Sejarah Peradaban Islam
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
            <span>Madrasah Aliyah</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>Kelas X, XI & XII</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="text-[#34D399] font-medium">{packages.length} Paket Materi</span>
          </div>
        </header>

        {/* ======================================================== */}
        {/* 2. MAIN CONFIGURATION CARD                               */}
        {/* ======================================================== */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#F2B705]/40 bg-gradient-to-b from-[#14234C] via-[#0F1B3E] to-[#0A122C] p-4 sm:p-7 shadow-2xl space-y-6 sm:space-y-7">
          <ArabesqueCorner className="absolute left-2 top-2 h-8 w-8 sm:h-12 sm:w-12 text-[#F2B705]/30 pointer-events-none" />
          <ArabesqueCorner className="absolute right-2 top-2 h-8 w-8 sm:h-12 sm:w-12 -scale-x-100 text-[#F2B705]/30 pointer-events-none" />

          {/* ------------------------------------------------------ */}
          {/* STEP 1: PILIH FORMAT PENGERJAAN                        */}
          {/* ------------------------------------------------------ */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F2B705] text-[#0A122C] font-black text-xs">
                  1
                </span>
                <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  Pilih Format Pengerjaan
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                {isSolo ? 'Mode Personal Siswa' : 'Mode Kompetisi Kelas'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Opsi A: Cerdas Cermat Kelompok */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, gameMode: 'group' })}
                className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left transition-all ${
                  !isSolo
                    ? 'border-[#F2B705] bg-[#1E336A]/80 text-white shadow-lg ring-1 ring-[#F2B705]/50'
                    : 'border-white/10 bg-[#0B142E]/70 text-slate-300 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg mt-0.5 ${
                    !isSolo ? 'bg-[#F2B705] text-[#0A122C]' : 'bg-white/10 text-[#F2B705]'
                  }`}
                >
                  <Trophy className="h-5 w-5 fill-current" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="text-sm sm:text-base font-bold text-white">
                    Cerdas Cermat Kelompok
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">
                    Kompetisi proyektor kelas dengan 2–6 regu & perebutan skor langsung.
                  </p>
                </div>
              </button>

              {/* Opsi B: Latihan Mandiri Siswa */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, gameMode: 'solo' })}
                className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left transition-all ${
                  isSolo
                    ? 'border-[#34D399] bg-[#0A3D2F]/70 text-white shadow-lg ring-1 ring-[#34D399]/50'
                    : 'border-white/10 bg-[#0B142E]/70 text-slate-300 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg mt-0.5 ${
                    isSolo ? 'bg-[#10B981] text-white' : 'bg-white/10 text-emerald-400'
                  }`}
                >
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="text-sm sm:text-base font-bold text-white">
                    Latihan Mandiri Siswa
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">
                    Pengerjaan mandiri 1 siswa dengan penilaian nilai 0–100 & rapor evaluasi.
                  </p>
                </div>
              </button>
            </div>

            {/* Sub-pengaturan Mode Terpilih */}
            {isSolo ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <label htmlFor="nama-siswa-input" className="text-xs font-bold text-emerald-300 shrink-0">
                  Nama Siswa / Peserta:
                </label>
                <input
                  id="nama-siswa-input"
                  type="text"
                  value={settings.studentName || ''}
                  onChange={(e) => onUpdateSettings({ ...settings, studentName: e.target.value })}
                  placeholder="Masukkan nama lengkap siswa..."
                  className="w-full sm:flex-1 rounded-lg border border-emerald-500/40 bg-[#0A162B] px-3 py-1.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-[#0B142E]/60 p-3 sm:p-3.5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">Jumlah Regu Aktif:</span>
                    <div className="inline-flex rounded-lg bg-white/5 p-1 border border-white/10">
                      {[2, 3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => onUpdateSettings({ ...settings, teamCount: num })}
                          className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                            settings.teamCount === num
                              ? 'bg-[#F2B705] text-[#0A122C] shadow-sm'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {num} Regu
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenTeamSettings}
                    className="text-xs font-semibold text-[#F2B705] hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <Sliders className="h-3 w-3" />
                    <span>Sesuaikan Nama / Keyboard</span>
                  </button>
                </div>

                {/* Team Preview Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
                  {activeTeams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#121E3E] p-2 min-w-0"
                    >
                      <span className="text-lg shrink-0 leading-none">{team.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">{team.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono-tabular truncate">
                          Tombol: {team.keys.A}·{team.keys.B}·{team.keys.C}·{team.keys.D}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ------------------------------------------------------ */}
          {/* STEP 2: PILIH MATERI & TINGKAT KELAS                   */}
          {/* ------------------------------------------------------ */}
          <section className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F2B705] text-[#0A122C] font-black text-xs">
                  2
                </span>
                <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  Pilih Tingkat Kelas & Bab Materi SKI
                </h2>
              </div>

              {/* Quick Search */}
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari materi bab..."
                  className="w-full rounded-lg border border-white/15 bg-[#0B142E] pl-8 pr-3 py-1 text-xs text-white placeholder-slate-400 focus:border-[#F2B705] focus:outline-none"
                />
              </div>
            </div>

            {/* Segmented Grade Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleGradeChange('X')}
                className={`py-2 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeGrade === 'X'
                    ? 'border-emerald-400 bg-emerald-600/30 text-white shadow-sm ring-1 ring-emerald-400'
                    : 'border-white/10 bg-[#0B142E]/70 text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>Kelas X MA</span>
                <span className="text-[11px] text-emerald-300 opacity-80">({countX} Bab)</span>
              </button>

              <button
                type="button"
                onClick={() => handleGradeChange('XI')}
                className={`py-2 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeGrade === 'XI'
                    ? 'border-amber-400 bg-amber-600/30 text-white shadow-sm ring-1 ring-amber-400'
                    : 'border-white/10 bg-[#0B142E]/70 text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>Kelas XI MA</span>
                <span className="text-[11px] text-amber-300 opacity-80">({countXI} Bab)</span>
              </button>

              <button
                type="button"
                onClick={() => handleGradeChange('XII')}
                className={`py-2 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeGrade === 'XII'
                    ? 'border-purple-400 bg-purple-600/30 text-white shadow-sm ring-1 ring-purple-400'
                    : 'border-white/10 bg-[#0B142E]/70 text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>Kelas XII MA</span>
                <span className="text-[11px] text-purple-300 opacity-80">({countXII} Bab)</span>
              </button>
            </div>

            {/* Direct Chapter Selection Cards (Crystal clear & fully visible) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {visiblePackages.map((pkg) => {
                const isSelected = pkg.id === selectedPackage?.id;
                const imgCount = pkg.questions.filter((q) => Boolean(q.imageUrl)).length;

                return (
                  <div
                    key={pkg.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectPackage(pkg.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onSelectPackage(pkg.id);
                      }
                    }}
                    className={`relative flex items-start justify-between gap-3 p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'border-[#F2B705] bg-[#1E336A] shadow-md ring-1 ring-[#F2B705]/60'
                        : 'border-white/10 bg-[#0B142E]/75 hover:border-white/25 hover:bg-[#121E3E]'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                        <span className="text-[#34D399] font-bold">
                          {pkg.questions.length} Butir Soal
                        </span>
                        {imgCount > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#F2B705] flex items-center gap-1">
                              <ImageIcon className="h-3 w-3" />
                              <span>{imgCount} Foto</span>
                            </span>
                          </>
                        )}
                      </div>

                      <h3
                        className={`text-xs sm:text-sm font-bold leading-snug truncate ${
                          isSelected ? 'text-[#FFFDF7]' : 'text-slate-200'
                        }`}
                      >
                        {pkg.name}
                      </h3>

                      <p className="text-[11px] sm:text-xs text-slate-300 line-clamp-1">
                        {pkg.subtitle}
                      </p>
                    </div>

                    <div className="shrink-0 pt-0.5">
                      {isSelected ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F2B705] text-[#0A122C] shadow-sm">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-white/20" />
                      )}
                    </div>
                  </div>
                );
              })}

              {visiblePackages.length === 0 && (
                <div className="col-span-full py-6 text-center text-xs text-slate-400">
                  Tidak ditemukan bab yang cocok dengan pencarian "{searchQuery}".
                </div>
              )}
            </div>
          </section>

          {/* ------------------------------------------------------ */}
          {/* STEP 3: PENGATURAN KUIS CEPAT                          */}
          {/* ------------------------------------------------------ */}
          <section className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F2B705] text-[#0A122C] font-black text-xs">
                  3
                </span>
                <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  Pengaturan Kuis
                </h2>
              </div>
              <span className="text-xs text-slate-400">Ketuk untuk mengaktifkan / menonaktifkan</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Timer Toggle */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, timerEnabled: !settings.timerEnabled })}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  settings.timerEnabled
                    ? 'border-[#F2B705] bg-[#F2B705]/15 text-[#FDE68A]'
                    : 'border-white/10 bg-[#0B142E]/70 text-slate-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#F2B705]" />
                  <span>Timer</span>
                </div>
                <span className="font-mono-tabular text-[11px] font-bold">
                  {settings.timerEnabled ? `${settings.timerSeconds}s` : 'OFF'}
                </span>
              </button>

              {/* Speed Bonus Toggle */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, speedBonusEnabled: !settings.speedBonusEnabled })}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  settings.speedBonusEnabled
                    ? 'border-[#10B981] bg-[#10B981]/15 text-[#6EE7B7]'
                    : 'border-white/10 bg-[#0B142E]/70 text-slate-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-[#10B981]" />
                  <span>Bonus Kilat</span>
                </div>
                <span className="font-mono-tabular text-[11px] font-bold">
                  {settings.speedBonusEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Shuffle Questions Toggle */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, shuffleQuestionsOnStart: !settings.shuffleQuestionsOnStart })}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  settings.shuffleQuestionsOnStart
                    ? 'border-[#60A5FA] bg-[#3B82F6]/15 text-[#93C5FD]'
                    : 'border-white/10 bg-[#0B142E]/70 text-slate-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Shuffle className="h-3.5 w-3.5 text-[#60A5FA]" />
                  <span>Acak Soal</span>
                </div>
                <span className="font-mono-tabular text-[11px] font-bold">
                  {settings.shuffleQuestionsOnStart ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Shuffle Options Toggle */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, shuffleOptionsOnStart: !settings.shuffleOptionsOnStart })}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  settings.shuffleOptionsOnStart
                    ? 'border-[#C084FC] bg-[#A855F7]/15 text-[#E9D5FF]'
                    : 'border-white/10 bg-[#0B142E]/70 text-slate-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ListOrdered className="h-3.5 w-3.5 text-[#C084FC]" />
                  <span>Acak Opsi</span>
                </div>
                <span className="font-mono-tabular text-[11px] font-bold">
                  {settings.shuffleOptionsOnStart ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          </section>

          {/* Validation Notice */}
          {!canStartQuiz && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/40 p-3 text-xs text-amber-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
              <span>
                {questionCount === 0
                  ? 'Paket materi soal ini masih kosong. Silakan isi butir soal terlebih dahulu.'
                  : 'Minimal harus ada 2 tim aktif untuk memulai mode cerdas cermat kelompok.'}
              </span>
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* MAIN ACTION BUTTON: MULAI KUIS                         */}
          {/* ------------------------------------------------------ */}
          <div className="pt-2">
            {isSolo ? (
              <button
                type="button"
                disabled={!canStartQuiz}
                onClick={onStartQuiz}
                className="group relative w-full flex items-center justify-between gap-3 sm:gap-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#059669] via-[#10B981] to-[#047857] p-4 text-white shadow-lg hover:brightness-105 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-left"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 shrink-0 group-hover:scale-105 transition-transform">
                    <Play className="h-6 w-6 fill-current text-white ml-0.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-base sm:text-xl font-bold tracking-tight text-white leading-tight truncate">
                      Mulai Latihan Mandiri
                    </div>
                    <div className="text-xs text-emerald-100 font-medium truncate mt-0.5">
                      {selectedPackage?.name} · {questionCount} Butir Soal · Peserta: {settings.studentName || 'Siswa'}
                    </div>
                  </div>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </button>
            ) : (
              <button
                type="button"
                disabled={!canStartQuiz}
                onClick={onStartQuiz}
                className="group relative w-full flex items-center justify-between gap-3 sm:gap-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#F2B705] via-[#E5A800] to-[#D97706] p-4 text-[#0A122C] shadow-lg hover:brightness-105 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-left"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A122C]/15 shrink-0 group-hover:scale-105 transition-transform">
                    <Trophy className="h-6 w-6 fill-current text-[#0A122C]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-base sm:text-xl font-bold tracking-tight text-[#0A122C] leading-tight truncate">
                      Mulai Cerdas Cermat Kelompok
                    </div>
                    <div className="text-xs text-[#0A122C]/80 font-bold truncate mt-0.5">
                      {activeTeams.length} Regu Siap · {selectedPackage?.name} ({questionCount} Soal)
                    </div>
                  </div>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A122C] text-[#F2B705] group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="h-5 w-5 stroke-[2.5]" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. PORTAL KHUSUS GURU (DISCREET & DIGNIFIED FOOTER)     */}
        {/* ======================================================== */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-slate-400 text-xs">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#F2B705]" />
            <span className="font-semibold text-slate-300">Portal Guru Madrasah:</span>
            <span className="text-slate-500">Akses Terproteksi PIN</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenQuestionManager}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <Lock className="h-3 w-3 text-[#F2B705]" />
              <span>Kelola Bank Soal & Paket</span>
            </button>
            <button
              type="button"
              onClick={onOpenTeamSettings}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <Sliders className="h-3 w-3 text-[#F2B705]" />
              <span>Pengaturan Regu & Tombol</span>
            </button>
          </div>
        </footer>
      </div>

      {/* Decorative architectural silhouette */}
      <div className="pointer-events-none inset-x-0 bottom-0 mt-4 text-[#F2B705]/20 hidden sm:block">
        <HagiaSophiaSilhouette className="w-full h-auto max-h-16" />
      </div>
    </div>
  );
};
