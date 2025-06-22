export interface AIPuzzle {
  question: string;
  answer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'logic' | 'math' | 'riddle' | 'pattern';
  xpReward: number;
}

// Fallback puzzles in case API fails
const fallbackPuzzles: AIPuzzle[] = [
  {
    question: "I am thinking of a number between 1 and 100. It's divisible by 3, 5, and 7. What's the smallest such number?",
    answer: "105",
    explanation: "The smallest number divisible by 3, 5, and 7 is their LCM: 3×5×7 = 105",
    difficulty: 'medium',
    type: 'math',
    xpReward: 60
  },
  {
    question: "What comes next in the sequence: 1, 1, 2, 3, 5, 8, 13, ?",
    answer: "21",
    explanation: "This is the Fibonacci sequence where each number is the sum of the two preceding ones: 8 + 13 = 21",
    difficulty: 'easy',
    type: 'pattern',
    xpReward: 40
  },
  {
    question: "A man lives on the 20th floor of an apartment building. Every morning he takes the elevator down to the ground floor. When he comes home, he takes the elevator to the 10th floor and walks the rest of the way... except on rainy days, when he takes the elevator all the way to the 20th floor. Why?",
    answer: "He's too short to reach the button for the 20th floor, except when he has an umbrella",
    explanation: "The man is short and can only reach the button for the 10th floor. On rainy days, he has an umbrella which allows him to reach the 20th floor button.",
    difficulty: 'hard',
    type: 'logic',
    xpReward: 100
  },
  {
    question: "If 5 cats can catch 5 mice in 5 minutes, how many cats are needed to catch 100 mice in 100 minutes?",
    answer: "5",
    explanation: "Each cat catches 1 mouse in 5 minutes. In 100 minutes, each cat can catch 20 mice. So 5 cats can catch 100 mice in 100 minutes.",
    difficulty: 'medium',
    type: 'logic',
    xpReward: 70
  },
  {
    question: "What is the next number in this sequence: 2, 6, 12, 20, 30, ?",
    answer: "42",
    explanation: "The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42",
    difficulty: 'medium',
    type: 'pattern',
    xpReward: 60
  }
];

// Simple puzzle generator using mathematical patterns and logic
function generateMathPuzzle(): AIPuzzle {
  const patterns = [
    {
      type: 'arithmetic_sequence',
      generate: () => {
        const start = Math.floor(Math.random() * 10) + 1;
        const diff = Math.floor(Math.random() * 5) + 2;
        const sequence = [start, start + diff, start + 2*diff, start + 3*diff, start + 4*diff];
        const next = start + 5*diff;
        return {
          question: `What is the next number in this arithmetic sequence: ${sequence.join(', ')}, ?`,
          answer: next.toString(),
          explanation: `This is an arithmetic sequence with a common difference of ${diff}. Next: ${start + 4*diff} + ${diff} = ${next}`,
          difficulty: 'easy' as const,
          type: 'pattern' as const,
          xpReward: 40
        };
      }
    },
    {
      type: 'geometric_sequence',
      generate: () => {
        const start = Math.floor(Math.random() * 5) + 2;
        const ratio = Math.floor(Math.random() * 3) + 2;
        const sequence = [start, start * ratio, start * ratio * ratio, start * ratio * ratio * ratio];
        const next = start * Math.pow(ratio, 4);
        return {
          question: `What is the next number in this geometric sequence: ${sequence.join(', ')}, ?`,
          answer: next.toString(),
          explanation: `This is a geometric sequence with a common ratio of ${ratio}. Next: ${sequence[3]} × ${ratio} = ${next}`,
          difficulty: 'medium' as const,
          type: 'pattern' as const,
          xpReward: 60
        };
      }
    },
    {
      type: 'square_sequence',
      generate: () => {
        const squares = [1, 4, 9, 16, 25, 36];
        const startIndex = Math.floor(Math.random() * 3);
        const sequence = squares.slice(startIndex, startIndex + 4);
        const next = squares[startIndex + 4];
        return {
          question: `What is the next number in this sequence: ${sequence.join(', ')}, ?`,
          answer: next.toString(),
          explanation: `This sequence consists of perfect squares: ${sequence.map((n, i) => `${startIndex + i + 1}² = ${n}`).join(', ')}, ${startIndex + 5}² = ${next}`,
          difficulty: 'medium' as const,
          type: 'pattern' as const,
          xpReward: 70
        };
      }
    }
  ];

  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  return pattern.generate();
}

