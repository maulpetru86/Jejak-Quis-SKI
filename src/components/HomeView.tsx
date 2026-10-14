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
} from 'lucide-react';
import {
  GradeLevel,
  QuestionPackage,
  QuizSettings,
  TeamConfig,
} from '../config/quizConfig';
import {
  ArabesqueCorner,
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
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-x-hidden flex flex-col justify-between py-3 sm:py-6 lg:py-8">
      {/* Central Responsive Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl w-full flex-1 flex flex-col justify-center space-y-5 sm:space-y-8 animate-fade-slide-up pb-6">
        {/* HERO BANNER CARD */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#F2B705]/45 sm:border-2 bg-gradient-to-br from-[#162654] via-[#122047] to-[#0F1B3D] p-4 sm:p-7 lg:p-9 shadow-2xl">
          <ArabesqueCorner className="absolute left-2 top-2 h-7 w-7 sm:h-12 sm:w-12 text-[#F2B705]/40 pointer-events-none" />
          <ArabesqueCorner className="absolute right-2 top-2 h-7 w-7 sm:h-12 sm:w-12 -scale-x-100 text-[#F2B705]/40 pointer-events-none" />

          {/* Flexible Responsive Grid: 1 col on mobile, 12 cols on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">
            {/* Left Column (7 cols): Title, Selector & Action Buttons */}
            <div className="space-y-4 sm:space-y-5 lg:col-span-7 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold tracking-wider">
                <OttomanStarIcon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-[#F2B705]" />
                <span className="text-[#F2B705]">MEDIA PEMBELAJARAN SKI</span>
                <span className="text-white/40" aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 border border-white/20">
                  <GraduationCap className="h-3 w-3 text-[#F2B705]" />
                  <span className="text-emerald-400 font-extrabold">KELAS X</span>
                  <span className="text-white/40">·</span>
                  <span className="text-[#F2B705] font-extrabold">XI</span>
                  <span className="text-white/40">·</span>
                  <span className="text-purple-400 font-extrabold">XII MA</span>
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-wide text-[#FFFDF7] break-words">
                Quiz Sejarah Peradaban Islam
              </h1>

              <p className="max-w-2xl text-xs sm:text-base leading-relaxed text-slate-200 break-words">
                Aplikasi kuis interaktif SKI terlengkap mencakup kurikulum Madrasah Aliyah <strong className="text-emerald-400">Kelas X</strong>, <strong className="text-[#F2B705]">Kelas XI</strong>, dan <strong className="text-purple-400">Kelas XII</strong> (Kemenag RI), mendukung <strong className="text-[#F2B705]">Cerdas Cermat Kelompok</strong> dan <strong className="text-[#6EE7B7]">Latihan Mandiri Siswa</strong> perorangan.
              </p>

              {/* GAME MODE SWITCHER: Kelompok vs Individu */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  <span className="text-slate-300">Pilih Format Pengerjaan:</span>
                  <span className={isSolo ? 'text-[#34D399] font-extrabold' : 'text-[#F2B705] font-extrabold'}>
                    {isSolo ? 'Mode Mandiri (1 Siswa)' : `Mode Kelas (${activeTeams.length} Tim)`}
                  </span>
                </div>
                <div className="flex rounded-xl sm:rounded-2xl border border-white/20 bg-[#0B142E] p-1 shadow-inner gap-1">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, gameMode: 'group' })}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg sm:rounded-xl py-2 sm:py-2.5 px-2 text-xs sm:text-sm font-extrabold transition-all text-center min-w-0 ${
                      !isSolo
                        ? 'bg-[#F2B705] text-[#0F1B3D] shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                    <span className="truncate">Mode Kelompok ({activeTeams.length} Tim)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, gameMode: 'solo' })}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg sm:rounded-xl py-2 sm:py-2.5 px-2 text-xs sm:text-sm font-extrabold transition-all text-center min-w-0 ${
                      isSolo
                        ? 'bg-[#10B981] text-[#0F1B3D] shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                    <span className="truncate">Mode Mandiri (1 Siswa)</span>
                  </button>
                </div>
              </div>

              {/* If Solo Mode: Name Input */}
              {isSolo && (
                <div className="rounded-xl sm:rounded-2xl border border-[#34D399]/40 bg-[#0F1B3D]/95 p-3 sm:p-4 shadow-inner space-y-1.5">
                  <label htmlFor="input-nama-siswa" className="block text-xs font-bold text-[#6EE7B7]">
                    Nama Siswa / Peserta Latihan:
                  </label>
                  <input
                    id="input-nama-siswa"
                    type="text"
                    value={settings.studentName || ''}
                    onChange={(e) => onUpdateSettings({ ...settings, studentName: e.target.value })}
                    placeholder="Ketik nama Anda (misal: Muhammad Al-Fatih / Siti Aisyah)"
                    className="w-full rounded-xl border border-[#34D399]/40 bg-[#162654] px-3.5 py-2.5 text-sm font-bold text-white placeholder-slate-400 focus:border-[#34D399] focus:outline-none"
                  />
                </div>
              )}

              {/* TINGKAT KELAS FILTER TABS + PACKAGE SELECTOR */}
              <div className="rounded-xl sm:rounded-2xl border border-white/15 bg-[#0F1B3D]/90 p-3 sm:p-4 lg:p-5 shadow-inner space-y-3 sm:space-y-3.5">
                {/* Tingkat Kelas Tab Selector */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <GraduationCap className="h-3.5 w-3.5 text-[#F2B705]" />
                      <span>Filter Tingkat Kelas:</span>
                    </span>
                    <span className="text-xs font-extrabold text-[#F2B705]">
                      {selectedGradeFilter === 'ALL'
                        ? 'Semua Tingkat'
                        : `Kelas ${selectedGradeFilter} MA`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-[#0B142E] p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => handleGradeFilterChange('ALL')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                        selectedGradeFilter === 'ALL'
                          ? 'bg-[#1E3A8A] text-white shadow ring-1 ring-[#60A5FA]'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>Semua Kelas</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/15">
                        {packages.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleGradeFilterChange('X')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                        selectedGradeFilter === 'X'
                          ? 'bg-emerald-600 text-white shadow ring-1 ring-emerald-400'
                          : 'text-emerald-300/80 hover:text-emerald-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span>Kelas X</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950/60 text-emerald-300">
                        {countX}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleGradeFilterChange('XI')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                        selectedGradeFilter === 'XI'
                          ? 'bg-[#F2B705] text-[#0F1B3D] shadow ring-1 ring-amber-300'
                          : 'text-amber-300/90 hover:text-amber-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-[#F2B705]" />
                      <span>Kelas XI</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-950/40 text-amber-200">
                        {countXI}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleGradeFilterChange('XII')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                        selectedGradeFilter === 'XII'
                          ? 'bg-purple-600 text-white shadow ring-1 ring-purple-400'
                          : 'text-purple-300/80 hover:text-purple-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-purple-400" />
                      <span>Kelas XII</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-950/60 text-purple-300">
                        {countXII}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Dropdown Paket Soal */}
                <div className="min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="select-paket-soal"
                      className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#F2B705]"
                    >
                      Pilih Paket Materi Soal:
                    </label>
                    {selectedPackage && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold border ${activeGradeBadge.bg}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${activeGradeBadge.dot}`} />
                        <span>{activeGradeBadge.label}</span>
                      </span>
                    )}
                  </div>

                  <select
                    id="select-paket-soal"
                    value={selectedPackage?.id || ''}
                    onChange={(e) => onSelectPackage(e.target.value)}
                    className="w-full max-w-full rounded-xl border sm:border-2 border-[#F2B705]/60 bg-[#162654] px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-base lg:text-lg font-extrabold text-[#FFFDF7] shadow focus:border-[#F2B705] focus:outline-none truncate"
                  >
                    {selectedGradeFilter === 'ALL' ? (
                      <>
                        <optgroup label="── KELAS X MA (Peradaban Islam Klasik) ──" className="bg-[#0B142E] text-emerald-400 font-bold">
                          {packages
                            .filter((p) => (p.gradeLevel || 'XI') === 'X')
                            .map((pkg) => (
                              <option key={pkg.id} value={pkg.id} className="bg-[#0F1B3D] text-white">
                                [Kelas X] {pkg.name} ({pkg.questions.length} Soal)
                              </option>
                            ))}
                        </optgroup>

                        <optgroup label="── KELAS XI MA (Tiga Kerajaan Besar & Pembaruan) ──" className="bg-[#0B142E] text-amber-300 font-bold">
                          {packages
                            .filter((p) => (p.gradeLevel || 'XI') === 'XI')
                            .map((pkg) => (
                              <option key={pkg.id} value={pkg.id} className="bg-[#0F1B3D] text-white">
                                [Kelas XI] {pkg.name} ({pkg.questions.length} Soal)
                              </option>
                            ))}
                        </optgroup>

                        <optgroup label="── KELAS XII MA (Islam Nusantara & Walisongo) ──" className="bg-[#0B142E] text-purple-300 font-bold">
                          {packages
                            .filter((p) => (p.gradeLevel || 'XI') === 'XII')
                            .map((pkg) => (
                              <option key={pkg.id} value={pkg.id} className="bg-[#0F1B3D] text-white">
                                [Kelas XII] {pkg.name} ({pkg.questions.length} Soal)
                              </option>
                            ))}
                        </optgroup>
                      </>
                    ) : (
                      filteredPackages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id} className="bg-[#0F1B3D] text-white">
                          [Kelas {pkg.gradeLevel || 'XI'}] {pkg.name} ({pkg.questions.length} Soal)
                        </option>
                      ))
                    )}
                  </select>

                  {selectedPackage && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-slate-300">
                      <span className="truncate max-w-[200px] sm:max-w-none">{selectedPackage.subtitle}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-[#34D399] whitespace-nowrap">
                        {selectedPackage.questions.length} Butir Soal
                      </span>
                      {imageQuestionsCount > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 font-bold text-[#F2B705] whitespace-nowrap">
                            <ImageIcon className="h-3 w-3" />
                            <span>{imageQuestionsCount} Bergambar</span>
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Game Mode Switches: clean 2-col on mobile, 4-col on tablet/desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-white/10 pt-2.5 sm:pt-3">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSettings({ ...settings, timerEnabled: !settings.timerEnabled })
                    }
                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-bold transition-colors min-w-0 ${
                      settings.timerEnabled
                        ? 'border-[#F2B705]/60 bg-[#F2B705]/15 text-[#F2B705]'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Timer: {settings.timerEnabled ? `${settings.timerSeconds}d` : 'Mati'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSettings({
                        ...settings,
                        speedBonusEnabled: !settings.speedBonusEnabled,
                      })
                    }
                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-bold transition-colors min-w-0 ${
                      settings.speedBonusEnabled
                        ? 'border-[#10B981]/60 bg-[#10B981]/15 text-[#6EE7B7]'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Zap className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Bonus Cepat: {settings.speedBonusEnabled ? 'Aktif' : 'Mati'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSettings({
                        ...settings,
                        shuffleQuestionsOnStart: !settings.shuffleQuestionsOnStart,
                      })
                    }
                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-bold transition-colors min-w-0 ${
                      settings.shuffleQuestionsOnStart
                        ? 'border-[#60A5FA]/60 bg-[#60A5FA]/15 text-[#93C5FD]'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Shuffle className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Acak Soal: {settings.shuffleQuestionsOnStart ? 'Aktif' : 'Urut'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSettings({
                        ...settings,
                        shuffleOptionsOnStart: !settings.shuffleOptionsOnStart,
                      })
                    }
                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-bold transition-colors min-w-0 ${
                      settings.shuffleOptionsOnStart
                        ? 'border-[#A78BFA]/60 bg-[#A78BFA]/15 text-[#DDD6FE]'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <ListOrdered className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Acak Opsi: {settings.shuffleOptionsOnStart ? 'Aktif' : 'Mati'}</span>
                  </button>
                </div>
              </div>

              {!canStartQuiz && (
                <div className="flex items-center gap-2 rounded-xl border border-[#F59E0B] bg-[#78350F]/40 p-2.5 sm:p-3 text-xs sm:text-sm text-[#FDE68A]">
                  <AlertCircle className="h-4 w-4 shrink-0 text-[#F2B705]" />
                  <span>
                    {questionCount === 0
                      ? 'Paket soal ini masih kosong. Silakan tambah soal terlebih dahulu.'
                      : 'Minimal harus ada 2 tim untuk memulai mode kelompok.'}
                  </span>
                </div>
              )}

              {/* PRIMARY START ACTION BUTTON (Full width, bold, focus on quiz ready) */}
              <div className="w-full pt-1">
                {isSolo ? (
                  <button
                    type="button"
                    disabled={!canStartQuiz}
                    onClick={onStartQuiz}
                    className="w-full flex items-center justify-center gap-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] py-4 px-6 text-base sm:text-lg lg:text-xl font-extrabold text-[#FFFDF7] shadow-xl ring-2 ring-[#6EE7B7]/50 hover:brightness-105 active:scale-95 transition-all whitespace-nowrap min-h-[52px]"
                  >
                    <Play className="h-5 w-5 fill-current shrink-0 text-[#FFFDF7]" />
                    <span>Mulai Latihan Mandiri Siswa</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!canStartQuiz}
                    onClick={onStartQuiz}
                    className="w-full flex items-center justify-center gap-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#F2B705] via-[#F59E0B] to-[#D97706] py-4 px-6 text-base sm:text-lg lg:text-xl font-extrabold text-[#0F1B3D] shadow-xl ring-2 ring-[#FFFDF7]/50 hover:brightness-105 disabled:opacity-40 transition-all active:scale-95 whitespace-nowrap min-h-[52px]"
                  >
                    <Play className="h-5 w-5 fill-current shrink-0" />
                    <span>Mulai Kuis Cerdas Cermat Kelompok</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column (5 cols): Active Teams Preview OR Solo Guide */}
            <div className="space-y-3 sm:space-y-4 lg:col-span-5 min-w-0">
              {isSolo ? (
                /* SOLO MODE GUIDE CARD */
                <div className="rounded-xl sm:rounded-2xl border border-[#34D399]/40 bg-[#0F1B3D]/95 p-4 sm:p-5 shadow-xl space-y-3.5">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
                    <User className="h-5 w-5 text-[#34D399]" />
                    <div>
                      <h2 className="text-xs sm:text-sm lg:text-base font-extrabold text-[#FFFDF7]">
                        Panduan Latihan Mandiri Siswa
                      </h2>
                      <p className="text-[10px] sm:text-xs text-[#6EE7B7]">
                        Pengerjaan mandiri di laptop, tablet, atau HP
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-200">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0 mt-0.5" />
                      <span>
                        <strong>Klik Langsung:</strong> Pilih jawaban A, B, C, D, atau E dengan mengklik kartu jawaban di layar atau menekan tombol A/B/C/D/E (atau angka 1–5) di keyboard.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0 mt-0.5" />
                      <span>
                        <strong>Umpan Balik Instan:</strong> Mengetahui secara langsung apakah jawaban Anda benar beserta penjelasan materi dan rujukan halaman buku.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0 mt-0.5" />
                      <span>
                        <strong>Rapor Evaluasi Lengkap:</strong> Di akhir kuis akan ditampilkan nilai akhir (0–100), predikat (*Mumtaz* / *Jayyid*), serta rekap butir soal.
                      </span>
                    </li>
                  </ul>

                  <div className="rounded-xl border border-[#34D399]/30 bg-[#064E3B]/30 p-2.5 text-xs text-[#A7F3D0] flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-[#F2B705]" />
                    <span>Bagus untuk belajar mandiri, tugas pekerjaan rumah, maupun remedial kuis SKI.</span>
                  </div>
                </div>
              ) : (
                /* GROUP MODE TEAMS PREVIEW CARD */
                <div className="rounded-xl sm:rounded-2xl border border-white/15 bg-[#0F1B3D]/90 p-3.5 sm:p-4 lg:p-5 shadow-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="min-w-0">
                      <h2 className="text-xs sm:text-sm lg:text-base font-extrabold text-[#FFFDF7] truncate">
                        Tim Siap Bertanding ({activeTeams.length} Tim)
                      </h2>
                      <p className="text-[10px] sm:text-xs text-slate-300 truncate">
                        Menjawab via keyboard atau panel guru
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenTeamSettings}
                      className="text-xs font-bold text-[#F2B705] hover:underline whitespace-nowrap shrink-0 ml-2"
                    >
                      Ubah →
                    </button>
                  </div>

                  {/* Team cards flexible grid (1 col on narrow mobile, 2 col on >420px) */}
                  <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2">
                    {activeTeams.map((team) => (
                      <div
                        key={team.id}
                        className="relative flex items-center justify-between rounded-lg sm:rounded-xl border border-white/10 bg-[#162654] p-2 sm:p-2.5 min-w-0"
                      >
                        <div
                          className="absolute inset-y-0 left-0 w-1 rounded-l-lg"
                          style={{ backgroundColor: team.color }}
                        />
                        <div className="flex items-center gap-1.5 pl-1.5 min-w-0 flex-1">
                          <span className="text-lg sm:text-xl leading-none shrink-0">{team.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-xs sm:text-sm font-bold text-[#FFFDF7]">
                              {team.name}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-300">
                              <Keyboard className="h-2.5 w-2.5 text-[#F2B705] shrink-0" />
                              <span className="font-mono-tabular font-bold text-[#F2B705] truncate">
                                {team.keys.A}·{team.keys.B}·{team.keys.C}·{team.keys.D}{team.keys.E ? `·${team.keys.E}` : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#162654]/60 p-2.5 sm:p-3 space-y-1 text-slate-200">
                    <div className="flex items-center gap-1.5 font-bold text-[#F2B705] text-[11px] sm:text-xs">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                      <span>Panduan Kelas & Proyektor:</span>
                    </div>
                    <ul className="space-y-1 text-slate-300 text-[10px] sm:text-xs">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 shrink-0 text-[#34D399] mt-0.5" />
                        <span className="break-words">
                          <strong>Layar Responsif:</strong> Otomatis menyesuaikan proyektor 16:9 atau HP guru tanpa teks terpotong.
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 shrink-0 text-[#34D399] mt-0.5" />
                        <span className="break-words">
                          <strong>Kunci Otomatis:</strong> Jawaban pertama kelompok langsung terkunci untuk mencegah saling tiru.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PORTAL KHUSUS GURU (Terpisah di bagian bawah, tenang & terproteksi sandi) */}
        <div className="pt-2 sm:pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <div className="flex items-center gap-2 text-xs">
            <Shield className="h-4 w-4 text-[#F2B705]" />
            <span className="font-semibold text-slate-300">Ruang Pengelolaan Guru</span>
            <span className="text-slate-500">·</span>
            <span className="text-[11px] text-slate-400">Akses dibatasi kode rahasia</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenQuestionManager}
              className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-[#FFFDF7] transition-colors"
              title="Kelola butir soal, gambar, dan paket kurikulum (Sandi Guru)"
            >
              <Lock className="h-3 w-3 text-[#F2B705]" />
              <span>Kelola Soal & Bank Materi</span>
            </button>

            <button
              type="button"
              onClick={onOpenTeamSettings}
              className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-[#FFFDF7] transition-colors"
              title="Atur tim, nama regu, dan tombol keyboard (Sandi Guru)"
            >
              <Sliders className="h-3 w-3 text-[#F2B705]" />
              <span>Pengaturan Tim</span>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative architectural silhouette */}
      <div className="pointer-events-none inset-x-0 bottom-0 mt-3 text-[#F2B705] hidden sm:block">
        <HagiaSophiaSilhouette className="w-full h-auto max-h-20 sm:max-h-28" />
      </div>
    </div>
  );
};
