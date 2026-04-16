import React from 'react';

interface ActionButtonsProps {
  onFeed: () => void;
  onWater: () => void;
  onPet: () => void;
  onPlay: () => void;
  onSleep: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onFeed,
  onWater,
  onPet,
  onPlay,
  onSleep,
}) => {
  const buttons = [
    { onClick: onFeed, emoji: '🍖', label: '喂食', color: 'from-orange-400 to-orange-600' },
    { onClick: onWater, emoji: '💧', label: '喂水', color: 'from-blue-400 to-blue-600' },
    { onClick: onPet, emoji: '🤚', label: '摸头', color: 'from-pink-400 to-pink-600' },
    { onClick: onPlay, emoji: '🎾', label: '玩耍', color: 'from-green-400 to-green-600' },
    { onClick: onSleep, emoji: '😴', label: '休息', color: 'from-purple-400 to-purple-600' },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span>🎮</span> 互动
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {buttons.map((btn, index) => (
          <button
            key={index}
            onClick={btn.onClick}
            className={`bg-gradient-to-br ${btn.color} text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95`}
          >
            <div className="text-2xl mb-1">{btn.emoji}</div>
            <div className="text-xs font-medium">{btn.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionButtons;
