import React from 'react';
import type { DogStats } from '../types';

interface StatusBarProps {
  stats: DogStats;
}

const StatusBar: React.FC<StatusBarProps> = ({ stats }) => {
  const getStatusColor = (value: number) => {
    if (value > 60) return 'bg-green-500';
    if (value > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusEmoji = (key: keyof DogStats) => {
    const emojis: Record<keyof DogStats, string> = {
      hunger: '🍖',
      thirst: '💧',
      energy: '⚡',
      happiness: '😊',
      fun: '🎾',
    };
    return emojis[key];
  };

  const getStatusName = (key: keyof DogStats) => {
    const names: Record<keyof DogStats, string> = {
      hunger: '饱腹感',
      thirst: '口渴度',
      energy: '精力',
      happiness: '心情',
      fun: '玩耍',
    };
    return names[key];
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span>📊</span> 狗狗状态
      </h3>
      <div className="space-y-3">
        {(Object.keys(stats) as (keyof DogStats)[]).map((key) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xl w-8">{getStatusEmoji(key)}</span>
            <span className="text-sm font-medium text-gray-600 w-16">{getStatusName(key)}</span>
            <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStatusColor(stats[key])} transition-all duration-500 rounded-full`}
                style={{ width: `${stats[key]}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-700 w-12 text-right">
              {Math.round(stats[key])}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusBar;
