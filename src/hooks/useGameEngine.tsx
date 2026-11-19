/* eslint-disable react-refresh/only-export-components -- file konteks: provider + hook memang tinggal bersama */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type GameMode = 'welcome' | 'login' | 'landing' | 'home' | 'vocab' | 'quiz' | 'sim' | 'admin';
export type UserRole = 'guest' | 'user' | 'admin';

export interface ScoreLog {
  id: number;
  name: string;
  score: number;
  badge: string;
  date: string;
}

/* Semua angka di dasbor adalah angka sesi nyata, bukan hardcode.
   Dulu: streak "3 HARI" dan akurasi "87%" ditulis langsung di kode
   (dan diakui "Simulasi" di README lama). Sekarang:
   - streak dihitung dari hari aktif yang tersimpan di localStorage
     (hari berurutan mundur dari hari ini);
   - akurasi dihitung dari jawaban benar/salah sesi berjalan;
   - kosakata dikuasai dilacak per id istilah;
   - log skor tersimpan lokal agar panel evaluator melihat riwayat
     sesi-sesi sebelumnya di perangkat yang sama.
   Tidak ada backend: Firebase dihapus (config-nya placeholder dan
   dbService tidak pernah diimpor siapa pun) — lihat docs/ARCHITECTURE.md. */

