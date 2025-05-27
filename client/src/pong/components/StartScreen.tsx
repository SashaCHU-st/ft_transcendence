import { SpaceBackground } from "./SpaceBackground";
import aiIcon from "../png_icons/ai.png";
import localIcon from "../png_icons/local.png";
import tournamentIcon from "../png_icons/tournament2.png";
import remDualIcon from "../png_icons/remduel.png";
import remTournIcon from "../png_icons/remtourn.png";

interface StartScreenProps {
  onSingleAI: () => void;
  onLocal2P: () => void;
  onTournament: () => void;
  onRemoteDuel: () => void;
  onRemoteTournament: () => void;
}

export function StartScreen({
  onSingleAI,
  onLocal2P,
  onTournament,
  onRemoteDuel,
  onRemoteTournament,
}: StartScreenProps) {
  return (
    <SpaceBackground>
      {/* top-left corner brackets */}
      <div className="absolute top-10 left-1/4 w-12 h-12 transform -translate-x-16 sm:top-20 sm:w-16 sm:h-16 sm:-translate-x-20">
        <div
          className="
            absolute top-0 left-0
            w-12 h-1 sm:w-16
            bg-[#0A7FC9]
            shadow-[0_0_12px_rgba(10,127,201,0.7),0_0_24px_rgba(10,127,201,0.4)]
          "
        />
        <div
          className="
            absolute top-0 left-0
            w-1 h-12 sm:h-16
            bg-[#0A7FC9]
            shadow-[0_0_12px_rgba(10,127,201,0.7),0_0_24px_rgba(10,127,201,0.4)]
          "
        />
      </div>

      {/* top-right corner brackets */}
      <div className="absolute top-10 right-1/4 w-12 h-12 transform translate-x-16 sm:top-20 sm:w-16 sm:h-16 sm:translate-x-20">
        <div
          className="
            absolute top-0 right-0
            w-12 h-1 sm:w-16
            bg-[#0A7FC9]
            shadow-[0_0_12px_rgba(10,127,201,0.7),0_0_24px_rgba(10,127,201,0.4)]
          "
        />
        <div
          className="
            absolute top-0 right-0
            w-1 h-12 sm:h-16
            bg-[#0A7FC9]
            shadow-[0_0_12px_rgba(10,127,201,0.7),0_0_24px_rgba(10,127,201,0.4)]
          "
        />
      </div>

      {/* bottom-left corner brackets */}
      <div className="absolute bottom-10 left-1/4 w-12 h-12 transform -translate-x-16 sm:bottom-20 sm:w-16 sm:h-16 sm:-translate-x-20">
        <div
          className="
            absolute bottom-0 left-0
            w-12 h-1 sm:w-16
            bg-[#0A7FC9]
            shadow-[0_0_12px_rgba(10,127,201,0.7),0_0_24px_rgba(10,127,201,0.4)]
          "
        />
        <div
          className="
            absolute bottom-0 left-0
            w-1 h-12 sm:h-16
            bg-[#0A7FC9]
            shadow-[0_0_12px_rgba(10,127,201,0.7),0_0_24px_rgba(10,127,201,0.4)]
          "
        />
      </div>

      {/* bottom-right corner brackets */}
      <div className="absolute bottom-10 right-1/4 w-12 h-12 transform translate-x-16 sm:bottom-20 sm:w-16 sm:h-16 sm:translate-x-20">
        <div
          className="
            absolute bottom-0 right-0
            w-12 h-1 sm:w-16
            bg-[#0A7FC9]
            shadow-[0_0_12px_rgba(10,127,201,0.7),0_0_24px_rgba(10,127,201,0.4)]
          "
        />
        <div
          className="
            absolute bottom-0 right-0
            w-1 h-12 sm:h-16
            bg-[#0A7FC9]
            shadow-[0_0_12px_rgba(10,127,201,0.7),0_0_24px_rgba(10,127,201,0.4)]
          "
        />
      </div>

      {/* main title */}
      <h1
        className="
          mt-16
          absolute top-12 w-full
          text-center
          text-5xl sm:text-7xl md:text-8xl
          font-extrabold
          text-[#D3E0FB]
          drop-shadow-[0_0_20px_rgba(211,224,251,1)]
        "
      >
        SPACE PONG
      </h1>

      {/* action buttons in grid layout */}
      <div className="absolute inset-0 flex items-center justify-center mt-20 px-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 w-full max-w-4xl">
          {/* Play vs AI */}
          <button
            onClick={onSingleAI}
            className="
              w-full flex items-center justify-center gap-2
              rounded-xl border-2 border-[#0A7FC9]
              bg-black bg-opacity-30
              px-6 py-4 sm:px-10 sm:py-6
              text-2xl sm:text-3xl font-semibold text-[#297db1]
              shadow-[0_0_15px_rgba(0,255,255,0.7),0_0_24px_rgba(0,255,255,0.4)]
              hover:scale-105 transition
            "
          >
            <img src={aiIcon} alt="AI" className="w-8 h-8 sm:w-10 sm:h-10" />
            AI VS PLAYER
          </button>

          {/* Local Duel */}
          <button
            onClick={onLocal2P}
            className="
              w-full flex items-center justify-center gap-2
              rounded-xl border-2 border-[#9010CE]
              bg-black bg-opacity-30
              px-6 py-4 sm:px-10 sm:py-6
              text-2xl sm:text-3xl font-semibold text-[#743b91]
              shadow-[0_0_15px_rgba(192,38,211,0.7),0_0_24px_rgba(192,38,211,0.4)]
              hover:scale-105 transition
            "
          >
            <img src={localIcon} alt="Local" className="w-8 h-8 sm:w-10 sm:h-10" />
            LOCAL DUEL
          </button>

          {/* Local Tournament */}
          <button
            onClick={onTournament}
            className="
              w-full flex items-center justify-center gap-2
              rounded-xl border-2 border-[#BD0E86]
              bg-black bg-opacity-30
              px-6 py-4 sm:px-10 sm:py-6
              text-2xl sm:text-3xl font-semibold text-[#832264]
              shadow-[0_0_15px_rgba(255,29,153,0.7),0_0_24px_rgba(255,29,153,0.4)]
              hover:scale-105 transition
            "
          >
            <img src={tournamentIcon} alt="Tournament" className="w-10 h-10 sm:w-14 sm:h-14" />
            LOCAL TOURNAMENT
          </button>

          {/* Remote Duel */}
          <button
            onClick={onRemoteDuel}
            className="
              w-full flex items-center justify-center gap-2
              rounded-xl border-2 border-[#0AC9B7]
              bg-black bg-opacity-30
              px-6 py-4 sm:px-10 sm:py-6
              text-2xl sm:text-3xl font-semibold text-[#2b9b8f]
              shadow-[0_0_15px_rgba(10,201,183,0.7),0_0_24px_rgba(10,201,183,0.4)]
              hover:scale-105 transition
            "
          >
            <img src={remDualIcon} alt="Remote Duel" className="w-10 h-10 sm:w-14 sm:h-14" />
            REMOTE DUEL
          </button>

          {/* Remote Tournament */}
          <button
            onClick={onRemoteTournament}
            className="
              w-full flex items-center justify-center gap-2
              sm:col-span-2
              rounded-xl border-2 border-[#9cc90a]
              bg-black bg-opacity-30
              px-6 py-4 sm:px-10 sm:py-6
              text-2xl sm:text-3xl font-semibold text-[#9cc90a]
              shadow-[0_0_15px_rgba(156,201,10,0.7),0_0_24px_rgba(156,201,10,0.5)]
              hover:scale-105 transition
            "
          >
            <img src={remTournIcon} alt="Remote Tournament" className="w-10 h-10 sm:w-12 sm:h-12" />
            REMOTE TOURNAMENT
          </button>
        </div>
      </div>
    </SpaceBackground>
  );
}
