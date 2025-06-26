import React from "react";
import UserList from "./UserList";
import UserHeader from "./UserHeader";
import PlayArena from "./PlayArena";
import GameSelector from "./GameSelector/GameSelector";
import { PrimaryButton } from "./types/ui";
import { UserInfo, MatchResult } from "./types/UserInfo";
import { bots } from "./types/botsData";
import UserProfile from "./UserProfile";

// Define props for DesktopLayout component
interface DesktopLayoutProps {
  user: UserInfo; // Current user's data
  friends: UserInfo[]; // List of friends
  players: UserInfo[]; // List of other players
  selectedBot: (typeof bots)[0] | null; // Currently selected bot for gameplay
  handlePlay: () => void; // Callback to start the game
  expandUsername?: string;
  handleRemove: (username: string) => void;
  handleAdd: (username: string) => void;
  
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  user,
  friends,
  players,
  selectedBot,
  handlePlay,
  expandUsername,
  handleRemove,
  handleAdd,
 
  
}) => {
  return (
    <div className="hidden xl:flex flex-col gap-8 px-4 flex-grow p-6">
      {/* Top row: Friends | User Info | Players */}
      <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Friends List */}
        <div className="flex flex-col items-start w-full">
          <UserProfile
            user={{
              username: user.username,
              avatar: user.avatar,
              online: user.online,
              wins: user.wins,
              losses: user.losses,
              // history: user.history,
            
            }}
          />
         
          {/* <h2 className="text-lg xl:text-xl  font-bold font-orbitron text-purple-200 mb-2 text-left drop-shadow-[0_0_8px_red] tracking-[.20em]">
            FRIENDS
          </h2>
          <UserList
            users={friends}
            variant="friends"
            expandUsername={expandUsername}
            onRemove={handleRemove}
            onAdd={handleAdd}
          /> */}
          
        </div>

        {/* Center Section */}
        <div className="flex flex-col items-center justify-start gap-6 w-full">
          {/* <UserHeader
            user={{
              username: user.username,
              wins: user.wins,
              losses: user.losses,
              history: user.history,
            }}
          /> */}
          <PlayArena
            user={{ username: user.username, avatar: user.avatar }}
            opponentImage={selectedBot ? selectedBot.image : null}
            opponentName={selectedBot ? selectedBot.name : undefined}
          />
          <PrimaryButton onClick={handlePlay}>PLAY</PrimaryButton>
          
            <div className="flex justify-center">
              <div className="w-full max-w-[720px]">
                <GameSelector />
              </div>
            </div>
        </div>

        {/* Players List */}

        <div className="flex flex-col items-end w-full">
         <div className="bg-gray-900 rounded-lg p-4 w-96">
          <h2 className="text-lg xl:text-xl  font-bold font-orbitron text-purple-200 mb-2 text-left drop-shadow-[0_0_8px_red] tracking-[.20em]">
            FRIENDS
          </h2>
          <UserList
            users={friends}
            variant="friends"
            expandUsername={expandUsername}
            onRemove={handleRemove}
            onAdd={handleAdd}
          />
          
          <h2 className="text-lg xl:text-xl  font-semibold font-orbitron text-purple-200  mb-2 text-right   drop-shadow-[0_0_8px_red] tracking-[.20em]">
            PLAYERS
          </h2>
          <UserList
            users={players}
            variant="players"
            expandUsername={expandUsername}
            onAdd={handleAdd}
          />
        </div>
        </div>
      </div>
     
    </div>
  );
};


export default DesktopLayout;
