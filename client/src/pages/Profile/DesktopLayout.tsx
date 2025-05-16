import React from "react";
import EnhancedFriendsList from "./EnhancedFriendsList";
import PlayersList from "./PlayersList";
import UserHeader from "./UserHeader";
import PlayArena from "./PlayArena";
import GameModeSelector from "./GameModeSelector";
import { PrimaryButton } from "./types/ui";
import { UserInfo } from "./types/UserInfo";
import { bots } from "./types/botsData";

interface DesktopLayoutProps {
  user: UserInfo;
  friends: UserInfo[];
  players: UserInfo[];
  selectedBot: (typeof bots)[0] | null;
  handlePlay: () => void;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  user,
  friends,
  players,
  selectedBot,
  handlePlay,
}) => {
  return (
    <div
      className={`
        hidden
        xl:grid
        xl:grid-cols-6
        gap-4
        px-4
        flex-grow
      `}
      /* Main container: Creates a responsive grid layout visible only on extra-large screens */
    >
      <div
        className={`
          pt-4
          flex
          flex-col
          items-start
          col-span-1
          max-w-[220px]
        `}
        /* Friends section: Aligns the friends list vertically on the left side with constrained width */
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
          pt-6
          col-span-1
          mx-auto
        `}
        /* Video section: Centers the video container with top padding */
      >
        <div
          className={`
            w-full
            max-w-[750px]
            bg-gray-800
            bg-opacity-40
            rounded-lg
            p-1
            shadow-lg
            ml-14
            mt-32
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

      <div
        className={`
          pt-8
          flex
          flex-col
          items-center
          justify-start
          gap-6
          col-span-2
        `}
        /* Central section: Centers user info, play button, and arena with vertical spacing */
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
      </div>

      <div
        className={`
          pt-8
          flex
          justify-center
          col-span-1
        `}
        /* Game mode section: Centers the game mode selector */
      >
        <div
          className={`
            flex
            flex-col
            items-center
            justify-start
            pt-5
            px-2
            xl:px-5
            w-full
            max-w-[320px]
            xl:max-w-full
          `}
          /* Game mode wrapper: Styles the container for the game mode selector with responsive padding */
        >
          <GameModeSelector />
        </div>
      </div>

      <div
        className={`
          pt-4
          flex
          flex-col
          items-end
          col-span-1
          max-w-[220px]
          ml-auto
        `}
        /* Players section: Aligns the players list vertically on the right side with constrained width */
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
  );
};

export default DesktopLayout;
