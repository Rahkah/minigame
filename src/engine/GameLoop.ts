export interface LoopCallbacks {
  update: (dt: number) => void;
  render: (fps: number) => void;
}

/**
 * Fixed-clamp requestAnimationFrame loop with automatic pause when tab is backgrounded.
 */
export class GameLoop {
  private readonly callbacks: LoopCallbacks;
  private rafId: number | null = null;
  private lastTime = 0;
  private running = false;
  private fps = 60;
  private frameCounter = 0;
  private fpsAccum = 0;
  private readonly onVisibilityChange: () => void;

  constructor(callbacks: LoopCallbacks) {
    this.callbacks = callbacks;
    this.onVisibilityChange = () => {
      if (document.hidden) {
        this.lastTime = 0;
      } else if (this.running) {
        this.lastTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  public start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  public stop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  public destroy(): void {
    this.stop();
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  private readonly tick = (now: number): void => {
    if (!this.running) return;

    if (!document.hidden) {
      const rawDt = this.lastTime > 0 ? (now - this.lastTime) / 1000 : 1 / 60;
      // Clamp dt to prevent physics jumps after tab switch or lag spikes
      const dt = Math.min(Math.max(rawDt, 0), 0.05);
      this.lastTime = now;

      this.frameCounter += 1;
      this.fpsAccum += rawDt;
      if (this.fpsAccum >= 0.5) {
        this.fps = Math.round(this.frameCounter / this.fpsAccum);
        this.frameCounter = 0;
        this.fpsAccum = 0;
      }

      this.callbacks.update(dt);
      this.callbacks.render(this.fps);
    }

    this.rafId = requestAnimationFrame(this.tick);
  };
}
