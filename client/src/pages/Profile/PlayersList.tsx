
import React from 'react';
import PlayerItem from './PlayerItem';

type Player = {
  name: string;
  online: boolean;
  totalWins: number;
  totalLosses: number;
};

const PlayersList = ({ players }: { players: Player[] }) => {
  const sorted = [...players].sort((a, b) => Number(b.online) - Number(a.online));

  return (
    <ul className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
      {sorted.map((player, idx) => (
        <PlayerItem key={idx} player={player} />
      ))}
    </ul>
  );
};

export default PlayersList;

