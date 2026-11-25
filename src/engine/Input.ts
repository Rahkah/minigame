import type { Point, Viewport } from './Viewport';

export interface PointerEventPayload {
  id: number;
  point: Point;
  isPrimary: boolean;
}

export interface InputListeners {
  onPointerDown?: (event: PointerEventPayload) => void;
  onPointerMove?: (event: PointerEventPayload) => void;
  onPointerUp?: (event: PointerEventPayload) => void;
}

/**
 * Unified Pointer/Touch input adapter mapped to the viewport's logical coordinates.
 */
export class InputManager {
  private readonly canvas: HTMLCanvasElement;
  private readonly viewport: Viewport;
  private listeners: InputListeners = {};

  private readonly handleDown: (e: PointerEvent) => void;
  private readonly handleMove: (e: PointerEvent) => void;
  private readonly handleUp: (e: PointerEvent) => void;

  constructor(canvas: HTMLCanvasElement, viewport: Viewport) {
    this.canvas = canvas;
    this.viewport = viewport;

    this.handleDown = (e: PointerEvent) => {
      e.preventDefault();
      this.canvas.setPointerCapture?.(e.pointerId);
      this.listeners.onPointerDown?.(this.toPayload(e));
    };

    this.handleMove = (e: PointerEvent) => {
      e.preventDefault();
      this.listeners.onPointerMove?.(this.toPayload(e));
    };

    this.handleUp = (e: PointerEvent) => {
      e.preventDefault();
      this.listeners.onPointerUp?.(this.toPayload(e));
    };

    this.canvas.addEventListener('pointerdown', this.handleDown, { passive: false });
    this.canvas.addEventListener('pointermove', this.handleMove, { passive: false });
    this.canvas.addEventListener('pointerup', this.handleUp, { passive: false });
    this.canvas.addEventListener('pointercancel', this.handleUp, { passive: false });
  }

  public setListeners(listeners: InputListeners): void {
    this.listeners = listeners;
  }

  private toPayload(e: PointerEvent): PointerEventPayload {
    return {
      id: e.pointerId,
      point: this.viewport.clientToLogical(e.clientX, e.clientY),
      isPrimary: e.isPrimary,
    };
  }

  public destroy(): void {
    this.canvas.removeEventListener('pointerdown', this.handleDown);
    this.canvas.removeEventListener('pointermove', this.handleMove);
    this.canvas.removeEventListener('pointerup', this.handleUp);
    this.canvas.removeEventListener('pointercancel', this.handleUp);
  }
}
