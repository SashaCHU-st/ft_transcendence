import type { BracketRound, BracketMatch, PlayerSlot } from "./BracketOverlay";

export function buildSingleElimNoDoubleByeSym(
  players: string[],
): BracketRound[] {
  const round1 = createFirstRound(players);
  const rounds = createSubsequentRounds(round1);
  resolveByeWinners(rounds);
  return rounds;
}

function createFirstRound(players: string[]): BracketMatch[] {
  const total = players.length;
  const real = players.filter((p) => p !== "BYE");
  let byeCount = total - real.length;

  shuffle(real);

  if (byeCount > real.length) byeCount = real.length;

  let leftover = real.length - byeCount;
  if (leftover % 2 !== 0 && byeCount > 0) {
    leftover++;
    byeCount--;
  }
  if (leftover < 0) leftover = 0;

  const chosen = real.slice(0, byeCount);
  const leftoverPlayers = real.slice(byeCount);

  const round: BracketMatch[] = [];
  for (const p of chosen) {
    round.push({ p1: { name: p }, p2: { name: "BYE" }, winner: null });
  }

  for (let i = 0; i < leftoverPlayers.length; i += 2) {
    round.push({
      p1: { name: leftoverPlayers[i] },
      p2: { name: leftoverPlayers[i + 1] },
      winner: null,
    });
  }

  shuffleRound1(round);
  return round;
}

function createSubsequentRounds(round1: BracketMatch[]): BracketRound[] {
  const rounds: BracketRound[] = [round1];
  let nextArr = round1.map((m) => `WINNER_OF(${m.p1.name} vs ${m.p2.name})`);
  while (nextArr.length > 1) {
    const r: BracketMatch[] = [];
    const tmpNext: string[] = [];
    for (let i = 0; i < nextArr.length; i += 2) {
      const p1 = nextArr[i];
      const p2 = nextArr[i + 1] || "BYE";
      r.push({ p1: { name: p1 }, p2: { name: p2 }, winner: null });
      tmpNext.push(`WINNER_OF(${p1} vs ${p2})`);
    }
    rounds.push(r);
    nextArr = tmpNext;
  }
  return rounds;
}

function resolveByeWinners(rounds: BracketRound[]): void {
  for (const round of rounds) {
    for (const match of round) {
      match.p1 = replaceAllByePred(match.p1.name);
      match.p2 = replaceAllByePred(match.p2.name);
    }
  }
}

export function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export function shuffleRound1(round: BracketMatch[]): void {
  shuffle(round);
}

export function findNextPairString(
  rounds: BracketRound[],
  rIndex: number,
  mIndex: number,
): string | undefined {
  const nextM = mIndex + 1;
  if (nextM < rounds[rIndex].length) {
    const nm = rounds[rIndex][nextM];
    return nm.p1.name + " vs " + nm.p2.name;
  }
  const rr = rIndex + 1;
  if (rr < rounds.length) {
    const nm2 = rounds[rr][0];
    return nm2.p1.name + " vs " + nm2.p2.name;
  }
  return undefined;
}

function replaceAllByePred(str: string): PlayerSlot {
  let changed = true;
  let predicted = false;
  while (changed) {
    changed = false;

    const next1 = str.replace(
      /WINNER_OF\(\s*([^()]+?)\s+vs\s+BYE\s*\)/,
      (_match, p1) => {
        changed = true;
        predicted = true;
        return p1.trim();
      },
    );

    const next2 = next1.replace(
      /WINNER_OF\(\s*BYE\s+vs\s+([^()]+?)\s*\)/,
      (_match, p2) => {
        changed = true;
        predicted = true;
        return p2.trim();
      },
    );

    str = next2;
  }

  if (predicted) {
    return { name: str, isPredicted: true };
  }
  return { name: str };
}
