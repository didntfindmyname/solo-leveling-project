import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Quest } from '@/types';
import { Sparkles, Clock, Zap, Plus } from 'lucide-react';

interface AIRecommendationCardProps {
  quest: Quest;
  onAccept: () => void;
  onDismiss: () => void;
}

export function AIRecommendationCard({ quest, onAccept, onDismiss }: AIRecommendationCardProps) {
  const getDifficultyColor = () => {
    switch (quest.difficulty) {
      case 'easy': return 'bg-green-600/20 text-green-200 border-green-500/30';
      case 'medium': return 'bg-yellow-600/20 text-yellow-200 border-yellow-500/30';
      case 'hard': return 'bg-red-600/20 text-red-200 border-red-500/30';
      default: return 'bg-gray-600/20 text-gray-200 border-gray-500/30';
    }
  };

  const getCategoryColor = () => {
    switch (quest.category) {
      case 'fitness': return 'bg-red-900/20 border-red-500/30';
      case 'mental': return 'bg-purple-900/20 border-purple-500/30';
      case 'knowledge': return 'bg-blue-900/20 border-blue-500/30';
      default: return 'bg-gray-900/20 border-gray-500/30';
    }
  };

  return (
    <Card className={`${getCategoryColor()} border-2 border-dashed animate-pulse`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <CardTitle className="text-lg text-white">AI Recommendation</CardTitle>
          </div>
          <Badge className={getDifficultyColor()}>
            {quest.difficulty}
          </Badge>
        </div>
        <div className="text-xl font-bold text-white">{quest.title}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300">{quest.description}</p>
        
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

        <div className="bg-yellow-900/20 p-3 rounded-lg border border-yellow-500/30">
          <div className="text-sm text-yellow-200">
            <Sparkles className="w-4 h-4 inline mr-1" />
            This quest was generated based on your recent progress in {quest.category} activities!
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={onAccept}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Accept Quest
          </Button>
          <Button 
            onClick={onDismiss}
            variant="outline"
            className="border-gray-500/30 text-gray-300 hover:bg-gray-600/20"
          >
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}