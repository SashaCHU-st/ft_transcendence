export type Side = 'left' | 'right';

export interface RemoteState {
  ballX: number;
  ballZ: number;
  leftPaddleZ: number;
  rightPaddleZ: number;
  leftScore: number;
  rightScore: number;
  activeLeft?: string | null;
  activeRight?: string | null;
}

export interface RemoteSettings {
  powerUps: boolean;
  ballSpeed: number;
  ballSize: number;
  winningScore: number;
  sound: boolean;
  leftColor: string;
  rightColor: string;
}

export interface InitMessage {
  type: 'init';
  side: Side;
  leftName?: string;
  rightName?: string;
  startTime?: number;
  serverTime?: number;
  settings?: RemoteSettings;
}

export interface StateMessage {
  type: 'state';
  state: RemoteState;
}

export interface EndMessage {
  type: 'end';
  winner: Side;
  state: RemoteState;
  reason?: 'opponent_left';
}

export interface PowerMessage {
  type: 'power';
  power: string;
  duration?: number;
}

export interface WaitMessage {
  type: 'wait';
}

export type ServerMessage =
  | InitMessage
  | StateMessage
  | EndMessage
  | PowerMessage
  | WaitMessage;

/**
 * Enum-like object with string constants for message types.
 */
export const MessageTypes: {
  readonly INIT: 'init';
  readonly STATE: 'state';
  readonly END: 'end';
  readonly POWER: 'power';
  readonly WAIT: 'wait';
};

export function createInitMessage(
  side: Side,
  leftName?: string,
  rightName?: string,
  startTime?: number,
  serverTime?: number,
  settings?: RemoteSettings,
): InitMessage;

export function createStateMessage(state: RemoteState): StateMessage;

export function createEndMessage(
  winner: Side,
  state: RemoteState,
  reason?: 'opponent_left',
): EndMessage;
