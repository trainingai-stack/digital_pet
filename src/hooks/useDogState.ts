import { useState, useEffect, useCallback, useRef } from 'react';
import type { DogState, DogBreed, Message } from '../types';
import { MESSAGES } from '../types';

const getRandomMessage = (type: keyof typeof MESSAGES) => {
  const messages = MESSAGES[type];
  return messages[Math.floor(Math.random() * messages.length)];
};

export const useDogState = (initialBreed: DogBreed) => {
  const [dog, setDog] = useState<DogState>({
    breed: initialBreed,
    name: '小宝贝',
    stats: {
      hunger: 80,
      thirst: 80,
      energy: 80,
      happiness: 80,
      fun: 80,
    },
    position: { x: 400, y: 350 },
    action: 'idle',
    direction: 'right',
    speed: 2,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const messageIdRef = useRef(0);

  const addMessage = useCallback((type: Message['type'] | 'eating' | 'drinking' | 'playing' | 'sleeping') => {
    const messageType = type as keyof typeof MESSAGES;
    const newMessage: Message = {
      id: messageIdRef.current++,
      text: getRandomMessage(messageType),
      type: type === 'eating' || type === 'drinking' || type === 'playing' || type === 'sleeping' ? 'happy' : type,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev.slice(-2), newMessage]);
  }, []);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setMessages(prev => prev.filter(m => now - m.timestamp < 4000));
    }, 500);
    return () => clearInterval(cleanupInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDog(prev => {
        const newStats = { ...prev.stats };
        
        const decayRate = 0.3;
        newStats.hunger = Math.max(0, newStats.hunger - decayRate * 0.5);
        newStats.thirst = Math.max(0, newStats.thirst - decayRate * 0.6);
        newStats.energy = Math.max(0, newStats.energy - decayRate * 0.3);
        newStats.happiness = Math.max(0, newStats.happiness - decayRate * 0.2);
        newStats.fun = Math.max(0, newStats.fun - decayRate * 0.4);

        return { ...prev, stats: newStats };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      const { hunger, thirst, energy, fun } = dog.stats;
      
      if (hunger < 30 && Math.random() > 0.7) {
        addMessage('hungry');
      } else if (thirst < 30 && Math.random() > 0.7) {
        addMessage('thirsty');
      } else if (energy < 30 && Math.random() > 0.7) {
        addMessage('tired');
      } else if (fun < 30 && Math.random() > 0.7) {
        addMessage('bored');
      } else if (Math.random() > 0.95) {
        addMessage('love');
      }
    }, 5000);

    return () => clearInterval(checkInterval);
  }, [dog.stats, addMessage]);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {

      setDog(prev => {
        if (prev.action === 'sleeping' || prev.action === 'eating' || prev.action === 'drinking' || prev.action === 'petting') {
          return prev;
        }

        if (Math.random() > 0.995) {
          const actions: typeof prev.action[] = ['idle', 'walking', 'sitting'];
          const randomAction = actions[Math.floor(Math.random() * actions.length)];
          return {
            ...prev,
            action: randomAction,
            direction: Math.random() > 0.5 ? 'left' : 'right',
          };
        }

        if (prev.action === 'walking') {
          const newX = prev.direction === 'right' 
            ? Math.min(prev.position.x + prev.speed, 600)
            : Math.max(prev.position.x - prev.speed, 150);
          
          if (newX >= 600 || newX <= 150) {
            return {
              ...prev,
              direction: prev.direction === 'right' ? 'left' : 'right',
              position: { ...prev.position, x: newX },
            };
          }

          return {
            ...prev,
            position: { ...prev.position, x: newX },
          };
        }

        return prev;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const feed = useCallback(() => {
    setDog(prev => ({
      ...prev,
      action: 'eating',
      stats: {
        ...prev.stats,
        hunger: Math.min(100, prev.stats.hunger + 40),
        happiness: Math.min(100, prev.stats.happiness + 10),
      },
    }));
    addMessage('eating');

    setTimeout(() => {
      setDog(prev => ({ ...prev, action: 'idle' }));
    }, 3000);
  }, [addMessage]);

  const giveWater = useCallback(() => {
    setDog(prev => ({
      ...prev,
      action: 'drinking',
      stats: {
        ...prev.stats,
        thirst: Math.min(100, prev.stats.thirst + 40),
        happiness: Math.min(100, prev.stats.happiness + 10),
      },
    }));
    addMessage('drinking');

    setTimeout(() => {
      setDog(prev => ({ ...prev, action: 'idle' }));
    }, 3000);
  }, [addMessage]);

  const pet = useCallback(() => {
    setDog(prev => ({
      ...prev,
      action: 'petting',
      stats: {
        ...prev.stats,
        happiness: Math.min(100, prev.stats.happiness + 25),
        love: Math.min(100, (prev.stats as any).love || 50 + 30),
      },
    }));
    addMessage('happy');

    setTimeout(() => {
      setDog(prev => ({ ...prev, action: 'idle' }));
    }, 2500);
  }, [addMessage]);

  const play = useCallback(() => {
    setDog(prev => ({
      ...prev,
      action: 'walking',
      speed: 4,
      stats: {
        ...prev.stats,
        fun: Math.min(100, prev.stats.fun + 35),
        energy: Math.max(0, prev.stats.energy - 15),
        happiness: Math.min(100, prev.stats.happiness + 20),
      },
    }));
    addMessage('playing');

    setTimeout(() => {
      setDog(prev => ({ ...prev, speed: 2 }));
    }, 5000);
  }, [addMessage]);

  const sleep = useCallback(() => {
    setDog(prev => ({
      ...prev,
      action: 'sleeping',
    }));
    addMessage('sleeping');

    const sleepInterval = setInterval(() => {
      setDog(prev => {
        if (prev.stats.energy >= 100) {
          clearInterval(sleepInterval);
          return { ...prev, action: 'idle', stats: { ...prev.stats, energy: 100 } };
        }
        return {
          ...prev,
          stats: { ...prev.stats, energy: Math.min(100, prev.stats.energy + 5) },
        };
      });
    }, 500);
  }, [addMessage]);

  const changeBreed = useCallback((breed: DogBreed) => {
    setDog(prev => ({ ...prev, breed }));
  }, []);

  return {
    dog,
    messages,
    feed,
    giveWater,
    pet,
    play,
    sleep,
    changeBreed,
  };
};
