import React from "react";
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

export default GameModeSelector;
