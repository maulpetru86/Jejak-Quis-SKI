import React, { useState } from 'react';
import {
  Users,
  Keyboard,
  Sliders,
  RotateCcw,
  ArrowLeft,
  Play,
  Clock,
  Zap,
  ShieldAlert,
  Sparkles,
  Check,
} from 'lucide-react';
import {
  AnswerLetter,
  DEFAULT_SETTINGS,
  DEFAULT_TEAMS,
  QuizSettings,
  TEAM_COLOR_PALETTE,
  TEAM_EMOJI_OPTIONS,
  TeamConfig,
} from '../config/quizConfig';
import { OttomanStarIcon } from './OttomanDecorations';

interface TeamSettingsViewProps {
  teams: TeamConfig[];
  settings: QuizSettings;
  onUpdateTeams: (teams: TeamConfig[]) => void;
  onUpdateSettings: (settings: QuizSettings) => void;
  onBackHome: () => void;
  onStartQuizNow: () => void;
}

export const TeamSettingsView: React.FC<TeamSettingsViewProps> = ({
  teams,
  settings,
  onUpdateTeams,
  onUpdateSettings,
  onBackHome,
  onStartQuizNow,
}) => {
  const [listeningKeyTarget, setListeningKeyTarget] = useState<{
    teamId: string;
    letter: AnswerLetter;
  } | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const activeTeams = teams.slice(0, settings.teamCount);

  const triggerSavedToast = () => {
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 1800);
  };

  const handleTeamFieldChange = (
    teamId: string,
    field: 'name' | 'color' | 'emoji',
    value: string
  ) => {
    const updated = teams.map((t) => (t.id === teamId ? { ...t, [field]: value } : t));
    onUpdateTeams(updated);
    triggerSavedToast();
  };

  const handleKeyBindingChange = (teamId: string, letter: AnswerLetter, rawKey: string) => {
    const cleanKey = rawKey.trim().toUpperCase().slice(0, 1);
    if (!cleanKey) return;
    const updated = teams.map((t) =>
      t.id === teamId ? { ...t, keys: { ...t.keys, [letter]: cleanKey } } : t
    );
    onUpdateTeams(updated);
    setListeningKeyTarget(null);
    triggerSavedToast();
  };

  const handleResetDefaults = () => {
    onUpdateTeams(DEFAULT_TEAMS);
    onUpdateSettings(DEFAULT_SETTINGS);
    triggerSavedToast();
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8 animate-fade-slide-up">
      {/* Header Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705]">
            <OttomanStarIcon className="h-4 w-4" />
            <span>KONFIGURASI PERMAINAN KELAS</span>
          </div>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FFFDF7]">
            Pengaturan Tim & Sistem Poin
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-300">
            Atur jumlah kelompok (2–6 tim), tombol keyboard, dan sistem penilaian.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {savedNotice && (
            <span className="flex items-center gap-1 text-xs font-bold text-[#34D399]">
              <Check className="h-3.5 w-3.5" /> Tersimpan
            </span>
          )}

          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/15 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Kembalikan Default</span>
            <span className="sm:hidden">Reset</span>
          </button>

          <button
            type="button"
            onClick={onBackHome}
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-[#162654] px-3.5 py-2 text-xs font-bold text-[#FFFDF7] hover:bg-white/15 transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali</span>
          </button>

          <button
            type="button"
            onClick={onStartQuizNow}
            className="flex items-center gap-1.5 rounded-xl bg-[#F2B705] px-4 py-2 text-xs font-extrabold text-[#0F1B3D] shadow-lg hover:bg-[#facc15] transition-colors whitespace-nowrap"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Mulai Quiz</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12">
        {/* LEFT COLUMN: Team Count & Cards */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-7">
          <div className="rounded-2xl border border-white/15 bg-[#162654]/90 p-4 sm:p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-[#FFFDF7]">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[#F2B705]" />
                  <span>Jumlah Kelompok Siswa</span>
                </h2>
                <p className="text-xs text-slate-300">
                  Pilih 2 sampai 6 kelompok yang bertanding.
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-1 rounded-xl bg-[#0F1B3D] p-1 border border-white/10 overflow-x-auto">
                {[2, 3, 4, 5, 6].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      onUpdateSettings({ ...settings, teamCount: count });
                      triggerSavedToast();
                    }}
                    className={`flex-1 sm:flex-none rounded-lg px-3 py-1.5 font-mono-tabular text-xs sm:text-sm font-extrabold transition-colors whitespace-nowrap ${
                      settings.teamCount === count
                        ? 'bg-[#F2B705] text-[#0F1B3D] shadow'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {count} Tim
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {activeTeams.map((team, idx) => (
              <div
                key={team.id}
                className="relative flex flex-col justify-between rounded-2xl border border-white/15 bg-[#162654]/90 p-4 sm:p-5 shadow-xl"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1.5 sm:h-2 rounded-t-2xl"
                  style={{ backgroundColor: team.color }}
                />

                <div className="space-y-3 sm:space-y-4 pt-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-tabular text-xs font-bold text-[#F2B705]">
                      TIM #{idx + 1}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-300">
                      Keys: {team.keys.A}/{team.keys.B}/{team.keys.C}/{team.keys.D}{team.keys.E ? `/${team.keys.E}` : ''}
                    </span>
                  </div>

                  <div>
                    <label
                      htmlFor={`team-name-${team.id}`}
                      className="block text-xs font-semibold text-slate-300 mb-1"
                    >
                      Nama Tim
                    </label>
                    <input
                      id={`team-name-${team.id}`}
                      type="text"
                      value={team.name}
                      onChange={(e) => handleTeamFieldChange(team.id, 'name', e.target.value)}
                      placeholder="Nama Tim..."
                      className="w-full rounded-xl border border-white/20 bg-[#0F1B3D] px-3 py-2 text-sm sm:text-base font-bold text-[#FFFDF7] focus:border-[#F2B705] focus:outline-none"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-slate-300 mb-1">
                      Emoji Tim
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {TEAM_EMOJI_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleTeamFieldChange(team.id, 'emoji', emoji)}
                          className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg text-base sm:text-lg transition-transform ${
                            team.emoji === emoji
                              ? 'bg-[#F2B705] scale-110 ring-2 ring-white'
                              : 'bg-[#0F1B3D] hover:bg-white/15'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-slate-300 mb-1">
                      Warna Bendera
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {TEAM_COLOR_PALETTE.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => handleTeamFieldChange(team.id, 'color', c.hex)}
                          title={c.name}
                          className={`h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 transition-transform ${
                            team.color === c.hex
                              ? 'border-white scale-110 ring-2 ring-[#F2B705]'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-2.5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
                      <Keyboard className="h-3 w-3 text-[#F2B705]" />
                      <span>Tombol Keyboard (A / B / C / D / E)</span>
                    </span>

                    <div className="grid grid-cols-5 gap-1.5">
                      {(['A', 'B', 'C', 'D', 'E'] as AnswerLetter[]).map((letter) => {
                        const isListening =
                          listeningKeyTarget?.teamId === team.id &&
                          listeningKeyTarget?.letter === letter;

                        return (
                          <div key={letter} className="flex flex-col items-center">
                            <span className="mb-0.5 text-[10px] font-bold text-slate-300">
                              {letter}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setListeningKeyTarget(
                                  isListening ? null : { teamId: team.id, letter }
                                )
                              }
                              onKeyDown={(e) => {
                                if (isListening) {
                                  e.preventDefault();
                                  if (e.key.length === 1) {
                                    handleKeyBindingChange(team.id, letter, e.key);
                                  }
                                }
                              }}
                              className={`w-full rounded-lg border py-1.5 font-mono-tabular text-xs sm:text-sm font-extrabold transition-colors ${
                                isListening
                                  ? 'border-[#F2B705] bg-[#F2B705] text-[#0F1B3D] animate-pulse'
                                  : 'border-white/20 bg-[#0F1B3D] text-[#F2B705] hover:border-[#F2B705]'
                              }`}
                              title="Klik lalu tekan 1 tombol keyboard"
                            >
                              {isListening ? '...' : team.keys[letter] || '-'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Scoring & Rules */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-white/15 bg-[#162654]/90 p-4 sm:p-6 shadow-xl space-y-4 sm:space-y-6">
            <div>
              <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-[#FFFDF7]">
                <Sliders className="h-4 w-4 sm:h-5 sm:w-5 text-[#F2B705]" />
                <span>Aturan Poin & Timer</span>
              </h2>
              <p className="mt-0.5 text-xs text-slate-300">
                Sesuaikan durasi waktu dan sistem penilaian.
              </p>
            </div>

            <div className="space-y-2.5 border-t border-white/10 pt-3.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FFFDF7]">
                  <Clock className="h-4 w-4 text-[#F2B705]" />
                  <span>Timer Hitung Mundur</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSettings({ ...settings, timerEnabled: !settings.timerEnabled });
                    triggerSavedToast();
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-extrabold transition-colors ${
                    settings.timerEnabled
                      ? 'bg-[#10B981] text-[#0F1B3D]'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {settings.timerEnabled ? 'Aktif' : 'Nonaktif'}
                </button>
              </div>

              {settings.timerEnabled && (
                <div className="space-y-1.5 rounded-xl bg-[#0F1B3D] p-3 border border-white/10">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300">Durasi:</span>
                    <span className="font-mono-tabular text-sm sm:text-base font-extrabold text-[#F2B705]">
                      {settings.timerSeconds} Detik
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    step={5}
                    value={settings.timerSeconds}
                    onChange={(e) => {
                      onUpdateSettings({
                        ...settings,
                        timerSeconds: Number(e.target.value),
                      });
                      triggerSavedToast();
                    }}
                    className="w-full accent-[#F2B705]"
                  />
                  <div className="flex justify-between text-[10px] font-mono-tabular text-slate-400">
                    <span>10s</span>
                    <span>25s</span>
                    <span>45s</span>
                    <span>60s</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 border-t border-white/10 pt-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-[#FFFDF7]">Poin Jawaban Benar</span>
                <span className="font-mono-tabular text-sm sm:text-base font-extrabold text-[#34D399]">
                  +{settings.baseCorrectPoints} Poin
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[50, 100, 150, 200].map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => {
                      onUpdateSettings({ ...settings, baseCorrectPoints: pts });
                      triggerSavedToast();
                    }}
                    className={`rounded-xl py-1.5 font-mono-tabular text-xs font-extrabold transition-colors ${
                      settings.baseCorrectPoints === pts
                        ? 'bg-[#F2B705] text-[#0F1B3D]'
                        : 'bg-[#0F1B3D] text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    +{pts}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#FFFDF7]">
                    <Zap className="h-3.5 w-3.5 text-[#F2B705]" />
                    <span>Mode Cepat</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Bonus hingga +{settings.maxSpeedBonusPoints} poin untuk tim yang menjawab lebih awal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSettings({
                      ...settings,
                      speedBonusEnabled: !settings.speedBonusEnabled,
                    });
                    triggerSavedToast();
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-extrabold transition-colors shrink-0 ${
                    settings.speedBonusEnabled
                      ? 'bg-[#10B981] text-[#0F1B3D]'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {settings.speedBonusEnabled ? 'Aktif' : 'Mati'}
                </button>
              </div>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#FFFDF7]">
                    <ShieldAlert className="h-3.5 w-3.5 text-[#FF6B81]" />
                    <span>Pengurangan Poin Salah</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {settings.wrongPenaltyEnabled
                      ? `Jawaban salah -${settings.wrongPenaltyPoints} poin.`
                      : 'Jawaban salah 0 poin.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSettings({
                      ...settings,
                      wrongPenaltyEnabled: !settings.wrongPenaltyEnabled,
                    });
                    triggerSavedToast();
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-extrabold transition-colors shrink-0 ${
                    settings.wrongPenaltyEnabled
                      ? 'bg-[#C8102E] text-white'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {settings.wrongPenaltyEnabled ? `-${settings.wrongPenaltyPoints}p` : '0p'}
                </button>
              </div>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#FFFDF7]">
                    <Sparkles className="h-3.5 w-3.5 text-[#F2B705]" />
                    <span>Power-Up 2x Poin</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    1x kesempatan tiap tim menggandakan poin soal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSettings({
                      ...settings,
                      doublePointsPowerUpEnabled: !settings.doublePointsPowerUpEnabled,
                    });
                    triggerSavedToast();
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-extrabold transition-colors shrink-0 ${
                    settings.doublePointsPowerUpEnabled
                      ? 'bg-[#10B981] text-[#0F1B3D]'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {settings.doublePointsPowerUpEnabled ? 'Aktif' : 'Mati'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
