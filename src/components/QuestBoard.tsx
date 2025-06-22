import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { QuestCard } from './QuestCard';
import { CustomQuestDialog } from './CustomQuestDialog';
import { AIRecommendationCard } from './AIRecommendationCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, Brain, BookOpen, Plus } from 'lucide-react';

export function QuestBoard() {
  const { quests, aiRecommendation, addCustomQuest, acceptAIRecommendation, dismissAIRecommendation } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredQuests = selectedCategory === 'all' 
    ? quests 
    : quests.filter(quest => quest.category === selectedCategory);

  const completedQuests = quests.filter(q => q.completed).length;
  const totalQuests = quests.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Daily Quests</h2>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-purple-600/20 text-purple-200">
              {completedQuests}/{totalQuests} Completed
            </Badge>
            <div className="text-sm text-gray-400">
              {totalQuests > 0 && `${Math.round((completedQuests / totalQuests) * 100)}% Complete`}
            </div>
          </div>
        </div>
        <CustomQuestDialog onCreateQuest={addCustomQuest} />
      </div>

      {/* AI Recommendation */}
      {aiRecommendation && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-3">Recommended for You</h3>
          <AIRecommendationCard
            quest={aiRecommendation}
            onAccept={acceptAIRecommendation}
            onDismiss={dismissAIRecommendation}
          />
        </div>
      )}

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
          <TabsTrigger value="all" className="data-[state=active]:bg-purple-600/30">
            All Quests
          </TabsTrigger>
          <TabsTrigger value="fitness" className="data-[state=active]:bg-red-600/30">
            <Dumbbell className="w-4 h-4 mr-2" />
            Fitness
          </TabsTrigger>
          <TabsTrigger value="mental" className="data-[state=active]:bg-purple-600/30">
            <Brain className="w-4 h-4 mr-2" />
            Mental
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="data-[state=active]:bg-blue-600/30">
            <BookOpen className="w-4 h-4 mr-2" />
            Knowledge
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
          
          {filteredQuests.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-lg font-semibold mb-2">No quests found</div>
              <div className="text-sm">Check back tomorrow for new daily quests!</div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}