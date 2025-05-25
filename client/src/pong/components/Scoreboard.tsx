import React from "react";

interface ScoreboardProps {
  leftLabel: string;
  rightLabel: string;
  scoreLeft: number;
  scoreRight: number;
}

export function Scoreboard({ leftLabel, rightLabel, scoreLeft, scoreRight }: ScoreboardProps) {
  return (
    <div className="absolute left-0 right-0 top-4 flex justify-between px-8">
      <div className="score-container rounded-lg px-6 py-3">
        <h2 className="text-xl text-blue-300">{leftLabel}</h2>
        <div className="score-glow text-4xl font-bold text-blue-400">{scoreLeft}</div>
      </div>
      <div className="score-container rounded-lg px-6 py-3">
        <h2 className="text-xl text-purple-300">{rightLabel}</h2>
        <div className="score-glow text-4xl font-bold text-purple-400">{scoreRight}</div>
      </div>
    </div>
  );
}
