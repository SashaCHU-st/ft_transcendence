// client/src/pong/physics.ts
import * as BABYLON from "@babylonjs/core";
import type { SceneObjects } from "./scene";
import { boom, bigBoom } from "./scene";
import { clamp } from "./utils";
import type { GameState } from "./pong";
import { GameMode } from "./pong";
import { playPaddleSound } from "./sound";
import { updateAI } from "./ai";
import { updatePowerUps, PowerUpType } from "./powerups";

export function stepPhysics(state: GameState, objs: SceneObjects, dt: number) {
  if (!state.gameStarted || state.paused) return;
  const { leftPaddle, rightPaddle, ball, scene } = objs;
  const chefMode = state.bot?.name === "Steady Chef";

  updatePowerUps(state, dt);

  if (state.currentMode === GameMode.Remote2P) {
    const s = state.remoteState;
    if (s) {
      const scoreChanged =
        s.leftScore !== state.match.playerScore ||
        s.rightScore !== state.match.aiScore;
      leftPaddle.position.z = s.leftPaddleZ;
      rightPaddle.position.z = s.rightPaddleZ;
      ball.position.x = s.ballX;
      ball.position.z = s.ballZ;

      if (
        typeof state.remoteBallDX === 'number' &&
        typeof state.remotePrevBallDX === 'number'
      ) {
        const leftX = -state.physics.FIELD_WIDTH + 1.5;
        const rightX = state.physics.FIELD_WIDTH - 1.5;
        if (
          Math.sign(state.remoteBallDX) !== Math.sign(state.remotePrevBallDX)
        ) {
          if (
            Math.abs(ball.position.x - leftX) < 1.2 ||
            Math.abs(ball.position.x - rightX) < 1.2
          ) {
            playPaddleSound();
          }
        }
        state.remotePrevBallDX = state.remoteBallDX;
      }

      state.match.playerScore = s.leftScore;
      state.match.aiScore = s.rightScore;
      if (scoreChanged) {
        state.onScoreUpdate?.(state.match.playerScore, state.match.aiScore);
        playRemoteGoalAnimation(state, objs);
      }
    }
    return;
  }

  const leftSpeedMultiplier =
    state.powerUps.activeLeft?.type === PowerUpType.Speed ? 1.5 : 1;
  leftPaddle.position.z = clamp(
    leftPaddle.position.z + state.input.playerDzLeft * leftSpeedMultiplier,
    -state.physics.FIELD_HEIGHT + 1.5,
    state.physics.FIELD_HEIGHT - 1.5,
  );


  if (state.currentMode === GameMode.AI) {
    updateAI(state, objs, dt);
  }


  const rightSpeedMultiplier =
    state.powerUps.activeRight?.type === PowerUpType.Speed ? 1.5 : 1;
  rightPaddle.position.z = clamp(
    rightPaddle.position.z + state.input.playerDzRight * rightSpeedMultiplier,
    -state.physics.FIELD_HEIGHT + 1.5,
    state.physics.FIELD_HEIGHT - 1.5,
  );

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
    if (state.gameStarted) playGoalAnimation(state, objs);
  } else if (ball.position.x > state.physics.FIELD_WIDTH) {
    state.match.playerScore++;
    state.onScoreUpdate?.(state.match.playerScore, state.match.aiScore);
    checkWin(state);
    if (state.gameStarted) playGoalAnimation(state, objs);
  }

  if (hitPaddle(ball, leftPaddle, 1)) {
    state.input.ballDX = Math.abs(state.input.ballDX);
    boom(scene, ball.position);
    playPaddleSound();
  }
  if (hitPaddle(ball, rightPaddle, -1)) {
    state.input.ballDX = -Math.abs(state.input.ballDX);
    boom(scene, ball.position);
    playPaddleSound();
    if (chefMode) {
      state.input.aiTargetZ = 0;
    }
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
    winnerSide === "left" ? state.match.playerScore : state.match.aiScore;
  const loserScore =
    winnerSide === "left" ? state.match.aiScore : state.match.playerScore;

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
  state.input.aiPrevBallX = ball.position.x;
  state.input.aiPrevBallZ = ball.position.z;
  state.input.aiTimer = 0;
  const dx = state.physics.BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  const dz = state.physics.BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  state.input.ballDX = 0;
  state.input.ballDZ = 0;
  state.input.aiTargetZ = 0;
  if (state.ballSpawnTimeout) clearTimeout(state.ballSpawnTimeout);
  state.ballSpawnTimeout = setTimeout(() => {
    state.input.ballDX = dx;
    state.input.ballDZ = dz;
    state.ballSpawnTimeout = null;
  }, 1000);
}

