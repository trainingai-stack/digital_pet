import React from 'react';
import type { Message } from '../types';

interface ChatBubblesProps {
  messages: Message[];
}

const ChatBubbles: React.FC<ChatBubblesProps> = ({ messages }) => {
  const getMessageStyle = (type: Message['type']) => {
    const styles: Record<Message['type'], string> = {
      happy: 'bg-gradient-to-r from-pink-50 to-pink-100 border-pink-400 text-pink-800',
      hungry: 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-400 text-orange-800',
      thirsty: 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-400 text-blue-800',
      tired: 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-400 text-purple-800',
      bored: 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-400 text-gray-700',
      love: 'bg-gradient-to-r from-red-50 to-red-100 border-red-400 text-red-800',
      playing: 'bg-gradient-to-r from-green-50 to-green-100 border-green-400 text-green-800',
      sleeping: 'bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-400 text-indigo-800',
    };
    return styles[type];
  };

  return (
    <div className="absolute top-4 left-4 right-4 space-y-2 pointer-events-none z-50">
      {messages.length === 0 && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-gray-200 text-gray-500 text-sm">
          <span>💡</span>
          <span>点击按钮或狗狗开始互动吧！</span>
        </div>
      )}
      {messages.slice(-3).map((message, index) => {
        const age = Date.now() - message.timestamp;
        const opacity = Math.max(0, 1 - age / 5000);
        
        return (
          <div
            key={message.id}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl border-2 shadow-xl transform transition-all duration-500 ${getMessageStyle(message.type)}`}
            style={{
              opacity: opacity,
              transform: `translateY(${index * -5}px) scale(${1 - index * 0.05})`,
              animation: age < 300 ? 'bubbleIn 0.4s ease-out' : undefined,
              borderRadius: '20px',
            }}
          >
            <span className="text-2xl">🐕</span>
            <span className="text-base font-bold">{message.text}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ChatBubbles;
