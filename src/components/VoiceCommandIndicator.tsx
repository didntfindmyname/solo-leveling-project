import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff } from 'lucide-react';

interface VoiceCommandIndicatorProps {
  isEnabled: boolean;
  isSupported: boolean;
  onToggle: () => void;
}

export function VoiceCommandIndicator({ isEnabled, isSupported, onToggle }: VoiceCommandIndicatorProps) {
  if (!isSupported) {
    return null;
  }

  return (
    <Badge 
      variant="outline" 
      className={`cursor-pointer transition-all duration-200 ${
        isEnabled 
          ? 'bg-green-600/20 text-green-200 border-green-500/30 hover:bg-green-600/30' 
          : 'bg-gray-600/20 text-gray-300 border-gray-500/30 hover:bg-gray-600/30'
      }`}
      onClick={onToggle}
    >
      {isEnabled ? (
        <>
          <Mic className="w-3 h-3 mr-1" />
          Voice Active
        </>
      ) : (
        <>
          <MicOff className="w-3 h-3 mr-1" />
          Voice Off
        </>
      )}
    </Badge>
  );
}