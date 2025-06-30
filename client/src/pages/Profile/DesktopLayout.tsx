import React from "react";
import UserList from "./UserList";
import PlayArena from "./PlayArena";
import GameSelector from "./GameSelector/GameSelector";
import { PrimaryButton } from "./types/ui";
import { UserInfo} from "./types/UserInfo";
import { bots } from "./types/botsData";
import UserProfile from "./UserProfile";

interface DesktopLayoutProps {
  user: UserInfo;
  friends: UserInfo[];
  players: UserInfo[];
  selectedBot: (typeof bots)[0] | null;
  handlePlay: () => void;
  isRandomizing: boolean;
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
  isRandomizing,
  expandUsername,
  handleRemove,
  handleAdd,
}) => {
  return (
    <div className="hidden xl:flex flex-col gap-8 px-4 flex-grow p-6">
      <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="flex flex-col items-start w-full">
          <UserProfile
            user={{
              username: user.username,
              avatar: user.avatar,
              online: user.online,
              wins: user.wins,
              losses: user.losses,
            }}
          />
        </div>
        {/* Center Section */}
        <div className="flex flex-col items-center justify-start gap-6 w-full">
          <PlayArena
            user={{ username: user.username, avatar: user.avatar }}
            opponentImage={selectedBot ? selectedBot.image : null}
            opponentName={selectedBot ? selectedBot.name : undefined}
            isRandomizing={isRandomizing}
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
         <div className="bg-gray-900 rounded-lg p-4 w-96 h-full">
           <div className="bg-opacity-10 bg-purple-500 rounded-md">
          <h2 className="text-lg xl:text-lg font-orbitron text-purple-200 mb-2 text-center tracking-[.20em]">
            FRIENDS
          </h2>
          </div>
          {friends.length > 0 ? (
            <UserList
              users={friends}
              variant="friends"
              expandUsername={expandUsername}
              onRemove={handleRemove}
              onAdd={handleAdd}
            />
          ) : (
            <p className="text-center text-sm text-gray-400 font-ubuntu">No friends available</p>
          )}
          <div className="mt-52 bg-opacity-10 bg-purple-500  rounded-md">
          <h2 className="text-lg xl:text-lg  font-orbitron text-purple-200  mb-2 text-center  tracking-[.20em]">
            PLAYERS
          </h2>
          </div>
           {players.length > 0 ? (
            <UserList
              users={players}
              variant="players"
              expandUsername={expandUsername}
              onRemove={handleRemove}
              onAdd={handleAdd}
            />
          ) : (
            <p className="text-center text-sm text-gray-400 font-ubuntu">No users available</p>
          )}
        </div>
        </div>
      </div>
     
    </div>
  );
};

export default DesktopLayout;