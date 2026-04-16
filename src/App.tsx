import { useState } from 'react';
import { useDogState } from './hooks/useDogState';
import GameCanvas from './components/GameCanvas';
import StatusBar from './components/StatusBar';
import ActionButtons from './components/ActionButtons';
import BreedSelector from './components/BreedSelector';
import type { DogBreed } from './types';

function App() {
  const [selectedBreed, setSelectedBreed] = useState<DogBreed | null>(null);
  const { dog, messages, feed, giveWater, pet, play, sleep, changeBreed } = useDogState(
    selectedBreed || 'golden'
  );

  const handleBreedSelect = (breed: DogBreed) => {
    setSelectedBreed(breed);
    changeBreed(breed);
  };

  if (!selectedBreed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 max-w-lg w-full shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🐕</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              欢迎来到电子宠物狗
            </h1>
            <p className="text-gray-600 mt-2">
              选择一只可爱的狗狗开始你的养宠之旅吧！
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { breed: 'golden' as DogBreed, name: '金毛寻回犬', emoji: '🦮', desc: '温顺友善' },
              { breed: 'labrador' as DogBreed, name: '拉布拉多', emoji: '🐕‍🦺', desc: '聪明活泼' },
              { breed: 'poodle' as DogBreed, name: '贵宾犬', emoji: '🐩', desc: '优雅高贵' },
              { breed: 'husky' as DogBreed, name: '哈士奇', emoji: '🐺', desc: '热情奔放' },
              { breed: 'bulldog' as DogBreed, name: '斗牛犬', emoji: '🐶', desc: '憨厚可爱' },
              { breed: 'beagle' as DogBreed, name: '比格犬', emoji: '🐾', desc: '活泼好动' },
            ].map((item) => (
              <button
                key={item.breed}
                onClick={() => handleBreedSelect(item.breed)}
                className="p-4 rounded-2xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="text-4xl mb-2 group-hover:animate-bounce">{item.emoji}</div>
                <div className="font-bold text-gray-800">{item.name}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            🐕 我的电子宠物狗
          </h1>
          <p className="text-white/80">
            好好照顾你的{dog.breed === 'golden' ? '金毛' : dog.breed === 'labrador' ? '拉布拉多' : dog.breed === 'poodle' ? '贵宾犬' : dog.breed === 'husky' ? '哈士奇' : dog.breed === 'bulldog' ? '斗牛犬' : '比格犬'}哦！
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <StatusBar stats={dog.stats} />
            <BreedSelector currentBreed={dog.breed} onSelect={handleBreedSelect} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video min-h-[400px]">
              <GameCanvas dog={dog} messages={messages} onPet={pet} />
            </div>
            <ActionButtons
              onFeed={feed}
              onWater={giveWater}
              onPet={pet}
              onPlay={play}
              onSleep={sleep}
            />
          </div>
        </div>

        <footer className="text-center mt-6 text-white/60 text-sm">
          💡 提示：狗狗会自己在院子里走动，记得经常来看它哦！
        </footer>
      </div>
    </div>
  );
}

export default App;
