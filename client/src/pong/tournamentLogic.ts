import type { BracketRound, BracketMatch } from "./BracketOverlay";

export function buildSingleElimNoDoubleByeSym(
  players: string[],
): BracketRound[] {
  const round1 = createFirstRound(players);
  const rounds = createSubsequentRounds(round1);
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
  let prev = round1;
  while (prev.length > 1) {
    const nextRound: BracketMatch[] = [];
    for (let i = 0; i < prev.length; i += 2) {
      const m1 = prev[i];
      const m2 = prev[i + 1];
      const nextMatch: BracketMatch = {
        p1: predictFrom(m1),
        p2: m2 ? predictFrom(m2) : { name: "" },
        winner: null,
      };
      m1.nextMatch = nextMatch;
      m1.nextSlot = "p1";
      if (m2) {
        m2.nextMatch = nextMatch;
        m2.nextSlot = "p2";
      }
      nextRound.push(nextMatch);
    }
    rounds.push(nextRound);
    prev = nextRound;
  }
  return rounds;
}

function predictFrom(match: BracketMatch) {
  if (match.p1.name === "BYE" && match.p2.name !== "BYE") {
    return { name: match.p2.name, isPredicted: true };
  }
  if (match.p2.name === "BYE" && match.p1.name !== "BYE") {
    return { name: match.p1.name, isPredicted: true };
  }
  return { name: "" };
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

export function findNextPair(
  rounds: BracketRound[],
  rIndex: number,
  mIndex: number,
): string | undefined {
  for (let r = rIndex; r < rounds.length; r++) {
    for (let m = r === rIndex ? mIndex + 1 : 0; m < rounds[r].length; m++) {
      const nm = rounds[r][m];
      if (
        nm.p1.name !== "" &&
        nm.p2.name !== "" &&
        nm.p1.name !== "BYE" &&
        nm.p2.name !== "BYE"
      ) {
        return nm.p1.name + " vs " + nm.p2.name;
      }
    }
  }
  return undefined;
}
