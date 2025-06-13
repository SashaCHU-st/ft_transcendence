import React from "react";
//import { OverlayButton } from "../../../pong/components/Overlays/OverlayComponents";
import {FaGlobe, FaUserFriends, FaTrophy} from "react-icons/fa"


const modes = [
  { name: ["RANDOM", "MATCH"], icon: <FaGlobe/>, color: "text-blue-500", border:"hover:border-blue-400 hover:shadow-[0_0_15px_#60a5fa]", animation: "animate-pulse hover:animate-none [animation-duration:3s] "}, 
  { name: ["LOCAL", "DUEL"], icon: <FaUserFriends/> ,color: "text-purple-500", border:"hover:border-purple-400 hover:shadow-[0_0_15px_#c084fc]", animation:"animate-pulse hover:animate-none [animation-duration:3s] "},
  { name: ["LOCAL", "TOURNAMENT"], icon: <FaTrophy/>, color: "text-pink-600", border: "hover:border-pink-600 hover:shadow-[0_0_15px_#db2777]", animation:"animate-pulse hover:animate-none [animation-duration:3s] "},
];

interface Props {
  onSingleClick: () => void;
  onMultiClick: () => void;
  onTournamentClick: () => void;
}

const GameModeSelector: React.FC<Props> = ({
  onSingleClick,
  onMultiClick,
  onTournamentClick
}) => {
  // Dispatch click to the correct handler based on mode name
  const handleClick = (modeName: string[]) => {
    const joined = modeName.join(" ");
    switch (joined) {
      case "RANDOM MATCH":
        onSingleClick();
        break;
      case "LOCAL DUEL":
        onMultiClick();
        break;
      case "LOCAL TOURNAMENT":
        onTournamentClick();
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex justify-center items-center w-full px-4 py-8">
    <div className="flex flex-row gap-6">
      {modes.map((mode) => (
        <button
          key={mode.name.join("")}
          onClick={() => handleClick(mode.name)}
          className={`flex flex-col items-center justify-center gap-2
            bg-transparent ${mode.color} ${mode.border} ${mode.animation} border-transparent border-2 rounded-xl 
            transition duration-200 text-center
            w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 xl:w-48 xl:h-48`}
        >
          <span className="text-3xl sm:text-4xl md:text-5xl">{mode.icon}</span>
          <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold font-orbitron leading-tight text-center">
            {mode.name[0]} <br /> {mode.name[1]}
          </span>
        </button>
      ))}
    </div>
  </div>

  );
};


// Available game modes with display name and icon path
// const modes = [
//   { name: "Random Match"}, 
//   { name: "Multiplayer",   img: "/button_img/mlti.png"   },
//   { name: "Tournament",    img: "/button_img/tourn.png"  },
// ];

// interface Props {
//   onSingleClick: () => void;
//   onMultiClick: () => void;
//   onTournamentClick: () => void;
// }

// const GameModeSelector: React.FC<Props> = ({
//   onSingleClick,
//   onMultiClick,
//   onTournamentClick
// }) => {
//   // Dispatch click to the correct handler based on mode name
//   const handleClick = (modeName: string) => {
//     switch (modeName) {
//       case "Random Match":
//         onSingleClick();
//         break;
//       case "Multiplayer":
//         onMultiClick();
//         break;
//       case "Tournament":
//         onTournamentClick();
//         break;
//       default:
//         break;
//     }
//   };

//   return (
//     // Vertical list of mode buttons with hover animations
//     <div className="flex flex-col items-center gap-9">
//       {modes.map((mode) => (
//         <button
//           key={mode.name}
//           onClick={() => handleClick(mode.name)}
//           className="
//             bg-transparent
//             rounded-xl
//             shadow-md
//             overflow-hidden
//             transform
//             transition
//             duration-300
//             hover:scale-110
//             hover:shadow-[0_0_20px_#00ff7f]
//           "
//         >
//           {/* Mode icon */}
//           <img
//             //src={mode.img}
//             alt={mode.name}
//             className="
//               w-[240px]
//               h-auto
//               object-contain
//               block
//               transition
//               duration-300
//               hover:brightness-110
//             "
//           />
//         </button>
//       ))}
//     </div>
//   );
// };

export default GameModeSelector;
