import React from "react";
import EnhancedFriendsList from "./EnhancedFriendsList";
import PlayersList from "./PlayersList";
import UserHeader from "./UserHeader";
import PlayArena from "./PlayArena";
import GameModeSelector from "./GameModeSelector";
import { PrimaryButton } from "./types/ui";
import { UserInfo } from "./types/UserInfo";
import { bots } from "./types/botsData";

interface MobileLayoutProps {
  user: UserInfo;
  friends: UserInfo[];
  players: UserInfo[];
  selectedBot: (typeof bots)[0] | null;
  handlePlay: () => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  user,
  friends,
  players,
  selectedBot,
  handlePlay,
}) => {
  return (
    <div
      className={`
        flex
        xl:hidden
        flex-col
        items-center
        px-4
        gap-4
      `}
      /* Main container: Creates a centered, vertical layout for mobile screens, hidden on xl screens */
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
        className={`
          w-full
          max-w-xs
          mt-4
        `}
        /* Game mode section: Constrains the width of the game mode selector with top margin */
      >
        <GameModeSelector />
      </div>
      <div
        className={`
          w-full
          flex
          flex-col
          sm:flex-row
          sm:justify-between
          gap-4
        `}
        /* Friends and players container: Arranges friends and players lists vertically on mobile, horizontally on sm screens */
      >
        <div
          className={`
            w-full
            sm:w-1/2
            min-w-0
          `}
          /* Friends section: Styles the friends list container, taking half width on sm screens */
        >
          <h2
            className={`
              text-lg
              font-semibold
              mb-2
              text-left
              drop-shadow-[0_0_8px_red]
            `}
            /* Friends title: Styles the heading for the friends list with a red glow */
          >
            Friends
          </h2>
          <EnhancedFriendsList friends={friends} />
        </div>
        <div
          className={`
            w-full
            sm:w-1/2
            min-w-0
            flex
            flex-col
            items-end
          `}
          /* Players section: Styles the players list container, aligned right, taking half width on sm screens */
        >
          <h2
            className={`
              text-lg
              font-semibold
              mb-2
              text-right
              drop-shadow-[0_0_8px_red]
            `}
            /* Players title: Styles the heading for the players list with a red glow */
          >
            Players
          </h2>
          <PlayersList players={players} />
        </div>
      </div>
      <div
        className={`
          w-full
          mt-8
        `}
        /* Video section: Centers the video container with top margin */
      >
        <div
          className={`
            w-full
            max-w-[600px]
            bg-gray-800
            bg-opacity-50
            rounded-2xl
            p-4
            shadow-lg
            mx-auto
          `}
          /* Video wrapper: Styles the video container with a semi-transparent background and shadow */
        >
          <video
            src="/videos/fight_gif.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={`
              w-full
              h-auto
              rounded-lg
            `}
            /* Video: Ensures the video fills the container with rounded corners */
          />
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
