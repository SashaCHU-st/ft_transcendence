// client/src/pong/pong.ts
import * as BABYLON from "@babylonjs/core";
import { createScene, fitFieldToCamera } from "./scene";
import { stepPhysics, resetScores, resetPositions } from "./physics";
import {
  startSinglePlayerAI,
  startLocal2P,
  startTournamentLocal2P,
} from "./modes";
import { removeAllKeyListeners } from "./utils";

export interface GameState {
  FIELD_WIDTH: number;
  FIELD_HEIGHT: number;
  PADDLE_SPEED: number;
  AI_SPEED: number;
  BALL_SPEED: number;
  WINNING_SCORE: number;

  FIXED_DT: number;
  accumulator: number;

  gameStarted: boolean;
  currentMode: "ai" | "local2p" | "tournament";
  paused: boolean;
  escMenuOpen: boolean;

  playerScore: number;
  aiScore: number;

  leftName: string;
  rightName: string;

  onScoreUpdate?: (plScore: number, aiScore: number) => void;
  onPauseChange?: (paused: boolean) => void;
  onEscMenuChange?: (show: boolean) => void;
  onMatchOver?: (
    mode: "ai" | "local2p" | "tournament",
    winnerName: string,
    plScore: number,
    aiScore: number,
  ) => void;
  onPlayersUpdate?: (leftName: string, rightName: string) => void;

  onMatchEndCallback?: (winner: string, loser: string) => void;
  isFinalMatch: boolean;

  playerDzLeft: number;
  playerDzRight: number;

  aiTimer: number;
  aiTargetZ: number;
  ballDX: number;
  ballDZ: number;

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
    onMatchEnd: (winner: string, loser: string) => void,
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
    mode: "ai" | "local2p" | "tournament",
    winnerName: string,
    plScore: number,
    aiScore: number,
  ) => void;
  onPlayersUpdate?: (leftName: string, rightName: string) => void;
}

export function initGame(
  canvas: HTMLCanvasElement,
  callbacks?: PongCallbacks,
): GameAPI {
  const engine = new BABYLON.Engine(canvas, true);

  const state: GameState = {
    FIELD_WIDTH: 20,
    FIELD_HEIGHT: 10,
    PADDLE_SPEED: 0.3,
    AI_SPEED: 0.3,
    BALL_SPEED: 0.25,
    WINNING_SCORE: 1,

    FIXED_DT: 1 / 60,
    accumulator: 0,

    gameStarted: false,
    currentMode: "ai",
    paused: false,
    escMenuOpen: false,

    playerScore: 0,
    aiScore: 0,

    leftName: "PLAYER",
    rightName: "AI",

    onScoreUpdate: callbacks?.onScoreUpdate,
    onPauseChange: callbacks?.onPauseChange,
    onEscMenuChange: callbacks?.onEscMenuChange,
    onMatchOver: callbacks?.onMatchOver,
    onPlayersUpdate: callbacks?.onPlayersUpdate,

    onMatchEndCallback: undefined,
    isFinalMatch: false,

    playerDzLeft: 0,
    playerDzRight: 0,

    aiTimer: 0,
    aiTargetZ: 0,
    ballDX: 0,
    ballDZ: 0,

    keyDownHandler: null,
    keyUpHandler: null,
  };

  createScene(engine, canvas, state);

  state.ballDX = state.BALL_SPEED;
  state.ballDZ = state.BALL_SPEED;

  engine.runRenderLoop(() => {
    const dt = engine.getDeltaTime() / 1000;
    state.accumulator += dt;
    while (state.accumulator >= state.FIXED_DT) {
      stepPhysics(state, state.FIXED_DT);
      state.accumulator -= state.FIXED_DT;
    }
    engine.scenes[0]?.render();
  });

  const resizeHandler = () => {
    engine.resize();
    fitFieldToCamera(state.FIELD_WIDTH, state.FIELD_HEIGHT);
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
      startSinglePlayerAI(state);
    },
    startLocal2P: () => {
      startLocal2P(state);
    },
    startTournamentMatch: (p1, p2, isF, cb) => {
      startTournamentLocal2P(state, p1, p2, isF, cb);
    },
    backToMenu: () => {
      removeAllKeyListeners(state);
      resetScores(state);
      resetPositions(state);
      state.gameStarted = false;
      state.paused = false;
      state.escMenuOpen = false;
      state.onPauseChange?.(false);
      state.onEscMenuChange?.(false);
    },
    restartCurrentMatch: () => {
      removeAllKeyListeners(state);
      resetScores(state);
      state.onScoreUpdate?.(state.playerScore, state.aiScore);
      resetPositions(state);

      state.gameStarted = true;
      state.paused = false;
      state.escMenuOpen = false;
      state.onPauseChange?.(false);
      state.onEscMenuChange?.(false);

      if (state.currentMode === "ai") {
        startSinglePlayerAI(state);
      } else if (state.currentMode === "local2p") {
        startLocal2P(state);
      } else if (state.currentMode === "tournament") {
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

  return api;
}
