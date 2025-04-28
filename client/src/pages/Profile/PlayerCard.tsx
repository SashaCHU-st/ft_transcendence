import React from "react";
import UserHeader from "./UserHeader";
import { MatchResult, calculateUserStats } from "./types/UserInfo";

interface Props {
  name: string;
  online: boolean;
  wins: number;
  losses: number;
  onRemove?: () => void;
  onChallenge?: () => void;
  avatar?: string;
  history?: MatchResult[];
}

const PlayerCard: React.FC<Props> = ({
  name,
  online,
  wins,
  losses,
  onRemove,
  onChallenge,
  avatar = "/boots_img/robot.png",
  history = [],
}) => {
  const { winRate, latestDate, winsToday, lossesToday } = calculateUserStats(
    wins,
    losses,
    history
  );

  return (
    <div
      className="
      bg-gray-900
      rounded-xl
      p-4
      shadow-md
      space-y-4
      w-full
      flex
      flex-col
      items-center
    "
    >
      <UserHeader username={name} avatar={avatar} wins={wins} losses={winRate} />
      {latestDate && (
        <p className="text-sm 
					text-purple-300 
					text-center 
					font-semibold">
          {name} on {latestDate}: {winsToday} wins, {lossesToday} losses
        </p>
      )}
      <div className="flex gap-3 
	  				justify-center 
	  				flex-wrap pt-2">
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="px-4 
					py-2 
					rounded-md 
					text-sm 
					font-semibold 
					text-red-400 
					border-2 
					border-red-500 
					hover:bg-red-600 
					hover:text-white 
					transition 
					duration-300 
					shadow-[0_0_12px_#ff4d4d] 
					hover:shadow-[0_0_18px_#ff4d4d]"
          >
            Remove
          </button>
        )}
        {onChallenge && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChallenge();
            }}
            className="px-4 
					py-2 
					rounded-md 
					text-sm 
					font-semibold 
					text-cyan-300 
					border-2 
					border-cyan-400 
					hover:bg-cyan-500 
					hover:text-black 
					transition 
					duration-300 
					shadow-[0_0_12px_#00ffff] 
					hover:shadow-[0_0_18px_#00ffff]"
          >
            Challenge
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;