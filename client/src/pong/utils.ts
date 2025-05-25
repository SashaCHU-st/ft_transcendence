
import type { GameState } from './pong';

export function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function resetInput(state: GameState) {
  state.input.playerDzLeft = 0;
  state.input.playerDzRight = 0;
}

export function removeAllKeyListeners(state: GameState) {
  if (state.keyDownHandler) {
    window.removeEventListener('keydown', state.keyDownHandler);
    state.keyDownHandler = null;
  }
  if (state.keyUpHandler) {
    window.removeEventListener('keyup', state.keyUpHandler);
    state.keyUpHandler = null;
  }
  resetInput(state);
}

export interface PaddleKeys {
  up: string | string[];
  down: string | string[];
}

function keyMatch(target: string, keys: string | string[]) {
  return Array.isArray(keys) ? keys.includes(target) : target === keys;
}

export function setupKeyListeners(
  state: GameState,
  left: PaddleKeys,
  right?: PaddleKeys,
) {
  state.keyDownHandler = (e: KeyboardEvent) => {
    if (keyMatch(e.key, left.up))
      state.input.playerDzLeft = state.physics.PADDLE_SPEED;
    if (keyMatch(e.key, left.down))
      state.input.playerDzLeft = -state.physics.PADDLE_SPEED;

    if (right) {
      if (keyMatch(e.key, right.up))
        state.input.playerDzRight = state.physics.PADDLE_SPEED;
      if (keyMatch(e.key, right.down))
        state.input.playerDzRight = -state.physics.PADDLE_SPEED;
    }
  };

  state.keyUpHandler = (e: KeyboardEvent) => {
    if (keyMatch(e.key, left.up) || keyMatch(e.key, left.down))
      state.input.playerDzLeft = 0;

    if (
      right &&
      (keyMatch(e.key, right.up) || keyMatch(e.key, right.down))
    )
      state.input.playerDzRight = 0;
  };

  window.addEventListener('keydown', state.keyDownHandler!);
  window.addEventListener('keyup', state.keyUpHandler!);
}


