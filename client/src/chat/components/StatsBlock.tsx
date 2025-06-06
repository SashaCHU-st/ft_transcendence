import React from "react";
import ProgressRing from "./ProgressRing";

interface StatsBlockProps {
  winRate: number;
  latestDate?: string;
  winsToday: number;
  lossesToday: number;
  totalMatches: number;
  totalWins: number;
}

const StatsBlock: React.FC<StatsBlockProps> = ({
  winRate,
  latestDate,
  winsToday,
  lossesToday,
  totalMatches,
  totalWins,
}) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center">
      <ProgressRing percent={winRate} />
      {latestDate && (
        <p className="text-xs text-gray-300">
          Last game: {latestDate} — Wins {winsToday}, Losses {lossesToday}
        </p>
      )}
    </div>
    <div className="col-span-2 sm:col-span-1 grid grid-rows-2 gap-4">
      <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 text-center">
        <p className="text-gray-300 text-sm">Matches played</p>
        <p className="text-2xl font-bold text-white mt-1">{totalMatches}</p>
      </div>
      <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 text-center">
        <p className="text-gray-300 text-sm">Wins</p>
        <p className="text-2xl font-bold text-white mt-1">{totalWins}</p>
      </div>
    </div>
  </div>
);

export default StatsBlock;
