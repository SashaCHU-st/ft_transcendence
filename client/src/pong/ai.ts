// client/src/pong/ai.ts
import type { GameState } from "./pong";
import type { SceneObjects } from "./scene";
import { clamp, dispatchKey } from "./utils";
import { predictImpactZ } from "./physics";
import { PowerUpType, activatePowerUp } from "./powerups";

export const AI_KEYS = {
  up: 'w',
  down: 's',
} as const;

export interface BotBehavior {
  overshoot?: number;
  center?: number;
}

export function calcTargetZ(
  prevX: number,
  prevZ: number,
  dx: number,
  dz: number,
  elapsed: number,
  fieldWidth: number,
  limit: number,
) {
  if (elapsed <= 0) {
    return prevZ;
  }

  const leftX = -fieldWidth + 1.5;
  const rightX = fieldWidth - 1.5;
  let x = prevX;
  let z = prevZ;
  let vx = dx / elapsed;
  const vz = dz / elapsed;

  while ((rightX - x) / vx < 0) {
    const target = vx < 0 ? leftX : rightX;
    z = predictImpactZ(x, z, vx, vz, target, limit);
    x = target;
    vx *= -1;
  }

  return predictImpactZ(x, z, vx, vz, rightX, limit);
}


export function updateAI(state: GameState, objs: SceneObjects, dt: number) {
  const { rightPaddle, ball } = objs;
  const dramaMode = state.bot?.name === "Drama Bot";
  const behavior: BotBehavior = {
    center: state.bot?.center,
    overshoot: state.bot?.overshoot,
  };

  if (
    !state.powerUps.activeRight &&
    state.powerUps.available.length > 0 &&
    state.input.ballDX > 0 &&
    state.match.aiScore <= state.match.playerScore
  ) {
    const pu = state.powerUps.available.shift()!;
    activatePowerUp(state, 'right', pu);
  }

  if (dramaMode) state.input.dramaPhase += dt;
  state.input.aiTimer += dt;
  if (state.input.aiTimer >= state.physics.AI_REACTION) {
    const elapsed = state.input.aiTimer;
    state.input.aiTimer = 0;

    const prevX = state.input.aiPrevBallX;
    const prevZ = state.input.aiPrevBallZ;
    const dx = ball.position.x - prevX;
    const dz = ball.position.z - prevZ;

    state.input.aiPrevBallX = ball.position.x;
    state.input.aiPrevBallZ = ball.position.z;

    const limit = state.physics.FIELD_HEIGHT - 0.5;

    let predicted = calcTargetZ(
      prevX,
      prevZ,
      dx,
      dz,
      elapsed,
      state.physics.FIELD_WIDTH,
      limit,
    );

    if (behavior.center && dx > 0) {
      const targetX = state.physics.FIELD_WIDTH - 1.5;
      const timeToImpact = (targetX - prevX) / (dx / elapsed);
      const adjust =
        behavior.center * Math.max(1 - timeToImpact / state.physics.AI_REACTION, 0);
      predicted += adjust * Math.sign(predicted - rightPaddle.position.z);
    }

    if (behavior.overshoot) {
      predicted +=
        behavior.overshoot * Math.sign(predicted - rightPaddle.position.z);
      predicted = clamp(predicted, -limit, limit);
    }

    let target = predicted + (Math.random() - 0.5) * state.physics.AI_ERROR;
    state.input.aiTargetZ = target;
  }
  let targetZ = state.input.aiTargetZ;
  if (dramaMode) {
    const limit = state.physics.FIELD_HEIGHT - 0.5;
    const osc = Math.sin(state.input.dramaPhase * 8) * 1;
    targetZ = clamp(targetZ + osc, -limit, limit);
    state.input.aiTargetZ = targetZ;
  }
  const diff = targetZ - rightPaddle.position.z;
  if (Math.abs(diff) > 0.4) {
    const up = diff > 0;
    const key = up ? AI_KEYS.up : AI_KEYS.down;
    const other = up ? AI_KEYS.down : AI_KEYS.up;
    dispatchKey(state, other, 'up');
    dispatchKey(state, key, 'down');
  } else {
    dispatchKey(state, AI_KEYS.up, 'up');
    dispatchKey(state, AI_KEYS.down, 'up');
  }
}

