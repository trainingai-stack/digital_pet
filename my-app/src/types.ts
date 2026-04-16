export interface DogBreed {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  secondaryColor: string;
  size: 'small' | 'medium' | 'large';
  description: string;
}

export interface DogState {
  hunger: number;
  thirst: number;
  energy: number;
  happiness: number;
  cleanliness: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface BubbleMessage {
  id: string;
  text: string;
  x: number;
  y: number;
  createdAt: number;
}

export type DogAction = 'idle' | 'walk' | 'eat' | 'sleep' | 'play' | 'petted';

export interface GameState {
  selectedBreed: DogBreed | null;
  dogState: DogState;
  dogPosition: Position;
  dogAction: DogAction;
  dogDirection: number;
  bubbles: BubbleMessage[];
  lastUpdate: number;
}
