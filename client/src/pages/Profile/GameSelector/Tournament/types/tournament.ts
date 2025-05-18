/** Shared type definitions for the tournament feature. */

export interface LocationState {
  players?: string[];
  winner?: string;
}

export interface Slot {
  name: string;
  isPlayerX: boolean;
}