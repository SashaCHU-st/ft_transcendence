// client/src/pong/modes.ts
import { resetScores, resetPositions } from "./physics";
import { removeAllKeyListeners } from "./utils";
import type { GameState } from "./pong";

/**
 * SINGLE vs AI
 */
export function startSinglePlayerAI(state: GameState) {
  removeAllKeyListeners(state);

  state.currentMode = "ai";
  resetScores(state);
  resetPositions(state);
  state.gameStarted = true;
  state.paused = false;
  state.escMenuOpen = false;
  state.onPauseChange?.(false);
  state.onEscMenuChange?.(false);

  state.leftName = "YOU";
  state.rightName = "AI";
  // Notify React
  state.onPlayersUpdate?.(state.leftName, state.rightName);

  state.keyDownHandler = (e) => {
    if (e.key === "ArrowUp") state.playerDzLeft = -state.PADDLE_SPEED;
    if (e.key === "ArrowDown") state.playerDzLeft = state.PADDLE_SPEED;
  };
  state.keyUpHandler = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      state.playerDzLeft = 0;
    }
  };

  window.addEventListener("keydown", state.keyDownHandler!);
  window.addEventListener("keyup", state.keyUpHandler!);
}

/**
 * LOCAL 2P
 */
export function startLocal2P(state: GameState) {
  removeAllKeyListeners(state);

  state.currentMode = "local2p";
  resetScores(state);
  resetPositions(state);
  state.gameStarted = true;
  state.paused = false;
  state.escMenuOpen = false;
  state.onPauseChange?.(false);
  state.onEscMenuChange?.(false);

  state.leftName = "PLAYER 1";
  state.rightName = "PLAYER 2";
  state.onPlayersUpdate?.(state.leftName, state.rightName);

  state.keyDownHandler = (e) => {
    if (e.key === "w" || e.key === "W")
      state.playerDzLeft = -state.PADDLE_SPEED;
    if (e.key === "s" || e.key === "S") state.playerDzLeft = state.PADDLE_SPEED;

    if (e.key === "ArrowUp") state.playerDzRight = -state.PADDLE_SPEED;
    if (e.key === "ArrowDown") state.playerDzRight = state.PADDLE_SPEED;
  };
  state.keyUpHandler = (e) => {
    if (["w", "W", "s", "S"].includes(e.key)) {
      state.playerDzLeft = 0;
    }
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      state.playerDzRight = 0;
    }
  };

  window.addEventListener("keydown", state.keyDownHandler!);
  window.addEventListener("keyup", state.keyUpHandler!);
}

/**
 * TOURNAMENT match (p1Name, p2Name)
 */
export function startTournamentLocal2P(
  state: GameState,
  p1Name: string,
  p2Name: string,
  isFinal: boolean,
  onMatchEnd: (winnerName: string, loserName: string) => void,
) {
  removeAllKeyListeners(state);

  state.currentMode = "tournament";
  resetScores(state);
  // Reset scores for React
  state.onScoreUpdate?.(state.playerScore, state.aiScore);
  resetPositions(state);

  state.gameStarted = true;
  state.paused = false;
  state.escMenuOpen = false;
  state.onPauseChange?.(false);
  state.onEscMenuChange?.(false);

  state.leftName = p1Name;
  state.rightName = p2Name;
  state.onPlayersUpdate?.(state.leftName, state.rightName);

  state.isFinalMatch = isFinal;
  state.onMatchEndCallback = onMatchEnd;

  // Controls same as local2p
  state.keyDownHandler = (e) => {
    if (e.key === "w" || e.key === "W")
      state.playerDzLeft = -state.PADDLE_SPEED;
    if (e.key === "s" || e.key === "S") state.playerDzLeft = state.PADDLE_SPEED;

    if (e.key === "ArrowUp") state.playerDzRight = -state.PADDLE_SPEED;
    if (e.key === "ArrowDown") state.playerDzRight = state.PADDLE_SPEED;
  };
  state.keyUpHandler = (e) => {
    if (["w", "W", "s", "S"].includes(e.key)) {
      state.playerDzLeft = 0;
    }
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      state.playerDzRight = 0;
    }
  };

  window.addEventListener("keydown", state.keyDownHandler!);
  window.addEventListener("keyup", state.keyUpHandler!);
}
