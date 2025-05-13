import React from "react";

// Available game modes with display name and icon path
const modes = [
  { name: "Single Player", img: "/button_img/single.png" },
  { name: "Multiplayer",   img: "/button_img/mlti.png"   },
  { name: "Tournament",    img: "/button_img/tourn.png"  },
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
      case "Single Player":
        onSingleClick();
        break;
      case "Multiplayer":
        onMultiClick();
        break;
      case "Tournament":
        onTournamentClick();
        break;
      default:
        break;
    }
  };

  return (
    // Vertical list of mode buttons with hover animations
    <div className="flex flex-col items-center gap-9">
      {modes.map((mode) => (
        <button
          key={mode.name}
          onClick={() => handleClick(mode.name)}
          className="
            bg-transparent
            rounded-xl
            shadow-md
            overflow-hidden
            transform
            transition
            duration-300
            hover:scale-110
            hover:shadow-[0_0_20px_#00ff7f]
          "
        >
          {/* Mode icon */}
          <img
            src={mode.img}
            alt={mode.name}
            className="
              w-[240px]
              h-auto
              object-contain
              block
              transition
              duration-300
              hover:brightness-110
            "
          />
        </button>
      ))}
    </div>
  );
};

export default GameModeSelector;
