import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Code, Clock, Trophy, Zap, ExternalLink, Timer, AlertCircle } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { toast } from '@/hooks/use-toast';

interface CodeforcesProblem {
  id: string;
  name: string;
  rating: number;
  tags: string[];
  timeLimit: number; // in minutes
  url: string;
  description: string;
}

const problemSets = [
  // Rating 800-900 (Beginner)
  {
    id: 'cf-1',
    name: 'Watermelon',
    rating: 800,
    tags: ['math', 'implementation'],
    timeLimit: 30,
    url: 'https://codeforces.com/problemset/problem/4/A',
    description: 'Pete and Billy are eating watermelon. Can they divide it into two even parts?'
  },
  {
    id: 'cf-2',
    name: 'Way Too Long Words',
    rating: 800,
    tags: ['strings', 'implementation'],
    timeLimit: 30,
    url: 'https://codeforces.com/problemset/problem/71/A',
    description: 'Sometimes some words like "localization" are so long that writing them is quite tiresome.'
  },
  {
    id: 'cf-3',
    name: 'Team',
    rating: 800,
    tags: ['greedy', 'implementation'],
    timeLimit: 30,
    url: 'https://codeforces.com/problemset/problem/231/A',
    description: 'One day three best friends decided to solve some problems on Codeforces.'
  },
  // Rating 900-1000 (Easy)
  {
    id: 'cf-4',
    name: 'Bit++',
    rating: 900,
    tags: ['implementation'],
    timeLimit: 25,
    url: 'https://codeforces.com/problemset/problem/282/A',
    description: 'The classic programming language of Bitland is Bit++.'
  },
  {
    id: 'cf-5',
    name: 'Domino piling',
    rating: 900,
    tags: ['math', 'greedy'],
    timeLimit: 25,
    url: 'https://codeforces.com/problemset/problem/50/A',
    description: 'You are given a rectangular board of M × N squares.'
  },
  // Rating 1000-1100 (Medium)
  {
    id: 'cf-6',
    name: 'Petya and Strings',
    rating: 1000,
    tags: ['strings', 'implementation'],
    timeLimit: 35,
    url: 'https://codeforces.com/problemset/problem/112/A',
    description: 'Little Petya loves to present flowers to his mother.'
  },
  {
    id: 'cf-7',
    name: 'Beautiful Matrix',
    rating: 1000,
    tags: ['implementation'],
    timeLimit: 35,
    url: 'https://codeforces.com/problemset/problem/263/A',
    description: 'You have a 5 × 5 matrix, consisting of 24 zeroes and a single number one.'
  },
  // Rating 1100-1200 (Hard)
  {
    id: 'cf-8',
    name: 'Helpful Maths',
    rating: 1100,
    tags: ['greedy', 'implementation', 'sortings', 'strings'],
    timeLimit: 40,
    url: 'https://codeforces.com/problemset/problem/339/A',
    description: 'Xenia the beginner mathematician is a third year student at elementary school.'
  },
  {
    id: 'cf-9',
    name: 'Word Capitalization',
    rating: 1100,
    tags: ['implementation', 'strings'],
    timeLimit: 40,
    url: 'https://codeforces.com/problemset/problem/281/A',
    description: 'Capitalization is writing a word with its first letter as a capital letter.'
  },
  // Rating 1200+ (Expert)
  {
    id: 'cf-10',
    name: 'Stones on the Table',
    rating: 1200,
    tags: ['greedy', 'implementation'],
    timeLimit: 45,
    url: 'https://codeforces.com/problemset/problem/266/A',
    description: 'There are n stones on the table in a row, each of them can be red, green or blue.'
  }
];

