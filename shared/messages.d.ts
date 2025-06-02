export type Side = 'left' | 'right';

export interface RemoteState {
  ballX: number;
  ballZ: number;
  leftPaddleZ: number;
  rightPaddleZ: number;
  leftScore: number;
  rightScore: number;
}

export interface InitMessage {
  type: 'init';
  side: Side;
  leftName?: string;
  rightName?: string;
  startTime?: number;
  serverTime?: number;
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

export type ServerMessage = InitMessage | StateMessage | EndMessage;

/**
 * Enum-like object with string constants for message types.
 */
export const MessageTypes: {
  readonly INIT: 'init';
  readonly STATE: 'state';
  readonly END: 'end';
};

export function createInitMessage(
  side: Side,
  leftName?: string,
  rightName?: string,
  startTime?: number,
  serverTime?: number,
): InitMessage;

export function createStateMessage(state: RemoteState): StateMessage;

export function createEndMessage(
  winner: Side,
  state: RemoteState,
  reason?: 'opponent_left',
): EndMessage;
