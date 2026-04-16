import { useState } from 'react';
import type { DogBreed } from './types';
import { BreedSelector } from './components/BreedSelector';
import { Game } from './components/Game';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const [selectedBreed, setSelectedBreed] = useState<DogBreed | null>(null);

  return (
    <ErrorBoundary>
      {selectedBreed ? (
        <Game
          breed={selectedBreed}
          onBack={() => setSelectedBreed(null)}
        />
      ) : (
        <BreedSelector onSelect={setSelectedBreed} />
      )}
    </ErrorBoundary>
  );
}

export default App;