const LS_LOGS = 'copet-score-logs';
const LS_MASTERED = 'copet-mastered-terms';
const LS_DAYS = 'copet-active-days';

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function calcStreak(days: string[]): number {
  const set = new Set(days);
  let streak = 0;
  const d = new Date();
  // Mundur dari hari ini selama hari itu tercatat aktif.
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (!set.has(key)) break;
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

interface GameEngineState {
  userPoints: number;
  masteredCount: number;
  masteredTerms: string[];
  currentMode: GameMode;
  playerName: string;
  testType: 'Pre-Test' | 'Post-Test';
  achievements: string[];
  isAdvancedLevelUnlocked: boolean;
  role: UserRole;
  scoreLogs: ScoreLog[];
  mistakes: Record<string, number>;
  streakCount: number;
  answersCorrect: number;
  answersWrong: number;
  quizCorrectToday: number;
  simCompletedToday: boolean;
  isQuizClaimed: boolean;
  isSimClaimed: boolean;
  setPlayerInfo: (name: string, type: 'Pre-Test' | 'Post-Test') => void;
  addPoints: (points: number) => void;
  markMastered: (termId: string) => void;
  recordAnswer: (correct: boolean) => void;
  setMode: (mode: GameMode) => void;
  resetGame: () => void;
  unlockAchievement: (achievement: string) => void;
  unlockAdvancedLevel: () => void;
  loginAs: (selectedRole: UserRole, customName?: string) => void;
  logout: () => void;
  saveScoreLog: (badge: string) => void;
  recordMistake: (category: string) => void;
  getWeakestCategory: () => string;
  addQuizCorrectProgress: (count: number) => void;
  triggerSimComplete: () => void;
  claimMissionReward: (type: 'quiz' | 'sim') => void;
}

const GameEngineContext = createContext<GameEngineState | undefined>(undefined);

export function GameEngineProvider({ children }: { children: ReactNode }) {
  const [userPoints, setUserPoints] = useState<number>(0);
  const [masteredTerms, setMasteredTerms] = useState<string[]>(() =>
    loadJson<string[]>(LS_MASTERED, []),
  );
  const [currentMode, setCurrentMode] = useState<GameMode>('welcome');
  const [playerName, setPlayerName] = useState<string>('Siswa Anonim');
  const [testType, setTestType] = useState<'Pre-Test' | 'Post-Test'>('Pre-Test');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isAdvancedLevelUnlocked, setIsAdvancedLevelUnlocked] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole>('guest');
  const [scoreLogs, setScoreLogs] = useState<ScoreLog[]>(() =>
    loadJson<ScoreLog[]>(LS_LOGS, []),
  );
  const [mistakes, setMistakes] = useState<Record<string, number>>({});
  const [activeDays, setActiveDays] = useState<string[]>(() =>
    loadJson<string[]>(LS_DAYS, []),
  );

  const [answersCorrect, setAnswersCorrect] = useState<number>(0);
  const [answersWrong, setAnswersWrong] = useState<number>(0);
  const [quizCorrectToday, setQuizCorrectToday] = useState<number>(0);
  const [simCompletedToday, setSimCompletedToday] = useState<boolean>(false);
  const [isQuizClaimed, setIsQuizClaimed] = useState<boolean>(false);
  const [isSimClaimed, setIsSimClaimed] = useState<boolean>(false);

  const streakCount = calcStreak(activeDays);
  const masteredCount = masteredTerms.length;

  useEffect(() => {
    localStorage.setItem(LS_LOGS, JSON.stringify(scoreLogs));
  }, [scoreLogs]);
  useEffect(() => {
    localStorage.setItem(LS_MASTERED, JSON.stringify(masteredTerms));
  }, [masteredTerms]);
  useEffect(() => {
    localStorage.setItem(LS_DAYS, JSON.stringify(activeDays));
  }, [activeDays]);

  const markTodayActive = () => {
    const key = todayKey();
    setActiveDays((prev) => (prev.includes(key) ? prev : [...prev, key]));
  };

  const setPlayerInfo = (name: string, type: 'Pre-Test' | 'Post-Test') => {
    setPlayerName(name);
    setTestType(type);
  };

  const loginAs = (selectedRole: UserRole, customName?: string) => {
    setRole(selectedRole);
    markTodayActive();
    if (selectedRole === 'admin') {
      setPlayerName('Sistem Admin');
      setCurrentMode('admin');
    } else {
      const finalName = customName && customName.trim() !== '' ? customName : 'Agent Anonim';
      setPlayerName(finalName);
      setCurrentMode('home');
    }
  };

  const logout = () => {
    setRole('guest');
    setCurrentMode('login');
    resetGame();
  };

  const addPoints = (points: number) => setUserPoints((prev) => prev + points);

  const markMastered = (termId: string) => {
    setMasteredTerms((prev) => (prev.includes(termId) ? prev : [...prev, termId]));
  };

  const recordAnswer = (correct: boolean) => {
    if (correct) setAnswersCorrect((prev) => prev + 1);
    else setAnswersWrong((prev) => prev + 1);
  };

  const setMode = (mode: GameMode) => setCurrentMode(mode);

  const unlockAchievement = (newAchievement: string) => {
    setAchievements((prev) => {
      if (!prev.includes(newAchievement)) return [...prev, newAchievement];
      return prev;
    });
  };

  const unlockAdvancedLevel = () => setIsAdvancedLevelUnlocked(true);

  const saveScoreLog = (highestBadge: string) => {
    setScoreLogs((prev) => [
      {
        id: Date.now(),
        name: playerName,
        score: userPoints,
        badge: highestBadge,
        date: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  const recordMistake = (category: string) => {
    setMistakes((prev) => ({
      ...prev,
      [category]: (prev[category] || 0) + 1,
    }));
  };

  const getWeakestCategory = () => {
    if (Object.keys(mistakes).length === 0) return 'Tidak Ada (Sempurna!)';
    return Object.keys(mistakes).reduce((a, b) => (mistakes[a] > mistakes[b] ? a : b));
  };

  const addQuizCorrectProgress = (count: number) => {
    setQuizCorrectToday((prev) => Math.min(3, prev + count));
  };

  const triggerSimComplete = () => {
    setSimCompletedToday(true);
  };

  const claimMissionReward = (type: 'quiz' | 'sim') => {
    if (type === 'quiz' && !isQuizClaimed && quizCorrectToday >= 3) {
      setUserPoints((prev) => prev + 15);
      setIsQuizClaimed(true);
    }
    if (type === 'sim' && !isSimClaimed && simCompletedToday) {
      setUserPoints((prev) => prev + 15);
      setIsSimClaimed(true);
    }
  };

  const resetGame = () => {
    setUserPoints(0);
    setMasteredTerms([]);
    setAchievements([]);
    setIsAdvancedLevelUnlocked(false);
    setMistakes({});
    setAnswersCorrect(0);
    setAnswersWrong(0);
    setQuizCorrectToday(0);
    setSimCompletedToday(false);
    setIsQuizClaimed(false);
    setIsSimClaimed(false);
  };

  return (
    <GameEngineContext.Provider
      value={{
        userPoints, masteredCount, masteredTerms, currentMode, playerName, testType,
        achievements, isAdvancedLevelUnlocked, role, scoreLogs, mistakes,
        streakCount, answersCorrect, answersWrong, quizCorrectToday, simCompletedToday, isQuizClaimed, isSimClaimed,
        setPlayerInfo, addPoints, markMastered, recordAnswer, setMode, resetGame,
        unlockAchievement, unlockAdvancedLevel, loginAs, logout, saveScoreLog,
        recordMistake, getWeakestCategory, addQuizCorrectProgress, triggerSimComplete, claimMissionReward,
      }}
    >
      {children}
    </GameEngineContext.Provider>
  );
}

export function useGameEngine() {
  const context = useContext(GameEngineContext);
  if (context === undefined) throw new Error('useGameEngine must be used within a GameEngineProvider');
  return context;
}
