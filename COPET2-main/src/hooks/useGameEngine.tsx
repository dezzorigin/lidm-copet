import { createContext, useContext, useState, type ReactNode } from 'react';

export type GameMode = 'welcome' | 'login' | 'landing' | 'home' | 'vocab' | 'quiz' | 'sim' | 'admin';
export type UserRole = 'guest' | 'user' | 'admin';

export interface ScoreLog {
  id: number;
  name: string;
  score: number;
  badge: string;
  date: string;
}

interface GameEngineState {
  userPoints: number;
  masteredCount: number;
  currentMode: GameMode;
  playerName: string;
  testType: 'Pre-Test' | 'Post-Test';
  achievements: string[];
  isAdvancedLevelUnlocked: boolean;
  role: UserRole;
  scoreLogs: ScoreLog[];
  mistakes: Record<string, number>;
  streakCount: number;
  quizCorrectToday: number;
  simCompletedToday: boolean;
  isQuizClaimed: boolean;
  isSimClaimed: boolean;
  setPlayerInfo: (name: string, type: 'Pre-Test' | 'Post-Test') => void;
  addPoints: (points: number) => void;
  incrementMastered: () => void;
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
  const [masteredCount, setMasteredCount] = useState<number>(0);
  const [currentMode, setCurrentMode] = useState<GameMode>('welcome'); 
  const [playerName, setPlayerName] = useState<string>("Siswa Anonim");
  const [testType, setTestType] = useState<'Pre-Test' | 'Post-Test'>('Pre-Test');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isAdvancedLevelUnlocked, setIsAdvancedLevelUnlocked] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole>('guest');
  const [scoreLogs, setScoreLogs] = useState<ScoreLog[]>([]);
  const [mistakes, setMistakes] = useState<Record<string, number>>({});

  const [streakCount] = useState<number>(3); 
  const [quizCorrectToday, setQuizCorrectToday] = useState<number>(0);
  const [simCompletedToday, setSimCompletedToday] = useState<boolean>(false);
  const [isQuizClaimed, setIsQuizClaimed] = useState<boolean>(false);
  const [isSimClaimed, setIsSimClaimed] = useState<boolean>(false);

  const setPlayerInfo = (name: string, type: 'Pre-Test' | 'Post-Test') => {
    setPlayerName(name);
    setTestType(type);
  };

  const loginAs = (selectedRole: UserRole, customName?: string) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setPlayerName("Sistem Admin");
      setCurrentMode('admin');
    } else {
      const finalName = customName && customName.trim() !== "" ? customName : "Agent Anonim";
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
  const incrementMastered = () => setMasteredCount((prev) => prev + 1);
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
      ...prev
    ]);
  };

  const recordMistake = (category: string) => {
    setMistakes((prev) => ({
      ...prev,
      [category]: (prev[category] || 0) + 1
    }));
  };

  const getWeakestCategory = () => {
    if (Object.keys(mistakes).length === 0) return "Tidak Ada (Sempurna!)";
    return Object.keys(mistakes).reduce((a, b) => mistakes[a] > mistakes[b] ? a : b);
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
    setMasteredCount(0);
    setAchievements([]);
    setIsAdvancedLevelUnlocked(false);
    setMistakes({});
    setQuizCorrectToday(0);
    setSimCompletedToday(false);
    setIsQuizClaimed(false);
    setIsSimClaimed(false);
  };

  return (
    <GameEngineContext.Provider
      value={{
        userPoints, masteredCount, currentMode, playerName, testType,
        achievements, isAdvancedLevelUnlocked, role, scoreLogs, mistakes,
        streakCount, quizCorrectToday, simCompletedToday, isQuizClaimed, isSimClaimed,
        setPlayerInfo, addPoints, incrementMastered, setMode, resetGame,
        unlockAchievement, unlockAdvancedLevel, loginAs, logout, saveScoreLog,
        recordMistake, getWeakestCategory, addQuizCorrectProgress, triggerSimComplete, claimMissionReward
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