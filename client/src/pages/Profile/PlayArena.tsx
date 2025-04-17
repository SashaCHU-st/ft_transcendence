import React from 'react';
import Avatar from './Avatar';

interface PlayArenaProps {
  username: string;
  avatar: string;
  wins: number;
  losses: number;
}

const PlayArena: React.FC<PlayArenaProps> = ({ username, avatar, wins, losses }) => {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Аватар и имя */}
      <Avatar src={avatar} username={username} className="w-40 h-40 sm:w-48 sm:h-48" />
      <div className="text-center">
        <h1 className="text-2xl font-bold">{username}</h1>
        <p className="text-sm text-gray-300">Wins: {wins} | Losses: {losses}</p>
      </div>

      {/* Кнопка PLAY */}
      <button className="bg-white text-black font-bold py-2 px-8 rounded text-xl shadow-md hover:bg-gray-300">
        PLAY
      </button>

      {/* Поле арены */}
      <div className="flex items-center justify-center gap-8 mt-8">
        {/* Player 1 */}
        <div className="w-40 h-40 rounded-full bg-gray-700 bg-opacity-60 flex flex-col items-center justify-center text-white shadow-inner">
          <span className="text-sm font-semibold">Player 1</span>
          <span className="text-xs text-gray-300 mt-1">{username}</span>
        </div>

        {/* VS */}
        <span className="text-2xl font-bold text-red-400">VS</span>

        {/* Player 2 */}
        <div className="w-40 h-40 rounded-full bg-gray-700 bg-opacity-60 flex flex-col items-center justify-center text-white shadow-inner">
          <span className="text-sm font-semibold">Player 2</span>
          <span className="text-xs text-gray-300 mt-1">Waiting...</span>
        </div>
      </div>
    </div>
  );
};

export default PlayArena;
