import React, { useState } from 'react';
import { Quest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, CheckCircle, Dumbbell, Brain, BookOpen, Timer, ExternalLink, Play } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { ExerciseTimer } from './ExerciseTimer';

interface QuestCardProps {
  quest: Quest;
}

export function QuestCard({ quest }: QuestCardProps) {
  const { completeQuest } = useGame();
  const [showTimer, setShowTimer] = useState(false);

  const getCategoryIcon = () => {
    switch (quest.category) {
      case 'fitness': return <Dumbbell className="w-4 h-4" />;
      case 'mental': return <Brain className="w-4 h-4" />;
      case 'knowledge': return <BookOpen className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getCategoryColor = () => {
    switch (quest.category) {
      case 'fitness': return 'bg-red-900/20 border-red-500/30 text-red-200';
      case 'mental': return 'bg-purple-900/20 border-purple-500/30 text-purple-200';
      case 'knowledge': return 'bg-blue-900/20 border-blue-500/30 text-blue-200';
      default: return 'bg-gray-900/20 border-gray-500/30 text-gray-200';
    }
  };

  const getDifficultyColor = () => {
    switch (quest.difficulty) {
      case 'easy': return 'bg-green-600/20 text-green-200 border-green-500/30';
      case 'medium': return 'bg-yellow-600/20 text-yellow-200 border-yellow-500/30';
      case 'hard': return 'bg-red-600/20 text-red-200 border-red-500/30';
      default: return 'bg-gray-600/20 text-gray-200 border-gray-500/30';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'book': return '📚';
      case 'video': return '🎥';
      case 'podcast': return '🎧';
      case 'article': return '📄';
      case 'app': return '📱';
      default: return '🔗';
    }
  };

  const handleTimerComplete = () => {
    setShowTimer(false);
    completeQuest(quest.id);
  };

  const handleTimerCancel = () => {
    setShowTimer(false);
  };

  if (showTimer && quest.hasTimer && quest.timerDuration) {
    return (
      <ExerciseTimer
        exerciseName={quest.title}
        duration={quest.timerDuration}
        onComplete={handleTimerComplete}
        onCancel={handleTimerCancel}
      />
    );
  }

  return (
    <Card className={`transition-all duration-300 hover:scale-105 ${
      quest.completed 
        ? 'bg-green-900/20 border-green-500/50' 
        : getCategoryColor()
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon()}
            <CardTitle className="text-lg text-white">{quest.title}</CardTitle>
          </div>
          {quest.completed && <CheckCircle className="w-5 h-5 text-green-400" />}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className={getDifficultyColor()}>
            {quest.difficulty}
          </Badge>
          <Badge variant="secondary" className="bg-purple-600/20 text-purple-200 border-purple-500/30">
            {quest.category}
          </Badge>
          {quest.hasTimer && (
            <Badge variant="secondary" className="bg-orange-600/20 text-orange-200 border-orange-500/30">
              <Timer className="w-3 h-3 mr-1" />
              Timer
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300">{quest.description}</p>
        
        {/* Resource Link */}
        {quest.resource && (
          <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getResourceIcon(quest.resource.type)}</span>
                <div>
                  <div className="text-sm text-blue-300 font-semibold">
                    {quest.resource.type.charAt(0).toUpperCase() + quest.resource.type.slice(1)}
                  </div>
                  <div className="text-xs text-gray-400">{quest.resource.name}</div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(quest.resource!.url, '_blank')}
                className="border-blue-500/30 text-blue-200 hover:bg-blue-600/20"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Open
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{quest.timeEstimate}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>+{quest.xpReward} XP</span>
            </div>
          </div>
        </div>

        {!quest.completed && (
          <div className="flex gap-2">
            {quest.hasTimer ? (
              <Button 
                onClick={() => setShowTimer(true)}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Timer
              </Button>
            ) : (
              <Button 
                onClick={() => completeQuest(quest.id)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Complete Quest
              </Button>
            )}
          </div>
        )}
        
        {quest.completed && (
          <div className="text-center py-2">
            <span className="text-green-400 font-semibold">✓ Quest Completed</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}