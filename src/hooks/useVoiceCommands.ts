import { useEffect, useRef } from 'react';

interface VoiceCommandCallbacks {
  onCompleteQuest?: () => void;
  onShowQuests?: () => void;
  onShowProfile?: () => void;
  onShowWorkouts?: () => void;
  onShowPuzzles?: () => void;
  onShowCodeforces?: () => void;
  onCreateQuest?: () => void;
}

export function useVoiceCommands(callbacks: VoiceCommandCallbacks, enabled: boolean = false) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!enabled || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript.toLowerCase().trim();
        
        // Command patterns
        if (transcript.includes('complete quest') || transcript.includes('finish quest')) {
          callbacks.onCompleteQuest?.();
        } else if (transcript.includes('show quests') || transcript.includes('open quests')) {
          callbacks.onShowQuests?.();
        } else if (transcript.includes('show profile') || transcript.includes('open profile')) {
          callbacks.onShowProfile?.();
        } else if (transcript.includes('show workouts') || transcript.includes('open training')) {
          callbacks.onShowWorkouts?.();
        } else if (transcript.includes('show puzzles') || transcript.includes('open puzzles')) {
          callbacks.onShowPuzzles?.();
        } else if (transcript.includes('show codeforces') || transcript.includes('open codeforces') || transcript.includes('coding challenges')) {
          callbacks.onShowCodeforces?.();
        } else if (transcript.includes('create quest') || transcript.includes('new quest')) {
          callbacks.onCreateQuest?.();
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognitionRef.current = recognition;
    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [enabled, callbacks]);

  return {
    isSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    recognition: recognitionRef.current
  };
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}