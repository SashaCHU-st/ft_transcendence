import React, { useEffect } from 'react';
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

const KEY_MAP: Record<'left' | 'right', Record<PowerUpType, string>> = {
  left: {
    [PowerUpType.Speed]: '1',
    [PowerUpType.MegaPaddle]: '2',
    [PowerUpType.PowerShot]: '3',
  },
  right: {
    [PowerUpType.Speed]: '8',
    [PowerUpType.MegaPaddle]: '9',
    [PowerUpType.PowerShot]: '0',
  },
};

export function PowerUpBar({ side, onSelect, active, disabled }: PowerUpBarProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const map = KEY_MAP[side];
      const match = (Object.keys(map) as PowerUpType[]).find(
        (t) => e.key === map[t]
      );
      if (match) {
        e.preventDefault();
        onSelect(match);
      }
    }
    if (!disabled) {
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }
  }, [side, onSelect, disabled]);
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
