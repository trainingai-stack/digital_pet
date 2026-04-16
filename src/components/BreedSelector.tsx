import React from 'react';
import type { DogBreed } from '../types';
import { BREEDS } from '../types';

interface BreedSelectorProps {
  currentBreed: DogBreed;
  onSelect: (breed: DogBreed) => void;
}

const BreedSelector: React.FC<BreedSelectorProps> = ({ currentBreed, onSelect }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span>🐕</span> 选择品种
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {BREEDS.map((breed) => (
          <button
            key={breed.breed}
            onClick={() => onSelect(breed.breed)}
            className={`p-2 rounded-xl transition-all duration-200 border-2 ${
              currentBreed === breed.breed
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div
              className="w-10 h-10 mx-auto rounded-full mb-1 shadow-inner"
              style={{ backgroundColor: breed.bodyColor }}
            />
            <div className="text-xs font-medium text-gray-700 truncate">
              {breed.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BreedSelector;
