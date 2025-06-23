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
  console.log('YYYYYYYYY=>', stats);

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
        {/* <div className="border-t-2 border-indigo-500 text-center text-xl py-2">
          <h2
            className=" font-orbitron 
                    text-xl 
                    text-indigo-400 
                    transition-colors 
                    duration-300 
                    tracking-wide 
                    uppercase
                    font-bold"
          >
            RECENT GAMES
            <div className="border-t-2 border-indigo-500 my-2 w-full" />
          </h2>
          {stats.length === 0 ? (
            <p className="text-sm text-gray-400 mt-2">No games</p>
          ) : (
            <div className="mt-4 text-left w-full font-orbitron text-sm text-indigo-300 space-y-2 font-bold">
              {stats.slice(0, 3).map((game, index) => {
                const opponentName =
                  game.winner_name === user.username
                    ? game.loser_name
                    : game.winner_name;
                return (
                  <div
                    key={index}
                    className="border-b border-gray-700 pb-2 mb-2 last:border-none last:pb-0 last:mb-0"
                  >
                    <p className="text-[#B9AECE]">
                      {new Date(game.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </p>
                    <div className="flex w-full items-center">
                      <div className="flex-grow text-[#34C2EF]">
                        <p>VS {opponentName}</p>
                      </div>
                      <div className="w-16 text-center">
                        <p>
                          <span
                            className={
                              game.winner_name === user.username
                                ? 'text-[#76E29A]'
                                : 'text-[#E984BE]'
                            }
                          >
                            {game.winner_name === user.username
                              ? game.win_score
                              : game.lose_score}
                          </span>
                        </p>
                      </div>

                      <div className="w-6 text-center -mx-2">
                        <p>
                          <span
                            className={
                              game.winner_name !== user.username
                                ? 'text-[#76E29A]'
                                : 'text-[#E984BE]'
                            }
                          >
                            {game.winner_name === user.username
                              ? game.lose_score
                              : game.win_score}
                          </span>
                        </p>
                      </div>

                      <div className="w-20 text-center">
                        <p>
                          <span
                            className={
                              game.winner_name === user.username
                                ? 'text-[#76E29A]'
                                : 'text-[#E984BE]'
                            }
                          >
                            {game.winner_name === user.username
                              ? 'WIN'
                              : 'LOSS'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div> */}

        <button
          onClick={handleShowHistory}
          className="
                  h-10
                  px-4
                  py-2
                  rounded-md
                  text-sm
                  font-semibold
                  text-indigo-500
                  border-2
                  border-indigo-500
                  hover:bg-indigo-300
                  hover:text-white
                  transition
                  duration-300
                  shadow-[0_0_12px_#00ff00]
                  hover:shadow-[0_0_18px_#00ff00]
                "
        >
          Full History
        </button>
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
  );
};

export default UserHeader;
