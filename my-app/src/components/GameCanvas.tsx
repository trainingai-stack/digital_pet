import { useEffect, useRef, useCallback } from 'react';
import type { DogBreed, Position, DogAction, BubbleMessage } from '../types';

interface GameCanvasProps {
  breed: DogBreed;
  dogPosition: Position;
  dogAction: DogAction;
  dogDirection: number;
  bubbles: BubbleMessage[];
  onCanvasClick: (x: number, y: number) => void;
}

export function GameCanvas({
  breed,
  dogPosition,
  dogAction,
  dogDirection,
  bubbles,
  onCanvasClick
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const frameRef = useRef(0);

  const drawYard = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.6, '#87CEEB');
    gradient.addColorStop(0.6, '#90EE90');
    gradient.addColorStop(1, '#228B22');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(80, 80, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFACD';
    ctx.beginPath();
    ctx.arc(70, 70, 8, 0, Math.PI * 2);
    ctx.arc(90, 75, 6, 0, Math.PI * 2);
    ctx.arc(85, 60, 7, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 5; i++) {
      const x = 150 + i * 200;
      const y = 180;
      ctx.fillStyle = '#228B22';
      ctx.beginPath();
      ctx.ellipse(x, y, 30, 50, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x - 20, y + 10, 20, 35, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + 20, y + 10, 20, 35, 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x - 8, y + 40, 16, 40);
    }

    for (let i = 0; i < 8; i++) {
      const x = 100 + Math.random() * (width - 200);
      const y = 350 + Math.random() * (height - 400);
      ctx.fillStyle = '#32CD32';
      ctx.beginPath();
      ctx.arc(x, y, 3 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const drawDogHouse = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const scale = 1.2;
    
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 10 * scale, y + 60 * scale);
    ctx.lineTo(x + 90 * scale, y + 60 * scale);
    ctx.lineTo(x + 100 * scale, y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#A0522D';
    ctx.beginPath();
    ctx.moveTo(x - 15 * scale, y);
    ctx.lineTo(x + 50 * scale, y - 40 * scale);
    ctx.lineTo(x + 115 * scale, y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.moveTo(x + 50 * scale, y - 40 * scale);
    ctx.lineTo(x + 55 * scale, y - 35 * scale);
    ctx.lineTo(x + 50 * scale, y - 30 * scale);
    ctx.lineTo(x + 45 * scale, y - 35 * scale);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#2F1810';
    ctx.beginPath();
    ctx.arc(x + 50 * scale, y + 35 * scale, 20 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1a0f08';
    ctx.beginPath();
    ctx.arc(x + 50 * scale, y + 35 * scale, 15 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(x + 15 * scale + i * 20 * scale, y + 5 * scale);
      ctx.lineTo(x + 15 * scale + i * 20 * scale, y + 55 * scale);
      ctx.stroke();
    }
  }, []);

  const drawDog = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) => {
    const size = breed.size === 'small' ? 0.7 : breed.size === 'large' ? 1.3 : 1;
    const direction = dogDirection;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(direction * size, size);

    const tailWag = dogAction === 'idle' || dogAction === 'petted' ? Math.sin(frame * 0.2) * 0.3 : Math.sin(frame * 0.4) * 0.5;

    ctx.fillStyle = breed.color;
    ctx.beginPath();
    ctx.ellipse(0, -25, 25, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = breed.secondaryColor;
    ctx.beginPath();
    ctx.ellipse(0, -25, 15, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = breed.color;
    ctx.beginPath();
    ctx.arc(20, -45, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = breed.secondaryColor;
    ctx.beginPath();
    ctx.ellipse(20, -42, 10, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2F1810';
    ctx.beginPath();
    ctx.ellipse(28, -50, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(29, -51, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(30, -51, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = breed.color;
    ctx.beginPath();
    ctx.ellipse(10, -55, 8, 12, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(30, -55, 8, 12, 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.ellipse(15, -38, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2F1810';
    ctx.beginPath();
    ctx.ellipse(32, -42, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    if (dogAction === 'sleep') {
      ctx.strokeStyle = '#2F1810';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(26, -52);
      ctx.lineTo(30, -50);
      ctx.moveTo(30, -52);
      ctx.lineTo(26, -50);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(-20, -20);
    ctx.rotate(tailWag);
    ctx.fillStyle = breed.color;
    ctx.beginPath();
    ctx.ellipse(-15, 0, 15, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = breed.color;
    const legOffset1 = dogAction === 'walk' ? Math.sin(frame * 0.3) * 8 : 0;
    const legOffset2 = dogAction === 'walk' ? Math.sin(frame * 0.3 + Math.PI) * 8 : 0;
    
    ctx.beginPath();
    ctx.roundRect(-15 + legOffset1, -10, 10, 25, 5);
    ctx.fill();
    
    ctx.beginPath();
    ctx.roundRect(5 + legOffset2, -10, 10, 25, 5);
    ctx.fill();
    
    ctx.beginPath();
    ctx.roundRect(-12 + legOffset2, -5, 10, 22, 5);
    ctx.fill();
    
    ctx.beginPath();
    ctx.roundRect(2 + legOffset1, -5, 10, 22, 5);
    ctx.fill();

    if (dogAction === 'sleep') {
      ctx.fillStyle = '#FFF';
      ctx.font = '12px Arial';
      ctx.fillText('Zzz...', 30, -70);
    }

    ctx.restore();
  }, [breed, dogAction, dogDirection]);

  const drawBubble = useCallback((ctx: CanvasRenderingContext2D, bubble: BubbleMessage) => {
    const age = Date.now() - bubble.createdAt;
    const opacity = Math.max(0, 1 - age / 3000);
    
    if (opacity <= 0) return;

    ctx.save();
    ctx.globalAlpha = opacity;
    
    ctx.font = '14px Arial';
    const textWidth = ctx.measureText(bubble.text).width;
    const padding = 12;
    const bubbleWidth = textWidth + padding * 2;
    const bubbleHeight = 32;
    
    const x = bubble.x - bubbleWidth / 2;
    const y = bubble.y - 50;
    
    ctx.fillStyle = '#FFF';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.roundRect(x, y, bubbleWidth, bubbleHeight, 16);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(bubble.x - 8, y + bubbleHeight);
    ctx.lineTo(bubble.x, y + bubbleHeight + 10);
    ctx.lineTo(bubble.x + 8, y + bubbleHeight);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bubble.text, bubble.x, y + bubbleHeight / 2);
    
    ctx.restore();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      frameRef.current += 1;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawYard(ctx, canvas.width, canvas.height);
      drawDogHouse(ctx, canvas.width - 150, 250);
      drawDog(ctx, dogPosition.x, dogPosition.y, frameRef.current);
      
      bubbles.forEach(bubble => {
        drawBubble(ctx, bubble);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dogPosition, bubbles, drawYard, drawDogHouse, drawDog, drawBubble]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onCanvasClick(x, y);
  };

  return (
    <canvas
      ref={canvasRef}
      width={900}
      height={550}
      onClick={handleClick}
      style={{
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        maxWidth: '100%',
        height: 'auto'
      }}
    />
  );
}
