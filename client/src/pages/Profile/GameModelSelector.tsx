import React from "react";

const modes = [
  {
    name: "Single Player",
    img: "/button_img/single.png",
  },
  {
    name: "Multiplayer",
    img: "/button_img/mlti.png",
  },
  {
    name: "Tournament",
    img: "/button_img/tourn.png",
  },
];

const GameModeSelector: React.FC = () => {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        gap-4
      "
    >
      {modes.map((mode, index) => (
        <button
          key={index}
          className="
            bg-transparent
            rounded-xl
            shadow-md
            overflow-hidden
            transform
            hover:scale-110
            transition
            duration-200
          "
          onClick={() => alert(`${mode.name} clicked!`)}
        >
          <img
            src={mode.img}
            alt={mode.name}
            className="
              w-[240px]
              h-auto
              object-contain
              block
            "
          />
        </button>
      ))}
    </div>
  );
};

export default GameModeSelector;
