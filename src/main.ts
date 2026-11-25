import './styles/main.css';
import { GameLoop } from './engine/GameLoop';
import { InputManager } from './engine/Input';
import { Viewport } from './engine/Viewport';
import { DemoScene } from './game/DemoScene';
import type { GameScene, SceneContext } from './game/Scene';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null;
const frame = document.getElementById('stage-frame');

if (!canvas || !frame) {
  throw new Error('Missing #game-canvas or #stage-frame element.');
}

const viewport = new Viewport(canvas, frame, 720, 1280);
const input = new InputManager(canvas, viewport);
const sceneContext: SceneContext = {
  width: viewport.logicalWidth,
  height: viewport.logicalHeight,
};

let currentScene: GameScene | null = null;

function setScene(next: GameScene): void {
  currentScene?.onExit?.();
  currentScene = next;
  currentScene.onEnter?.(sceneContext);
  input.setListeners({
    onPointerDown: (e) => currentScene?.onPointerDown?.(e),
    onPointerMove: (e) => currentScene?.onPointerMove?.(e),
    onPointerUp: (e) => currentScene?.onPointerUp?.(e),
  });
}

setScene(new DemoScene());

const loop = new GameLoop({
  update: (dt) => {
    currentScene?.update(dt, sceneContext);
  },
  render: (fps) => {
    currentScene?.render(viewport.context, sceneContext, fps);
  },
});

loop.start();
