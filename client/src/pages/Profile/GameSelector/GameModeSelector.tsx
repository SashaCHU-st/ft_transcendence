import React from "react";
import { OverlayButton } from "../../../pong/components/Overlays/OverlayComponents";


const modes = [
  { name: "Random Match", color: "green" }, 
  { name: "Local Duel", color: "blue" },
  { name: "Local Tournament", color: "magenta" },
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
  const handleClick = (modeName: string) => {
    switch (modeName) {
      case "Random Match":
        onSingleClick();
        break;
      case "Local Duel":
        onMultiClick();
        break;
      case "Local Tournament":
        onTournamentClick();
        break;
      default:
        break;
    }
  };

  return (
    // Vertical list of mode buttons with hover animations
    <div className="flex flex-col items-center gap-6">
      {modes.map((mode) => (
        <OverlayButton
          key={mode.name}
          color={mode.color} // Passing color for styling
          onClick={() => handleClick(mode.name)} // Handling button clicks
          className="w-full sm:w-[250px] md:w-[350px] xl:w-[400px] 2xl:w-[500px] py-4" // Adjust width
        >
          {mode.name}
        </OverlayButton>
      ))}
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
