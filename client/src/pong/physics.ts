// client/src/pong/physics.ts
import * as BABYLON from "@babylonjs/core";
import { leftPaddle, rightPaddle, ball, boom } from "./scene";
import { clamp } from "./utils";
import type { GameState } from "./pong";

export function stepPhysics(state: GameState, dt: number) {
  if (!state.gameStarted || state.paused) return;
  if (!leftPaddle || !rightPaddle || !ball) return;

  leftPaddle.position.z = clamp(
    leftPaddle.position.z + state.playerDzLeft,
    -state.FIELD_HEIGHT + 1.5,
    state.FIELD_HEIGHT - 1.5,
  );

  if (state.currentMode === "ai") {
    state.aiTimer += dt;
    if (state.aiTimer >= 1) {
      state.aiTimer = 0;
      state.aiTargetZ = ball.position.z;
    }
    const diff = state.aiTargetZ - rightPaddle.position.z;
    if (Math.abs(diff) > 0.4) {
      rightPaddle.position.z = clamp(
        rightPaddle.position.z + (diff > 0 ? state.AI_SPEED : -state.AI_SPEED),
        -state.FIELD_HEIGHT + 1.5,
        state.FIELD_HEIGHT - 1.5,
      );
    }
  } else {
    rightPaddle.position.z = clamp(
      rightPaddle.position.z + state.playerDzRight,
      -state.FIELD_HEIGHT + 1.5,
      state.FIELD_HEIGHT - 1.5,
    );
  }

  ball.position.x += state.ballDX;
  ball.position.z += state.ballDZ;

  if (Math.abs(ball.position.z) > state.FIELD_HEIGHT - 0.5) {
    ball.position.z = Math.sign(ball.position.z) * (state.FIELD_HEIGHT - 0.5);
    state.ballDZ *= -1;
    boom(ball.position);
  }

  if (ball.position.x < -state.FIELD_WIDTH) {
    state.aiScore++;
    state.onScoreUpdate?.(state.playerScore, state.aiScore);
    checkWin(state);
    resetBall(state);
  } else if (ball.position.x > state.FIELD_WIDTH) {
    state.playerScore++;
    state.onScoreUpdate?.(state.playerScore, state.aiScore);
    checkWin(state);
    resetBall(state);
  }

  if (hitPaddle(leftPaddle, 1)) {
    state.ballDX = Math.abs(state.ballDX);
    boom(ball.position);
  }
  if (hitPaddle(rightPaddle, -1)) {
    state.ballDX = -Math.abs(state.ballDX);
    boom(ball.position);
  }
}

function hitPaddle(p: BABYLON.Mesh, dir: number) {
  if (!ball) return false;
  return (
    Math.abs(ball.position.z - p.position.z) < 2.5 &&
    Math.sign(ball.position.x - p.position.x) === dir &&
    Math.abs(ball.position.x - p.position.x) < 1.0
  );
}

function checkWin(state: GameState) {
  if (state.playerScore >= state.WINNING_SCORE) {
    endGame(state, "left");
  } else if (state.aiScore >= state.WINNING_SCORE) {
    endGame(state, "right");
  }
}

function endGame(state: GameState, winnerSide: "left" | "right") {
  state.gameStarted = false;
  state.paused = false;
  state.escMenuOpen = false;
  state.onPauseChange?.(false);
  state.onEscMenuChange?.(false);

  const winnerName = winnerSide === "left" ? state.leftName : state.rightName;
  const loserName = winnerSide === "left" ? state.rightName : state.leftName;

  if (state.currentMode === "tournament") {
    // tournament => вызываем onMatchEndCallback
    if (typeof state.onMatchEndCallback === "function") {
      state.onMatchEndCallback(winnerName, loserName);
    }
    return;
  }

  state.onMatchOver?.(
    state.currentMode,
    winnerName,
    state.playerScore,
    state.aiScore,
  );
}

export function resetBall(state: GameState) {
  if (!ball) return;
  ball.position.set(0, 0.5, 0);
  state.ballDX = state.BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  state.ballDZ = state.BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
}

export function resetScores(state: GameState) {
  state.playerScore = 0;
  state.aiScore = 0;
}

export function resetPositions(state: GameState) {
  if (!leftPaddle || !rightPaddle) return;
  leftPaddle.position.set(-state.FIELD_WIDTH + 1.5, 0.5, 0);
  rightPaddle.position.set(state.FIELD_WIDTH - 1.5, 0.5, 0);
  resetBall(state);
}
