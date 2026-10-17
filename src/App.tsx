import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Play,
  Home as HomeIcon,
  BookOpen,
  Lock,
  Shield,
} from 'lucide-react';
import { GoldenMedallionEmblem, OttomanStarIcon } from './components/OttomanDecorations';
import {
  AnswerLetter,
  DEFAULT_SETTINGS,
  DEFAULT_TEAMS,
  DEFAULT_TEACHER_PIN,
  INITIAL_PACKAGES,
  QuestionPackage,
  QuizQuestion,
  QuizSettings,
  SoloGameState,
  STORAGE_KEYS,
  TeamConfig,
  TeamGameState,
} from './config/quizConfig';
import { soundFX } from './utils/soundEffects';
import { prepareQuizQuestions } from './utils/quizShuffle';
import { HomeView } from './components/HomeView';
import { TeamSettingsView } from './components/TeamSettingsView';
import { QuestionManagerView } from './components/QuestionManagerView';
import { QuestionScreen } from './components/QuestionScreen';
import { PodiumScreen } from './components/PodiumScreen';
import { SoloResultScreen } from './components/SoloResultScreen';
import { ConfirmDialog } from './components/ConfirmDialog';
import { TeacherAuthModal } from './components/TeacherAuthModal';

type AppScreen =
  | 'home'
  | 'team_settings'
  | 'question_manager'
  | 'quiz_play'
  | 'podium'
  | 'solo_result';

