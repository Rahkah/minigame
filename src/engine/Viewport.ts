export interface Point {
  x: number;
  y: number;
}

/**
 * Manages a fixed portrait logical resolution (720 x 1280) backed by a
 * devicePixelRatio-scaled canvas so rendering stays crisp across phones and desktops.
 */
export class Viewport {
  public readonly logicalWidth: number;
  public readonly logicalHeight: number;
  public dpr = 1;
  public cssWidth = 0;
  public cssHeight = 0;

  private readonly canvas: HTMLCanvasElement;
  private readonly container: HTMLElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly onResizeBound: () => void;

  constructor(
    canvas: HTMLCanvasElement,
    container: HTMLElement,
    logicalWidth = 720,
    logicalHeight = 1280,
  ) {
    this.canvas = canvas;
    this.container = container;
    this.logicalWidth = logicalWidth;
    this.logicalHeight = logicalHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('2D Canvas context is unavailable.');
    }
    this.ctx = context;

    this.onResizeBound = () => this.resize();
    window.addEventListener('resize', this.onResizeBound);
    window.addEventListener('orientationchange', this.onResizeBound);
    this.resize();
  }

  public get context(): CanvasRenderingContext2D {
    return this.ctx;
  }

  public resize(): void {
    const rect = this.container.getBoundingClientRect();
    this.cssWidth = Math.max(1, rect.width);
    this.cssHeight = Math.max(1, rect.height);
    this.dpr = Math.min(window.devicePixelRatio || 1, 3);

    this.canvas.width = Math.round(this.cssWidth * this.dpr);
    this.canvas.height = Math.round(this.cssHeight * this.dpr);

    const scaleX = this.canvas.width / this.logicalWidth;
    const scaleY = this.canvas.height / this.logicalHeight;
    this.ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  }

  public clientToLogical(clientX: number, clientY: number): Point {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / Math.max(1, rect.width)) * this.logicalWidth;
    const y = ((clientY - rect.top) / Math.max(1, rect.height)) * this.logicalHeight;
    return { x, y };
  }

  public destroy(): void {
    window.removeEventListener('resize', this.onResizeBound);
    window.removeEventListener('orientationchange', this.onResizeBound);
  }
}
