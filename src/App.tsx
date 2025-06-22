import { AchievementsPanel } from '@/components/AchievementsPanel';
import { BrainPuzzles } from '@/components/BrainPuzzles';
import { CodeforcesChallenges } from '@/components/CodeforcesChallenges';
import { QuestBoard } from '@/components/QuestBoard';
import { UserProfile } from '@/components/UserProfile';
import { VoiceCommandIndicator } from '@/components/VoiceCommandIndicator';
import { WorkoutSection } from '@/components/WorkoutSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import { GameProvider, useGame } from '@/contexts/GameContext';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { Brain, Code, Dumbbell, Home, Sword, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';



function AppContent() {
  const { user, achievements, updateUser } = useGame();
  const [activeTab, setActiveTab] = useState('quests');

  const voiceCallbacks = {
    onShowQuests: () => setActiveTab('quests'),
    onShowProfile: () => setActiveTab('profile'),
    onShowWorkouts: () => setActiveTab('workouts'),
    onShowPuzzles: () => setActiveTab('puzzles'),
    onShowCodeforces: () => setActiveTab('codeforces'),
  };

  const { isSupported } = useVoiceCommands(voiceCallbacks, user.preferences.voiceEnabled);

  const toggleVoiceCommands = () => {
    updateUser({
      preferences: {
        ...user.preferences,
        voiceEnabled: !user.preferences.voiceEnabled
      }
    });
  };
  const backgrounds = [
    '/im1.png',
    '/im2.png',
    '/im3.png',
    '/im4.png',
  ];

  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 8000); // every 8 seconds
    return () => clearInterval(interval);
  }, []);


  return (
    <div
      className="w-full min-h-screen bg-cover bg-center text-white transition-all duration-1000"
      style={{ backgroundImage: `url(${backgrounds[bgIndex]})` }}
    >
      <div className="w-full px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
              The System
            </h1>
            <VoiceCommandIndicator
              isEnabled={user.preferences.voiceEnabled}
              isSupported={isSupported}
              onToggle={toggleVoiceCommands}
            />
          </div>
          <p className="text-purple-400"> If you don’t like your destiny, don’t accept it. Instead, have the courage to change it the way you want it to be.!</p>
        </header>

        <div className="mb-8 max-w-7xl mx-auto">
          <UserProfile />
        </div>

        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-gray-900/50 mb-8">
              <TabsTrigger value="quests" className="data-[state=active]:bg-purple-600/30">
                <Sword className="w-4 h-4 mr-2" />
                Quests
              </TabsTrigger>
              <TabsTrigger value="workouts" className="data-[state=active]:bg-red-600/30">
                <Dumbbell className="w-4 h-4 mr-2" />
                Training
              </TabsTrigger>
              <TabsTrigger value="puzzles" className="data-[state=active]:bg-purple-600/30">
                <Brain className="w-4 h-4 mr-2" />
                Puzzles
              </TabsTrigger>
              <TabsTrigger value="codeforces" className="data-[state=active]:bg-blue-600/30">
                <Code className="w-4 h-4 mr-2" />
                Codeforces
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-yellow-600/30">
                <Trophy className="w-4 h-4 mr-2" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-indigo-600/30">
                <Home className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quests">
              <QuestBoard />
            </TabsContent>

            <TabsContent value="workouts">
              <WorkoutSection />
            </TabsContent>

            <TabsContent value="puzzles">
              <BrainPuzzles />
            </TabsContent>

            <TabsContent value="codeforces">
              <CodeforcesChallenges />
            </TabsContent>

            <TabsContent value="achievements">
              <AchievementsPanel achievements={achievements} />
            </TabsContent>

            <TabsContent value="profile">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <UserProfile />
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Recent Achievements</h3>
                    <div className="space-y-2">
                      {achievements.filter(a => a.unlocked).slice(-3).map(achievement => (
                        <div key={achievement.id} className="flex items-center gap-3 p-2 bg-purple-900/20 rounded">
                          <span className="text-lg">{achievement.icon}</span>
                          <div>
                            <div className="text-white font-semibold">{achievement.title}</div>
                            <div className="text-xs text-gray-400">{achievement.description}</div>
                          </div>
                        </div>
                      ))}
                      {achievements.filter(a => a.unlocked).length === 0 && (
                        <div className="text-gray-400">Complete your first quest to unlock achievements!</div>
                      )}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Daily Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Current Streak</span>
                        <span className="text-white font-semibold">{user.streaks.overall} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total XP</span>
                        <span className="text-white font-semibold">{user.totalXP}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Voice Commands</span>
                        <span className={`font-semibold ${user.preferences.voiceEnabled ? 'text-green-400' : 'text-gray-400'}`}>
                          {user.preferences.voiceEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;