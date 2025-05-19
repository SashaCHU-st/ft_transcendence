/**
 * SlotCard.tsx
 * -------------------------------------------------------
 * Visual card representing a single player slot in the bracket grid.
 */

import React from 'react';
import { Slot } from '../types/tournament';

interface Props {
  slot: Slot;
  className?: string;
}

const SlotCard: React.FC<Props> = ({ slot, className = '' }) => (
  <div
    className={`
      p-3
      sm:p-4
      rounded-lg
      text-center
      italic
      text-lg
      sm:text-xl
      text-white
      drop-shadow-[0_0_12px_rgba(0,255,200,0.5)]
      flex
      items-center
      justify-center
      ${className}
    `}
  >
    {slot.isPlayerX ? 'PlayerX' : slot.name || '—'}
  </div>
);

export default SlotCard;
