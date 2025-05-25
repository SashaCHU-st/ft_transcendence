export interface PhysicsParams {
  FIELD_WIDTH: number;
  FIELD_HEIGHT: number;
  PADDLE_SPEED: number;
  AI_SPEED: number;
  BALL_SPEED: number;
  WINNING_SCORE: number;
}

export interface MatchInfo {
  playerScore: number;
  aiScore: number;
  leftName: string;
  rightName: string;
  isFinalMatch: boolean;
}

export interface InputState {
  playerDzLeft: number;
  playerDzRight: number;
  aiTimer: number;
  aiTargetZ: number;
  ballDX: number;
  ballDZ: number;
}
