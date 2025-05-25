import { useState } from "react";
import {
  buildSingleElimNoDoubleByeSym,
  findNextPairString,
} from "../tournamentLogic";
import type { BracketRound } from "../BracketOverlay";
import type { GameAPI } from "../pong";

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

export function useTournament(gameApi: GameAPI | null) {
  const [rounds, setRounds] = useState<BracketRound[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [showBracket, setShowBracket] = useState(false);
  const [byeInfo, setByeInfo] = useState<ByeOverlayData | null>(null);
  const [matchInfo, setMatchInfo] = useState<BetweenMatchesData | null>(null);
  const [tournamentEnded, setTournamentEnded] = useState(false);

  function startTourney(players: string[]) {
    let arr = players.map((s) => s.trim()).filter((s) => s.length > 0);
    if (arr.length < 2) {
      alert("Need at least 2 players!");
      return;
    }
    const n = arr.length;
    const np = Math.pow(2, Math.ceil(Math.log2(n)));
    while (arr.length < np) {
      arr.push("BYE");
    }
    const bracket = buildSingleElimNoDoubleByeSym(arr);
    setRounds(bracket);
    setWinner(null);
    setTournamentEnded(false);
    startNextMatch(bracket, 0, 0);
  }

  function startNextMatch(
    bRounds: BracketRound[],
    rIndex: number,
    mIndex: number,
  ) {
    if (rIndex >= bRounds.length) return;
    if (mIndex >= bRounds[rIndex].length) {
      const nr = rIndex + 1;
      if (nr >= bRounds.length) {
        const finalM = bRounds[rIndex][0];
        setWinner(finalM.winner ? finalM.winner.name : "???");
      } else {
        startNextMatch(bRounds, nr, 0);
      }
      return;
    }

    const match = bRounds[rIndex][mIndex];

    if (match.p1.name === "BYE" && match.p2.name === "BYE") {
      bRounds[rIndex][mIndex].winner = { name: "(No match)" };
      setRounds([...bRounds]);
      startNextMatch(bRounds, rIndex, mIndex + 1);
      return;
    }

    if (match.p1.name === "BYE") {
      bRounds[rIndex][mIndex].winner = {
        name: match.p2.name,
        isPredicted: true,
      };
      setRounds([...bRounds]);
      const nextPair = findNextPairString(bRounds, rIndex, mIndex);
      setByeInfo({ winner: match.p2.name, rIndex, mIndex, nextPair });
      return;
    }
    if (match.p2.name === "BYE") {
      bRounds[rIndex][mIndex].winner = {
        name: match.p1.name,
        isPredicted: true,
      };
      setRounds([...bRounds]);
      const nextPair = findNextPairString(bRounds, rIndex, mIndex);
      setByeInfo({ winner: match.p1.name, rIndex, mIndex, nextPair });
      return;
    }

    const isFinal =
      rIndex === bRounds.length - 1 && mIndex === bRounds[rIndex].length - 1;
    gameApi?.startTournamentMatch(match.p1.name, match.p2.name, isFinal, (w, l, ws, ls) => {
      const winner = w;
      const loser = l;
      const winnerScore = ws;
      const loserScore = ls;
      bRounds[rIndex][mIndex].winner = { name: winner };
      if (rIndex < bRounds.length - 1) {
        const nextMIndex = Math.floor(mIndex / 2);
        if (bRounds[rIndex + 1] && nextMIndex < bRounds[rIndex + 1].length) {
          if (mIndex % 2 === 0) {
            bRounds[rIndex + 1][nextMIndex].p1 = { name: winner };
          } else {
            bRounds[rIndex + 1][nextMIndex].p2 = { name: winner };
          }
        }
      }
      const updated = [...bRounds];
      setRounds(updated);
      const nextPair = findNextPairString(updated, rIndex, mIndex);
      setMatchInfo({
        winner,
        loser,
        winnerScore,
        loserScore,
        isFinal,
        nextPair,
        rIndex,
        mIndex,
      });
    });
  }

  function continueBye() {
    if (!byeInfo) return;
    const { rIndex, mIndex } = byeInfo;
    setByeInfo(null);
    const clone = [...rounds];
    const w = clone[rIndex][mIndex].winner;
    const realName = w?.name ?? "";
    clone[rIndex][mIndex].winner = { name: realName };
    if (rIndex < clone.length - 1) {
      const nextMIndex = Math.floor(mIndex / 2);
      if (clone[rIndex + 1] && nextMIndex < clone[rIndex + 1].length) {
        if (mIndex % 2 === 0) {
          clone[rIndex + 1][nextMIndex].p1 = { name: realName };
        } else {
          clone[rIndex + 1][nextMIndex].p2 = { name: realName };
        }
      }
    }
    setRounds(clone);
    startNextMatch(clone, rIndex, mIndex + 1);
  }

  function continueMatch() {
    if (!matchInfo) return;
    const { rIndex, mIndex, isFinal } = matchInfo;
    setMatchInfo(null);
    if (!isFinal) {
      startNextMatch(rounds, rIndex, mIndex + 1);
    } else {
      const finalMat = rounds[rIndex][mIndex];
      setWinner(finalMat.winner ? finalMat.winner.name : "???");
      setTournamentEnded(true);
    }
  }

  function acknowledgeWinner() {
    setWinner(null);
  }

  function resetTourney() {
    setRounds([]);
    setWinner(null);
    setByeInfo(null);
    setMatchInfo(null);
    setTournamentEnded(false);
    setShowBracket(false);
  }

  return {
    rounds,
    winner,
    showBracket,
    setShowBracket,
    byeInfo,
    matchInfo,
    startTourney,
    continueBye,
    continueMatch,
    acknowledgeWinner,
    resetTourney,
    tournamentEnded,
  } as const;
}
