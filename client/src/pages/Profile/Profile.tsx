
import React from 'react';
import Avatar from './Avatar';
import PlayersList from './PlayersList';
import ProfileActions from './ProfileActions';
import EnhancedFriendsList from './EnhancedFriendsList';
import { EnhancedFriend } from './types/EnhancedFriend';

const Profile: React.FC = () => {
  const user = {
    username: 'Legend',
    avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Legend',
    wins: 12,
    losses: 8,
  };

  const friends: EnhancedFriend[] = [
    { name: 'Alice', online: true, totalWins: 3, totalLosses: 2 },
    { name: 'Bob', online: false, totalWins: 1, totalLosses: 4 },
    { name: 'Charlie', online: true, totalWins: 5, totalLosses: 1 },
    { name: 'David', online: true, totalWins: 2, totalLosses: 3 },
    { name: 'Eve', online: false, totalWins: 4, totalLosses: 4 },
  ];

  const players = [
    { name: 'Zoe', online: true, totalWins: 11, totalLosses: 4 },
    { name: 'Mika', online: false, totalWins: 5, totalLosses: 6 },
    { name: 'Alex', online: true, totalWins: 9, totalLosses: 3 },
    { name: 'Tina', online: false, totalWins: 3, totalLosses: 5 },
  ];

  return (

    <div className="min-h-screen w-full text-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 ">
        <div className="text-xl font-bold flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-400 rounded-full" />
          Super Pong
        </div>
        <ProfileActions username={user.username} />
      </div>

      {/* Main Grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Friends */}
        <aside className="w-1/5 min-w-[220px] max-h-full overflow-y-auto p-4">
          <h2 className="text-lg font-semibold mb-2">Friends</h2>
          <EnhancedFriendsList friends={friends} />
        </aside>

        {/* Center */}
        <main className="flex-1 flex flex-col items-center justify-start pt-8 gap-6">
          <Avatar src={user.avatar} username={user.username} className="w-40 h-40 sm:w-48 sm:h-48" />
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-gray-300">Wins: {user.wins} | Losses: {user.losses}</p>
          <button className="bg-white text-black font-bold py-2 px-8 rounded text-xl shadow-md hover:bg-gray-300">
            PLAY
          </button>
        </main>

        {/* Players */}
        <aside className="w-1/5 min-w-[220px] max-h-full overflow-y-auto p-4">
          <h2 className="text-lg font-semibold mb-2">Players</h2>
          <PlayersList players={players} />
        </aside>
      </div>

      {/* Bots to play */}
      <div className="bg-gray-900 bg-opacity-60 py-4 text-center">
        <p className="text-sm text-gray-300">Bots to play</p>
        <div className="mt-2 w-6 h-6 bg-pink-400 rounded-full inline-block" />

      </div>
    </div>
  );
};

export default Profile;
