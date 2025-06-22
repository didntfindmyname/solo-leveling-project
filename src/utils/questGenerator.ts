import { Quest } from '@/types';

const fitnessQuests = [
  { title: "Push-up Power", description: "Complete 25 push-ups", xpReward: 50, timeEstimate: 10 },
  { title: "Plank Master", description: "Hold a plank for 2 minutes", xpReward: 40, timeEstimate: 5, hasTimer: true, timerDuration: 120 },
  { title: "Wall Sit Challenge", description: "Hold a wall sit for 90 seconds", xpReward: 45, timeEstimate: 5, hasTimer: true, timerDuration: 90 },
  { title: "Cardio Burst", description: "15-minute cardio workout", xpReward: 75, timeEstimate: 15, hasTimer: true, timerDuration: 900 },
  { title: "Shadow Steps", description: "Take 8,000 steps today", xpReward: 60, timeEstimate: 60 },
  { title: "Flexibility Flow", description: "10-minute stretching session", xpReward: 35, timeEstimate: 10, hasTimer: true, timerDuration: 600 },
  { title: "Mountain Climber Madness", description: "Do mountain climbers for 60 seconds", xpReward: 40, timeEstimate: 3, hasTimer: true, timerDuration: 60 },
  { title: "Squat Challenge", description: "Complete 50 squats", xpReward: 45, timeEstimate: 8 },
];

const mentalQuests = [
  { title: "Mindful Moment", description: "Meditate for 10 minutes", xpReward: 45, timeEstimate: 10, hasTimer: true, timerDuration: 600 },
  { title: "Brain Training", description: "Solve 3 logic puzzles", xpReward: 55, timeEstimate: 15 },
  { title: "Memory Palace", description: "Practice memorizing 10 items", xpReward: 40, timeEstimate: 12 },
  { title: "Focus Flow", description: "25-minute focused work session (Pomodoro)", xpReward: 70, timeEstimate: 25, hasTimer: true, timerDuration: 1500 },
  { title: "Gratitude Journal", description: "Write 3 things you're grateful for", xpReward: 30, timeEstimate: 8 },
  { title: "Deep Breathing", description: "Practice deep breathing for 5 minutes", xpReward: 25, timeEstimate: 5, hasTimer: true, timerDuration: 300 },
];

const knowledgeQuests = [
  { 
    title: "Scholar's Page", 
    description: "Read 15 pages of 'Atomic Habits' by James Clear", 
    xpReward: 50, 
    timeEstimate: 20,
    resource: {
      type: 'book',
      name: 'Atomic Habits by James Clear',
      url: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/1847941834'
    }
  },
  { 
    title: "Code Warrior", 
    description: "Watch 'Clean Code' tutorial by Uncle Bob", 
    xpReward: 80, 
    timeEstimate: 30,
    resource: {
      type: 'video',
      name: 'Clean Code - Uncle Bob / Lesson 1',
      url: 'https://www.youtube.com/watch?v=7EmboKQH8lM'
    }
  },
  { 
    title: "Language Mastery", 
    description: "Complete a 15-minute Duolingo lesson", 
    xpReward: 45, 
    timeEstimate: 15,
    resource: {
      type: 'app',
      name: 'Duolingo',
      url: 'https://www.duolingo.com'
    }
  },
  { 
    title: "Tech Insights", 
    description: "Read 'The Pragmatic Programmer' - Chapter 1", 
    xpReward: 60, 
    timeEstimate: 25,
    resource: {
      type: 'book',
      name: 'The Pragmatic Programmer by David Thomas',
      url: 'https://www.amazon.com/Pragmatic-Programmer-journey-mastery-Anniversary/dp/0135957052'
    }
  },
  { 
    title: "Podcast Learning", 
    description: "Listen to 'Syntax.fm' latest episode", 
    xpReward: 40, 
    timeEstimate: 45,
    resource: {
      type: 'podcast',
      name: 'Syntax - Tasty Web Development Treats',
      url: 'https://syntax.fm'
    }
  },
  { 
    title: "Algorithm Study", 
    description: "Watch 'Big O Notation' explanation by CS Dojo", 
    xpReward: 70, 
    timeEstimate: 20,
    resource: {
      type: 'video',
      name: 'Introduction to Big O Notation and Time Complexity',
      url: 'https://www.youtube.com/watch?v=D6xkbGLQesk'
    }
  },
  { 
    title: "Design Patterns", 
    description: "Read about Singleton Pattern on Refactoring Guru", 
    xpReward: 55, 
    timeEstimate: 15,
    resource: {
      type: 'article',
      name: 'Singleton Pattern - Refactoring Guru',
      url: 'https://refactoring.guru/design-patterns/singleton'
    }
  },
  { 
    title: "System Design", 
    description: "Watch 'System Design Interview' by Gaurav Sen", 
    xpReward: 90, 
    timeEstimate: 35,
    resource: {
      type: 'video',
      name: 'System Design Interview Question: DESIGN A PARKING LOT',
      url: 'https://www.youtube.com/watch?v=DSGsa0pu8-k'
    }
  }
];

export function generateDailyQuests(): Quest[] {
  const allQuests = [
    ...fitnessQuests.map(q => ({ ...q, category: 'fitness' as const })),
    ...mentalQuests.map(q => ({ ...q, category: 'mental' as const })),
    ...knowledgeQuests.map(q => ({ ...q, category: 'knowledge' as const })),
  ];

  // Select 2 from each category for daily quests
  const categories: Array<'fitness' | 'mental' | 'knowledge'> = ['fitness', 'mental', 'knowledge'];
  const dailyQuests: Quest[] = [];

  categories.forEach(category => {
    const categoryQuests = allQuests.filter(q => q.category === category);
    const shuffled = categoryQuests.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 2);
    
    selected.forEach((quest, index) => {
      dailyQuests.push({
        id: `${category}-${index}-${Date.now()}`,
        ...quest,
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard',
        completed: false,
      });
    });
  });

  return dailyQuests;
}