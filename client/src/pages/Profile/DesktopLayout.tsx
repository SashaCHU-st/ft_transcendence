// import React from "react";
// import UserList from "./UserList";
// import UserHeader from "./UserHeader";
// import PlayArena from "./PlayArena";
// import GameSelector from "./GameSelector/GameSelector";
// import { PrimaryButton } from "./types/ui";
// import { UserInfo } from "./types/UserInfo";
// import { bots } from "./types/botsData";

// // Define props for DesktopLayout component
// interface DesktopLayoutProps {
//   user: UserInfo; // Current user's data
//   friends: UserInfo[]; // List of friends
//   players: UserInfo[]; // List of other players
//   selectedBot: (typeof bots)[0] | null; // Currently selected bot for gameplay
//   handlePlay: () => void; // Callback to start the game
//   expandUsername?: string; // Optional username to auto-expand a user's card in UserList
// }

// // DesktopLayout component for rendering the profile page layout on desktop screens
// const DesktopLayout: React.FC<DesktopLayoutProps> = ({
//   user,
//   friends,
//   players,
//   selectedBot,
//   handlePlay,
//   expandUsername,
// }) => {
//   // Render a 6-column grid layout visible only on extra-large screens
//   return (
//     <div
//       className="
//         hidden
//         xl:grid
//         xl:grid-cols-6
//         gap-4
//         px-4
//         flex-grow
//       "
//     >
//       {/* Friends list section (left column) */}
//       <div
//         className="
//           pt-4
//           flex
//           flex-col
//           items-start
//           col-span-1
//           max-w-[220px]
//         "
//       >
//         <h2
//           className="
//             text-lg
//             font-semibold
//             mb-2
//             text-left
//             drop-shadow-[0_0_8px_red]
//           "
//         >
//           Friends
//         </h2>
//         {/* Render list of friends with optional auto-expansion */}
//         <UserList users={friends} variant="friends" expandUsername={expandUsername} />
//       </div>

//       {/* Video section (decorative animation) */}
//       <div
//         className="
//           pt-6
//           col-span-1
//           mx-auto
//         "
//       >
//         <div
//           className="
//             w-full
//             max-w-[750px]
//             bg-gray-800
//             bg-opacity-40
//             rounded-lg
//             p-1
//             shadow-lg
//             ml-14
//             mt-32
//           "
//         >
//           {/* Auto-playing looped video for visual effect */}
//           <video
//             src="/videos/fight_gif.mp4"
//             autoPlay
//             loop
//             muted
//             playsInline
//             className="
//               w-full
//               h-auto
//               rounded-lg
//             "
//           />
//         </div>
//       </div>

//       {/* Central section: User info, play button, and game arena */}
//       <div
//         className="
//           pt-8
//           flex
//           flex-col
//           items-center
//           justify-start
//           gap-6
//           col-span-2
//         "
//       >
//         {/* Display user's profile header with stats */}
//         <UserHeader
//           user={{
//             username: user.username,
//             avatar: user.avatar,
//             wins: user.wins,
//             losses: user.losses,
//             history: user.history,
//           }}
//         />
//         {/* Button to trigger the game */}
//         <PrimaryButton onClick={handlePlay}>PLAY</PrimaryButton>
//         {/* Game arena displaying user and opponent (bot) info */}
//         <PlayArena
//           user={{ username: user.username, avatar: user.avatar }}
//           opponentImage={selectedBot ? selectedBot.image : null}
//           opponentName={selectedBot ? selectedBot.name : undefined}
//         />
//       </div>

//       {/* Game mode selector section */}
//       <div
//         className="
//           pt-8
//           flex
//           justify-center
//           col-span-1
//         "
//       >
//         <div
//           className="
//             flex
//             flex-col
//             items-center
//             justify-start
//             pt-5
//             px-2
//             xl:px-5
//             w-full
//             max-w-[320px]
//             xl:max-w-full
//           "
//         >
//           {/* Component for selecting game mode */}
//           <GameSelector />
//         </div>
//       </div>

//       {/* Players list section (right column) */}
//       <div
//         className="
//           pt-4
//           flex
//           flex-col
//           items-end
//           col-span-1
//           max-w-[220px]
//           ml-auto
//         "
//       >
//         <h2
//           className="
//             text-lg
//             font-semibold
//             mb-2
//             text-right
//             drop-shadow-[0_0_8px_red]
//           "
//         >
//           Players
//         </h2>
//         {/* Render list of players with optional auto-expansion */}
//         <UserList users={players} variant="players" expandUsername={expandUsername} />
//       </div>
//     </div>
//   );
// };

// export default DesktopLayout;

//! 19.05


// client/src/pages/Profile/DesktopLayout.tsx

import React from "react";
import UserList from "./UserList";
import UserHeader from "./UserHeader";
import PlayArena from "./PlayArena";
import GameSelector from "./GameSelector/GameSelector";
import { PrimaryButton } from "./types/ui";
import { UserInfo } from "./types/UserInfo";
import { bots } from "./types/botsData";


interface DesktopLayoutProps {
  user: UserInfo;
  friends: UserInfo[];
  players: UserInfo[];
  selectedBot: (typeof bots)[0] | null;
  setSelectedBot: (bot: (typeof bots)[0]) => void;
  handlePlay: () => void;
  expandUsername?: string;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  user,
  friends,
  players,
  selectedBot,
  setSelectedBot,
  handlePlay,
  expandUsername,
}) => {
  return (
    <div className="hidden xl:grid xl:grid-cols-6 gap-4 px-4 flex-grow">
      <div className="pt-4 flex flex-col items-start col-span-1 max-w-[220px]">
        <h2 className="text-lg font-semibold mb-2 text-left drop-shadow-[0_0_8px_red]">
          Friends
        </h2>
        <UserList users={friends} variant="friends" expandUsername={expandUsername} />
      </div>

      <div className="pt-6 col-span-1 mx-auto">
        <video
          src="/videos/fight_gif.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto rounded-lg"
        />
      </div>

      <div className="pt-8 flex flex-col items-center justify-start gap-6 col-span-2">
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

      <div className="pt-8 flex justify-center col-span-1">
        <GameSelector
        />
      </div>

      <div className="pt-4 flex flex-col items-end col-span-1 max-w-[220px] ml-auto">
        <h2 className="text-lg font-semibold mb-2 text-right drop-shadow-[0_0_8px_red]">
          Players
        </h2>
        <UserList users={players} variant="players" expandUsername={expandUsername} />
      </div>
    </div>
  );
};

export default DesktopLayout;
