import type { PointerEventPayload } from '../engine/Input';

export interface SceneContext {
  width: number;
  height: number;
}

export interface GameScene {
  onEnter?(ctx: SceneContext): void;
  onExit?(): void;
  update(dt: number, ctx: SceneContext): void;
  render(g: CanvasRenderingContext2D, ctx: SceneContext, fps: number): void;
  onPointerDown?(event: PointerEventPayload): void;
  onPointerMove?(event: PointerEventPayload): void;
  onPointerUp?(event: PointerEventPayload): void;
}
