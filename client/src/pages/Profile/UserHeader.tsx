import React from 'react';
//import Avatar from "./Avatar";
import { UserInfo, calculateUserStats, MatchResult } from './types/UserInfo';

interface UserHeaderProps {
  user: Pick<UserInfo, 'username' | 'avatar' | 'wins' | 'losses'>;
   matches?: MatchResult[];
}

const UserHeader: React.FC<UserHeaderProps> = ({ user, matches }) => {
  const { winRate } = calculateUserStats(
    user.wins,
    user.losses,
    // user.history
  );

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
      /* Header container: Centers user info vertically with constrained width */
    >
      <img
        src={user.avatar}
        alt="avatar"
        className="w-32 h-32 rounded-full object-cover"
      />
      <h2
        className={`
          text-2xl
          sm:text-2xl
		  xl:text-3xl
		  2xl:text-3xl
          font-bold
		  font-orbitron
        `}
        /* Username: Styles the user's username with responsive font size */
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
          Win Rate:{' '}
          <span className=" font-orbitron text-cyan-400">{winRate}%</span>
        </p>
        <div className="w-full bg-gray-800 rounded-full h-3 mt-1 shadow-inner overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-fuchsia-500 transition-all duration-700 ease-in-out"
            style={{ width: `${winRate}%` }}
          ></div>
        </div>
        <div className="flex justify-between gap-4 w-full">
          <div className="font-orbitron text-blue-400 text-4xl min-w-[80px] text-left">
            {user.wins}
          </div>
          <div className="font-orbitron text-red-400 text-4xl min-w-[80px] text-center">
            {user.losses}
          </div>
          <div className="font-orbitron text-green-400 text-4xl min-w-[80px] text-right">
            {user.losses}
          </div>
        </div>
        <div className="flex justify-between gap-4 w-full">
          <div className="font-orbitron text-blue-400 text-xl min-w-[80px] text-left">
            WINS
          </div>
          <div className="font-orbitron text-red-400 text-xl min-w-[80px] text-center">
            LOSES
          </div>
          <div className="font-orbitron text-green-400 text-xl min-w-[80px] text-right">
            STRIKE
          </div>
        </div>
        <div className="border-y-4 border-indigo-500 text-center text-xl py-2">
          <h2
            className="    font-orbitron 
    text-xl 
    text-indigo-400 
    transition-colors 
    duration-300 
    tracking-wide 
    uppercase"
          >
            RECENT GAMES
          </h2>
        </div>

        <h2
          className="
    font-orbitron 
    text-xl 
    text-indigo-400 
    transition-colors 
    duration-300 
    tracking-wide 
    uppercase
  "
        >
          FULL HISTORY →
        </h2>
      </div>
    </div>
  );
};

export default UserHeader;
