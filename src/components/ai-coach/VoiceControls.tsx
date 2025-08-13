import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Pause, Play } from 'lucide-react';

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  onToggleListening: () => void;
  onToggleSpeaking: () => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  isSpeaking,
  onToggleListening,
  onToggleSpeaking
}) => {
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isListening]);

  return (
    <div className="flex items-center space-x-3">
      {/* Voice Input */}
      <div className="relative">
        <motion.button
          onClick={onToggleListening}
          className={`relative p-3 rounded-xl border transition-all ${
            isListening 
              ? 'bg-red-500/20 border-red-500/30 text-red-400' 
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          
          {/* Audio Level Indicator */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute -inset-1 rounded-xl border-2 border-red-400/50"
                style={{
                  boxShadow: `0 0 ${audioLevel / 5}px rgba(239, 68, 68, 0.5)`
                }}
              />
            )}
          </AnimatePresence>
        </motion.button>

        {/* Listening Indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-red-500/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-red-500/30"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-red-400 text-xs font-medium">Listening...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Speech Output */}
      <div className="relative">
        <motion.button
          onClick={onToggleSpeaking}
          className={`p-3 rounded-xl border transition-all ${
            isSpeaking 
              ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' 
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSpeaking ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </motion.button>

        {/* Speaking Indicator */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-blue-500/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/30"
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  className="flex space-x-1"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <div className="w-1 h-3 bg-blue-400 rounded-full"></div>
                  <div className="w-1 h-2 bg-blue-400 rounded-full"></div>
                  <div className="w-1 h-4 bg-blue-400 rounded-full"></div>
                </motion.div>
                <span className="text-blue-400 text-xs font-medium">Speaking</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VoiceControls;