import type { PointerEventPayload } from '../engine/Input';
import type { GameScene, SceneContext } from './Scene';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  hue: number;
}

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
}

/**
 * Starter scene validating portrait 9:16 layout, DPR rendering, and touch/pointer input.
 * Replace this scene with your actual game scenes when ready.
 */
export class DemoScene implements GameScene {
  private ripples: Ripple[] = [];
  private orbs: Orb[] = [];
  private tapCount = 0;
  private elapsed = 0;
  private activePointer: { x: number; y: number } | null = null;

  public onEnter(ctx: SceneContext): void {
    this.orbs = Array.from({ length: 14 }, (_, idx) => ({
      x: 90 + ((idx * 137) % (ctx.width - 180)),
      y: 260 + ((idx * 193) % (ctx.height - 460)),
      vx: ((idx % 2 === 0 ? 1 : -1) * (24 + (idx % 5) * 9)),
      vy: ((idx % 3 === 0 ? 1 : -1) * (18 + (idx % 4) * 11)),
      radius: 10 + (idx % 4) * 6,
      hue: 195 + (idx * 14) % 110,
    }));
  }

  public onPointerDown(event: PointerEventPayload): void {
    this.tapCount += 1;
    this.activePointer = { x: event.point.x, y: event.point.y };
    this.spawnRipple(event.point.x, event.point.y);
  }

  public onPointerMove(event: PointerEventPayload): void {
    if (!this.activePointer) return;
    this.activePointer = { x: event.point.x, y: event.point.y };
  }

  public onPointerUp(): void {
    this.activePointer = null;
  }

  private spawnRipple(x: number, y: number): void {
    this.ripples.push({
      x,
      y,
      radius: 12,
      maxRadius: 180,
      alpha: 0.9,
      hue: (190 + this.tapCount * 23) % 360,
    });
  }

  public update(dt: number, ctx: SceneContext): void {
    this.elapsed += dt;

    for (const orb of this.orbs) {
      if (this.activePointer) {
        const dx = this.activePointer.x - orb.x;
        const dy = this.activePointer.y - orb.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 280) {
          orb.vx += (dx / dist) * 260 * dt;
          orb.vy += (dy / dist) * 260 * dt;
        }
      }

      orb.vx *= 0.992;
      orb.vy *= 0.992;
      orb.x += orb.vx * dt;
      orb.y += orb.vy * dt;

      if (orb.x < orb.radius || orb.x > ctx.width - orb.radius) {
        orb.vx *= -1;
        orb.x = Math.min(Math.max(orb.x, orb.radius), ctx.width - orb.radius);
      }
      if (orb.y < orb.radius + 140 || orb.y > ctx.height - orb.radius - 120) {
        orb.vy *= -1;
        orb.y = Math.min(Math.max(orb.y, orb.radius + 140), ctx.height - orb.radius - 120);
      }
    }

    for (const ripple of this.ripples) {
      ripple.radius += 260 * dt;
      ripple.alpha = Math.max(0, 1 - ripple.radius / ripple.maxRadius);
    }
    this.ripples = this.ripples.filter((r) => r.alpha > 0.02);
  }

  public render(g: CanvasRenderingContext2D, ctx: SceneContext, fps: number): void {
    const { width, height } = ctx;

    // Background gradient
    const bg = g.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#0f172a');
    bg.addColorStop(0.55, '#131d38');
    bg.addColorStop(1, '#090f1f');
    g.fillStyle = bg;
    g.fillRect(0, 0, width, height);

    // Subtle portrait grid
    g.strokeStyle = 'rgba(148, 163, 184, 0.07)';
    g.lineWidth = 1;
    const gridSize = 60;
    for (let x = gridSize; x < width; x += gridSize) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, height);
      g.stroke();
    }
    for (let y = gridSize; y < height; y += gridSize) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(width, y);
      g.stroke();
    }

    // Floating orbs
    for (const orb of this.orbs) {
      const glow = g.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius * 2.8);
      glow.addColorStop(0, `hsla(${orb.hue}, 90%, 72%, 0.65)`);
      glow.addColorStop(1, `hsla(${orb.hue}, 90%, 60%, 0)`);
      g.fillStyle = glow;
      g.beginPath();
      g.arc(orb.x, orb.y, orb.radius * 2.8, 0, Math.PI * 2);
      g.fill();

      g.fillStyle = `hsl(${orb.hue}, 95%, 78%)`;
      g.beginPath();
      g.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      g.fill();
    }

    // Touch ripples
    for (const ripple of this.ripples) {
      g.strokeStyle = `hsla(${ripple.hue}, 95%, 72%, ${ripple.alpha})`;
      g.lineWidth = 4;
      g.beginPath();
      g.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      g.stroke();
    }

    // Top status pill
    this.drawRoundedRect(g, 36, 48, width - 72, 72, 20);
    g.fillStyle = 'rgba(15, 23, 42, 0.72)';
    g.fill();
    g.strokeStyle = 'rgba(148, 163, 184, 0.22)';
    g.lineWidth = 2;
    g.stroke();

    g.fillStyle = '#38bdf8';
    g.beginPath();
    g.arc(72, 84, 8, 0, Math.PI * 2);
    g.fill();

    g.fillStyle = '#e2e8f0';
    g.font = '600 24px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    g.fillText('H5 竖屏小游戏 · 基础设施就绪', 94, 85);

    g.fillStyle = '#94a3b8';
    g.font = '600 22px monospace';
    g.textAlign = 'right';
    g.fillText(`${fps} FPS`, width - 64, 85);

    // Center hero badge
    const pulse = 1 + Math.sin(this.elapsed * 2.4) * 0.025;
    g.save();
    g.translate(width / 2, height * 0.44);
    g.scale(pulse, pulse);

    this.drawRoundedRect(g, -260, -110, 520, 220, 32);
    g.fillStyle = 'rgba(15, 23, 42, 0.76)';
    g.fill();
    g.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    g.lineWidth = 2.5;
    g.stroke();

    g.fillStyle = '#f8fafc';
    g.font = '700 52px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('MINIGAME', 0, -32);

    g.fillStyle = '#38bdf8';
    g.font = '500 26px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
    g.fillText('9:16 竖屏画布 · 点击或拖动体验交互', 0, 28);

    g.fillStyle = '#94a3b8';
    g.font = '500 22px monospace';
    g.fillText(`LOGICAL ${width}×${height}  |  TAPS: ${this.tapCount}`, 0, 74);

    g.restore();

    // Bottom footer hint
    g.fillStyle = 'rgba(148, 163, 184, 0.78)';
    g.font = '400 22px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('运行 npm run deploy 即可一键更新公网页面', width / 2, height - 64);
  }

  private drawRoundedRect(
    g: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ): void {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }
}
