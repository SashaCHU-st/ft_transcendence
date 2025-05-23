import type { BracketRound, BracketMatch } from "./BracketOverlay";
import { stripPredTag } from "./utils/utils";

export function buildSingleElimNoDoubleByeSym(
  players: string[],
): BracketRound[] {
  const n = players.length;
  let real = players.filter((p) => p !== "BYE");
  let diff = n - real.length;

  shuffle(real);

  if (diff > real.length) {
    diff = real.length;
  }

  let leftover = real.length - diff;
  if (leftover % 2 !== 0 && diff > 0) {
    leftover++;
    diff--;
  }
  if (leftover < 0) {
    leftover = 0;
  }

  const round1: BracketMatch[] = [];
  const chosen = real.slice(0, diff);
  const leftoverPlayers = real.slice(diff);

  for (let i = 0; i < chosen.length; i++) {
    round1.push({
      p1: chosen[i],
      p2: "BYE",
      winner: null,
    });
  }

  for (let i = 0; i < leftoverPlayers.length; i += 2) {
    round1.push({
      p1: leftoverPlayers[i],
      p2: leftoverPlayers[i + 1],
      winner: null,
    });
  }

  shuffleRound1(round1);

  const rounds: BracketRound[] = [];
  rounds.push(round1);

  let nextArr = round1.map((m) => `WINNER_OF(${m.p1} vs ${m.p2})`);
  while (nextArr.length > 1) {
    const r: BracketMatch[] = [];
    const tmpNext: string[] = [];
    for (let i = 0; i < nextArr.length; i += 2) {
      const p1 = nextArr[i];
      const p2 = nextArr[i + 1] || "BYE";
      r.push({ p1, p2, winner: null });
      tmpNext.push(`WINNER_OF(${p1} vs ${p2})`);
    }
    rounds.push(r);
    nextArr = tmpNext;
  }

  for (let r = 0; r < rounds.length; r++) {
    for (let m = 0; m < rounds[r].length; m++) {
      const match = rounds[r][m];
      match.p1 = replaceAllByePred(match.p1);
      match.p2 = replaceAllByePred(match.p2);
    }
  }

  return rounds;
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
    return stripPredTag(nm.p1) + " vs " + stripPredTag(nm.p2);
  }
  const rr = rIndex + 1;
  if (rr < rounds.length) {
    const nm2 = rounds[rr][0];
    return stripPredTag(nm2.p1) + " vs " + stripPredTag(nm2.p2);
  }
  return undefined;
}

function replaceAllByePred(str: string): string {
  let changed = true;
  while (changed) {
    changed = false;

    const next1 = str.replace(
      /WINNER_OF\(\s*([^()]+?)\s+vs\s+BYE\s*\)/,
      (_match, p1) => {
        changed = true;
        return `(pred) ${p1.trim()}`;
      },
    );

    const next2 = next1.replace(
      /WINNER_OF\(\s*BYE\s+vs\s+([^()]+?)\s*\)/,
      (_match, p2) => {
        changed = true;
        return `(pred) ${p2.trim()}`;
      },
    );

    str = next2;
  }
  return str;
}
