export type Side = 'left' | 'right';

export const SIDES: readonly Side[] = ['left', 'right'] as const;

export interface PhysicsParams {
  FIELD_WIDTH: number;
  FIELD_HEIGHT: number;
  PADDLE_SPEED: number;
  AI_SPEED: number;
  AI_REACTION: number;
  AI_ERROR: number;
  BALL_SPEED: number;
  BALL_SIZE: number;
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
  /** Last observed ball X position for AI refresh */
  aiPrevBallX: number;
  /** Last observed ball Z position for AI refresh */
  aiPrevBallZ: number;
  ballDX: number;
  ballDZ: number;
  /** Base speed magnitude for the ball. Used to restore velocity */
  ballBaseSpeed: number;
  /** Whether the ball is currently moving at boosted speed */
  ballPowered: boolean;
  /** Phase offset for Drama Bot movement oscillation */
  dramaPhase: number;
}
