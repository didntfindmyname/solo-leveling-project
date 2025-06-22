export interface User {
  id: string;
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  title: string;
  stats: {
    strength: number;
    intelligence: number;
    endurance: number;
    discipline: number;
  };
  achievements: Achievement[];
  totalXP: number;
  streaks: {
    fitness: number;
    mental: number;
    knowledge: number;
    overall: number;
  };
  preferences: {
    difficulty: 'easy' | 'medium' | 'hard';
    categories: string[];
    voiceEnabled: boolean;
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'mental' | 'knowledge';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  completed: boolean;
  completedAt?: Date;
  timeEstimate: number; // in minutes
  streak?: number;
  isCustom?: boolean;
  deadline?: Date;
  aiGenerated?: boolean;
  hasTimer?: boolean;
  timerDuration?: number; // in seconds
  resource?: {
    type: 'book' | 'video' | 'podcast' | 'article' | 'app';
    name: string;
    url: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: string;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  exercises: Exercise[];
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  description: string;
}

export interface BrainPuzzle {
  id: string;
  type: 'logic' | 'memory' | 'trivia' | 'math';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'quest' | 'achievement' | 'reminder' | 'recommendation';
  timestamp: Date;
  read: boolean;
}