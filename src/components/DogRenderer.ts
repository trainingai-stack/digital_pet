import type { DogState, DogBreed } from '../types';
import { BREEDS } from '../types';

export class DogRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private time: number = 0;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  private getBreedColors(breed: DogBreed) {
    const breedData = BREEDS.find(b => b.breed === breed)!;
    return {
      body: breedData.bodyColor,
      ears: breedData.color,
      eyes: '#1a1a1a',
      nose: '#2d2d2d',
      tongue: '#FF6B6B',
    };
  }

  private drawBackground() {
    const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.height * 0.6);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#E0F6FF');
    this.ctx.fillStyle = skyGradient;
    this.ctx.fillRect(0, 0, this.width, this.height * 0.6);

    this.ctx.fillStyle = '#FFFFFF';
    this.drawCloud(100, 60, 40);
    this.drawCloud(300, 40, 35);
    this.drawCloud(500, 80, 45);

    const grassGradient = this.ctx.createLinearGradient(0, this.height * 0.5, 0, this.height);
    grassGradient.addColorStop(0, '#7CB342');
    grassGradient.addColorStop(1, '#558B2F');
    this.ctx.fillStyle = grassGradient;
    this.ctx.fillRect(0, this.height * 0.55, this.width, this.height * 0.45);

    this.ctx.fillStyle = '#8BC34A';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * this.width;
      const y = this.height * 0.55 + Math.random() * (this.height * 0.4);
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x - 3, y - 10);
      this.ctx.lineTo(x + 3, y - 10);
      this.ctx.closePath();
      this.ctx.fill();
    }

    this.drawDogHouse(this.width - 150, this.height * 0.55);

    this.ctx.fillStyle = '#FFEB3B';
    this.drawFlower(80, this.height * 0.7);
    this.ctx.fillStyle = '#E91E63';
    this.drawFlower(200, this.height * 0.75);
    this.ctx.fillStyle = '#9C27B0';
    this.drawFlower(this.width - 250, this.height * 0.72);
  }

  private drawCloud(x: number, y: number, size: number) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.arc(x + size * 0.8, y - size * 0.2, size * 0.7, 0, Math.PI * 2);
    this.ctx.arc(x + size * 1.5, y, size * 0.8, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawDogHouse(x: number, y: number) {
    this.ctx.fillStyle = '#8D6E63';
    this.ctx.fillRect(x, y, 100, 80);

    this.ctx.fillStyle = '#6D4C41';
    this.ctx.beginPath();
    this.ctx.moveTo(x - 10, y);
    this.ctx.lineTo(x + 50, y - 50);
    this.ctx.lineTo(x + 110, y);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle = '#3E2723';
    this.ctx.beginPath();
    this.ctx.ellipse(x + 50, y + 60, 25, 35, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#FFD54F';
    this.ctx.fillRect(x + 85, y - 35, 15, 15);
  }

  private drawFlower(x: number, y: number) {
    this.ctx.strokeStyle = '#4CAF50';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x, y + 20);
    this.ctx.stroke();

    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      this.ctx.beginPath();
      this.ctx.arc(x + Math.cos(angle) * 6, y + Math.sin(angle) * 6, 5, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.fillStyle = '#FFC107';
    this.ctx.beginPath();
    this.ctx.arc(x, y, 4, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawDog(dog: DogState, colors: any) {
    const { x, y } = dog.position;
    const bounce = Math.sin(this.time * 3) * 3;
    const tailWag = Math.sin(this.time * 8) * 15;

    this.ctx.save();

    if (dog.direction === 'left') {
      this.ctx.translate(x * 2, 0);
      this.ctx.scale(-1, 1);
    }

    const offsetY = dog.action === 'walking' ? bounce : 0;

    this.ctx.fillStyle = colors.body;
    this.ctx.beginPath();
    this.ctx.ellipse(x, y + offsetY, 45, 30, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.save();
    this.ctx.translate(x + 40, y - 15 + offsetY);
    this.ctx.rotate((tailWag * Math.PI) / 180);
    this.ctx.beginPath();
    this.ctx.ellipse(15, 0, 20, 8, 0.3, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();

    this.ctx.fillStyle = colors.body;
    const legSwing = dog.action === 'walking' ? Math.sin(this.time * 6) * 8 : 0;
    
    this.ctx.save();
    this.ctx.translate(x - 25, y + 20 + offsetY);
    this.ctx.rotate((legSwing * Math.PI) / 180);
    this.ctx.fillRect(-5, 0, 10, 25);
    this.ctx.restore();

    this.ctx.save();
    this.ctx.translate(x - 5, y + 20 + offsetY);
    this.ctx.rotate((-legSwing * Math.PI) / 180);
    this.ctx.fillRect(-5, 0, 10, 25);
    this.ctx.restore();

    this.ctx.save();
    this.ctx.translate(x + 20, y + 20 + offsetY);
    this.ctx.rotate((-legSwing * Math.PI) / 180);
    this.ctx.fillRect(-5, 0, 10, 25);
    this.ctx.restore();

    this.ctx.save();
    this.ctx.translate(x + 35, y + 20 + offsetY);
    this.ctx.rotate((legSwing * Math.PI) / 180);
    this.ctx.fillRect(-5, 0, 10, 25);
    this.ctx.restore();

    const headBob = dog.action === 'petting' ? Math.sin(this.time * 4) * 5 : 0;
    this.ctx.beginPath();
    this.ctx.ellipse(x - 45, y - 15 + offsetY + headBob, 30, 25, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = colors.ears;
    this.ctx.beginPath();
    this.ctx.ellipse(x - 65, y - 35 + offsetY + headBob, 12, 18, -0.3, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(x - 25, y - 35 + offsetY + headBob, 12, 18, 0.3, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = colors.eyes;
    this.ctx.beginPath();
    this.ctx.arc(x - 55, y - 20 + offsetY + headBob, 5, 0, Math.PI * 2);
    this.ctx.arc(x - 35, y - 20 + offsetY + headBob, 5, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(x - 53, y - 22 + offsetY + headBob, 2, 0, Math.PI * 2);
    this.ctx.arc(x - 33, y - 22 + offsetY + headBob, 2, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = colors.nose;
    this.ctx.beginPath();
    this.ctx.ellipse(x - 60, y - 5 + offsetY + headBob, 8, 6, 0, 0, Math.PI * 2);
    this.ctx.fill();

    if (dog.action === 'eating' || dog.action === 'playing' || dog.action === 'petting') {
      this.ctx.fillStyle = colors.tongue;
      this.ctx.beginPath();
      this.ctx.ellipse(x - 60, y + 8 + offsetY + headBob + Math.sin(this.time * 5) * 2, 8, 12, 0, 0, Math.PI);
      this.ctx.fill();
    }

    if (dog.action === 'sleeping') {
      this.ctx.strokeStyle = colors.body;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x - 60, y - 20 + offsetY);
      this.ctx.quadraticCurveTo(x - 55, y - 25 + offsetY, x - 50, y - 20 + offsetY);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(x - 40, y - 20 + offsetY);
      this.ctx.quadraticCurveTo(x - 35, y - 25 + offsetY, x - 30, y - 20 + offsetY);
      this.ctx.stroke();

      this.ctx.fillStyle = '#64B5F6';
      this.ctx.font = 'bold 16px Arial';
      this.ctx.fillText('Z', x - 70, y - 45 + offsetY + Math.sin(this.time * 2) * 3);
      this.ctx.font = 'bold 12px Arial';
      this.ctx.fillText('z', x - 80, y - 55 + offsetY + Math.sin(this.time * 2 + 1) * 3);
    }

    if (dog.action === 'petting') {
      this.ctx.strokeStyle = '#FF6B6B';
      this.ctx.lineWidth = 2;
      const heartX = x - 80 + Math.sin(this.time * 3) * 5;
      const heartY = y - 50 + Math.sin(this.time * 2) * 5;
      this.ctx.beginPath();
      this.ctx.moveTo(heartX, heartY);
      this.ctx.bezierCurveTo(heartX, heartY - 5, heartX - 10, heartY - 5, heartX - 10, heartY);
      this.ctx.bezierCurveTo(heartX - 10, heartY + 5, heartX, heartY + 10, heartX, heartY + 12);
      this.ctx.bezierCurveTo(heartX, heartY + 10, heartX + 10, heartY + 5, heartX + 10, heartY);
      this.ctx.bezierCurveTo(heartX + 10, heartY - 5, heartX, heartY - 5, heartX, heartY);
      this.ctx.stroke();
    }

    if (dog.action === 'eating') {
      this.ctx.fillStyle = '#8D6E63';
      this.ctx.beginPath();
      this.ctx.ellipse(x - 80, y + 25 + offsetY, 20, 8, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#D4A574';
      this.ctx.beginPath();
      this.ctx.arc(x - 80, y + 22 + offsetY, 10, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  render(dog: DogState, deltaTime: number) {
    this.time += deltaTime;
    const colors = this.getBreedColors(dog.breed);

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawBackground();
    this.drawDog(dog, colors);
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
