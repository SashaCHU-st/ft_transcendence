// client/src/pong/pong.ts
import * as BABYLON from "@babylonjs/core";
import { createScene, fitFieldToCamera, type SceneObjects } from "./scene";
import { stepPhysics, resetScores, resetPositions } from "./physics";
import type { PhysicsParams, MatchInfo, InputState } from "./types";
import {
  startSinglePlayerAI,
  startLocal2P,
  startTournamentLocal2P,
} from "./modes";
import { removeAllKeyListeners } from "./utils";

export enum GameMode {
  AI = "ai",
  Local2P = "local2p",
  Tournament = "tournament",
}

export interface GameState {
  physics: PhysicsParams;
  match: MatchInfo;
  input: InputState;

  FIXED_DT: number;
  accumulator: number;

  gameStarted: boolean;
  currentMode: GameMode;
  paused: boolean;
  escMenuOpen: boolean;

  onScoreUpdate?: (plScore: number, aiScore: number) => void;
  onPauseChange?: (paused: boolean) => void;
  onEscMenuChange?: (show: boolean) => void;
  onMatchOver?: (
    mode: GameMode,
    winnerName: string,
    plScore: number,
    aiScore: number
  ) => void;
  onPlayersUpdate?: (leftName: string, rightName: string) => void;

  onMatchEndCallback?: (
    winner: string,
    loser: string,
    winnerScore: number,
    loserScore: number
  ) => void;

  keyDownHandler: ((e: KeyboardEvent) => void) | null;
  keyUpHandler: ((e: KeyboardEvent) => void) | null;
}

export interface GameAPI {
  startSinglePlayerAI: () => void;
  startLocal2P: () => void;
  startTournamentMatch: (
    p1Name: string,
    p2Name: string,
    isFinal: boolean,
    onMatchEnd: (
      winner: string,
      loser: string,
      winnerScore: number,
      loserScore: number
    ) => void
  ) => void;
  backToMenu: () => void;

  restartCurrentMatch?: () => void;
  unpause?: () => void;
  dispose: () => void;
}

export interface PongCallbacks {
  onScoreUpdate?: (plScore: number, aiScore: number) => void;
  onPauseChange?: (paused: boolean) => void;
  onEscMenuChange?: (show: boolean) => void;
  onMatchOver?: (
    mode: GameMode,
    winnerName: string,
    plScore: number,
    aiScore: number
  ) => void;
  onPlayersUpdate?: (leftName: string, rightName: string) => void;
}

export function initGame(
  canvas: HTMLCanvasElement,
  callbacks?: PongCallbacks
): GameAPI {
  const engine = new BABYLON.Engine(canvas, true);

  const state: GameState = {
    physics: {
      FIELD_WIDTH: 20,
      FIELD_HEIGHT: 10,
      PADDLE_SPEED: 0.3,
      AI_SPEED: 0.3,
      BALL_SPEED: 0.25,
      WINNING_SCORE: 3,
    },
    match: {
      playerScore: 0,
      aiScore: 0,
      leftName: "PLAYER",
      rightName: "AI",
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

    FIXED_DT: 1 / 60,
    accumulator: 0,

    gameStarted: false,
    currentMode: GameMode.AI,
    paused: false,
    escMenuOpen: false,

    onScoreUpdate: callbacks?.onScoreUpdate,
    onPauseChange: callbacks?.onPauseChange,
    onEscMenuChange: callbacks?.onEscMenuChange,
    onMatchOver: callbacks?.onMatchOver,
    onPlayersUpdate: callbacks?.onPlayersUpdate,

    onMatchEndCallback: undefined,

    keyDownHandler: null,
    keyUpHandler: null,
  };

  const sceneObjects: SceneObjects = createScene(engine, canvas, state.physics);

  state.input.ballDX = state.physics.BALL_SPEED;
  state.input.ballDZ = state.physics.BALL_SPEED;

  engine.runRenderLoop(() => {
    const dt = engine.getDeltaTime() / 1000;
    state.accumulator += dt;
    while (state.accumulator >= state.FIXED_DT) {
      stepPhysics(state, sceneObjects, state.FIXED_DT);
      state.accumulator -= state.FIXED_DT;
    }
    engine.scenes[0]?.render();
  });

  const resizeHandler = () => {
    engine.resize();
    fitFieldToCamera(
      sceneObjects.camera,
      state.physics.FIELD_WIDTH,
      state.physics.FIELD_HEIGHT
    );
  };
  window.addEventListener("resize", resizeHandler);

  // ESC / Space
  const keydownHandler = (e: KeyboardEvent) => {
    if (!state.gameStarted) return;
    if (e.key === "Escape") {
      if (!state.escMenuOpen) {
        state.escMenuOpen = true;
        state.paused = true;
        state.onPauseChange?.(true);
        state.onEscMenuChange?.(true);
      } else {
        state.escMenuOpen = false;
        state.paused = false;
        state.onPauseChange?.(false);
        state.onEscMenuChange?.(false);
      }
      return;
    }
    if (e.code === "Space") {
      if (state.escMenuOpen) return;
      state.paused = !state.paused;
      state.onPauseChange?.(state.paused);
    }
  };
  window.addEventListener("keydown", keydownHandler);

  const api: GameAPI = {
    startSinglePlayerAI: () => {
      startSinglePlayerAI(state, sceneObjects);
    },
    startLocal2P: () => {
      startLocal2P(state, sceneObjects);
    },
    startTournamentMatch: (p1, p2, isF, cb) => {
      startTournamentLocal2P(state, sceneObjects, p1, p2, isF, cb);
    },
    backToMenu: () => {
      removeAllKeyListeners(state);
      resetScores(state);
      resetPositions(state, sceneObjects);
      state.gameStarted = false;
      state.paused = false;
      state.escMenuOpen = false;
      state.onPauseChange?.(false);
      state.onEscMenuChange?.(false);
    },
    restartCurrentMatch: () => {
      removeAllKeyListeners(state);
      resetScores(state);
      state.onScoreUpdate?.(state.match.playerScore, state.match.aiScore);
      resetPositions(state, sceneObjects);

      state.gameStarted = true;
      state.paused = true;
      state.escMenuOpen = false;
      state.onPauseChange?.(true);
      state.onEscMenuChange?.(false);

      if (state.currentMode === GameMode.AI) {
        startSinglePlayerAI(state, sceneObjects);
      } else if (state.currentMode === GameMode.Local2P) {
        startLocal2P(state, sceneObjects);
      }
    },
    unpause: () => {
      state.paused = false;
      state.escMenuOpen = false;
      state.onPauseChange?.(false);
      state.onEscMenuChange?.(false);
    },
    dispose: () => {
      engine.stopRenderLoop();
      engine.dispose();
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("keydown", keydownHandler);
      removeAllKeyListeners(state);
    },
  };

  // !! exposing internal state for tests
  (api as any).__state = state;

  return api;
}
