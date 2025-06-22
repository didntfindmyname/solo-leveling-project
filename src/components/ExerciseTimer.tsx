import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Square, Timer, CheckCircle } from 'lucide-react';

interface ExerciseTimerProps {
  exerciseName: string;
  duration: number; // in seconds
  onComplete: () => void;
  onCancel: () => void;
}

export function ExerciseTimer({ exerciseName, duration, onComplete, onCancel }: ExerciseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Timer className="w-5 h-5 text-red-400" />
          {exerciseName} Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl font-bold text-white mb-4">
            {formatTime(timeLeft)}
          </div>
          <Progress 
            value={progress} 
            className="h-4 bg-red-900/50"
          />
          <div className="text-sm text-gray-400 mt-2">
            {Math.round(progress)}% Complete
          </div>
        </div>

        {isCompleted ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-400">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg font-semibold">Exercise Complete!</span>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleComplete}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Mark as Complete
              </Button>
              <Button 
                onClick={handleStop}
                variant="outline"
                className="border-gray-500/30 text-gray-300 hover:bg-gray-600/20"
              >
                Reset
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            {!isRunning ? (
              <Button 
                onClick={handleStart}
                className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {timeLeft === duration ? 'Start' : 'Resume'}
              </Button>
            ) : (
              <Button 
                onClick={handlePause}
                className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            
            <Button 
              onClick={handleStop}
              variant="outline"
              className="border-red-500/30 text-red-200 hover:bg-red-600/20"
            >
              <Square className="w-4 h-4 mr-2" />
              Reset
            </Button>
            
            <Button 
              onClick={onCancel}
              variant="outline"
              className="border-gray-500/30 text-gray-300 hover:bg-gray-600/20"
            >
              Cancel
            </Button>
          </div>
        )}

        <div className="bg-red-900/20 p-3 rounded-lg border border-red-500/30">
          <div className="text-sm text-red-200">
            <strong>Instructions:</strong> Maintain proper form throughout the exercise. 
            Take breaks if needed, but try to complete the full duration for maximum XP!
          </div>
        </div>
      </CardContent>
    </Card>
  );
}