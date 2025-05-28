import { useState } from "react";
import { buildSingleElimNoDoubleByeSym } from "../tournamentLogic";
import type { BracketRound } from "../BracketOverlay";
import type { GameAPI } from "../pong";
import { useMatchPhase } from "./matchPhase";
import {
  startNextMatch as startNextMatchHelper,
} from "./tournamentHelpers";
import type { BetweenMatchesData, ByeOverlayData } from "./tournamentTypes";


export function useTournament(gameApi: GameAPI | null) {
  const [rounds, setRounds] = useState<BracketRound[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [showBracket, setShowBracket] = useState(false);
  const [byeInfo, setByeInfo] = useState<ByeOverlayData | null>(null);
  const [matchInfo, setMatchInfo] = useState<BetweenMatchesData | null>(null);
  const [tournamentEnded, setTournamentEnded] = useState(false);
  const { phase, setPhase } = useMatchPhase();

  function runNextMatch(bRounds: BracketRound[], rIndex: number, mIndex: number) {
    startNextMatchHelper(bRounds, rIndex, mIndex, gameApi, {
      onRoundsUpdate: setRounds,
      onBye: setByeInfo,
      onMatch: setMatchInfo,
      onWinner: setWinner,
      setPhase,
    });
  }

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
    runNextMatch(bracket, 0, 0);
  }


  function continueBye() {
    if (!byeInfo) return;
    const { rIndex, mIndex } = byeInfo;
    setByeInfo(null);
    const clone = [...rounds];
    const w = clone[rIndex][mIndex].winner;
    const realName = w?.name ?? "";
    clone[rIndex][mIndex].winner = { name: realName };
    const match = clone[rIndex][mIndex];
    if (match.nextMatch && match.nextSlot) {
      match.nextMatch[match.nextSlot] = { name: realName };
    }
    setRounds(clone);
    setPhase("playing");
    runNextMatch(clone, rIndex, mIndex + 1);
  }

  function continueMatch() {
    if (!matchInfo) return;
    const { rIndex, mIndex, isFinal } = matchInfo;
    setMatchInfo(null);
    if (!isFinal) {
      setPhase("playing");
      runNextMatch(rounds, rIndex, mIndex + 1);
    } else {
      const finalMat = rounds[rIndex][mIndex];
      setWinner(finalMat.winner ? finalMat.winner.name : "???");
      setTournamentEnded(true);
      setPhase("ended");
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
    setPhase("idle");
  }

  return {
    rounds,
    winner,
    showBracket,
    setShowBracket,
    phase,
    byeInfo,
    matchInfo,
    startTourney,
    continueBye,
    continueMatch,
    acknowledgeWinner,
    resetTourney,
    tournamentEnded,
    setPhase,
  } as const;
}