export function CodeforcesChallenges() {
  const { user } = useGame();
  const [currentProblem, setCurrentProblem] = useState<CodeforcesProblem | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());
  const [currentRating, setCurrentRating] = useState(800);

  // Calculate user's coding rating based on solved problems and user level
  useEffect(() => {
    const baseRating = 800;
    const levelBonus = user.level * 20;
    const solvedBonus = solvedProblems.size * 50;
    setCurrentRating(baseRating + levelBonus + solvedBonus);
  }, [user.level, solvedProblems.size]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            toast({
              title: "⏰ Time's Up!",
              description: "The time limit has been reached. You can still submit, but it won't count for the time bonus.",
              variant: "destructive"
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const getAvailableProblems = () => {
    return problemSets.filter(problem => 
      problem.rating <= currentRating + 200 && // Allow slightly harder problems
      !solvedProblems.has(problem.id)
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating < 900) return 'bg-gray-600/20 text-gray-200 border-gray-500/30';
    if (rating < 1000) return 'bg-green-600/20 text-green-200 border-green-500/30';
    if (rating < 1100) return 'bg-blue-600/20 text-blue-200 border-blue-500/30';
    if (rating < 1200) return 'bg-purple-600/20 text-purple-200 border-purple-500/30';
    return 'bg-red-600/20 text-red-200 border-red-500/30';
  };

  const startProblem = (problem: CodeforcesProblem) => {
    setCurrentProblem(problem);
    setTimeLeft(problem.timeLimit * 60); // Convert to seconds
    setIsTimerRunning(true);
    
    toast({
      title: "🚀 Challenge Started!",
      description: `You have ${problem.timeLimit} minutes to solve "${problem.name}". Good luck!`,
    });
  };

  const completeProblem = (success: boolean) => {
    if (!currentProblem) return;

    if (success) {
      setSolvedProblems(prev => new Set([...prev, currentProblem.id]));
      const timeBonus = timeLeft > 0 ? Math.floor(timeLeft / 60) * 10 : 0;
      const baseXP = Math.floor(currentProblem.rating / 10);
      const totalXP = baseXP + timeBonus;

      toast({
        title: "🎉 Problem Solved!",
        description: `+${totalXP} XP earned! ${timeBonus > 0 ? `Time bonus: +${timeBonus} XP` : ''}`,
      });
    }

    setCurrentProblem(null);
    setIsTimerRunning(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const availableProblems = getAvailableProblems();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Codeforces Arena</h2>
          <p className="text-gray-400">Competitive programming challenges with time constraints</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Your Rating</div>
          <Badge className={getRatingColor(currentRating)}>
            {currentRating}
          </Badge>
        </div>
      </div>

      {/* Current Challenge */}
      {currentProblem && (
        <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-400" />
                {currentProblem.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-orange-400" />
                <span className={`text-lg font-bold ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={getRatingColor(currentProblem.rating)}>
                {currentProblem.rating}
              </Badge>
              {currentProblem.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-blue-600/20 text-blue-200">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">{currentProblem.description}</p>
            
            <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/30">
              <div className="text-sm text-blue-200">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Time limit: {currentProblem.timeLimit} minutes | 
                Solve within time for bonus XP!
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => window.open(currentProblem.url, '_blank')}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Problem
              </Button>
              <Button 
                onClick={() => completeProblem(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Solved!
              </Button>
              <Button 
                onClick={() => completeProblem(false)}
                variant="outline"
                className="border-gray-500/30 text-gray-300 hover:bg-gray-600/20"
              >
                Give Up
              </Button>
            </div>

            <Progress 
              value={((currentProblem.timeLimit * 60 - timeLeft) / (currentProblem.timeLimit * 60)) * 100} 
              className="h-2 bg-blue-900/50"
            />
          </CardContent>
        </Card>
      )}

      {/* Available Problems */}
      {!currentProblem && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-300">Available Challenges</h3>
          
          {availableProblems.length === 0 ? (
            <Card className="bg-gradient-to-br from-gray-900/20 to-gray-800/20 border-gray-500/30">
              <CardContent className="text-center py-12">
                <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-lg text-white mb-2">No more problems available!</div>
                <div className="text-sm text-gray-400">
                  Solve more problems or level up to unlock harder challenges.
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableProblems.slice(0, 6).map(problem => (
                <Card key={problem.id} className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-white text-lg">{problem.name}</CardTitle>
                      <Badge className={getRatingColor(problem.rating)}>
                        {problem.rating}
                      </Badge>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {problem.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-blue-600/20 text-blue-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-300 text-sm line-clamp-2">{problem.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{problem.timeLimit}min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        <span>+{Math.floor(problem.rating / 10)} XP</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => startProblem(problem)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Start Challenge
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Statistics */}
      <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{solvedProblems.size}</div>
              <div className="text-sm text-gray-400">Problems Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{currentRating}</div>
              <div className="text-sm text-gray-400">Current Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{availableProblems.length}</div>
              <div className="text-sm text-gray-400">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{Math.floor(currentRating / 100)}</div>
              <div className="text-sm text-gray-400">Skill Level</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}