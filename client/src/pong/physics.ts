// client/src/pong/physics.ts
import * as BABYLON from "@babylonjs/core";
import type { SceneObjects } from "./scene";
import { boom } from "./scene";
import { clamp } from "./utils";
import type { GameState } from "./pong";
import { GameMode } from "./pong";

export function stepPhysics(state: GameState, objs: SceneObjects, dt: number) {
  if (!state.gameStarted || state.paused) return;
  const { leftPaddle, rightPaddle, ball, scene } = objs;

  leftPaddle.position.z = clamp(
    leftPaddle.position.z + state.input.playerDzLeft,
    -state.physics.FIELD_HEIGHT + 1.5,
    state.physics.FIELD_HEIGHT - 1.5,
  );

  if (state.currentMode === GameMode.AI) {
    state.input.aiTimer += dt;
    if (state.input.aiTimer >= 1) {
      state.input.aiTimer = 0;
      state.input.aiTargetZ = ball.position.z;
    }
    const diff = state.input.aiTargetZ - rightPaddle.position.z;
    if (Math.abs(diff) > 0.4) {
      rightPaddle.position.z = clamp(
        rightPaddle.position.z +
          (diff > 0 ? state.physics.AI_SPEED : -state.physics.AI_SPEED),
        -state.physics.FIELD_HEIGHT + 1.5,
        state.physics.FIELD_HEIGHT - 1.5,
      );
    }
  } else {
    rightPaddle.position.z = clamp(
      rightPaddle.position.z + state.input.playerDzRight,
      -state.physics.FIELD_HEIGHT + 1.5,
      state.physics.FIELD_HEIGHT - 1.5,
    );
  }

  ball.position.x += state.input.ballDX;
  ball.position.z += state.input.ballDZ;

  if (Math.abs(ball.position.z) > state.physics.FIELD_HEIGHT - 0.5) {
    ball.position.z =
      Math.sign(ball.position.z) * (state.physics.FIELD_HEIGHT - 0.5);
    state.input.ballDZ *= -1;
    boom(scene, ball.position);
  }

  if (ball.position.x < -state.physics.FIELD_WIDTH) {
    state.match.aiScore++;
    state.onScoreUpdate?.(state.match.playerScore, state.match.aiScore);
    checkWin(state);
    resetBall(state, objs);
  } else if (ball.position.x > state.physics.FIELD_WIDTH) {
    state.match.playerScore++;
    state.onScoreUpdate?.(state.match.playerScore, state.match.aiScore);
    checkWin(state);
    resetBall(state, objs);
  }

  if (hitPaddle(ball, leftPaddle, 1)) {
    state.input.ballDX = Math.abs(state.input.ballDX);
    boom(scene, ball.position);
  }
  if (hitPaddle(ball, rightPaddle, -1)) {
    state.input.ballDX = -Math.abs(state.input.ballDX);
    boom(scene, ball.position);
  }
}

function hitPaddle(ball: BABYLON.Mesh, p: BABYLON.Mesh, dir: number) {
  return (
    Math.abs(ball.position.z - p.position.z) < 2.5 &&
    Math.sign(ball.position.x - p.position.x) === dir &&
    Math.abs(ball.position.x - p.position.x) < 1.0
  );
}

function checkWin(state: GameState) {
  if (state.match.playerScore >= state.physics.WINNING_SCORE) {
    endGame(state, "left");
  } else if (state.match.aiScore >= state.physics.WINNING_SCORE) {
    endGame(state, "right");
  }
}

function endGame(state: GameState, winnerSide: "left" | "right") {
  state.gameStarted = false;
  state.paused = false;
  state.escMenuOpen = false;
  state.onPauseChange?.(false);
  state.onEscMenuChange?.(false);

  const winnerName =
    winnerSide === "left" ? state.match.leftName : state.match.rightName;
  const loserName =
    winnerSide === "left" ? state.match.rightName : state.match.leftName;
  const winnerScore =
    winnerSide === "left"
      ? state.match.playerScore
      : state.match.aiScore;
  const loserScore =
    winnerSide === "left"
      ? state.match.aiScore
      : state.match.playerScore;

  if (state.currentMode === GameMode.Tournament) {
    // tournament => call onMatchEndCallback
    if (typeof state.onMatchEndCallback === "function") {
      state.onMatchEndCallback(winnerName, loserName, winnerScore, loserScore);
    }
    return;
  }

  state.onMatchOver?.(
    state.currentMode,
    winnerName,
    state.match.playerScore,
    state.match.aiScore,
  );
}

export function resetBall(state: GameState, objs: SceneObjects) {
  const { ball } = objs;
  ball.position.set(0, 0.5, 0);
  state.input.ballDX =
    state.physics.BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  state.input.ballDZ =
    state.physics.BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
}

export function resetScores(state: GameState) {
  state.match.playerScore = 0;
  state.match.aiScore = 0;
}

export function resetPositions(state: GameState, objs: SceneObjects) {
  const { leftPaddle, rightPaddle } = objs;
  leftPaddle.position.set(-state.physics.FIELD_WIDTH + 1.5, 0.5, 0);
  rightPaddle.position.set(state.physics.FIELD_WIDTH - 1.5, 0.5, 0);
  resetBall(state, objs);
}
