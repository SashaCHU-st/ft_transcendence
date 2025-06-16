/**
 * Shared power-up configuration and type definitions used in both the
 * client and server.
 */

/**
 * Default effect values when no power-up is active.
 * @type {{ readonly speed: number, readonly scale: number, readonly powerShot: boolean }}
 */
export const DEFAULT_EFFECTS = {
  speed: 1,
  scale: 1,
  powerShot: false,
};

/**
 * Map of available power-ups and their configuration.
 * @type {{
 *   readonly speed: { icon: string, label: string, defaultDuration: number, effect: Partial<typeof DEFAULT_EFFECTS> },
 *   readonly mega: { icon: string, label: string, defaultDuration: number, effect: Partial<typeof DEFAULT_EFFECTS> },
 *   readonly power: { icon: string, label: string, defaultDuration: number, effect: Partial<typeof DEFAULT_EFFECTS> },
 * }}
 */
export const POWER_UPS = {
  speed: {
    icon: '⚡',
    label: 'Speed boost: doubles paddle speed',
    defaultDuration: 8,
    effect: { speed: 2 },
  },
  mega: {
    icon: '🛡',
    label: 'Mega paddle: increases paddle length',
    defaultDuration: 12,
    effect: { scale: 1.5 },
  },
  power: {
    icon: '💥',
    label: 'Power shot: doubles ball speed on hit',
    defaultDuration: 10,
    effect: { powerShot: true },
  },
};