function generateLogicPuzzle(): AIPuzzle {
  const puzzles = [
    {
      question: "In a race, you overtake the person in 2nd place. What position are you in now?",
      answer: "2nd place",
      explanation: "If you overtake the person in 2nd place, you take their position, which is 2nd place.",
      difficulty: 'easy' as const,
      type: 'logic' as const,
      xpReward: 50
    },
    {
      question: "A farmer has 17 sheep. All but 9 die. How many sheep are left?",
      answer: "9",
      explanation: "'All but 9 die' means 9 sheep survive. So 9 sheep are left.",
      difficulty: 'easy' as const,
      type: 'logic' as const,
      xpReward: 40
    },
    {
      question: "You have a 3-gallon jug and a 5-gallon jug. How can you measure exactly 4 gallons?",
      answer: "Fill 5-gallon, pour into 3-gallon, empty 3-gallon, pour remaining 2 gallons into 3-gallon, fill 5-gallon again, pour into 3-gallon until full (1 gallon), leaving 4 gallons",
      explanation: "Step by step: Fill 5→3 (2 left in 5), empty 3, pour 2 into 3, fill 5, pour 1 from 5 to 3 (4 left in 5)",
      difficulty: 'hard' as const,
      type: 'logic' as const,
      xpReward: 100
    }
  ];

  return puzzles[Math.floor(Math.random() * puzzles.length)];
}

function generateRiddle(): AIPuzzle {
  const riddles = [
    {
      question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
      answer: "A map",
      explanation: "A map shows cities, mountains, and water bodies, but doesn't contain the actual physical objects.",
      difficulty: 'medium' as const,
      type: 'riddle' as const,
      xpReward: 60
    },
    {
      question: "The more you take, the more you leave behind. What am I?",
      answer: "Footsteps",
      explanation: "The more steps you take, the more footprints you leave behind.",
      difficulty: 'easy' as const,
      type: 'riddle' as const,
      xpReward: 40
    },
    {
      question: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?",
      answer: "Fire",
      explanation: "Fire grows when it spreads, needs oxygen (air) to survive, and is extinguished by water.",
      difficulty: 'medium' as const,
      type: 'riddle' as const,
      xpReward: 70
    }
  ];

  return riddles[Math.floor(Math.random() * riddles.length)];
}

export async function generateAIPuzzle(): Promise<AIPuzzle> {
  try {
    // Try to use a free API service for puzzle generation
    // Using a simple approach with local generation for now
    
    const puzzleTypes = ['math', 'logic', 'riddle'];
    const selectedType = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];
    
    let puzzle: AIPuzzle;
    
    switch (selectedType) {
      case 'math':
        puzzle = generateMathPuzzle();
        break;
      case 'logic':
        puzzle = generateLogicPuzzle();
        break;
      case 'riddle':
        puzzle = generateRiddle();
        break;
      default:
        puzzle = fallbackPuzzles[Math.floor(Math.random() * fallbackPuzzles.length)];
    }
    
    return puzzle;
  } catch (error) {
    console.error('Error generating AI puzzle:', error);
    // Return a random fallback puzzle
    return fallbackPuzzles[Math.floor(Math.random() * fallbackPuzzles.length)];
  }
}

// Alternative: Use a free trivia API
export async function generateTriviaPuzzle(): Promise<AIPuzzle> {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple&difficulty=medium');
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const trivia = data.results[0];
      const allAnswers = [...trivia.incorrect_answers, trivia.correct_answer].sort(() => Math.random() - 0.5);
      
      return {
        question: `${decodeHTMLEntities(trivia.question)}\n\nOptions: ${allAnswers.map((ans, i) => `${String.fromCharCode(65 + i)}) ${decodeHTMLEntities(ans)}`).join('\n')}`,
        answer: decodeHTMLEntities(trivia.correct_answer),
        explanation: `The correct answer is: ${decodeHTMLEntities(trivia.correct_answer)}`,
        difficulty: trivia.difficulty as 'easy' | 'medium' | 'hard',
        type: 'riddle',
        xpReward: trivia.difficulty === 'easy' ? 40 : trivia.difficulty === 'medium' ? 60 : 80
      };
    }
  } catch (error) {
    console.error('Error fetching trivia:', error);
  }
  
  // Fallback to local puzzle
  return fallbackPuzzles[Math.floor(Math.random() * fallbackPuzzles.length)];
}

function decodeHTMLEntities(text: string): string {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}