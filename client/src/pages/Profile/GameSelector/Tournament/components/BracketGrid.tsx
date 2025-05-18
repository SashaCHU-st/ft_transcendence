/**
 * BracketGrid.tsx
 * ------------------------------------------------------------------
 * Renders the whole bracket as a responsive CSS-grid layout.
 * • Each column (except the last) is delegated to <RoundColumn/>.
 * • The final column shows the single winner via <WinnerSlot/>.
 * Props:
 *   – rounds:        2-D array of Slot objects grouped by round.
 *   – playersCount:  total number of players (used for headings).
 */

import React from 'react';
import { Slot } from '../types/tournament';
import RoundColumn from './RoundColumn';
import WinnerSlot from './WinnerSlot';

interface Props {
  rounds: Slot[][];
  playersCount: number;
}

const BracketGrid: React.FC<Props> = ({ rounds, playersCount }) => (
  <div
    /* one flexible column per round */
    className={`
      grid
      gap-4
      sm:gap-6
      mx-auto
      w-[66.67%]
      min-h-[50vh]
    `}
    style={{
      gridTemplateColumns: `repeat(${rounds.length}, minmax(150px, 1fr))`,
    }}
  >
    {rounds.map((slots, i) =>
      /* all rounds except the last render a column of slot cards;
         the last index renders the single winner card. */
      i < rounds.length - 1 ? (
        <RoundColumn
          key={i}
          slots={slots}
          roundIndex={i}
          playersCount={playersCount}
        />
      ) : (
        <WinnerSlot key={i} slot={slots[0]} />
      )
    )}
  </div>
);

export default BracketGrid;
