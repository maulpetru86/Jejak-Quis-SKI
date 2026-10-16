import React, { useState } from 'react';
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
  ChevronDown,
  ChevronUp,
  Check,
  Search,
  X,
  Layers,
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
  GoldenMedallionEmblem,
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

  // Grade filter state: 'ALL' | 'X' | 'XI' | 'XII'
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<'ALL' | GradeLevel>(() => {
    return selectedPackage?.gradeLevel || 'ALL';
  });

  // Custom Package Picker Modal & Search State
  const [isPackagePickerOpen, setIsPackagePickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isSolo = settings.gameMode === 'solo';
  const activeTeams = teams.slice(0, settings.teamCount);
  const questionCount = selectedPackage?.questions.length || 0;
  const canStartQuiz = questionCount > 0 && (isSolo || activeTeams.length >= 2);

  const imageQuestionsCount =
    selectedPackage?.questions.filter((q) => Boolean(q.imageUrl)).length || 0;

  // Packages filtered by selected grade tab
  const filteredPackages = selectedGradeFilter === 'ALL'
    ? packages
    : packages.filter((p) => (p.gradeLevel || 'XI') === selectedGradeFilter);

  // Grade stats
  const countX = packages.filter((p) => (p.gradeLevel || 'XI') === 'X').length;
  const countXI = packages.filter((p) => (p.gradeLevel || 'XI') === 'XI').length;
  const countXII = packages.filter((p) => (p.gradeLevel || 'XI') === 'XII').length;

  const handleGradeFilterChange = (newGrade: 'ALL' | GradeLevel) => {
    setSelectedGradeFilter(newGrade);
    if (newGrade !== 'ALL') {
      const targetPackages = packages.filter((p) => (p.gradeLevel || 'XI') === newGrade);
      if (targetPackages.length > 0 && (!selectedPackage || (selectedPackage.gradeLevel || 'XI') !== newGrade)) {
        onSelectPackage(targetPackages[0].id);
      }
    }
  };

  const getGradeBadgeConfig = (grade: GradeLevel | undefined) => {
    switch (grade) {
      case 'X':
        return {
          label: 'Kelas X MA',
          shortLabel: 'Kelas X',
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400',
        };
      case 'XII':
        return {
          label: 'Kelas XII MA',
          shortLabel: 'Kelas XII',
          bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          dot: 'bg-purple-400',
        };
      case 'XI':
      default:
        return {
          label: 'Kelas XI MA',
          shortLabel: 'Kelas XI',
          bg: 'bg-[#F2B705]/20 text-[#F2B705] border-[#F2B705]/40',
          dot: 'bg-[#F2B705]',
        };
    }
  };

  const activeGradeBadge = getGradeBadgeConfig(selectedPackage?.gradeLevel);

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-x-hidden flex flex-col justify-between py-4 sm:py-7 pb-10">
      {/* Central Focused Container - Clear Single Column Hierarchy */}
      <div className="container mx-auto px-3 sm:px-6 max-w-4xl w-full flex-1 flex flex-col justify-start space-y-5 sm:space-y-6 animate-fade-slide-up">
        {/* HERO TITLE - MAJESTIK, RINGKAS & TIDAK MEMBINGUNGKAN */}
        <header className="text-center space-y-2 pt-1 sm:pt-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F2B705]/20 to-[#D97706]/10 px-3.5 py-1 border border-[#F2B705]/50 shadow-[0_0_15px_rgba(242,183,5,0.2)]">
            <OttomanStarIcon className="h-4 w-4 text-[#F2B705]" />
            <span className="text-[#F2B705] font-black uppercase tracking-wider text-[11px] sm:text-xs">
              KUIS CERDAS CERMAT & EVALUASI MANDIRI SKI
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-wide gold-gradient-text drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Quiz Sejarah Peradaban Islam
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium">
            Madrasah Aliyah · Kurikulum Resmi Kemenag RI (Kelas X, XI & XII)
          </p>
        </header>

        {/* KARTU PENGATURAN KUIS: 3 LANGKAH MUDAH */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-[#F2B705]/50 bg-gradient-to-b from-[#162758]/98 via-[#101D44]/95 to-[#091126]/98 p-4 sm:p-7 shadow-[0_0_40px_rgba(0,0,0,0.5)] space-y-6">
          <ArabesqueCorner className="absolute left-2 top-2 h-7 w-7 sm:h-12 sm:w-12 text-[#F2B705]/40 pointer-events-none" />
          <ArabesqueCorner className="absolute right-2 top-2 h-7 w-7 sm:h-12 sm:w-12 -scale-x-100 text-[#F2B705]/40 pointer-events-none" />

          {/* ======================================================== */}
          {/* LANGKAH 1: PILIH FORMAT KUIS                            */}
          {/* ======================================================== */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F2B705] text-[#0A122C] font-black text-xs shadow-sm">
                1
              </span>
              <h2 className="text-sm sm:text-base font-black text-[#FFFDF7] uppercase tracking-wider">
                Pilih Format Pengerjaan:
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Opsi Cerdas Cermat Kelompok */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, gameMode: 'group' })}
                className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all ${
                  !isSolo
                    ? 'border-[#F2B705] bg-gradient-to-r from-[#F2B705] via-[#F59E0B] to-[#D97706] text-[#0A122C] shadow-lg ring-2 ring-amber-200/60 scale-[1.01]'
                    : 'border-white/10 bg-[#0B142E]/70 text-slate-300 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    !isSolo ? 'bg-[#0A122C]/20 text-[#0A122C]' : 'bg-white/10 text-[#F2B705]'
                  }`}
                >
                  <Trophy className="h-6 w-6 fill-current" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm sm:text-base font-black truncate leading-tight ${!isSolo ? 'text-[#0A122C]' : 'text-white'}`}>
                    Cerdas Cermat Kelompok
                  </div>
                  <div className={`text-xs mt-0.5 truncate ${!isSolo ? 'text-[#0A122C]/85 font-black' : 'text-slate-400'}`}>
                    {activeTeams.length} Regu Siap · Layar Proyektor & Kelas
                  </div>
                </div>
              </button>

              {/* Opsi Latihan Mandiri */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, gameMode: 'solo' })}
                className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all ${
                  isSolo
                    ? 'border-[#34D399] bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] text-white shadow-lg ring-2 ring-emerald-300/60 scale-[1.01]'
                    : 'border-white/10 bg-[#0B142E]/70 text-slate-300 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    isSolo ? 'bg-white/20 text-white' : 'bg-white/10 text-emerald-400'
                  }`}
                >
                  <User className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm sm:text-base font-black truncate leading-tight text-white">
                    Latihan Mandiri Siswa
                  </div>
                  <div className={`text-xs mt-0.5 truncate ${isSolo ? 'text-emerald-100 font-bold' : 'text-slate-400'}`}>
                    1 Siswa · Skor Nilai 0–100 & Rapor Evaluasi
                  </div>
                </div>
              </button>
            </div>

            {/* Jika mode mandiri: input nama peserta yang jelas */}
            {isSolo && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 sm:p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <label htmlFor="input-nama-siswa" className="text-xs font-black text-emerald-300 shrink-0">
                  Nama Peserta Latihan:
                </label>
                <input
                  id="input-nama-siswa"
                  type="text"
                  value={settings.studentName || ''}
                  onChange={(e) => onUpdateSettings({ ...settings, studentName: e.target.value })}
                  placeholder="Ketik nama Anda (misal: Muhammad Al-Fatih / Siti Aisyah)"
                  className="flex-1 rounded-lg border border-emerald-500/30 bg-[#0D1E3A] px-3 py-1.5 text-xs sm:text-sm font-bold text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* LANGKAH 2: PILIH MATERI & TINGKAT KELAS                  */}
          {/* ======================================================== */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F2B705] text-[#0A122C] font-black text-xs shadow-sm">
                  2
                </span>
                <h2 className="text-sm sm:text-base font-black text-[#FFFDF7] uppercase tracking-wider">
                  Pilih Materi Soal SKI:
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsPackagePickerOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#F2B705] hover:text-white bg-[#F2B705]/15 hover:bg-[#F2B705]/25 border border-[#F2B705]/40 px-3 py-1 rounded-lg transition-all"
              >
                <span>Daftar Semua ({packages.length} Paket)</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Filter Cepat Tingkat Kelas (Chips) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleGradeFilterChange('ALL')}
                className={`py-2 px-3 rounded-xl border text-xs font-black transition-all flex items-center justify-between ${
                  selectedGradeFilter === 'ALL'
                    ? 'border-blue-400 bg-blue-600/30 text-white shadow-sm ring-1 ring-blue-400'
                    : 'border-white/10 bg-[#0B142E]/70 text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>Semua Tingkat</span>
                <span className="text-[10px] bg-white/10 px-1.5 py-0.2 rounded-full">{packages.length}</span>
              </button>

              <button
                type="button"
                onClick={() => handleGradeFilterChange('X')}
                className={`py-2 px-3 rounded-xl border text-xs font-black transition-all flex items-center justify-between ${
                  selectedGradeFilter === 'X'
                    ? 'border-emerald-400 bg-emerald-600/30 text-white shadow-sm ring-1 ring-emerald-400'
                    : 'border-white/10 bg-[#0B142E]/70 text-emerald-300 hover:bg-white/5'
                }`}
              >
                <span>Kelas X MA</span>
                <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.2 rounded-full">{countX}</span>
              </button>

              <button
                type="button"
                onClick={() => handleGradeFilterChange('XI')}
                className={`py-2 px-3 rounded-xl border text-xs font-black transition-all flex items-center justify-between ${
                  selectedGradeFilter === 'XI'
                    ? 'border-amber-400 bg-amber-600/30 text-white shadow-sm ring-1 ring-amber-400'
                    : 'border-white/10 bg-[#0B142E]/70 text-amber-300 hover:bg-white/5'
                }`}
              >
                <span>Kelas XI MA</span>
                <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded-full">{countXI}</span>
              </button>

              <button
                type="button"
                onClick={() => handleGradeFilterChange('XII')}
                className={`py-2 px-3 rounded-xl border text-xs font-black transition-all flex items-center justify-between ${
                  selectedGradeFilter === 'XII'
                    ? 'border-purple-400 bg-purple-600/30 text-white shadow-sm ring-1 ring-purple-400'
                    : 'border-white/10 bg-[#0B142E]/70 text-purple-300 hover:bg-white/5'
                }`}
              >
                <span>Kelas XII MA</span>
                <span className="text-[10px] bg-purple-500/20 px-1.5 py-0.2 rounded-full">{countXII}</span>
              </button>
            </div>

            {/* Kartu Materi Terpilih (Sangat jelas & bisa diklik untuk ganti) */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsPackagePickerOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setIsPackagePickerOpen(true);
                }
              }}
              className="group relative cursor-pointer w-full rounded-2xl border-2 border-[#F2B705] bg-gradient-to-r from-[#1A2E63] via-[#14244E] to-[#0F1B3D] p-4 sm:p-5 shadow-[0_4px_20px_rgba(242,183,5,0.2)] hover:shadow-[0_6px_30px_rgba(242,183,5,0.3)] transition-all"
            >
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F2B705] to-[#B45309] text-[#0A122C] shadow-lg group-hover:scale-105 transition-transform">
                    <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] sm:text-[11px] font-black border uppercase ${activeGradeBadge.bg}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${activeGradeBadge.dot}`} />
                        <span>{activeGradeBadge.label}</span>
                      </span>
                      <span className="text-xs text-[#34D399] font-black">
                        {questionCount} Butir Soal
                      </span>
                      {imageQuestionsCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#F2B705] bg-[#F2B705]/15 px-2 py-0.5 rounded border border-[#F2B705]/30">
                          <ImageIcon className="h-3 w-3" />
                          <span>{imageQuestionsCount} Foto Sejarah</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-xl font-black text-[#FFFDF7] group-hover:text-[#FDE68A] transition-colors leading-snug truncate">
                      {selectedPackage?.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 truncate">
                      {selectedPackage?.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 rounded-xl bg-[#F2B705] hover:bg-[#F59E0B] px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-black text-[#0A122C] shadow-md group-hover:scale-105 transition-all">
                  <span className="hidden min-[420px]:inline">Ganti Materi</span>
                  <span className="min-[420px]:hidden">Ganti</span>
                  <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* LANGKAH 3: PENGATURAN KUIS & KESIAPAN REGUs             */}
          {/* ======================================================== */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F2B705] text-[#0A122C] font-black text-xs shadow-sm">
                  3
                </span>
                <h2 className="text-sm sm:text-base font-black text-[#FFFDF7] uppercase tracking-wider">
                  {isSolo ? 'Pengaturan Tambahan Kuis:' : `Kesiapan Regu (${activeTeams.length} Tim) & Pengaturan:`}
                </h2>
              </div>

              {!isSolo && (
                <button
                  type="button"
                  onClick={onOpenTeamSettings}
                  className="inline-flex items-center gap-1 text-xs font-black text-[#F2B705] hover:text-white bg-[#F2B705]/15 hover:bg-[#F2B705]/25 border border-[#F2B705]/40 px-3 py-1 rounded-lg transition-all"
                >
                  <Sliders className="h-3 w-3" />
                  <span>Ubah Nama Regu / Tombol</span>
                </button>
              )}
            </div>

            {/* Preview Regu Jika Mode Kelompok (Bersih, Horizontal, Rapi) */}
            {!isSolo && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {activeTeams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#0B142E]/70 p-2.5 min-w-0"
                  >
                    <span className="text-xl shrink-0 leading-none">{team.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black text-white truncate">{team.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono-tabular truncate">
                        Tombol: {team.keys.A}·{team.keys.B}·{team.keys.C}·{team.keys.D}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4 Sakelar Opsi Cepat */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, timerEnabled: !settings.timerEnabled })}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-black transition-all ${
                  settings.timerEnabled
                    ? 'border-[#F2B705] bg-[#F2B705]/20 text-[#F2B705] ring-1 ring-[#F2B705]/40'
                    : 'border-white/10 bg-[#080E22]/80 text-slate-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Timer</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${settings.timerEnabled ? 'bg-[#F2B705] text-[#0A122C]' : 'bg-white/10 text-slate-400'}`}>
                  {settings.timerEnabled ? `${settings.timerSeconds}d` : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, speedBonusEnabled: !settings.speedBonusEnabled })}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-black transition-all ${
                  settings.speedBonusEnabled
                    ? 'border-[#10B981] bg-[#10B981]/20 text-[#6EE7B7] ring-1 ring-[#10B981]/40'
                    : 'border-white/10 bg-[#080E22]/80 text-slate-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Bonus Kilat</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${settings.speedBonusEnabled ? 'bg-[#10B981] text-[#0A122C]' : 'bg-white/10 text-slate-400'}`}>
                  {settings.speedBonusEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, shuffleQuestionsOnStart: !settings.shuffleQuestionsOnStart })}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-black transition-all ${
                  settings.shuffleQuestionsOnStart
                    ? 'border-[#60A5FA] bg-[#3B82F6]/20 text-[#93C5FD] ring-1 ring-[#60A5FA]/40'
                    : 'border-white/10 bg-[#080E22]/80 text-slate-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Shuffle className="h-3.5 w-3.5" />
                  <span>Acak Soal</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${settings.shuffleQuestionsOnStart ? 'bg-[#3B82F6] text-white' : 'bg-white/10 text-slate-400'}`}>
                  {settings.shuffleQuestionsOnStart ? 'ACAK' : 'URUT'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, shuffleOptionsOnStart: !settings.shuffleOptionsOnStart })}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-black transition-all ${
                  settings.shuffleOptionsOnStart
                    ? 'border-[#C084FC] bg-[#A855F7]/20 text-[#E9D5FF] ring-1 ring-[#C084FC]/40'
                    : 'border-white/10 bg-[#080E22]/80 text-slate-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ListOrdered className="h-3.5 w-3.5" />
                  <span>Acak Opsi</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${settings.shuffleOptionsOnStart ? 'bg-[#A855F7] text-white' : 'bg-white/10 text-slate-400'}`}>
                  {settings.shuffleOptionsOnStart ? 'ACAK' : 'ASLI'}
                </span>
              </button>
            </div>
          </div>

          {!canStartQuiz && (
            <div className="flex items-center gap-2 rounded-xl border border-[#F59E0B] bg-[#78350F]/40 p-3 text-xs sm:text-sm text-[#FDE68A]">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#F2B705]" />
              <span>
                {questionCount === 0
                  ? 'Paket soal ini masih kosong. Silakan tambah soal di Ruang Guru.'
                  : 'Minimal harus ada 2 tim untuk memulai mode cerdas cermat.'}
              </span>
            </div>
          )}

          {/* ======================================================== */}
          {/* SATU-SATUNYA TOMBOL UTAMA: MULAI KUIS SEKARANG           */}
          {/* ======================================================== */}
          <div className="pt-2">
            {isSolo ? (
              <button
                type="button"
                disabled={!canStartQuiz}
                onClick={onStartQuiz}
                className="group relative w-full flex items-center justify-between gap-3 sm:gap-4 rounded-2xl bg-gradient-to-r from-[#059669] via-[#10B981] to-[#047857] p-3.5 sm:p-5 text-white shadow-[0_12px_35px_-5px_rgba(16,185,129,0.5)] ring-2 ring-[#6EE7B7] hover:brightness-110 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-left"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <span className="flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-xl sm:rounded-2xl bg-white/20 shadow-inner shrink-0 group-hover:scale-105 transition-transform ring-1 ring-white/40">
                    <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-current text-white ml-0.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-base sm:text-2xl font-black tracking-tight text-white leading-tight truncate">
                      Mulai Latihan Mandiri
                    </div>
                    <div className="text-xs sm:text-sm text-emerald-100 font-semibold truncate mt-0.5">
                      Materi: {selectedPackage?.name} · {questionCount} Butir Soal
                    </div>
                  </div>
                </div>
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-white/20 text-white group-hover:bg-white/30 group-hover:translate-x-1 transition-all shadow-sm ring-1 ring-white/30">
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </button>
            ) : (
              <button
                type="button"
                disabled={!canStartQuiz}
                onClick={onStartQuiz}
                className="group relative w-full flex items-center justify-between gap-3 sm:gap-4 rounded-2xl bg-gradient-to-r from-[#F2B705] via-[#F59E0B] to-[#D97706] p-3.5 sm:p-5 text-[#0A122C] shadow-[0_12px_40px_-5px_rgba(242,183,5,0.55)] ring-2 ring-amber-200 hover:brightness-110 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-left"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <span className="flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-xl sm:rounded-2xl bg-[#0A122C]/15 shadow-inner shrink-0 group-hover:scale-105 transition-transform ring-1 ring-[#0A122C]/20">
                    <Trophy className="h-6 w-6 sm:h-7 sm:w-7 fill-current text-[#0A122C]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-base sm:text-2xl font-black tracking-tight text-[#0A122C] leading-tight truncate">
                      Mulai Kuis Cerdas Cermat
                    </div>
                    <div className="text-xs sm:text-sm text-[#0A122C]/85 font-black truncate mt-0.5">
                      {activeTeams.length} Regu Siap · Materi: {selectedPackage?.name} ({questionCount} Soal)
                    </div>
                  </div>
                </div>
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[#0A122C] text-[#F2B705] group-hover:bg-[#0A122C]/90 group-hover:translate-x-1 transition-all shadow-md">
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5]" />
                </div>
              </button>
            )}
          </div>
        </section>

        {/* PORTAL KHUSUS GURU (Bawah, Simpel & Tenang) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-xs">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#F2B705]" />
            <span className="font-semibold text-slate-300">Portal Pengelolaan Guru:</span>
            <span className="text-slate-500">Khusus Tenaga Pengajar SKI</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenQuestionManager}
              className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              <Lock className="h-3 w-3 text-[#F2B705]" />
              <span>Kelola Bank Soal & Paket</span>
            </button>
            <button
              type="button"
              onClick={onOpenTeamSettings}
              className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              <Sliders className="h-3 w-3 text-[#F2B705]" />
              <span>Pengaturan Regu & Keyboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative architectural silhouette */}
      <div className="pointer-events-none inset-x-0 bottom-0 mt-4 text-[#F2B705] hidden sm:block">
        <HagiaSophiaSilhouette className="w-full h-auto max-h-16 sm:max-h-20" />
      </div>

      {/* CUSTOM PACKAGE PICKER MODAL (ELITE UI/UX, NO SYSTEM SELECT) */}
      {isPackagePickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-sm animate-fade-slide-up"
          role="dialog"
          aria-modal="true"
          aria-labelledby="package-modal-title"
        >
          <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl sm:rounded-3xl border border-[#F2B705]/50 bg-gradient-to-b from-[#162654] via-[#111E45] to-[#0F1B3D] shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/15 px-4 sm:px-6 py-3.5 sm:py-4 shrink-0 bg-[#0B142E]/70">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#F2B705]/20 text-[#F2B705] border border-[#F2B705]/40 shrink-0">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <h2 id="package-modal-title" className="text-sm sm:text-lg font-black text-[#FFFDF7] truncate">
                    Pilih Paket Materi SKI
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-300 truncate">
                    Kurikulum Madrasah Aliyah Kelas X, XI & XII Kemenag RI
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPackagePickerOpen(false)}
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Tutup pemilih paket"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="p-3 sm:p-4 border-b border-white/10 bg-[#0F1B3D]/95 space-y-2.5 shrink-0">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari materi soal (misal: Abbasiyah, Utsmani, Walisongo)..."
                  className="w-full rounded-xl border border-white/20 bg-[#162654] pl-9 pr-8 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-[#F2B705] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Grade Filter Pills in Modal */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleGradeFilterChange('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedGradeFilter === 'ALL'
                      ? 'bg-[#1E3A8A] text-white ring-1 ring-[#60A5FA]'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Semua ({packages.length})
                </button>
                <button
                  type="button"
                  onClick={() => handleGradeFilterChange('X')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    selectedGradeFilter === 'X'
                      ? 'bg-emerald-600 text-white ring-1 ring-emerald-400'
                      : 'bg-white/5 text-emerald-300 hover:bg-white/10'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Kelas X ({countX})
                </button>
                <button
                  type="button"
                  onClick={() => handleGradeFilterChange('XI')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    selectedGradeFilter === 'XI'
                      ? 'bg-[#F2B705] text-[#0F1B3D] ring-1 ring-amber-300'
                      : 'bg-white/5 text-amber-300 hover:bg-white/10'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-[#F2B705]" />
                  Kelas XI ({countXI})
                </button>
                <button
                  type="button"
                  onClick={() => handleGradeFilterChange('XII')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    selectedGradeFilter === 'XII'
                      ? 'bg-purple-600 text-white ring-1 ring-purple-400'
                      : 'bg-white/5 text-purple-300 hover:bg-white/10'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-purple-400" />
                  Kelas XII ({countXII})
                </button>
              </div>
            </div>

            {/* Scrollable Package List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2.5">
              {filteredPackages
                .filter((pkg) => {
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    pkg.name.toLowerCase().includes(q) ||
                    pkg.subtitle.toLowerCase().includes(q) ||
                    `kelas ${pkg.gradeLevel || 'xi'}`.toLowerCase().includes(q)
                  );
                })
                .map((pkg) => {
                  const isCurrent = pkg.id === selectedPackage?.id;
                  const badge = getGradeBadgeConfig(pkg.gradeLevel);
                  const pkgImgCount = pkg.questions.filter((q) => Boolean(q.imageUrl)).length;

                  return (
                    <div
                      key={pkg.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        onSelectPackage(pkg.id);
                        setIsPackagePickerOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          onSelectPackage(pkg.id);
                          setIsPackagePickerOpen(false);
                        }
                      }}
                      className={`relative flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-[#F2B705] bg-[#1E3A8A]/50 ring-2 ring-[#F2B705]/60 shadow-lg'
                          : 'border-white/10 bg-[#162654]/70 hover:border-[#F2B705]/50 hover:bg-[#162654]'
                      }`}
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold border ${badge.bg}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                            <span>{badge.label}</span>
                          </span>
                          <span className="text-[11px] font-bold text-[#34D399]">
                            {pkg.questions.length} Butir Soal
                          </span>
                          {pkgImgCount > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-[#F2B705] font-semibold">
                              <ImageIcon className="h-3 w-3" />
                              <span>{pkgImgCount} Foto</span>
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm sm:text-base font-extrabold text-[#FFFDF7] leading-snug">
                          {pkg.name}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {pkg.subtitle}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center pl-2">
                        {isCurrent ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2B705] text-[#0F1B3D] shadow-md">
                            <Check className="h-5 w-5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-slate-400 group-hover:border-[#F2B705] group-hover:text-[#F2B705]">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
