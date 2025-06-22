import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Trophy, Zap, RefreshCw, Sparkles } from 'lucide-react';
import { generateAIPuzzle, generateTriviaPuzzle, AIPuzzle } from '@/services/aiPuzzleService';
import { toast } from '@/hooks/use-toast';

export function BrainPuzzles() {
  const { incrementPuzzlesSolved } = useGame();
  const [currentPuzzle, setCurrentPuzzle] = useState<AIPuzzle | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completedPuzzles, setCompletedPuzzles] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-600/20 text-green-200 border-green-500/30';
      case 'medium': return 'bg-yellow-600/20 text-yellow-200 border-yellow-500/30';
      case 'hard': return 'bg-red-600/20 text-red-200 border-red-500/30';
      default: return 'bg-gray-600/20 text-gray-200 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'logic': return 'bg-purple-600/20 text-purple-200 border-purple-500/30';
      case 'math': return 'bg-blue-600/20 text-blue-200 border-blue-500/30';
      case 'riddle': return 'bg-green-600/20 text-green-200 border-green-500/30';
      case 'pattern': return 'bg-orange-600/20 text-orange-200 border-orange-500/30';
      default: return 'bg-gray-600/20 text-gray-200 border-gray-500/30';
    }
  };

  const loadNewPuzzle = async (useTrivia = false) => {
    setIsLoading(true);
    setShowAnswer(false);
    
    try {
      const puzzle = useTrivia ? await generateTriviaPuzzle() : await generateAIPuzzle();
      setCurrentPuzzle(puzzle);
      toast({
        title: "🧩 New Puzzle Generated!",
        description: `A ${puzzle.difficulty} ${puzzle.type} puzzle is ready for you.`,
      });
    } catch (error) {
      console.error('Error loading puzzle:', error);
      toast({
        title: "Error",
        description: "Failed to generate new puzzle. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const completePuzzle = () => {
    if (!currentPuzzle) return;
    
    const puzzleId = `${currentPuzzle.type}-${Date.now()}`;
    setCompletedPuzzles(prev => new Set([...prev, puzzleId]));
    incrementPuzzlesSolved();
    
    toast({
      title: "🎉 Puzzle Completed!",
      description: `+${currentPuzzle.xpReward} XP earned!`,
    });
    
    setShowAnswer(false);
    // Auto-generate next puzzle
    setTimeout(() => loadNewPuzzle(), 1000);
  };

  // Load initial puzzle
  useEffect(() => {
    loadNewPuzzle();
  }, []);

  if (!currentPuzzle) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Brain Training</h2>
          <p className="text-gray-400">AI-powered puzzles to sharpen your mind</p>
        </div>
        
        <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/30">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <div className="text-lg text-white mb-4">Loading your first puzzle...</div>
              <Button 
                onClick={() => loadNewPuzzle()}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate Puzzle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Brain Training</h2>
          <p className="text-gray-400">AI-powered puzzles to sharpen your mind</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => loadNewPuzzle(false)}
            disabled={isLoading}
            variant="outline"
            className="border-purple-500/30 text-purple-200 hover:bg-purple-600/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Puzzle
          </Button>
          <Button 
            onClick={() => loadNewPuzzle(true)}
            disabled={isLoading}
            variant="outline"
            className="border-blue-500/30 text-blue-200 hover:bg-blue-600/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Trivia
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-purple-400" />
              <CardTitle className="text-white">
                {isLoading ? 'Generating Puzzle...' : 'Current Challenge'}
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge className={getDifficultyColor(currentPuzzle.difficulty)}>
                {currentPuzzle.difficulty}
              </Badge>
              <Badge className={getTypeColor(currentPuzzle.type)}>
                {currentPuzzle.type}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Zap className="w-4 h-4" />
            <span>+{currentPuzzle.xpReward} XP</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          ) : (
            <>
              <div className="text-lg text-white leading-relaxed whitespace-pre-line">
                {currentPuzzle.question}
              </div>

              {showAnswer && (
                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                  <div className="text-sm text-purple-300 mb-2">Answer:</div>
                  <div className="text-white mb-3">{currentPuzzle.answer}</div>
                  {currentPuzzle.explanation && (
                    <div className="text-sm text-blue-500">
                      <strong>Explanation:</strong> {currentPuzzle.explanation}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                {!showAnswer ? (
                  <Button 
                    onClick={() => setShowAnswer(true)}
                    variant="outline"
                    className="border-purple-500/30 text-purple-200 hover:bg-purple-600/20"
                  >
                    Show Answer
                  </Button>
                ) : (
                  <Button 
                    onClick={completePuzzle}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Complete Puzzle
                  </Button>
                )}
                
                <Button 
                  onClick={() => loadNewPuzzle()}
                  disabled={isLoading}
                  variant="outline"
                  className="border-gray-500/30 text-gray-300 hover:bg-gray-600/20"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Puzzle
                </Button>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Puzzles completed today: {completedPuzzles.size}</span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Generated
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}