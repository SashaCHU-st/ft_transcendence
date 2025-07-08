export interface EffectValues {
  speed: number;
  scale: number;
  powerShot: boolean;
}

export interface PowerUpInfo {
  icon: string;
  label: string;
  defaultDuration: number;
  effect: Partial<EffectValues>;
}

export const DEFAULT_EFFECTS: EffectValues;

export const POWER_UPS: {
  readonly speed: PowerUpInfo;
  readonly mega: PowerUpInfo;
  readonly power: PowerUpInfo;
};