export function spawnBall(objs: SceneObjects) {
  const { ball, scene } = objs;
  const FR = 60;
  if (typeof scene.beginAnimation !== "function") return;
  boom(scene, ball.position);
  ball.scaling = new BABYLON.Vector3(0, 0, 0);
  const anim = new BABYLON.Animation(
    "spawn",
    "scaling",
    FR,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  );
  anim.setKeys([
    { frame: 0, value: new BABYLON.Vector3(0, 0, 0) },
    { frame: FR * 0.5, value: new BABYLON.Vector3(1, 1, 1) },
  ]);
  ball.animations = [anim];
  scene.beginAnimation(ball, 0, FR * 0.5, false);
}

export function resetScores(state: GameState) {
  state.match.playerScore = 0;
  state.match.aiScore = 0;
}

export function resetPositions(
  state: GameState,
  objs: SceneObjects,
  animate = true,
) {
  const { leftPaddle, rightPaddle } = objs;
  leftPaddle.position.set(-state.physics.FIELD_WIDTH + 1.5, 0.5, 0);
  rightPaddle.position.set(state.physics.FIELD_WIDTH - 1.5, 0.5, 0);
  resetBall(state, objs);
  if (animate) spawnBall(objs);
}

export function playGoalAnimation(state: GameState, objs: SceneObjects) {
  const { ball, scene } = objs;
  const FR = 60;

  state.paused = true;
  bigBoom(scene, ball.position);
  const scaleDown = new BABYLON.Animation(
    "goalDown",
    "scaling",
    FR,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  );
  scaleDown.setKeys([
    { frame: 0, value: ball.scaling.clone() },
    { frame: FR * 0.1, value: new BABYLON.Vector3(0, 0, 0) },
  ]);
  ball.animations = [scaleDown];
  scene.beginAnimation(ball, 0, FR * 0.1, false);

  if (state.goalTimeout) clearTimeout(state.goalTimeout);
  state.goalTimeout = setTimeout(() => {
    resetBall(state, objs);
    spawnBall(objs);
    state.goalTimeout = null;
    state.paused = state.manualPaused;
    state.onPauseChange?.(state.paused);
  }, 1000);
}

export function playRemoteGoalAnimation(state: GameState, objs: SceneObjects) {
  const { ball, scene } = objs;
  const FR = 60;

  state.paused = true;
  bigBoom(scene, ball.position);
  const scaleDown = new BABYLON.Animation(
    "remoteGoalDown",
    "scaling",
    FR,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  );
  scaleDown.setKeys([
    { frame: 0, value: ball.scaling.clone() },
    { frame: FR * 0.1, value: new BABYLON.Vector3(0, 0, 0) },
  ]);
  ball.animations = [scaleDown];
  scene.beginAnimation(ball, 0, FR * 0.1, false);

  // Spawn the ball immediately so it waits one second before moving
  spawnBall(objs);

  if (state.goalTimeout) clearTimeout(state.goalTimeout);
  state.goalTimeout = setTimeout(() => {
    state.goalTimeout = null;
    state.paused = state.manualPaused;
    state.onPauseChange?.(state.paused);
  }, 1000);
}

export let predictImpactZ = (
  x0: number,
  z0: number,
  vx: number,
  vz: number,
  targetX: number,
  limit: number,
) => {
  if (!isFinite(vx) || vx === 0) return z0;
  let t = (targetX - x0) / vx;
  if (t <= 0) return z0;
  let z = z0;
  let dz = vz;
  const top = limit;
  const bottom = -limit;
  while (t > 0) {
    if (!isFinite(dz) || dz === 0) return z;
    const targetZ = dz >= 0 ? top : bottom;
    const timeToWall = (targetZ - z) / dz;
    if (timeToWall >= t) {
      z += dz * t;
      break;
    }
    z = targetZ;
    dz *= -1;
    t -= timeToWall;
  }
  return z;
};

export function __setPredictImpactZ(fn: typeof predictImpactZ) {
  predictImpactZ = fn;
}
