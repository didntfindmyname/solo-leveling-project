import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Quest } from '@/types';
import { cn } from '@/lib/utils';

interface CustomQuestDialogProps {
  onCreateQuest: (quest: Omit<Quest, 'id' | 'completed'>) => void;
  children?: React.ReactNode;
}

export function CustomQuestDialog({ onCreateQuest, children }: CustomQuestDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'fitness' | 'mental' | 'knowledge'>('fitness');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [timeEstimate, setTimeEstimate] = useState(15);
  const [deadline, setDeadline] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) return;

    const xpReward = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 50 : 80;

    onCreateQuest({
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      xpReward,
      timeEstimate,
      deadline,
      isCustom: true
    });

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('fitness');
    setDifficulty('medium');
    setTimeEstimate(15);
    setDeadline(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="border-purple-500/30 text-purple-200 hover:bg-purple-600/20">
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Quest
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-purple-500/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Create Custom Quest
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-purple-300">Quest Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quest title..."
              className="bg-gray-800 border-purple-500/30 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-purple-300">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your quest..."
              className="bg-gray-800 border-purple-500/30 text-white placeholder:text-gray-400 min-h-[80px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-purple-300">Category</Label>
              <Select value={category} onValueChange={(value: 'fitness' | 'mental' | 'knowledge') => setCategory(value)}>
                <SelectTrigger className="bg-gray-800 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/30">
                  <SelectItem value="fitness" className="text-white hover:bg-purple-600/20">Fitness</SelectItem>
                  <SelectItem value="mental" className="text-white hover:bg-purple-600/20">Mental</SelectItem>
                  <SelectItem value="knowledge" className="text-white hover:bg-purple-600/20">Knowledge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-purple-300">Difficulty</Label>
              <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}>
                <SelectTrigger className="bg-gray-800 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/30">
                  <SelectItem value="easy" className="text-white hover:bg-green-600/20">Easy (30 XP)</SelectItem>
                  <SelectItem value="medium" className="text-white hover:bg-yellow-600/20">Medium (50 XP)</SelectItem>
                  <SelectItem value="hard" className="text-white hover:bg-red-600/20">Hard (80 XP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeEstimate" className="text-purple-300">Time Estimate (minutes)</Label>
            <Input
              id="timeEstimate"
              type="number"
              value={timeEstimate}
              onChange={(e) => setTimeEstimate(parseInt(e.target.value) || 15)}
              min="1"
              max="480"
              className="bg-gray-800 border-purple-500/30 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-purple-300">Deadline (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-800 border-purple-500/30 text-white hover:bg-gray-700",
                    !deadline && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : "Pick a deadline"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-purple-500/30">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-gray-500/30 text-gray-300 hover:bg-gray-600/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Create Quest
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}