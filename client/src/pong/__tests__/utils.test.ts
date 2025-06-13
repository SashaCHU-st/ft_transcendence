import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { clamp, resetInput, setupKeyListeners, removeAllKeyListeners } from '../utils';
import { GameMode } from '../pong';
import type { GameState } from '../pong';

function createState(): GameState {
  return {
    physics: {
      FIELD_WIDTH: 0,
      FIELD_HEIGHT: 0,
      PADDLE_SPEED: 1,
      AI_SPEED: 0,
      BALL_SPEED: 0,
      WINNING_SCORE: 0,
    },
    match: {
      playerScore: 0,
      aiScore: 0,
      leftName: '',
      rightName: '',
      isFinalMatch: false,
    },
    input: {
      playerDzLeft: 0,
      playerDzRight: 0,
      aiTimer: 0,
      aiTargetZ: 0,
      aiPrevBallX: 0,
      aiPrevBallZ: 0,
      ballDX: 0,
      ballDZ: 0,
      dramaPhase: 0,
    },
    FIXED_DT: 0,
    accumulator: 0,
    gameStarted: false,
    currentMode: GameMode.AI,
    paused: false,
    manualPaused: false,
    escMenuOpen: false,
    keyDownHandler: null,
    keyUpHandler: null,
    goalTimeout: null,
    ballSpawnTimeout: null,
    powerUps: { available: [], activeLeft: null, activeRight: null },
  };
}

describe('clamp', () => {
  it('limits value to range', () => {
    expect(clamp(10, 0, 5)).toBe(5);
    expect(clamp(-1, 0, 5)).toBe(0);
    expect(clamp(3, 0, 5)).toBe(3);
  });
});

describe('input helpers', () => {
  let state: GameState;

  beforeEach(() => {
    state = createState();
  });

  afterEach(() => {
    removeAllKeyListeners(state);
  });

  it('resetInput clears paddle speeds', () => {
    state.input.playerDzLeft = 2;
    state.input.playerDzRight = 3;
    resetInput(state);
    expect(state.input.playerDzLeft).toBe(0);
    expect(state.input.playerDzRight).toBe(0);
  });

  it('setupKeyListeners updates state on key events', () => {
    setupKeyListeners(state, { up: 'w', down: 's' });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
    expect(state.input.playerDzLeft).toBe(1);
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }));
    expect(state.input.playerDzLeft).toBe(0);
  });

  it('setupKeyListeners handles right paddle keys', () => {
    setupKeyListeners(state, { up: 'w', down: 's' }, { up: 'ArrowUp', down: 'ArrowDown' });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(state.input.playerDzRight).toBe(1);
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
    expect(state.input.playerDzRight).toBe(0);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(state.input.playerDzRight).toBe(-1);
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }));
    expect(state.input.playerDzRight).toBe(0);
  });

  it('removeAllKeyListeners clears handlers and resets input', () => {
    setupKeyListeners(state, { up: 'w', down: 's' });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
    expect(state.input.playerDzLeft).toBe(1);
    removeAllKeyListeners(state);
    expect(state.keyDownHandler).toBeNull();
    expect(state.keyUpHandler).toBeNull();
    expect(state.input.playerDzLeft).toBe(0);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
    expect(state.input.playerDzLeft).toBe(0);
  });
});
