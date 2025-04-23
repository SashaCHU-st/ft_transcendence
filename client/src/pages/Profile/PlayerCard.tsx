import React from "react";
import WinLossChart from "./WinsLossChart";

type Props = {
  name: string;
  online: boolean;
  wins: number;
  losses: number;
  onRemove?: () => void;
  onChallenge?: () => void;
};

const PlayerCard: React.FC<Props> = ({
  name,
  online,
  wins,
  losses,
  onRemove,
  onChallenge,
}) => {
  return (
    <div
      className="
        bg-gray-900
        rounded-xl
        p-4
        shadow-md
        space-y-2
        w-full
      "
    >
      <div className="flex justify-between items-center">
        <div className="text-lg font-bold">{name}</div>
        <div className={online ? "text-green-400" : "text-gray-400"}>
          {online ? "Online" : "Offline"}
        </div>
      </div>

      <div className="text-sm text-gray-300">
        Wins: {wins} | Losses: {losses}
      </div>

      <WinLossChart />

      <div className="flex gap-2 justify-end flex-wrap">
        {onRemove && (
          <button
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
            onClick={onRemove}
          >
            Remove
          </button>
        )}
        {onChallenge && (
          <button
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
            onClick={onChallenge}
          >
            Challenge
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
