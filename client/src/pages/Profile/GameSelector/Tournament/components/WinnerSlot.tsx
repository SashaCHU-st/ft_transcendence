/**
 * WinnerSlot.tsx
 * -------------------------------------------------------
 * Shows the single tournament winner with fireworks glow effect.
 */

import React from 'react';
import { Slot } from '../types/tournament';

interface Props {
  slot: Slot;
}

const WinnerSlot: React.FC<Props> = ({ slot }) => (
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
      Winner
    </h3>

    <div
      className={`
        p-3
        sm:p-4
        rounded-lg
        text-center
        italic
        text-xl
        sm:text-2xl
        text-gray-900
        bg-gradient-to-r
        from-green-400
        to-teal-400
        winner-glow
        w-full
        h-[60px]
        sm:h-[80px]
        flex
        items-center
        justify-center
      `}
    >
      <span>{slot.isPlayerX ? 'PlayerX' : slot.name || '—'}</span>
    </div>
  </div>
);

export default WinnerSlot;
