import React from "react";
import UserList from "./UserList";
import PlayArena from "./PlayArena";
import GameSelector from "./GameSelector/GameSelector";
import { PrimaryButton } from "./types/ui";
import { UserInfo } from "./types/UserInfo";
import { bots } from "./types/botsData";
import UserProfile from "./UserProfile";

interface MobileLayoutProps {
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

const MobileLayout: React.FC<MobileLayoutProps> = ({
  user,
  friends,
  players,
  selectedBot,
  handlePlay,
  isRandomizing,
  expandUsername,
  handleRemove,
  handleAdd,
  //handleConfirm,
}) => {
  return (
    <div
      className="
        flex
        xl:hidden
        flex-col
        items-center
        px-4
        gap-4
        pt-6
      "
    >
    <div className="flex flex-col items-center justify-start gap-6 w-full">
        <UserProfile
            user={{
              username: user.username,
              avatar: user.avatar,
              online: user.online,
              wins: user.wins,
              losses: user.losses,
             }}
          />
      <PlayArena
        user={{ username: user.username, avatar: user.avatar }}
        opponentImage={selectedBot ? selectedBot.image : null}
        opponentName={selectedBot ? selectedBot.name : undefined}
        isRandomizing={isRandomizing}
      />
        <PrimaryButton onClick={handlePlay}>PLAY</PrimaryButton>
        <GameSelector />
      </div>
      <div
        className="
          w-full
          flex
          flex-col
          sm:flex-row
          sm:justify-between
          gap-4
        "
        >
        <div
          className="
            w-full
            sm:w-1/2
            min-w-0
            flex
            flex-col
            items-start
          "
        >
          <h2
            className="
              text-lg
              font-orbitron
              font-bold
              text-purple-200
              tracking-[.20em]
              mb-2
              text-left
              drop-shadow-[0_0_8px_red]
            "
          >
            FRIENDS
          </h2>
          <UserList 
            users={friends} 
            variant="friends" 
            expandUsername={expandUsername} 
            onRemove={handleRemove} 
            onAdd={handleAdd}/>
        </div>
        <div
          className="
            w-full
            sm:w-1/2
            min-w-0
            flex
            flex-col
            items-end
          "
        >
          <h2
            className="
              text-lg
              font-orbitron
              font-bold
              text-purple-200
              tracking-[.20em]
              mb-2
              text-right
              drop-shadow-[0_0_8px_red]
            "
          >
            PLAYERS
          </h2>
          <UserList 
            users={players} 
            variant="players" 
            expandUsername={expandUsername}  
            onAdd={handleAdd}/>
        </div>
      </div>
      <div
        className="
          w-full
          mt-8
        "
      >
      </div>
    </div>
  );
};

export default MobileLayout;
