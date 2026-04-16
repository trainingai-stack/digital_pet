import React, { useEffect, useRef } from 'react';
import type { DogState } from '../types';
import { DogRenderer } from './DogRenderer';
import ChatBubbles from './ChatBubbles';

interface GameCanvasProps {
  dog: DogState;
  messages: any[];
  onPet: () => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ dog, messages, onPet }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<DogRenderer | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      if (rendererRef.current) {
        rendererRef.current.resize(canvas.offsetWidth, canvas.offsetHeight);
      }
    };

    if (!rendererRef.current) {
      rendererRef.current = new DogRenderer(ctx, canvas.offsetWidth, canvas.offsetHeight);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastTime = performance.now();
    
    const render = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (rendererRef.current) {
        rendererRef.current.render(dog, deltaTime);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dog]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dogX = dog.position.x;
    const dogY = dog.position.y;
    const distance = Math.sqrt(Math.pow(x - dogX, 2) + Math.pow(y - dogY, 2));

    if (distance < 80) {
      onPet();
    }
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes bubbleIn {
          0% { opacity: 0; transform: scale(0.8) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        style={{ height: '100%', minHeight: '400px' }}
        onClick={handleCanvasClick}
      />
      <ChatBubbles messages={messages} />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/30 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
        💡 点击狗狗可以摸头哦！
      </div>
    </div>
  );
};

export default GameCanvas;
