import { describe, it, expect, beforeEach, vi } from 'vitest';
// Mocks must be defined before importing tested modules
vi.mock('../scene', () => {
  function mesh() {
    return {
      position: {
        x: 0,
        y: 0,
        z: 0,
        set(x: number, y: number, z: number) {
          this.x = x;
          this.y = y;
          this.z = z;
        },
      },
    };
  }
  return {
    createScene: vi.fn(() => ({
      scene: {},
      camera: {},
      leftPaddle: mesh(),
      rightPaddle: mesh(),
      ball: mesh(),
    })),
    fitFieldToCamera: vi.fn(),
    boom: vi.fn(),
    bigBoom: vi.fn(),
  };
});

vi.mock('@babylonjs/core', () => {
  class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x = 0, y = 0, z = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    clone() {
      return new Vector3(this.x, this.y, this.z);
    }
  }

  class Animation {
    static ANIMATIONTYPE_VECTOR3 = 0;
    static ANIMATIONLOOPMODE_CONSTANT = 0;
    keys: any[] = [];
    constructor(
      public name: string,
      public prop: string,
      public rate: number,
      public type: number,
      public loop: number,
    ) {}
    setKeys(keys: any[]) {
      this.keys = keys;
    }
  }

  return {
    Engine: class {
      scenes = [{}];
      runRenderLoop() {}
      stopRenderLoop() {}
      dispose() {}
      resize() {}
      getDeltaTime() {
        return 16;
      }
    },
    Vector3,
    Animation,
  };
});

import { initGame, GameMode } from '../pong';
import type { GameAPI } from '../pong';
import { playGoalAnimation } from '../physics';
import type { GameState } from '../pong';


let api: GameAPI & { __state: any };

beforeEach(() => {
  const canvas = document.createElement('canvas');
  api = initGame(canvas) as any;
});

function createState(): GameState {
  return {
    physics: {
      FIELD_WIDTH: 10,
      FIELD_HEIGHT: 5,
      PADDLE_SPEED: 1,
      AI_SPEED: 0,
      BALL_SPEED: 1,
      WINNING_SCORE: 3,
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
      ballDX: 0,
      ballDZ: 0,
    },
    FIXED_DT: 0,
    accumulator: 0,
    gameStarted: true,
    currentMode: GameMode.AI,
    paused: false,
    manualPaused: false,
    escMenuOpen: false,
    keyDownHandler: null,
    keyUpHandler: null,
    goalTimeout: null,
  };
}

function mesh() {
  return {
    position: {
      x: 0,
      y: 0,
      z: 0,
      set(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
      },
    },
    scaling: {
      x: 1,
      y: 1,
      z: 1,
      clone() {
        return { x: this.x, y: this.y, z: this.z };
      },
    },
    animations: [] as any[],
  };
}

function createObjs() {
  return {
    scene: { beginAnimation: vi.fn() },
    leftPaddle: mesh(),
    rightPaddle: mesh(),
    ball: mesh(),
  };
}

describe('start modes', () => {
  it('starts games paused', () => {
    api.startSinglePlayerAI();
    expect(api.__state.paused).toBe(true);
    api.startLocal2P();
    expect(api.__state.paused).toBe(true);
    api.startTournamentMatch('A','B',false, vi.fn());
    expect(api.__state.paused).toBe(true);
  });
});

describe('pause behaviour', () => {
  beforeEach(() => {
    api.startSinglePlayerAI();
    api.__state.match.playerScore = 1;
  });

  it('toggles only on space', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(api.__state.paused).toBe(true);
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
    expect(api.__state.paused).toBe(false);
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
    expect(api.__state.paused).toBe(true);
    expect(api.__state.match.playerScore).toBe(1);
  });
});

describe('esc menu', () => {
  beforeEach(() => {
    api.startSinglePlayerAI();
    api.__state.match.aiScore = 2;
  });

  it('opens and closes only with esc and keeps score', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(api.__state.escMenuOpen).toBe(true);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(api.__state.escMenuOpen).toBe(true);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(api.__state.escMenuOpen).toBe(false);
    expect(api.__state.aiScore).toBeUndefined();
    expect(api.__state.match.aiScore).toBe(2);
  });
});

describe('unpause api', () => {
  it('does not reset scores', () => {
    api.startSinglePlayerAI();
    api.__state.match.playerScore = 3;
    api.unpause?.();
    expect(api.__state.paused).toBe(false);
    expect(api.__state.match.playerScore).toBe(3);
  });
});

describe('goal timeout lock', () => {
  beforeEach(() => {
    api.startSinglePlayerAI();
    api.__state.goalTimeout = {} as any;
    api.__state.paused = true;
  });

  it('ignores space key', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
    expect(api.__state.paused).toBe(true);
  });

  it('cannot close esc menu', () => {
    api.__state.escMenuOpen = true;
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(api.__state.escMenuOpen).toBe(true);
    expect(api.__state.paused).toBe(true);
  });

  it('blocks unpause api', () => {
    api.unpause?.();
    expect(api.__state.paused).toBe(true);
  });
});

describe('manual pause during goal animation', () => {
  it('remains paused after timeout', () => {
    vi.useFakeTimers();
    const state = createState();
    const objs = createObjs();
    playGoalAnimation(state as any, objs as any);
    state.manualPaused = true;
    vi.runAllTimers();
    expect(state.paused).toBe(true);
    vi.useRealTimers();
  });
});
