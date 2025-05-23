/**
 * useTournament.ts
 * ------------------------------------------------------------------
 * React hook that owns **all** tournament state and side-effects.
 *
 * Responsibilities
 *  • Load players / past winners from API.
 *  • Build the rounds grid every time data changes.
 *  • Auto-advance vs. “PlayerX” and handle odd 3-player semifinal.
 *  • Persist winners coming either from game callbacks or auto-logic.
 *
 * The UI layer only consumes:
 *   { players, rounds, loading, start() }
 */

import { useEffect, useState } from 'react';
import { fetchPlayers, fetchWinners, saveWinner } from '../api/tournamentApi';
import { shuffleArray } from './array';
import { LocationState, Slot } from '../types/tournament';

export interface UseTournament {
  players: string[];
  rounds: Slot[][];
  loading: boolean;
  start: () => void;
}

export const useTournament = (state: LocationState): UseTournament => {
  /* ------------------------------------------------------------------ */
  /* local state                                                         */
  /* ------------------------------------------------------------------ */
  const [players, setPlayers] = useState<string[]>([]);
  const [winners, setWinners] = useState<
    { round: number; pair: number; winner: string }[]
  >([]);
  const [rounds, setRounds] = useState<Slot[][]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);

  /* ------------------------------------------------------------------ */
  /* helper: build the full rounds grid                                  */
  /* ------------------------------------------------------------------ */
  const buildRounds = (pl: string[], win: typeof winners) => {
    const shuffled = shuffleArray(pl);
    const grid: Slot[][] = [];

    /* 1  first round */
    const first = shuffled.map((p) => ({ name: p, isPlayerX: false }));
    if ([3, 5, 7].includes(pl.length))
      first.push({ name: 'PlayerX', isPlayerX: true });
    grid.push(first);

    /* 2  empty next rounds */
    const max = pl.length <= 4 ? 2 : 3;
    for (let i = 1; i < max; i++) {
      grid.push(
        Array(Math.ceil(grid[i - 1].length / 2)).fill({
          name: '',
          isPlayerX: false,
        }),
      );
    }
    /* 3  winner slot */
    grid.push([{ name: '', isPlayerX: false }]);

    /* 4  inject persisted winners */
    const merged = grid.map((round, rIdx) => {
      if (rIdx === 0) return round;
      const copy = [...round];
      win
        .filter((w) => w.round === rIdx)
        .forEach((w) => {
          const ix = w.pair * (rIdx < max - 1 ? 2 : 1);
          copy[ix] = { name: w.winner, isPlayerX: false };
        });
      return copy;
    });

    setRounds(merged);
  };

  /* ------------------------------------------------------------------ */
  /* 1. load players (or take from navigation state)                     */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    (async () => {
      setLoading(true);

      let pl = await fetchPlayers();
      if (
        state?.players?.length &&
        state.players.length >= 3 &&
        state.players.length <= 8
      ) {
        pl = state.players;
      }

      if (pl.length >= 3 && pl.length <= 8) setPlayers(pl);
      setLoading(false);
    })();
  }, [state.players]);

  /* ------------------------------------------------------------------ */
  /* 2. load winners on mount                                            */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    (async () => setWinners(await fetchWinners()))();
  }, []);

  /* ------------------------------------------------------------------ */
  /* 3. rebuild grid whenever players OR winners change                  */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (players.length >= 3) buildRounds(players, winners);
  }, [players, winners]);

  /* ------------------------------------------------------------------ */
  /* 4. after “Start” — auto-advance vs PlayerX + odd semifinal logic    */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!started || rounds.length === 0) return;

    const advance = async () => {
      /* auto-advance when facing PlayerX */
      const first = rounds[0];
      for (let i = 0; i < first.length; i += 2) {
        const [a, b] = [first[i], first[i + 1]];
        if (a.isPlayerX && b && !b.isPlayerX) await saveWinner(1, i / 2, b.name);
        else if (b?.isPlayerX && !a.isPlayerX)
          await saveWinner(1, i / 2, a.name);
      }
      setWinners(await fetchWinners());
    };
    advance();

    /* random finalist in 3-player semifinal */
    if (rounds[1]?.length === 3) {
      const real = rounds[1].filter((s) => !s.isPlayerX && s.name);
      if (real.length === 3) {
        const finalist = real[Math.floor(Math.random() * real.length)];
        saveWinner(2, 0, finalist.name).then(async () =>
          setWinners(await fetchWinners()),
        );
      }
    }
  }, [started, rounds]);

  /* ------------------------------------------------------------------ */
  /* 5. callback when a /game returns a winner                           */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!started || !state?.winner) return;

    (async () => {
      const rIdx = rounds.findIndex((r) =>
        r.some((s) => s.name === '' && !s.isPlayerX),
      );
      if (rIdx > 0) {
        const pIdx = Math.floor(
          rounds[rIdx - 1].findIndex((s) => s.name === state.winner) / 2,
        );
        await saveWinner(rIdx, pIdx, state.winner!);
        setWinners(await fetchWinners());
      }
    })();
  }, [state.winner, started, rounds]);

  /* ------------------------------------------------------------------ */
  /* public API                                                          */
  /* ------------------------------------------------------------------ */
  return {
    players,
    rounds,
    loading,
    start: () => setStarted(true),
  };
};
