export enum PowerUpType {
  Speed = 'speed',
}

export interface PowerUp {
  type: PowerUpType;
  duration: number;
}

export interface ActivePowerUp {
  type: PowerUpType;
  timer: number;
}

export interface PowerUpState {
  available: PowerUp[];
  activeLeft: ActivePowerUp | null;
  activeRight: ActivePowerUp | null;
}

export function activatePowerUp(
  state: { powerUps: PowerUpState },
  side: 'left' | 'right',
  powerUp: PowerUp,
) {
  const active: ActivePowerUp = { type: powerUp.type, timer: powerUp.duration };
  if (side === 'left') state.powerUps.activeLeft = active;
  else state.powerUps.activeRight = active;
}

export function updatePowerUps(state: { powerUps: PowerUpState }, dt: number) {
  if (state.powerUps.activeLeft) {
    state.powerUps.activeLeft.timer -= dt;
    if (state.powerUps.activeLeft.timer <= 0) state.powerUps.activeLeft = null;
  }
  if (state.powerUps.activeRight) {
    state.powerUps.activeRight.timer -= dt;
    if (state.powerUps.activeRight.timer <= 0)
      state.powerUps.activeRight = null;
  }
}
