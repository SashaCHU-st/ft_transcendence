// import React from 'react';
import React, { useState } from 'react';
import { UserInfo, calculateUserStats } from './types/UserInfo';
import FullHistory from './FullHistory';

interface UserHeaderProps {
  user: Pick<UserInfo, 'username' | 'avatar' | 'wins' | 'losses' | 'online'>;
  stats: {
    date: string;
    game_id: number;
    lose_score: number;
    loser_name: string;
    win_score: number;
    winner_name: string;
  }[];
}
// const opponentName = game.winner_name === user.username ? game.loser_name : game.winner_name;

const UserHeader: React.FC<UserHeaderProps> = ({ user, stats = [] }) => {
  const { winRate } = calculateUserStats(
    user.wins,
    user.losses
    // user.history
  );

  const [fullHistory, setFullHistory] = useState(false);
  // console.log('YYYYYYYYY=>', stats);

  const handleShowHistory = () => {
    console.log('JJJJ');
    setFullHistory(true);
  };
  return (
    <div
      className={`
        flex
        flex-col
        items-center
        gap-4
        w-full
        max-w-md
        mx-auto
        text-center
      `}
  
    >
      {/* <img
        src={user.avatar}
        alt="avatar"
        className="w-32 h-32 rounded-full object-cover"
      /> */}
      <h2
        className={`
          text-2xl
          sm:text-2xl
          xl:text-xl
          2xl:text-3xl
          font-bold
		      font-orbitron
        `}
      >
        {user.username}
      </h2>
      <div
        className={`
          text-base
          sm:text-md
          md:text-lg
          lg:text-xl
          2xl:text-2xl
          space-y-1
        `}
      >
        <p className="font-orbitron">
          Win Rate:
          <span className=" font-orbitron text-cyan-400">{winRate}%</span>
        </p>
        <div className="w-full bg-gray-800 rounded-full h-3 mt-1 shadow-inner overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-fuchsia-500 transition-all duration-700 ease-in-out"
            style={{ width: `${winRate}%` }}
          ></div>
        </div>
        <div className="flex justify-between gap-4 w-full">
          <div className="font-orbitron text-[#63A5F0] text-2xl min-w-[80px] text-center font-bold">
            {user.wins}
          </div>
          <div className="font-orbitron text-[#E984BE] text-2xl min-w-[80px] text-center font-bold">
            {user.losses}
          </div>
          {/* <div className="font-orbitron text-[#76E29A] text-2xl min-w-[80px] text-center font-bold">
            {user.losses}
          </div> */}
        </div>
        <div className="flex justify-between gap-4 w-full">
          <div className="font-orbitron text-[#63A5F0] text-xl min-w-[80px] text-center">
            WINS
          </div>
          <div className="font-orbitron text-[#E984BE] text-xl min-w-[80px] text-center">
            LOSES
          </div>
          {/* <div className="font-orbitron text-[#76E29A] text-xl min-w-[80px] text-center">
            STRIKE
          </div> */}
        </div>
        <button
          onClick={handleShowHistory}
          className="
                  px-4
                  py-1
                  rounded-md
                  text-sm
                  font-orbitron
                  text-white
                  transition
                  duration-300
                  hover:scale-110
                 
                "
        >
          FULL HISTORY <span className="text-4xl text-white">→</span>
        </button>
        {/* <div className='pt-6'> */}
        {fullHistory && (
          <FullHistory
            winRate={winRate}
            stats={stats}
            user={user}
            username={user.username}
            onClose={() => setFullHistory(false)}
          />
        )}
        </div>
      </div>
    // </div>
  );
};

export default UserHeader;
