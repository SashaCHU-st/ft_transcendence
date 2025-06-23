import React from 'react';
import {
  OverlayCard,
  OverlayHeading,
} from '../../pong/components/Overlays/OverlayComponents';
import { OverlayWrapper } from '../../pong/components/Overlays/OverlayWrapper';
import { UserInfo } from './types/UserInfo';

interface FullHistoryProps {
  onClose: () => void;
  stats: {
    date: string;
    game_id: number;
    lose_score: number;
    loser_name: string;
    win_score: number;
    winner_name: string;
  }[];
  username: string;
  user: Pick<UserInfo, 'username' | 'avatar' | 'wins' | 'losses' | 'online'>;
  winRate: number;
}

const FullHistory: React.FC<FullHistoryProps> = ({
  onClose,
  stats,
  username,
  user,
  winRate,
}) => {
  return (
    <>
      <OverlayWrapper>
        <OverlayCard className="w-[90%] max-w-[800px] max-h-[80vh] overflow-auto border-indigo-500 bg-gradient-to-br from-[#0a0e2a] to-black shadow-[0_0_20px_#00a1ff]">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-2 right-4 text-indigo-400 hover:text-pink-500 text-lg font-bold font-orbitron"
          >
            ✕
          </button>
          <OverlayHeading className="text-2xl mb-4 text-indigo-400 font-orbitron">
            Match History
          </OverlayHeading>

          <div className="self-end flex items-center gap-2">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover"
            />
            <i
              className="fa-solid fa-circle"
              style={{
                color: user.online ? 'green' : 'red',
                fontSize: '1.2em',
              }}
            />
            <span
              className={`text-sm sm:text-sm md:text-base ${
                user.online ? 'text-green-400' : 'text-gray-400'
              }`}
            ></span>
            <div className="flex w-full justify-between text-center font-bold font-orbitron">
              <div className="flex-1 flex flex-col items-center">
                <div>GAMES</div>
                <div className="text-[#63A5F0] text-5xl font-bold">
                  {stats.length}
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div>WIN RATE</div>
                <div className="text-[#E984BE] text-5xl font-bold">
                  {winRate}%
                </div>
              </div>
              {/* <div className="flex-1 flex flex-col items-center">
                <div>STREAK</div>
                <div className="text-[#76E29A] text-5xl font-bold">
                  {user.losses}
                </div>
              </div> */}
            </div>
          </div>

          <div className="border-t-2 border-indigo-500 my-4 w-full" />
          {stats.map((game, index) => {
            const opponentName =
              game.winner_name === username
                ? game.loser_name
                : game.winner_name;
            const isWinner = game.winner_name === username;

            return (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 text-center border-b border-gray-700 pb-2 last:border-none font-orbitron text-base"
              >
                <div className="text-[#B9AECE]">
                  {new Date(game.date).toLocaleDateString()}
                </div>
                <div className="text-[#34C2EF]">{opponentName}</div>
                <div className="flex justify-center gap-2">
                  <span
                    className={
                      game.winner_name === username
                        ? 'text-[#76E29A]' 
                        : 'text-[#E984BE]' 
                    }
                  >
                    {game.winner_name === username
                      ? game.win_score
                      : game.lose_score}
                  </span>
                  <span
                    className={
                      game.winner_name !== username
                        ? 'text-[#76E29A]' 
                        : 'text-[#E984BE]' 
                    }
                  >
                    {game.winner_name === username
                      ? game.lose_score
                      : game.win_score}
                  </span>
                </div>

                <div className={isWinner ? 'text-[#76E29A]' : 'text-[#E984BE]'}>
                  {isWinner ? 'WIN' : 'LOSS'}
                </div>
              </div>
            );
          })}
        </OverlayCard>
      </OverlayWrapper>
    </>
  );
};

export default FullHistory;
