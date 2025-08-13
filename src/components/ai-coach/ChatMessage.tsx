import React from 'react';
import { motion } from 'framer-motion';
import { Brain, User, Copy, Bookmark, ThumbsUp, ThumbsDown } from 'lucide-react';
import { CoachMessage } from '../../services/aiCoach';

interface ChatMessageProps {
  message: CoachMessage;
  onSuggestionClick: (suggestion: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSuggestionClick }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} group`}
    >
      <div className={`max-w-4xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
        <div className="flex items-start space-x-3">
          {message.type === 'ai' && (
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-white" />
            </div>
          )}
          
          <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
            <div className={`inline-block max-w-full relative ${
              message.type === 'user' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl rounded-tr-md' 
                : 'bg-white/10 backdrop-blur-sm text-white rounded-2xl rounded-tl-md border border-white/20'
            } p-4 shadow-lg`}>
              <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: message.content }}></div>
              
              {/* AI Insights */}
             

              {/* Message Actions */}
            

            {/* Suggestions */}
           

          {message.type === 'user' && (
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
