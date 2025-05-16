
// import React, { useState } from "react";
// import PlayerCard from "./PlayerCard";
// import Avatar from "./Avatar";
// import { CardWrapper } from "./types/ui";
// import { UserInfo } from "./types/UserInfo";

// type Props = {
//   players: UserInfo[];
// };

// const PlayersList: React.FC<Props> = ({ players }) => {
//   const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

//   const toggleExpand = (index: number) => {
//     setExpandedIndex((prev) => (prev === index ? null : index));
//   };

//   return (
//     <div
//       className="
//         flex
//         flex-col
//         gap-2
//         overflow-y-auto
//         max-h-[500px]
//         pr-1
//         scrollbar-thin
//         scrollbar-thumb-white/60
//         scrollbar-track-transparent
//       "
//     >
//       {players.map((player, index) => {
//         const isExpanded = expandedIndex === index;

//         return (
//           <CardWrapper key={index} onClick={() => toggleExpand(index)}>
//             <div className="flex justify-between items-center">
//               <div className="flex items-center gap-2">
//                 <Avatar
//                   user={{ username: player.username, avatar: player.avatar }}
//                   className="w-8 h-8"
//                 />
//                 <div className="font-bold text-base">{player.username}</div>
//               </div>
//               <div
//                 className={`text-sm ${player.online ? "text-green-400" : "text-gray-400"}`}
//               >
//                 {player.online ? "Online" : "Offline"}
//               </div>
//             </div>
//             <div
//               className={`
//                 transition-all
//                 duration-300
//                 overflow-hidden
//                 ${isExpanded ? "max-h-[600px] mt-3" : "max-h-0"}
//               `}
//             >
//               <PlayerCard user={player} />
//             </div>
//           </CardWrapper>
//         );
//       })}
//     </div>
//   );
// };

// export default PlayersList;



import React, { useState } from "react";
import PlayerCard from "./PlayerCard";
import Avatar from "./Avatar";
import { CardWrapper } from "./types/ui";
import { UserInfo } from "./types/UserInfo";

type Props = {
  players: UserInfo[];
};

const PlayersList: React.FC<Props> = ({ players }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    // Container for the players list with scrollable area
    <div
      className="
        flex
        flex-col
        gap-2
        overflow-y-auto
        max-h-[500px]
        pr-1
        scrollbar-thin
        scrollbar-thumb-white/60
        scrollbar-track-transparent
      "
    >
      {players.map((player, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <CardWrapper key={index} onClick={() => toggleExpand(index)}>
            {/* Player summary row */}
            <div
              className="
                flex
                justify-between
                items-center
              "
            >
              {/* Player avatar and username */}
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <Avatar
                  user={{ username: player.username, avatar: player.avatar }}
                  className="
                    w-8
                    h-8
                  "
                />
                <div
                  className="
                    font-bold
                    text-base
                  "
                >
                  {player.username}
                </div>
              </div>
              {/* Online/Offline status indicator */}
              <div
                className={`
                  text-sm
                  ${player.online ? "text-green-400" : "text-gray-400"}
                `}
              >
                {player.online ? "Online" : "Offline"}
              </div>
            </div>
            {/* Expandable player details section */}
            <div
              className={`
                transition-all
                duration-300
                overflow-hidden
                ${isExpanded ? "max-h-[600px] mt-3" : "max-h-0"}
              `}
            >
              <PlayerCard user={player} />
            </div>
          </CardWrapper>
        );
      })}
    </div>
  );
};

export default PlayersList;