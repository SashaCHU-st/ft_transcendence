// import { StarryBackground } from "./StarryBackground";

// interface SpaceBackgroundProps {
//   children: React.ReactNode;
// }

// export function SpaceBackground({ children }: SpaceBackgroundProps) {
//   return (
//     <div
//       className="
//         absolute
//         inset-0
//         z-[80]
//         bg-gradient-to-b
//         from-[#050A15]
//         to-[#132553]
//         overflow-hidden
//         flex
//         items-center
//         justify-center
//       "
//     >
//       {/* animated starry backdrop */}
//       <StarryBackground />

//       {/* decorative elements (click-through), now with lower z-index and scaled down */}
//       <div
//         className="
//           pointer-events-none
//           z-0
//         "
//       >
//         {/* pink radial glow at upper right */}
//         <div
//           className="
//             absolute
//             top-1/3
//             left-2/3
//             w-[900px]
//             h-[900px]
//             rounded-full
//             transform
//             -translate-x-1/2
//             -translate-y-1/2
//             bg-[radial-gradient(circle_at_center,rgba(179,4,126,0.2)_0%,rgba(12,23,50,0)_70%)]
//             scale-50
//           "
//         />

//         {/* purple radial glow at bottom right */}
//         <div
//           className="
//             absolute
//             bottom-1/3
//             right-0
//             w-[750px]
//             h-[750px]
//             rounded-full
//             transform
//             translate-x-1/2
//             translate-y-1/2
//             bg-[radial-gradient(circle_at_center,rgba(126,67,154,0.3)_0%,rgba(14,28,63,0)_70%)]
//             scale-50
//           "
//         />

//         {/* blue radial glow at upper left */}
//         <div
//           className="
//             absolute
//             top-1
//             left-1
//             w-[700px]
//             h-[700px]
//             rounded-full
//             transform
//             -translate-x-1/2
//             -translate-y-1/4
//             bg-[radial-gradient(circle_at_center,rgba(24,96,246,0.5)_0%,rgba(6,11,24,0.9)_70%)]
//             opacity-30
//             scale-50
//           "
//         />
//       </div>

//       {children}
//     </div>
//   );
// }

///////////


import { StarryBackground } from "./StarryBackground";
import "./SpaceBackground.css"
import noiseImg from "../png_icons/tv-noise2.png";

interface SpaceBackgroundProps {
  children: React.ReactNode;
}

export function SpaceBackground({ children }: SpaceBackgroundProps) {
  return (
    <div
      className="
        absolute
        inset-0
        z-[80]
        bg-gradient-to-b
        from-[#050A15]
        to-[#132553]
        overflow-hidden
        flex
        items-center
        justify-center
      "
    >
      {/* animated starry backdrop */}
      <StarryBackground />

	  {/* full-screen noise overlay */}
	  <div
        className="noise-overlay"
        style={{ backgroundImage: `url(${noiseImg})`, backgroundSize: "cover" }}
      />

      {/* decorative elements (click-through), now with lower z-index and scaled down */}
      <div
        className="
          pointer-events-none
          z-0
        "
      >
        {/* pink radial glow at upper right */}
        <div
          className="
            absolute
            top-1/3
            left-2/3
            w-[900px]
            h-[900px]
            rounded-full
            transform
            -translate-x-1/2
            -translate-y-1/2
            bg-[radial-gradient(circle_at_center,rgba(179,4,126,0.2)_0%,rgba(12,23,50,0)_70%)]
            scale-50
          "
        />

        {/* purple radial glow at bottom right */}
        <div
          className="
            absolute
            bottom-1/3
            right-0
            w-[750px]
            h-[750px]
            rounded-full
            transform
            translate-x-1/2
            translate-y-1/2
            bg-[radial-gradient(circle_at_center,rgba(126,67,154,0.3)_0%,rgba(14,28,63,0)_70%)]
            scale-50
          "
        />

        {/* blue radial glow at upper left */}
        <div
          className="
            absolute
            top-1
            left-1
            w-[700px]
            h-[700px]
            rounded-full
            transform
            -translate-x-1/2
            -translate-y-1/4
            bg-[radial-gradient(circle_at_center,rgba(24,96,246,0.5)_0%,rgba(6,11,24,0.9)_70%)]
            opacity-30
            scale-50
          "
        />
      </div>

      {children}
    </div>
  );
}


//! dlja smeni png, zakintenovij png fail v png_icon i obnovit nazvanie faila sverhu


//! esli etot vareant ne podhodit,
//! togda prosto zakomentirovat ego i ispolzovat versiju s 3 ili 5 knopkami