import type { BracketRound } from "../BracketOverlay";
import { findNextPair } from "../tournamentLogic";
import type { GameAPI } from "../pong";
import type { BetweenMatchesData, ByeOverlayData } from "./tournamentTypes";
import type { MatchPhase } from "./matchPhase";

interface Callbacks {
  onRoundsUpdate: (rounds: BracketRound[]) => void;
  onBye: (info: ByeOverlayData) => void;
  onMatch: (info: BetweenMatchesData) => void;
  onWinner: (name: string) => void;
  setPhase: (phase: MatchPhase) => void;
}

export function startNextMatch(
  rounds: BracketRound[],
  rIndex: number,
  mIndex: number,
  gameApi: GameAPI | null,
  cb: Callbacks,
): void {
  const { onRoundsUpdate, onBye, onMatch, onWinner, setPhase } = cb;

  if (rIndex >= rounds.length) return;
  if (mIndex >= rounds[rIndex].length) {
    const nr = rIndex + 1;
    if (nr >= rounds.length) {
      const finalM = rounds[rIndex][0];
      onWinner(finalM.winner ? finalM.winner.name : "???");
      setPhase("ended");
    } else {
      startNextMatch(rounds, nr, 0, gameApi, cb);
    }
    return;
  }

  const match = rounds[rIndex][mIndex];

  if (match.p1.name === "BYE" && match.p2.name === "BYE") {
    rounds[rIndex][mIndex].winner = { name: "(No match)" };
    onRoundsUpdate([...rounds]);
    startNextMatch(rounds, rIndex, mIndex + 1, gameApi, cb);
    return;
  }

  if (match.p1.name === "BYE") {
    rounds[rIndex][mIndex].winner = {
      name: match.p2.name,
      isPredicted: true,
    };
    if (match.nextMatch && match.nextSlot) {
      match.nextMatch[match.nextSlot] = {
        name: match.p2.name,
        isPredicted: true,
      };
    }
    onRoundsUpdate([...rounds]);
    const nextPair = findNextPair(rounds, rIndex, mIndex);
    setPhase("bye");
    onBye({ winner: match.p2.name, rIndex, mIndex, nextPair });
    return;
  }
  if (match.p2.name === "BYE") {
    rounds[rIndex][mIndex].winner = {
      name: match.p1.name,
      isPredicted: true,
    };
    if (match.nextMatch && match.nextSlot) {
      match.nextMatch[match.nextSlot] = {
        name: match.p1.name,
        isPredicted: true,
      };
    }
    onRoundsUpdate([...rounds]);
    const nextPair = findNextPair(rounds, rIndex, mIndex);
    setPhase("bye");
    onBye({ winner: match.p1.name, rIndex, mIndex, nextPair });
    return;
  }

  const isFinal =
    rIndex === rounds.length - 1 && mIndex === rounds[rIndex].length - 1;
  setPhase("playing");
  gameApi?.startTournamentMatch(
    match.p1.name,
    match.p2.name,
    isFinal,
    (w, l, ws, ls) => {
      rounds[rIndex][mIndex].winner = { name: w };
      if (match.nextMatch && match.nextSlot) {
        match.nextMatch[match.nextSlot] = { name: w };
      }
      const updated = [...rounds];
      onRoundsUpdate(updated);
      const nextPair = findNextPair(updated, rIndex, mIndex);
      setPhase("result");
      onMatch({
        winner: w,
        loser: l,
        winnerScore: ws,
        loserScore: ls,
        isFinal,
        nextPair,
        rIndex,
        mIndex,
      });
    },
  );
}
