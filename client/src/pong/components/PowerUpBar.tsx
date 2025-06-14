import React from 'react';
import {
  PowerUpType,
  POWER_UPS,
} from '../powerups';

interface PowerUpBarProps {
  onSelect: (type: PowerUpType) => void;
  active?: PowerUpType | null;
}

const POWER_UP_LIST: { type: PowerUpType; icon: string }[] = Object.entries(
  POWER_UPS,
).map(([type, info]) => ({ type: type as PowerUpType, icon: info.icon }));

export function PowerUpBar({ onSelect, active }: PowerUpBarProps) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-24 flex gap-4">
      {POWER_UP_LIST.map((pu) => (
        <button
          key={pu.type}
          onClick={() => onSelect(pu.type)}
          className={`text-3xl ${active === pu.type ? 'text-yellow-300' : 'text-white'}`}
          aria-label={POWER_UPS[pu.type].label}
          title={POWER_UPS[pu.type].label}
        >
          {pu.icon}
        </button>
      ))}
    </div>
  );
}
