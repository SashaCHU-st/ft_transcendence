
import React from "react";
import UserList from "./UserList";
import UserHeader from "./UserHeader";
import PlayArena from "./PlayArena";
import GameSelector from "./GameSelector/GameSelector";
import { PrimaryButton } from "./types/ui";
import { UserInfo } from "./types/UserInfo";
import { bots } from "./types/botsData";

interface MobileLayoutProps {
  user: UserInfo;
  friends: UserInfo[];
  players: UserInfo[];
  selectedBot: (typeof bots)[0] | null;
  handlePlay: () => void;
  expandUsername?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  user,
  friends,
  players,
  selectedBot,
  handlePlay,
  expandUsername,
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
      "
    >
      <UserHeader
        user={{
          username: user.username,
          avatar: user.avatar,
          wins: user.wins,
          losses: user.losses,
          history: user.history,
        }}
      />
      <PrimaryButton onClick={handlePlay}>PLAY</PrimaryButton>
      <PlayArena
        user={{ username: user.username, avatar: user.avatar }}
        opponentImage={selectedBot ? selectedBot.image : null}
        opponentName={selectedBot ? selectedBot.name : undefined}
      />
      <div
        className="
          w-full
          max-w-xs
          mt-4
        "
      >
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
          "
        >
          <h2
            className="
              text-lg
              font-semibold
              mb-2
              text-left
              drop-shadow-[0_0_8px_red]
            "
          >
            Friends
          </h2>
          <UserList users={friends} variant="friends" expandUsername={expandUsername} />
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
              font-semibold
              mb-2
              text-right
              drop-shadow-[0_0_8px_red]
            "
          >
            Players
          </h2>
          <UserList users={players} variant="players" expandUsername={expandUsername} />
        </div>
      </div>
      <div
        className="
          w-full
          mt-8
        "
      >
        <div
          className="
            w-full
            max-w-[600px]
            bg-gray-800
            bg-opacity-50
            rounded-2xl
            p-4
            shadow-lg
            mx-auto
          "
        >
          <video
            src="/videos/fight_gif.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="
              w-full
              h-auto
              rounded-lg
            "
          />
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
