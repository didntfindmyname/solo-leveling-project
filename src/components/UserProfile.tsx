import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { User, Zap, Sword, Brain, Heart, Trophy } from 'lucide-react';

export function UserProfile() {
  const { user } = useGame();
  
  const progressPercentage = (user.xp / user.xpToNextLevel) * 100;

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-black/40 border-purple-500/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-white">{user.name}</CardTitle>
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-200 border-purple-500/30">
                {user.title}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">Lv.{user.level}</div>
            <div className="text-sm text-purple-500">{user.totalXP} Total XP</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-purple-500 mb-2">
            <span>XP Progress</span>
            <span>{user.xp} / {user.xpToNextLevel}</span>
          </div>
          <Progress value={progressPercentage} className="h-3 bg-purple-900/50" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
            <Sword className="w-5 h-5 text-red-400" />
            <div>
              <div className="text-sm text-red-300">Strength</div>
              <div className="text-lg font-bold text-white">{user.stats.strength}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
            <Brain className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-sm text-blue-300">Intelligence</div>
              <div className="text-lg font-bold text-white">{user.stats.intelligence}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-green-900/20 rounded-lg border border-green-500/30">
            <Heart className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-sm text-green-300">Endurance</div>
              <div className="text-lg font-bold text-white">{user.stats.endurance}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
            <Zap className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-sm text-yellow-300">Discipline</div>
              <div className="text-lg font-bold text-white">{user.stats.discipline}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}