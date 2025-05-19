// client/src/pong/utils.ts
import type { GameState } from './pong';

export function clamp(v: number, min: number, max: number) {
        return Math.min(max, Math.max(min, v));
  }

export function resetInput(state: GameState) {
        state.playerDzLeft  = 0;
        state.playerDzRight = 0;
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
  