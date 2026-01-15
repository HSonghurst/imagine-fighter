import type { Team } from './types';

export class XPOrb {
  x: number;
  y: number;
  targetTeam: Team; // Team that will collect this orb
  value: number;
  speed: number = 0.03;
  radius: number = 3;
  collected: boolean = false;

  constructor(x: number, y: number, targetTeam: Team, value: number = 10) {
    this.x = x;
    this.y = y;
    this.targetTeam = targetTeam;
    this.value = value;
  }

  update(deltaTime: number, canvasHeight: number): void {
    if (this.collected) return;

    // Drift toward the target team's side
    const direction = this.targetTeam === 'top' ? -1 : 1;

    this.y += direction * this.speed * deltaTime;

    // Check if reached collection zone
    if (this.targetTeam === 'top' && this.y <= 80) {
      this.collected = true;
    } else if (this.targetTeam === 'bottom' && this.y >= canvasHeight - 80) {
      this.collected = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.collected) return;

    // Glowing orb effect
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius * 2
    );

    const color = this.targetTeam === 'top' ? '#4a90d9' : '#d94a4a';
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.3, color);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
