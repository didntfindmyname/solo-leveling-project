import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Clock, Flame, Target } from 'lucide-react';

const workoutRoutines = [
  {
    id: '1',
    name: 'Shadow Warrior Training',
    difficulty: 'medium',
    duration: 20,
    exercises: [
      { name: 'Push-ups', sets: 3, reps: 15 },
      { name: 'Squats', sets: 3, reps: 20 },
      { name: 'Plank', duration: 60 },
      { name: 'Mountain Climbers', sets: 3, reps: 30 },
    ],
    xpReward: 100,
  },
  {
    id: '2',
    name: 'Hunter\'s Agility',
    difficulty: 'easy',
    duration: 15,
    exercises: [
      { name: 'Jumping Jacks', sets: 3, reps: 30 },
      { name: 'Lunges', sets: 2, reps: 12 },
      { name: 'Wall Sit', duration: 45 },
      { name: 'Burpees', sets: 2, reps: 8 },
    ],
    xpReward: 75,
  },
  {
    id: '3',
    name: 'S-Rank Intensive',
    difficulty: 'hard',
    duration: 30,
    exercises: [
      { name: 'Diamond Push-ups', sets: 4, reps: 12 },
      { name: 'Pistol Squats', sets: 3, reps: 8 },
      { name: 'Handstand Hold', duration: 30 },
      { name: 'Explosive Burpees', sets: 4, reps: 10 },
    ],
    xpReward: 150,
  },
];

export function WorkoutSection() {
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-600/20 text-green-200 border-green-500/30';
      case 'medium': return 'bg-yellow-600/20 text-yellow-200 border-yellow-500/30';
      case 'hard': return 'bg-red-600/20 text-red-200 border-red-500/30';
      default: return 'bg-gray-600/20 text-gray-200 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-indigo mb-2">Workout Routines</h2>
        <p className="text-black-400">Choose your training to become stronger</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workoutRoutines.map(routine => (
          <Card key={routine.id} className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/30 hover:border-red-400/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-white">{routine.name}</CardTitle>
                <Badge className={getDifficultyColor(routine.difficulty)}>
                  {routine.difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-blue-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{routine.duration}min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  <span>+{routine.xpReward} XP</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {routine.exercises.map((exercise, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-red-600">{exercise.name}</span>
                    <span className="text-gray-400">
                      {exercise.sets && exercise.reps && `${exercise.sets}x${exercise.reps}`}
                      {exercise.duration && `${exercise.duration}s`}
                    </span>
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                onClick={() => setActiveWorkout(routine.id)}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Workout
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}