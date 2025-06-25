import React from 'react';
import {
  PowerUpType,
  POWER_UPS,
} from '../powerups';

interface PowerUpBarProps {
  /** Which player's bar this is */
  side: "left" | "right";
  onSelect: (type: PowerUpType) => void;
  active?: PowerUpType | null;
  disabled?: boolean;
}

const POWER_UP_LIST: { type: PowerUpType; icon: string }[] = Object.entries(
  POWER_UPS,
).map(([type, info]) => ({ type: type as PowerUpType, icon: info.icon }));

export function PowerUpBar({ side, onSelect, active, disabled }: PowerUpBarProps) {
  const posClass =
    side === "left"
      ? "left-1/4 -translate-x-1/2"
      : "right-1/4 translate-x-1/2";
  return (
    <div className={`absolute bottom-16 ${posClass} flex gap-4`}>
      {POWER_UP_LIST.map((pu) => (
        <button
          key={pu.type}
          onClick={() => onSelect(pu.type)}
          disabled={disabled}
          className={`text-3xl ${active === pu.type ? 'text-yellow-300' : 'text-white'} ${disabled ? 'opacity-50 cursor-default' : ''}`}
          aria-label={POWER_UPS[pu.type].label}
          title={POWER_UPS[pu.type].label}
        >
          {pu.icon}
        </button>
      ))}
    </div>
  );
}
