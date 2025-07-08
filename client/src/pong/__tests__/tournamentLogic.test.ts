import { describe, it, expect, vi } from 'vitest';
import { buildSingleElimNoDoubleByeSym, findNextPair } from '../tournamentLogic';
import type { BracketRound } from '../BracketOverlay';

describe('buildSingleElimNoDoubleByeSym', () => {
  it('creates rounds without double byes', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // deterministic shuffle
    const rounds = buildSingleElimNoDoubleByeSym(['A', 'B', 'C', 'D']);
    expect(rounds.length).toBe(2);
    expect(rounds[0].length).toBe(2);
    for (const match of rounds[0]) {
      expect(match.p1.name).not.toBe('');
      expect(match.p2.name).not.toBe('');
    }
  });
});

describe('findNextPair', () => {
  it('returns next match string in bracket', () => {
    const rounds: BracketRound[] = [
      [
        { p1: { name: 'A' }, p2: { name: 'B' }, winner: null },
        { p1: { name: 'C' }, p2: { name: 'D' }, winner: null },
      ],
      [
        { p1: { name: '' }, p2: { name: '' }, winner: null },
      ],
    ];
    const next = findNextPair(rounds, 0, 0);
    expect(next).toBe('C vs D');
  });
});
