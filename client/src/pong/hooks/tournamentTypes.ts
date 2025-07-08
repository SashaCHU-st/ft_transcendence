export interface BetweenMatchesData {
  winner: string;
  loser: string;
  winnerScore: number;
  loserScore: number;
  isFinal: boolean;
  nextPair?: string;
  rIndex: number;
  mIndex: number;
}

export interface ByeOverlayData {
  winner: string;
  rIndex: number;
  mIndex: number;
  nextPair?: string;
}