export default function App() {
  const [packages, setPackages] = useState<QuestionPackage[]>(() => {
    try {
      const raw =
        localStorage.getItem(STORAGE_KEYS.PACKAGES) ||
        localStorage.getItem('ski_quiz_packages_v7');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Preserve any custom packages created by the teacher
          const customTeacherPackages = parsed
            .filter((p: QuestionPackage) => !INITIAL_PACKAGES.some((init) => init.id === p.id))
            .map((p: QuestionPackage) => ({
              ...p,
              gradeLevel: p.gradeLevel || 'XI',
            }));

          return [...INITIAL_PACKAGES, ...customTeacherPackages];
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_PACKAGES;
  });

  const [selectedPackageId, setSelectedPackageId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_PACKAGE_ID);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return INITIAL_PACKAGES[0].id;
  });

  const [teams, setTeams] = useState<TeamConfig[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TEAMS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === 6) {
          return parsed.map((t: TeamConfig) => ({
            ...t,
            keys: {
              ...DEFAULT_TEAMS.find((dt) => dt.id === t.id)?.keys,
              ...t.keys,
              E: t.keys?.E || DEFAULT_TEAMS.find((dt) => dt.id === t.id)?.keys.E || 'E',
            },
          }));
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_TEAMS;
  });

  const [settings, setSettings] = useState<QuizSettings>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (raw) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
    } catch {
      // ignore
    }
  }, [packages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_PACKAGE_ID, selectedPackageId);
    } catch {
      // ignore
    }
  }, [selectedPackageId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    } catch {
      // ignore
    }
  }, [teams]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
    soundFX.setEnabled(settings.soundEnabled);
  }, [settings]);

  const [teacherPin, setTeacherPin] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.TEACHER_PIN) || DEFAULT_TEACHER_PIN;
    } catch {
      return DEFAULT_TEACHER_PIN;
    }
  });

  const handleUpdateTeacherPin = (newPin: string) => {
    setTeacherPin(newPin);
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHER_PIN, newPin);
    } catch {
      // ignore
    }
  };

  const [authModalState, setAuthModalState] = useState<{
    isOpen: boolean;
    targetScreen: 'question_manager' | 'team_settings' | null;
    featureName: string;
  }>({
    isOpen: false,
    targetScreen: null,
    featureName: '',
  });

  const requestTeacherAccess = useCallback(
    (targetScreen: 'question_manager' | 'team_settings', featureName: string) => {
      setAuthModalState({
        isOpen: true,
        targetScreen,
        featureName,
      });
    },
    []
  );

  const [screen, setScreen] = useState<AppScreen>('home');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  // --- GAMEPLAY STATE ---
  const [gameQuestions, setGameQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameTeams, setGameTeams] = useState<TeamGameState[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState(settings.timerSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  // Solo mode state
  const [soloSelectedAnswer, setSoloSelectedAnswer] = useState<AnswerLetter | null>(null);
  const [soloState, setSoloState] = useState<SoloGameState>({
    studentName: 'Siswa SKI',
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    totalTimeMs: 0,
    answers: [],
  });

  const questionStartTimestampRef = useRef<number>(Date.now());
  const gameTeamsRef = useRef<TeamGameState[]>(gameTeams);
  gameTeamsRef.current = gameTeams;

  const activePackage =
    packages.find((p) => p.id === selectedPackageId) || packages[0] || INITIAL_PACKAGES[0];
  const currentQuestion = gameQuestions[currentQuestionIndex] || activePackage.questions[0];

  const startQuiz = useCallback(() => {
    const pkg = packages.find((p) => p.id === selectedPackageId) || packages[0];
    if (!pkg || pkg.questions.length === 0) return;

    const preparedQuestions = prepareQuizQuestions(pkg.questions, {
      shuffleQuestions: settings.shuffleQuestionsOnStart,
      shuffleOptions: settings.shuffleOptionsOnStart,
    });

    const activeTeamConfigs = teams.slice(0, Math.max(2, Math.min(6, settings.teamCount)));
    const initialTeamStates: TeamGameState[] = activeTeamConfigs.map((tc) => ({
      ...tc,
      score: 0,
      previousScore: 0,
      selectedAnswer: null,
      answerTimeMs: null,
      doublePointsUsed: false,
      doublePointsActiveThisRound: false,
      lastPointsDelta: 0,
      lastSpeedBonus: 0,
      correctCount: 0,
      wrongCount: 0,
    }));

    setGameQuestions(preparedQuestions);
    setCurrentQuestionIndex(0);
    setGameTeams(initialTeamStates);
    setRemainingSeconds(settings.timerSeconds);
    setIsPaused(false);
    setIsRevealed(false);
    setSoloSelectedAnswer(null);
    setSoloState({
      studentName: settings.studentName || 'Siswa SKI',
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      totalTimeMs: 0,
      answers: [],
    });
    questionStartTimestampRef.current = Date.now();
    setScreen('quiz_play');
  }, [packages, selectedPackageId, settings, teams]);

  const handleSelectSoloAnswer = useCallback(
    (answer: AnswerLetter) => {
      if (isRevealed) return;
      const q = gameQuestions[currentQuestionIndex];
      if (!q) return;

      const isCorrect = answer === q.correctAnswer;
      const timeSpent = Math.max(0, Date.now() - questionStartTimestampRef.current);
      const totalMs = Math.max(1000, settings.timerSeconds * 1000);

      let points = 0;
      if (isCorrect) {
        points = settings.baseCorrectPoints;
        if (settings.speedBonusEnabled) {
          const elapsedRatio = Math.max(0, Math.min(1, 1 - timeSpent / totalMs));
          points += Math.round(elapsedRatio * settings.maxSpeedBonusPoints);
        }
      }

      setSoloState((prev) => ({
        ...prev,
        score: prev.score + points,
        correctCount: prev.correctCount + (isCorrect ? 1 : 0),
        wrongCount: prev.wrongCount + (isCorrect ? 0 : 1),
        totalTimeMs: prev.totalTimeMs + timeSpent,
        answers: [
          ...prev.answers,
          {
            questionId: q.id,
            questionText: q.question,
            selectedAnswer: answer,
            correctAnswer: q.correctAnswer,
            isCorrect,
            options: q.options,
            explanation: q.explanation,
            pageReference: q.pageReference,
            timeSpentMs: timeSpent,
          },
        ],
      }));

      setSoloSelectedAnswer(answer);
      setIsRevealed(true);

      setTimeout(() => {
        if (isCorrect) {
          soundFX.playRevealCorrect();
        } else {
          soundFX.playSoftBuzz();
        }
      }, 20);
    },
    [isRevealed, gameQuestions, currentQuestionIndex, settings]
  );

  const revealCurrentAnswer = useCallback(() => {
    if (isRevealed) return;
    const q = gameQuestions[currentQuestionIndex];
    if (!q) return;

    const totalMs = Math.max(1000, settings.timerSeconds * 1000);
    let anyCorrect = false;

    if (settings.gameMode === 'solo') {
      if (soloSelectedAnswer === null) {
        const timeSpent = Math.max(0, Date.now() - questionStartTimestampRef.current);
        setSoloState((prev) => ({
          ...prev,
          wrongCount: prev.wrongCount + 1,
          totalTimeMs: prev.totalTimeMs + timeSpent,
          answers: [
            ...prev.answers,
            {
              questionId: q.id,
              questionText: q.question,
              selectedAnswer: '-',
              correctAnswer: q.correctAnswer,
              isCorrect: false,
              options: q.options,
              explanation: q.explanation,
              pageReference: q.pageReference,
              timeSpentMs: timeSpent,
            },
          ],
        }));
      }
    } else {
      setGameTeams((prevTeams) =>
        prevTeams.map((team) => {
          const isCorrect = team.selectedAnswer === q.correctAnswer;
          const hasAnswered = team.selectedAnswer !== null;

          let pointsDelta = 0;
          let speedBonus = 0;

          if (isCorrect) {
            anyCorrect = true;
            pointsDelta = settings.baseCorrectPoints;

            if (settings.speedBonusEnabled && team.answerTimeMs !== null) {
              const elapsedRatio = Math.max(0, Math.min(1, 1 - team.answerTimeMs / totalMs));
              speedBonus = Math.round(elapsedRatio * settings.maxSpeedBonusPoints);
              pointsDelta += speedBonus;
            }

            if (settings.doublePointsPowerUpEnabled && team.doublePointsActiveThisRound) {
              pointsDelta *= 2;
            }
          } else if (hasAnswered && settings.wrongPenaltyEnabled) {
            pointsDelta = -Math.abs(settings.wrongPenaltyPoints);
            if (settings.doublePointsPowerUpEnabled && team.doublePointsActiveThisRound) {
              pointsDelta *= 2;
            }
          }

          const newScore = Math.max(0, team.score + pointsDelta);

          return {
            ...team,
            previousScore: team.score,
            score: newScore,
            lastPointsDelta: pointsDelta,
            lastSpeedBonus: speedBonus,
            doublePointsUsed: team.doublePointsUsed || team.doublePointsActiveThisRound,
            correctCount: isCorrect ? team.correctCount + 1 : team.correctCount,
            wrongCount: hasAnswered && !isCorrect ? team.wrongCount + 1 : team.wrongCount,
          };
        })
      );
    }

    setIsRevealed(true);
    setTimeout(() => {
      if (anyCorrect) {
        soundFX.playRevealCorrect();
      } else {
        soundFX.playSoftBuzz();
      }
    }, 30);
  }, [isRevealed, gameQuestions, currentQuestionIndex, settings, soloSelectedAnswer]);

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 >= gameQuestions.length) {
      soundFX.playVictoryFanfare();
      if (settings.gameMode === 'solo') {
        setScreen('solo_result');
      } else {
        setScreen('podium');
      }
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
    setGameTeams((prev) =>
      prev.map((t) => ({
        ...t,
        selectedAnswer: null,
        answerTimeMs: null,
        doublePointsActiveThisRound: false,
        lastPointsDelta: 0,
        lastSpeedBonus: 0,
      }))
    );
    setSoloSelectedAnswer(null);
    setRemainingSeconds(settings.timerSeconds);
    setIsPaused(false);
    setIsRevealed(false);
    questionStartTimestampRef.current = Date.now();
  }, [currentQuestionIndex, gameQuestions.length, settings.timerSeconds, settings.gameMode]);

  const skipCurrentQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 >= gameQuestions.length) return;
    const q = gameQuestions[currentQuestionIndex];
    if (settings.gameMode === 'solo' && q) {
      const timeSpent = Math.max(0, Date.now() - questionStartTimestampRef.current);
      setSoloState((prev) => ({
        ...prev,
        wrongCount: prev.wrongCount + 1,
        totalTimeMs: prev.totalTimeMs + timeSpent,
        answers: [
          ...prev.answers,
          {
            questionId: q.id,
            questionText: q.question,
            selectedAnswer: '-',
            correctAnswer: q.correctAnswer,
            isCorrect: false,
            options: q.options,
            explanation: q.explanation,
            pageReference: q.pageReference,
            timeSpentMs: timeSpent,
          },
        ],
      }));
    }

    setCurrentQuestionIndex((prev) => prev + 1);
    setGameTeams((prev) =>
      prev.map((t) => ({
        ...t,
        selectedAnswer: null,
        answerTimeMs: null,
        doublePointsActiveThisRound: false,
        lastPointsDelta: 0,
        lastSpeedBonus: 0,
      }))
    );
    setSoloSelectedAnswer(null);
    setRemainingSeconds(settings.timerSeconds);
    setIsPaused(false);
    setIsRevealed(false);
    questionStartTimestampRef.current = Date.now();
  }, [currentQuestionIndex, gameQuestions, settings.timerSeconds, settings.gameMode]);

  const selectTeamAnswer = useCallback(
    (teamId: string, answer: AnswerLetter) => {
      if (isRevealed) return;
      const q = gameQuestions[currentQuestionIndex];
      if (!q) return;
      if (q.type === 'true_false' && (answer === 'C' || answer === 'D' || answer === 'E')) return;
      const hasOptionE = Boolean(q.options?.E && q.options.E.trim() !== '' && q.options.E !== '-');
      if (answer === 'E' && !hasOptionE) return;

      const elapsedMs = Math.max(0, Date.now() - questionStartTimestampRef.current);
      let didLockNewAnswer = false;

      setGameTeams((prev) =>
        prev.map((team) => {
          if (team.id !== teamId) return team;
          if (team.selectedAnswer !== null) return team;
          didLockNewAnswer = true;
          return {
            ...team,
            selectedAnswer: answer,
            answerTimeMs: elapsedMs,
          };
        })
      );

      if (didLockNewAnswer) {
        soundFX.playLockIn();
      }
    },
    [isRevealed, gameQuestions, currentQuestionIndex]
  );

  useEffect(() => {
    if (screen !== 'quiz_play' || isRevealed || gameTeams.length === 0) return;
    const allLocked = gameTeams.every((t) => t.selectedAnswer !== null);
    if (allLocked) {
      const timeout = window.setTimeout(() => {
        revealCurrentAnswer();
      }, 500);
      return () => window.clearTimeout(timeout);
    }
  }, [screen, isRevealed, gameTeams, revealCurrentAnswer]);

  useEffect(() => {
    if (
      screen !== 'quiz_play' ||
      !settings.timerEnabled ||
      isPaused ||
      isRevealed
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          soundFX.playTimerUrgentTick(0);
          window.setTimeout(() => revealCurrentAnswer(), 120);
          return 0;
        }
        const nextVal = prev - 1;
        if (nextVal <= 5) {
          soundFX.playTimerUrgentTick(nextVal);
        }
        return nextVal;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [screen, settings.timerEnabled, isPaused, isRevealed, revealCurrentAnswer]);

  useEffect(() => {
    if (screen !== 'quiz_play') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (!isRevealed) {
          revealCurrentAnswer();
        } else {
          goToNextQuestion();
        }
        return;
      }

      const upperKey = e.key.toUpperCase();

      let matchedTeamBinding = false;
      if (!isRevealed) {
        const q = gameQuestions[currentQuestionIndex];
        const isTrueFalse = q?.type === 'true_false';
        const hasOptionE = Boolean(
          !isTrueFalse &&
            q?.options?.E &&
            q.options.E.trim() !== '' &&
            q.options.E !== '-'
        );
        const letters: AnswerLetter[] = isTrueFalse
          ? ['A', 'B']
          : hasOptionE
            ? ['A', 'B', 'C', 'D', 'E']
            : ['A', 'B', 'C', 'D'];

        for (const team of gameTeamsRef.current) {
          for (const letter of letters) {
            if (team.keys[letter]?.toUpperCase() === upperKey) {
              matchedTeamBinding = true;
              selectTeamAnswer(team.id, letter);
              break;
            }
          }
          if (matchedTeamBinding) break;
        }
      }

      if (matchedTeamBinding) return;

      if (upperKey === 'P' && settings.timerEnabled && !isRevealed) {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      } else if (upperKey === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    screen,
    isRevealed,
    settings.timerEnabled,
    revealCurrentAnswer,
    goToNextQuestion,
    selectTeamAnswer,
    toggleFullscreen,
  ]);

  const handleResetAllAnswers = () => {
    if (isRevealed) return;
    setGameTeams((prev) =>
      prev.map((t) => ({
        ...t,
        selectedAnswer: null,
        answerTimeMs: null,
      }))
    );
  };

  const handleResetSingleTeamAnswer = (teamId: string) => {
    if (isRevealed) return;
    setGameTeams((prev) =>
      prev.map((t) =>
        t.id === teamId ? { ...t, selectedAnswer: null, answerTimeMs: null } : t
      )
    );
  };

  const handleToggleDoublePoints = (teamId: string) => {
    if (isRevealed) return;
    setGameTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;
        if (t.doublePointsUsed && !t.doublePointsActiveThisRound) return t;
        const nextActive = !t.doublePointsActiveThisRound;
        if (nextActive) {
          soundFX.playPowerUp();
        }
        return {
          ...t,
          doublePointsActiveThisRound: nextActive,
        };
      })
    );
  };

  const handleManualScoreAdjust = (teamId: string, delta: number) => {
    setGameTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              previousScore: t.score,
              score: Math.max(0, t.score + delta),
            }
          : t
      )
    );
  };

  const handleRestoreSamplePackages = () => {
    setPackages(INITIAL_PACKAGES);
    setSelectedPackageId(INITIAL_PACKAGES[0].id);
  };

  const isNonGameScreen =
    screen !== 'quiz_play' && screen !== 'podium' && screen !== 'solo_result';

  return (
    <div className="min-h-screen bg-islamic-pattern text-[#FFFDF7]">
      {/* TOP NAVIGATION BAR - IMPERIAL ISLAMIC ARCHITECTURE */}
      {isNonGameScreen && (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#F2B705]/25 bg-gradient-to-r from-[#0B142E]/98 via-[#0D1836]/95 to-[#0B142E]/98 px-3 py-2 sm:px-6 sm:py-2.5 lg:px-8 backdrop-blur-md shadow-lg shadow-black/40">
          {/* Zone 1: Brand Title & Quiz Status */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="flex items-center gap-2.5 group text-left transition-all"
            >
              <GoldenMedallionEmblem className="h-8 w-8 sm:h-9 sm:w-9 group-hover:rotate-12 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(242,183,5,0.4)]" />
              <div className="min-w-0">
                <span className="font-display text-sm sm:text-base lg:text-lg font-black tracking-wide gold-gradient-text block leading-tight">
                  Quiz Sejarah Islam
                </span>
                <span className="hidden sm:block text-[10px] font-bold text-slate-300 tracking-wider uppercase">
                  Madrasah Aliyah
                </span>
              </div>
            </button>

            {activePackage?.gradeLevel && (
              <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-300 shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Kelas {activePackage.gradeLevel} MA</span>
              </span>
            )}
          </div>

          {/* Zone 2: Quick Action Buttons, Teacher Portal & Play */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Quick Guru Access Button in Navbar */}
            <button
              type="button"
              onClick={() => requestTeacherAccess('question_manager', 'Portal Pengelolaan Guru')}
              title="Akses Ruang Guru & Soal"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#F2B705]/40 px-2.5 py-1.5 text-xs font-bold text-slate-200 transition-all shadow-xs"
            >
              <Shield className="h-3.5 w-3.5 text-[#F2B705]" />
              <span>Ruang Guru</span>
            </button>

            <button
              type="button"
              onClick={toggleSound}
              title={settings.soundEnabled ? 'Suara Aktif' : 'Suara Dimatikan'}
              className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 p-2 text-slate-200 hover:text-white transition-colors"
              aria-label="Pengaturan Suara"
            >
              {settings.soundEnabled ? (
                <Volume2 className="h-4 w-4 text-[#F2B705]" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-400" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              title="Layar Penuh Proyektor"
              className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 p-2 text-slate-200 hover:text-white transition-colors hidden sm:block"
              aria-label="Layar Penuh"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4 text-[#F2B705]" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>

            {screen !== 'home' && (
              <button
                type="button"
                onClick={startQuiz}
                disabled={(activePackage?.questions.length || 0) === 0}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F2B705] via-[#F59E0B] to-[#D97706] px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-black text-[#0A122C] shadow-[0_4px_15px_rgba(242,183,5,0.35)] hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all whitespace-nowrap ring-1 ring-amber-200/50"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Mulai Kuis</span>
              </button>
            )}
          </div>
        </header>
      )}

      {/* SCREEN ROUTER */}
      {screen === 'home' && (
        <HomeView
          packages={packages}
          selectedPackageId={selectedPackageId}
          teams={teams}
          settings={settings}
          onSelectPackage={setSelectedPackageId}
          onUpdateSettings={setSettings}
          onStartQuiz={startQuiz}
          onOpenQuestionManager={() =>
            requestTeacherAccess('question_manager', 'Kelola Soal & Gambar')
          }
          onOpenTeamSettings={() =>
            requestTeacherAccess('team_settings', 'Pengaturan Tim & Tombol')
          }
        />
      )}

      {screen === 'team_settings' && (
        <TeamSettingsView
          teams={teams}
          settings={settings}
          onUpdateTeams={setTeams}
          onUpdateSettings={setSettings}
          onBackHome={() => setScreen('home')}
          onStartQuizNow={startQuiz}
        />
      )}

      {screen === 'question_manager' && (
        <QuestionManagerView
          packages={packages}
          selectedPackageId={selectedPackageId}
          onSelectPackage={setSelectedPackageId}
          onUpdatePackages={setPackages}
          onRestoreSamplePackages={handleRestoreSamplePackages}
          onBackHome={() => setScreen('home')}
          onOpenChangePin={() =>
            setAuthModalState({
              isOpen: true,
              targetScreen: null,
              featureName: 'Penggantian Sandi Rahasia Guru',
            })
          }
        />
      )}

      {screen === 'quiz_play' && currentQuestion && (
        <QuestionScreen
          packageName={activePackage?.name || 'Daulah Usmani'}
          gradeLevel={activePackage?.gradeLevel || 'XI'}
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          totalQuestions={gameQuestions.length}
          teams={gameTeams}
          settings={settings}
          remainingSeconds={remainingSeconds}
          isPaused={isPaused}
          isRevealed={isRevealed}
          isFullscreen={isFullscreen}
          soloSelectedAnswer={soloSelectedAnswer}
          onSelectSoloAnswer={handleSelectSoloAnswer}
          soloScore={soloState.score}
          soloCorrectCount={soloState.correctCount}
          soloWrongCount={soloState.wrongCount}
          onSelectTeamAnswer={selectTeamAnswer}
          onResetAllAnswers={handleResetAllAnswers}
          onResetSingleTeamAnswer={handleResetSingleTeamAnswer}
          onToggleDoublePoints={handleToggleDoublePoints}
          onManualScoreAdjust={handleManualScoreAdjust}
          onRevealAnswer={revealCurrentAnswer}
          onNextQuestion={goToNextQuestion}
          onSkipQuestion={skipCurrentQuestion}
          onTogglePause={() => setIsPaused((prev) => !prev)}
          onToggleSound={toggleSound}
          onToggleFullscreen={toggleFullscreen}
          onRequestExitHome={() => setShowExitConfirm(true)}
        />
      )}

      {screen === 'podium' && (
        <PodiumScreen
          packageName={activePackage?.name || 'Daulah Usmani'}
          gradeLevel={activePackage?.gradeLevel || 'XI'}
          totalQuestions={gameQuestions.length}
          teams={gameTeams}
          onPlayAgain={startQuiz}
          onBackHome={() => setScreen('home')}
        />
      )}

      {screen === 'solo_result' && (
        <SoloResultScreen
          packageName={activePackage?.name || 'Daulah Usmani'}
          gradeLevel={activePackage?.gradeLevel || 'XI'}
          totalQuestions={gameQuestions.length}
          soloState={soloState}
          onPlayAgain={startQuiz}
          onBackHome={() => setScreen('home')}
        />
      )}

      {/* MODAL OTORISASI SANDI RAHASIA GURU */}
      <TeacherAuthModal
        isOpen={authModalState.isOpen}
        targetFeatureName={authModalState.featureName}
        currentPin={teacherPin}
        onUpdatePin={handleUpdateTeacherPin}
        onClose={() => setAuthModalState({ isOpen: false, targetScreen: null, featureName: '' })}
        onSuccess={() => {
          const dest = authModalState.targetScreen;
          setAuthModalState({ isOpen: false, targetScreen: null, featureName: '' });
          if (dest) {
            setScreen(dest);
          }
        }}
      />

      <ConfirmDialog
        isOpen={showExitConfirm}
        title="Akhiri Permainan & Kembali ke Beranda?"
        message="Skor permainan yang sedang berlangsung akan direset jika Anda kembali ke Beranda."
        confirmLabel="Ya, Kembali ke Beranda"
        cancelLabel="Lanjutkan Bermain"
        variant="warning"
        onConfirm={() => {
          setShowExitConfirm(false);
          setScreen('home');
        }}
        onCancel={() => setShowExitConfirm(false)}
      />
    </div>
  );
}
