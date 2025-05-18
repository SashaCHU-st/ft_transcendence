import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  names: string[];
  updateName: (idx: number, value: string) => void;
  onStart: () => void;
  canStart: boolean;
}

const TournamentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  names,
  updateName,
  onStart,
  canStart,
}) => {
  if (!isOpen) return null;

  return (
    // Overlay: dim background and center the modal
    <div
      className={`
        fixed
        inset-0
        bg-black
        bg-opacity-70
        flex
        items-center
        justify-center
        z-50
      `}
    >
      {/* Modal container: neon gradient background with padding and rounded corners */}
      <div
        className={`
          bg-gradient-to-br
          from-purple-800
          via-indigo-900
          to-pink-800
          p-6
          rounded-2xl
          shadow-neon-lg
          w-full
          max-w-lg
        `}
      >
        {/* Title: gradient clipped text, centered, bold */}
        <h2
          className={`
            text-2xl
            text-center
            text-transparent
            bg-clip-text
            bg-gradient-to-r
            from-cyan-300
            via-blue-400
            to-purple-500
            font-bold
            mb-4
          `}
        >
          Enter players for tournament
        </h2>

        {/* Input grid: two columns with gap */}
        <div
          className={`
            grid
            grid-cols-2
            gap-4
            mb-6
          `}
        >
          {names.map((value, idx) => (
            <input
              key={idx}
              type="text"
              value={value}
              onChange={e => updateName(idx, e.target.value)}
              placeholder={`Player ${idx + 1}`}
              className={`
                bg-gray-900
                bg-opacity-50
                text-white
                placeholder-gray-400
                p-2
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500
                transition-shadow
                duration-200
              `}
            />
          ))}
        </div>

        {/* Actions row: cancel and start buttons spaced apart */}
        <div
          className={`
            flex
            justify-between
          `}
        >
          {/* Cancel button: red outline turning solid on hover */}
          <button
            onClick={onClose}
            className={`
              px-4
              py-2
              rounded-xl
              border
              border-red-400
              text-red-400
              hover:bg-red-500
              hover:text-white
              transition
            `}
          >
            Cancel
          </button>

          {/* Start button: green when enabled, gray when disabled */}
          <button
            onClick={onStart}
            disabled={!canStart}
            className={`
              px-6
              py-2
              rounded-xl
              font-bold
              transition-all
              ${
                canStart
                  ? `
                    bg-green-400
                    hover:shadow-[0_0_15px_#4ade80]
                  `
                  : `
                    bg-gray-600
                    cursor-not-allowed
                    opacity-50
                  `
              }
            `}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default TournamentModal;
