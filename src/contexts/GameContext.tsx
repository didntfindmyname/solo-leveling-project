import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Quest, Achievement, Notification } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateDailyQuests } from '@/utils/questGenerator';
import { calculateLevel, calculateXPForLevel } from '@/utils/levelSystem';
import { initializeAchievements, checkAchievements } from '@/utils/achievementSystem';
import { generateAIRecommendation } from '@/utils/aiTaskRecommender';
import { toast } from '@/hooks/use-toast';

interface GameContextType {
  user: User;
  quests: Quest[];
  notifications: Notification[];
  achievements: Achievement[];
  aiRecommendation: Quest | null;
  puzzlesSolved: number;
  customQuestsCreated: number;
  completeQuest: (questId: string) => void;
  addCustomQuest: (quest: Omit<Quest, 'id' | 'completed'>) => void;
  acceptAIRecommendation: () => void;
  dismissAIRecommendation: () => void;
  clearNotifications: () => void;
  updateUser: (updates: Partial<User>) => void;
  incrementPuzzlesSolved: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialUser: User = {
  id: '1',
  name: 'Shadow Beginner',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  title: 'E-Rank Hunter',
  stats: {
    strength: 10,
    intelligence: 10,
    endurance: 10,
    discipline: 10,
  },
  achievements: [],
  totalXP: 0,
  streaks: {
    fitness: 0,
    mental: 0,
    knowledge: 0,
    overall: 0,
  },
  preferences: {
    difficulty: 'medium',
    categories: ['fitness', 'mental', 'knowledge'],
    voiceEnabled: false,
  },
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User>('user', initialUser);
  const [quests, setQuests] = useLocalStorage<Quest[]>('quests', []);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', []);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('achievements', []);
  const [aiRecommendation, setAIRecommendation] = useState<Quest | null>(null);
  const [puzzlesSolved, setPuzzlesSolved] = useLocalStorage<number>('puzzlesSolved', 0);
  const [customQuestsCreated, setCustomQuestsCreated] = useLocalStorage<number>('customQuestsCreated', 0);

  // Initialize achievements if empty
  useEffect(() => {
    if (achievements.length === 0) {
      setAchievements(initializeAchievements());
    }
  }, []);

  // Generate daily quests if none exist
  useEffect(() => {
    const today = new Date().toDateString();
    const lastQuestDate = localStorage.getItem('lastQuestDate');
    
    if (lastQuestDate !== today || quests.length === 0) {
      const dailyQuests = generateDailyQuests();
      setQuests(dailyQuests);
      localStorage.setItem('lastQuestDate', today);
    }
  }, []);

  const completeQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    setQuests(currentQuests => 
      currentQuests.map(q => {
        if (q.id === questId) {
          const updatedQuest = { 
            ...q, 
            completed: true, 
            completedAt: new Date() 
          };
          
          // Award XP and update user
          const newTotalXP = user.totalXP + q.xpReward;
          const newLevel = calculateLevel(newTotalXP);
          const leveledUp = newLevel > user.level;
          
          setUser(currentUser => ({
            ...currentUser,
            xp: newTotalXP % calculateXPForLevel(newLevel),
            level: newLevel,
            xpToNextLevel: calculateXPForLevel(newLevel + 1) - newTotalXP,
            totalXP: newTotalXP,
            stats: {
              ...currentUser.stats,
              [q.category === 'fitness' ? 'strength' : 
               q.category === 'mental' ? 'intelligence' : 'discipline']: 
               currentUser.stats[q.category === 'fitness' ? 'strength' : 
                                q.category === 'mental' ? 'intelligence' : 'discipline'] + 1
            }
          }));

          // Check for achievements
          const completedQuests = currentQuests.filter(quest => quest.completed);
          const updatedAchievements = checkAchievements(user, [...completedQuests, updatedQuest], puzzlesSolved, customQuestsCreated);
          
          // Find newly unlocked achievements
          const newlyUnlocked = updatedAchievements.filter(a => 
            a.unlocked && !achievements.find(existing => existing.id === a.id && existing.unlocked)
          );

          if (newlyUnlocked.length > 0) {
            setAchievements(updatedAchievements);
            newlyUnlocked.forEach(achievement => {
              toast({
                title: "🏆 Achievement Unlocked!",
                description: `${achievement.title}: ${achievement.description}`,
              });
            });
          }

          // Show completion toast
          toast({
            title: "Quest Completed!",
            description: `+${q.xpReward} XP earned`,
          });

          // Level up notification
          if (leveledUp) {
            toast({
              title: "🎉 LEVEL UP!",
              description: `You are now level ${newLevel}!`,
            });
          }

          // Generate AI recommendation
          const completedQuestsList = currentQuests.filter(quest => quest.completed);
          const recommendation = generateAIRecommendation(user, updatedQuest, completedQuestsList);
          setAIRecommendation(recommendation);
          
          return updatedQuest;
        }
        return q;
      })
    );
  };

  const addCustomQuest = (questData: Omit<Quest, 'id' | 'completed'>) => {
    const newQuest: Quest = {
      ...questData,
      id: Date.now().toString(),
      completed: false,
    };
    setQuests(current => [...current, newQuest]);
    setCustomQuestsCreated(prev => prev + 1);
    
    toast({
      title: "Custom Quest Created!",
      description: `"${questData.title}" has been added to your quest board.`,
    });
  };

  const acceptAIRecommendation = () => {
    if (aiRecommendation) {
      addCustomQuest(aiRecommendation);
      setAIRecommendation(null);
    }
  };

  const dismissAIRecommendation = () => {
    setAIRecommendation(null);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(current => ({ ...current, ...updates }));
  };

  const incrementPuzzlesSolved = () => {
    setPuzzlesSolved(prev => prev + 1);
  };

  return (
    <GameContext.Provider value={{
      user,
      quests,
      notifications,
      achievements,
      aiRecommendation,
      puzzlesSolved,
      customQuestsCreated,
      completeQuest,
      addCustomQuest,
      acceptAIRecommendation,
      dismissAIRecommendation,
      clearNotifications,
      updateUser,
      incrementPuzzlesSolved,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}