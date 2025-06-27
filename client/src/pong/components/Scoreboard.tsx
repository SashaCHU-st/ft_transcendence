import React from "react";

import { PowerUpType, POWER_UPS } from "../powerups";

interface ScoreboardProps {
  leftLabel: string;
  rightLabel: string;
  scoreLeft: number;
  scoreRight: number;
  leftPowerUp?: PowerUpType | null;
  rightPowerUp?: PowerUpType | null;
}

export function Scoreboard({
  leftLabel,
  rightLabel,
  scoreLeft,
  scoreRight,
  leftPowerUp,
  rightPowerUp,
}: ScoreboardProps) {
  const icon = (p?: PowerUpType | null) =>
    p ? (
      <span role="img" aria-label={POWER_UPS[p].label}>
        {POWER_UPS[p].icon}
      </span>
    ) : null;
  return (
    <div className="absolute left-0 right-0 top-4 flex justify-between px-8 font-orbitron">
      <div className="score-container rounded-lg px-6 py-3 text-center">
        <h2 className="glow text-xl text-blue-300">{leftLabel}</h2>
        <div className="score-glow glow text-4xl font-bold text-blue-400">
          {scoreLeft} {icon(leftPowerUp)}
        </div>
      </div>
      <div className="score-container rounded-lg px-6 py-3 text-center">
        <h2 className="glow text-xl text-purple-300">{rightLabel}</h2>
        <div className="score-glow glow text-4xl font-bold text-purple-400">
          {scoreRight} {icon(rightPowerUp)}
        </div>
      </div>
    </div>
  );
}
