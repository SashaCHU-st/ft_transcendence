import React from 'react';

interface Player {
  name: string;
  online: boolean;
  totalWins: number;
  totalLosses: number;
}

const PlayerItem: React.FC<{ player: Player }> = ({ player }) => {
  return (
    <li className="bg-gray-800 bg-opacity-70 p-1 rounded shadow-sm flex flex-col sm:flex-row justify-between items-center text-sm">
      <div className="flex items-center gap-2">
        <span className="font-semibold">{player.name}</span>
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            player.online ? 'bg-green-400' : 'bg-gray-500'
          }`}
        />
      </div>
      <div className="text-gray-400 text-xs sm:text-sm">
        Wins: {player.totalWins} | Losses: {player.totalLosses}
      </div>
    </li>
  );
};

export default PlayerItem;
