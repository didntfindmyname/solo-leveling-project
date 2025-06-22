import { Achievement, User, Quest } from '@/types';

export const achievementTemplates: Omit<Achievement, 'progress' | 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first_quest',
    title: 'First Steps',
    description: 'Complete your first quest',
    icon: '🎯',
    rarity: 'common',
    maxProgress: 1,
    category: 'general'
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day quest completion streak',
    icon: '🔥',
    rarity: 'rare',
    maxProgress: 7,
    category: 'streak'
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day quest completion streak',
    icon: '👑',
    rarity: 'epic',
    maxProgress: 30,
    category: 'streak'
  },
  {
    id: 'fitness_100',
    title: 'Iron Body',
    description: 'Complete 100 fitness quests',
    icon: '💪',
    rarity: 'epic',
    maxProgress: 100,
    category: 'fitness'
  },
  {
    id: 'mental_100',
    title: 'Mind Palace',
    description: 'Complete 100 mental quests',
    icon: '🧠',
    rarity: 'epic',
    maxProgress: 100,
    category: 'mental'
  },
  {
    id: 'knowledge_100',
    title: 'Scholar Supreme',
    description: 'Complete 100 knowledge quests',
    icon: '📚',
    rarity: 'epic',
    maxProgress: 100,
    category: 'knowledge'
  },
  {
    id: 'puzzles_100',
    title: 'Puzzle Master',
    description: 'Solve 100 brain puzzles',
    icon: '🧩',
    rarity: 'epic',
    maxProgress: 100,
    category: 'puzzles'
  },
  {
    id: 'level_10',
    title: 'Rising Hunter',
    description: 'Reach level 10',
    icon: '⭐',
    rarity: 'rare',
    maxProgress: 10,
    category: 'level'
  },
  {
    id: 'level_25',
    title: 'Elite Hunter',
    description: 'Reach level 25',
    icon: '🌟',
    rarity: 'epic',
    maxProgress: 25,
    category: 'level'
  },
  {
    id: 'level_50',
    title: 'S-Rank Legend',
    description: 'Reach level 50',
    icon: '💎',
    rarity: 'legendary',
    maxProgress: 50,
    category: 'level'
  },
  {
    id: 'custom_creator',
    title: 'Quest Architect',
    description: 'Create 10 custom quests',
    icon: '🏗️',
    rarity: 'rare',
    maxProgress: 10,
    category: 'custom'
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete all daily quests for 7 consecutive days',
    icon: '✨',
    rarity: 'epic',
    maxProgress: 7,
    category: 'perfect'
  }
];

export function initializeAchievements(): Achievement[] {
  return achievementTemplates.map(template => ({
    ...template,
    progress: 0,
    unlocked: false
  }));
}

export function checkAchievements(
  user: User, 
  completedQuests: Quest[], 
  puzzlesSolved: number,
  customQuestsCreated: number
): Achievement[] {
  const achievements = [...user.achievements];
  const newUnlocks: Achievement[] = [];

  // Helper function to update achievement progress
  const updateAchievement = (id: string, progress: number) => {
    const achievement = achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
      achievement.progress = Math.min(progress, achievement.maxProgress);
      if (achievement.progress >= achievement.maxProgress) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        newUnlocks.push(achievement);
      }
    }
  };

  // First quest
  if (completedQuests.length > 0) {
    updateAchievement('first_quest', 1);
  }

  // Streak achievements
  updateAchievement('streak_7', user.streaks.overall);
  updateAchievement('streak_30', user.streaks.overall);

  // Category-specific achievements
  const fitnessQuests = completedQuests.filter(q => q.category === 'fitness').length;
  const mentalQuests = completedQuests.filter(q => q.category === 'mental').length;
  const knowledgeQuests = completedQuests.filter(q => q.category === 'knowledge').length;

  updateAchievement('fitness_100', fitnessQuests);
  updateAchievement('mental_100', mentalQuests);
  updateAchievement('knowledge_100', knowledgeQuests);

  // Puzzle achievements
  updateAchievement('puzzles_100', puzzlesSolved);

  // Level achievements
  updateAchievement('level_10', user.level);
  updateAchievement('level_25', user.level);
  updateAchievement('level_50', user.level);

  // Custom quest achievements
  updateAchievement('custom_creator', customQuestsCreated);

  // Perfectionist achievement (check if all daily quests completed for 7 days)
  // This would need more complex tracking in a real implementation

  return achievements;
}