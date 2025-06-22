import { Quest, User } from '@/types';

interface TaskTemplate {
  title: string;
  description: string;
  category: 'fitness' | 'mental' | 'knowledge';
  baseXP: number;
  timeEstimate: number;
  scalingFactor: number;
}

const taskTemplates: TaskTemplate[] = [
  // Fitness tasks
  {
    title: "Push-up Challenge",
    description: "Complete {amount} push-ups",
    category: 'fitness',
    baseXP: 40,
    timeEstimate: 8,
    scalingFactor: 1.2
  },
  {
    title: "Squat Power",
    description: "Perform {amount} squats",
    category: 'fitness',
    baseXP: 35,
    timeEstimate: 6,
    scalingFactor: 1.15
  },
  {
    title: "Plank Endurance",
    description: "Hold a plank for {amount} seconds",
    category: 'fitness',
    baseXP: 45,
    timeEstimate: 5,
    scalingFactor: 1.3
  },
  {
    title: "Cardio Burst",
    description: "Complete {amount} minutes of cardio",
    category: 'fitness',
    baseXP: 60,
    timeEstimate: 15,
    scalingFactor: 1.1
  },
  {
    title: "Step Counter",
    description: "Walk {amount} steps today",
    category: 'fitness',
    baseXP: 50,
    timeEstimate: 45,
    scalingFactor: 1.05
  },

  // Mental tasks
  {
    title: "Meditation Session",
    description: "Meditate for {amount} minutes",
    category: 'mental',
    baseXP: 40,
    timeEstimate: 10,
    scalingFactor: 1.2
  },
  {
    title: "Mindfulness Practice",
    description: "Practice mindfulness for {amount} minutes",
    category: 'mental',
    baseXP: 35,
    timeEstimate: 8,
    scalingFactor: 1.15
  },
  {
    title: "Breathing Exercise",
    description: "Complete {amount} deep breathing cycles",
    category: 'mental',
    baseXP: 30,
    timeEstimate: 5,
    scalingFactor: 1.1
  },
  {
    title: "Gratitude Journal",
    description: "Write {amount} things you're grateful for",
    category: 'mental',
    baseXP: 25,
    timeEstimate: 10,
    scalingFactor: 1.3
  },
  {
    title: "Mental Math",
    description: "Solve {amount} mental math problems",
    category: 'mental',
    baseXP: 45,
    timeEstimate: 12,
    scalingFactor: 1.25
  },

  // Knowledge tasks
  {
    title: "Reading Session",
    description: "Read {amount} pages of a book",
    category: 'knowledge',
    baseXP: 50,
    timeEstimate: 20,
    scalingFactor: 1.1
  },
  {
    title: "Code Practice",
    description: "Solve {amount} coding problems",
    category: 'knowledge',
    baseXP: 70,
    timeEstimate: 30,
    scalingFactor: 1.4
  },
  {
    title: "Language Learning",
    description: "Study a new language for {amount} minutes",
    category: 'knowledge',
    baseXP: 45,
    timeEstimate: 15,
    scalingFactor: 1.2
  },
  {
    title: "Article Research",
    description: "Read {amount} educational articles",
    category: 'knowledge',
    baseXP: 40,
    timeEstimate: 25,
    scalingFactor: 1.15
  },
  {
    title: "Skill Practice",
    description: "Practice a new skill for {amount} minutes",
    category: 'knowledge',
    baseXP: 55,
    timeEstimate: 20,
    scalingFactor: 1.25
  }
];

export function generateAIRecommendation(
  user: User, 
  completedQuest: Quest, 
  completedQuests: Quest[]
): Quest {
  // Find similar tasks in the same category
  const categoryQuests = completedQuests.filter(q => q.category === completedQuest.category);
  const categoryTemplates = taskTemplates.filter(t => t.category === completedQuest.category);
  
  // Select a random template from the same category
  const template = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
  
  // Calculate difficulty scaling based on user progress
  const categoryCompletions = categoryQuests.length;
  const difficultyMultiplier = Math.pow(template.scalingFactor, categoryCompletions);
  
  // Generate scaled amounts based on task type
  let amount: number;
  switch (template.title) {
    case "Push-up Challenge":
      amount = Math.max(10, Math.floor(15 * difficultyMultiplier));
      break;
    case "Squat Power":
      amount = Math.max(15, Math.floor(20 * difficultyMultiplier));
      break;
    case "Plank Endurance":
      amount = Math.max(30, Math.floor(45 * difficultyMultiplier));
      break;
    case "Cardio Burst":
      amount = Math.max(10, Math.floor(15 * difficultyMultiplier));
      break;
    case "Step Counter":
      amount = Math.max(5000, Math.floor(7000 * difficultyMultiplier));
      break;
    case "Meditation Session":
      amount = Math.max(5, Math.floor(10 * difficultyMultiplier));
      break;
    case "Mindfulness Practice":
      amount = Math.max(5, Math.floor(8 * difficultyMultiplier));
      break;
    case "Breathing Exercise":
      amount = Math.max(10, Math.floor(15 * difficultyMultiplier));
      break;
    case "Gratitude Journal":
      amount = Math.max(3, Math.floor(5 * difficultyMultiplier));
      break;
    case "Mental Math":
      amount = Math.max(5, Math.floor(10 * difficultyMultiplier));
      break;
    case "Reading Session":
      amount = Math.max(10, Math.floor(15 * difficultyMultiplier));
      break;
    case "Code Practice":
      amount = Math.max(1, Math.floor(2 * difficultyMultiplier));
      break;
    case "Language Learning":
      amount = Math.max(10, Math.floor(15 * difficultyMultiplier));
      break;
    case "Article Research":
      amount = Math.max(2, Math.floor(3 * difficultyMultiplier));
      break;
    case "Skill Practice":
      amount = Math.max(15, Math.floor(20 * difficultyMultiplier));
      break;
    default:
      amount = Math.max(1, Math.floor(difficultyMultiplier));
  }

  // Determine difficulty based on scaling
  let difficulty: 'easy' | 'medium' | 'hard';
  if (difficultyMultiplier < 1.5) difficulty = 'easy';
  else if (difficultyMultiplier < 2.5) difficulty = 'medium';
  else difficulty = 'hard';

  // Calculate XP reward
  const xpReward = Math.floor(template.baseXP * difficultyMultiplier);

  return {
    id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: template.title,
    description: template.description.replace('{amount}', amount.toString()),
    category: template.category,
    difficulty,
    xpReward,
    completed: false,
    timeEstimate: Math.floor(template.timeEstimate * difficultyMultiplier),
    aiGenerated: true
  };
}