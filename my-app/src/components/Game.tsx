import { useState, useEffect, useCallback, useRef } from 'react';
import type { DogBreed, DogState, Position, DogAction, BubbleMessage } from '../types';
import { bubbleMessages } from '../data/dogBreeds';
import { GameCanvas } from './GameCanvas';
import { StatusBar } from './StatusBar';
import { ControlPanel } from './ControlPanel';

interface GameProps {
  breed: DogBreed;
  onBack: () => void;
}

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 550;
const DOG_SPEED = 2;

export function Game({ breed, onBack }: GameProps) {
  const [dogState, setDogState] = useState<DogState>({
    hunger: 80,
    thirst: 80,
    energy: 80,
    happiness: 80,
    cleanliness: 80
  });

  const [dogPosition, setDogPosition] = useState<Position>({ x: 450, y: 400 });
  const [dogAction, setDogAction] = useState<DogAction>('idle');
  const [dogDirection, setDogDirection] = useState(1);
  const [bubbles, setBubbles] = useState<BubbleMessage[]>([]);
  const [isWalking, setIsWalking] = useState(false);

  const targetRef = useRef<Position | null>(null);
  const actionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNeedCheckRef = useRef(0);
  const isMovingRef = useRef(false);

  const addBubble = useCallback((text: string, x?: number, y?: number) => {
    const bubble: BubbleMessage = {
      id: Date.now().toString() + Math.random(),
      text,
      x: x ?? dogPosition.x,
      y: y ?? dogPosition.y - 50,
      createdAt: Date.now()
    };
    setBubbles(prev => [...prev, bubble]);

    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== bubble.id));
    }, 3000);
  }, [dogPosition.x, dogPosition.y]);

  const getRandomMessage = useCallback((category: keyof typeof bubbleMessages) => {
    const messages = bubbleMessages[category];
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  const moveTo = useCallback((targetX: number, targetY: number) => {
    targetRef.current = { x: targetX, y: targetY };
    setDogAction('walk');

    const direction = targetX > dogPosition.x ? 1 : -1;
    setDogDirection(direction);
  }, [dogPosition.x]);

  const handleFeed = useCallback(() => {
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);

    setDogAction('eat');
    addBubble(getRandomMessage('feed'));

    setDogState(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 30),
      energy: Math.min(100, prev.energy + 10)
    }));

    actionTimeoutRef.current = setTimeout(() => {
      setDogAction('idle');
    }, 2000);
  }, [addBubble, getRandomMessage]);

  const handlePet = useCallback(() => {
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);

    setDogAction('petted');
    addBubble(getRandomMessage('pet'));

    setDogState(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 20),
      energy: Math.max(0, prev.energy - 5)
    }));

    actionTimeoutRef.current = setTimeout(() => {
      setDogAction('idle');
    }, 1500);
  }, [addBubble, getRandomMessage]);

  const handleWalk = useCallback(() => {
    if (isWalking) {
      setIsWalking(false);
      targetRef.current = null;
      setDogAction('idle');
    } else {
      setIsWalking(true);
      const randomX = 100 + Math.random() * (CANVAS_WIDTH - 200);
      const randomY = 300 + Math.random() * (CANVAS_HEIGHT - 350);
      moveTo(randomX, randomY);
      addBubble(getRandomMessage('walk'));
    }
  }, [isWalking, moveTo, addBubble, getRandomMessage]);

  const handleCanvasClick = useCallback((x: number, y: number) => {
    if (y > 250 && y < CANVAS_HEIGHT - 50 && x > 50 && x < CANVAS_WIDTH - 50) {
      moveTo(x, y);
      setIsWalking(false);
    }
  }, [moveTo]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setDogState(prev => ({
        hunger: Math.max(0, prev.hunger - 0.5),
        thirst: Math.max(0, prev.thirst - 0.7),
        energy: Math.max(0, prev.energy - 0.3),
        happiness: Math.max(0, prev.happiness - 0.4),
        cleanliness: Math.max(0, prev.cleanliness - 0.2)
      }));
    }, 1000);

    return () => clearInterval(gameLoop);
  }, []);

  useEffect(() => {
    const now = Date.now();
    if (now - lastNeedCheckRef.current < 10000) return;
    lastNeedCheckRef.current = now;

    const checkNeeds = () => {
      if (dogState.hunger < 30) {
        return getRandomMessage('lowHunger');
      } else if (dogState.thirst < 30) {
        return getRandomMessage('lowThirst');
      } else if (dogState.energy < 20) {
        return getRandomMessage('lowEnergy');
      } else if (dogState.happiness < 30) {
        return getRandomMessage('lowHappiness');
      }
      return null;
    };

    const message = checkNeeds();
    if (message) {
      requestAnimationFrame(() => addBubble(message));
    }
  }, [dogState, addBubble, getRandomMessage]);

  useEffect(() => {
    if (!targetRef.current || dogAction !== 'walk') {
      isMovingRef.current = false;
      return;
    }

    isMovingRef.current = true;

    const moveInterval = setInterval(() => {
      if (!targetRef.current || !isMovingRef.current) return;

      setDogPosition(prev => {
        if (!targetRef.current) return prev;

        const dx = targetRef.current.x - prev.x;
        const dy = targetRef.current.y - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < DOG_SPEED) {
          targetRef.current = null;
          isMovingRef.current = false;
          setDogAction('idle');
          if (isWalking) {
            setTimeout(() => {
              if (isWalking) {
                const randomX = 100 + Math.random() * (CANVAS_WIDTH - 200);
                const randomY = 300 + Math.random() * (CANVAS_HEIGHT - 350);
                moveTo(randomX, randomY);
              }
            }, 500);
          }
          return prev;
        }

        const moveX = (dx / distance) * DOG_SPEED;
        const moveY = (dy / distance) * DOG_SPEED;

        if (Math.abs(moveX) > 0.1) {
          setDogDirection(moveX > 0 ? 1 : -1);
        }

        return {
          x: prev.x + moveX,
          y: prev.y + moveY
        };
      });
    }, 16);

    return () => {
      clearInterval(moveInterval);
      isMovingRef.current = false;
    };
  }, [dogAction, isWalking, moveTo]);

  useEffect(() => {
    if (dogAction === 'idle' && !isWalking && !targetRef.current) {
      const randomMove = setInterval(() => {
        if (Math.random() < 0.3 && dogAction === 'idle' && !isWalking) {
          const randomX = Math.max(100, Math.min(CANVAS_WIDTH - 100, dogPosition.x + (Math.random() - 0.5) * 200));
          const randomY = Math.max(300, Math.min(CANVAS_HEIGHT - 100, dogPosition.y + (Math.random() - 0.5) * 100));
          moveTo(randomX, randomY);
        }
      }, 5000);

      return () => clearInterval(randomMove);
    }
  }, [dogAction, isWalking, dogPosition.x, dogPosition.y, moveTo]);

  useEffect(() => {
    return () => {
      if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
      isMovingRef.current = false;
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <button
              onClick={onBack}
              style={{
                padding: '10px 20px',
                background: '#FFF',
                border: '2px solid #ddd',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFF';
              }}
            >
              ← 返回
            </button>
            <h1 style={{
              margin: 0,
              fontSize: '1.8rem',
              color: '#333'
            }}>
              🐕 {breed.name}
            </h1>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '24px',
          alignItems: 'start'
        }}>
          <div>
            <GameCanvas
              breed={breed}
              dogPosition={dogPosition}
              dogAction={dogAction}
              dogDirection={dogDirection}
              bubbles={bubbles}
              onCanvasClick={handleCanvasClick}
            />

            <div style={{
              marginTop: '24px',
              padding: '20px',
              background: '#FFF',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
            }}>
              <ControlPanel
                onFeed={handleFeed}
                onPet={handlePet}
                onWalk={handleWalk}
                isWalking={isWalking}
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '1.2rem',
              color: '#333'
            }}>
              狗狗状态
            </h3>
            <StatusBar
              label="饱食度"
              value={dogState.hunger}
              color="#FF6B6B"
              icon="🍖"
            />
            <StatusBar
              label="口渴度"
              value={dogState.thirst}
              color="#4ECDC4"
              icon="💧"
            />
            <StatusBar
              label="精力"
              value={dogState.energy}
              color="#45B7D1"
              icon="⚡"
            />
            <StatusBar
              label="快乐"
              value={dogState.happiness}
              color="#96CEB4"
              icon="😊"
            />
            <StatusBar
              label="清洁"
              value={dogState.cleanliness}
              color="#DDA0DD"
              icon="✨"
            />

            <div style={{
              marginTop: '16px',
              padding: '16px',
              background: '#FFF8E7',
              borderRadius: '12px',
              border: '2px solid #FFE4B5'
            }}>
              <h4 style={{
                margin: '0 0 8px 0',
                fontSize: '1rem',
                color: '#8B7355'
              }}>
                💡 提示
              </h4>
              <p style={{
                margin: 0,
                fontSize: '0.9rem',
                color: '#A0826D',
                lineHeight: '1.6'
              }}>
                点击院子可以让狗狗走过去。记得定期喂食、陪它玩耍，保持狗狗健康快乐！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
