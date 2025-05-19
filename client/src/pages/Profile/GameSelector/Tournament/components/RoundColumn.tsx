/**
 * RoundColumn.tsx
 * -------------------------------------------------------
 * Displays a single column (one round) in the bracket grid.
 * Shows every pair as two <SlotCard/> components.
 */

import React from 'react';
import SlotCard from './SlotCard';
import { Slot } from '../types/tournament';
import { gradients } from '../constants/gradients';

interface Props {
  slots: Slot[];
  roundIndex: number;
  playersCount: number;
}

const RoundColumn: React.FC<Props> = ({ slots, roundIndex, playersCount }) => {
  /* heading depends on round position and total players */
  const title =
    roundIndex === 0
      ? playersCount >= 5
        ? 'Quarter-Final'
        : 'Semi-Final'
      : roundIndex === 1
      ? playersCount >= 5
        ? 'Semi-Final'
        : 'Final'
      : 'Final';

  return (
    <div
      className={`
        flex
        flex-col
        items-center
        justify-center
        min-h-[50vh]
      `}
    >
      <h3
        className={`
          text-lg
          sm:text-xl
          text-center
          text-cyan-300
          mb-4
        `}
      >
        {title}
      </h3>

      <div
        className={`
          flex
          flex-col
          space-y-12
          w-full
        `}
      >
        {Array.from({ length: Math.ceil(slots.length / 2) }).map((_, pairIdx) => {
          const [a, b] = [slots[pairIdx * 2], slots[pairIdx * 2 + 1]];
          const grad = gradients[(roundIndex * 10 + pairIdx) % gradients.length];

          return (
            <div
              key={pairIdx}
              className={`
                flex
                flex-col
                space-y-2
                w-full
              `}
            >
              <SlotCard
                slot={a}
                className={`
                  bg-gradient-to-br
                  ${grad}
                  h-[60px]
                  sm:h-[80px]
                `}
              />
              {b && (
                <SlotCard
                  slot={b}
                  className={`
                    bg-gradient-to-br
                    ${grad}
                    h-[60px]
                    sm:h-[80px]
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoundColumn;
