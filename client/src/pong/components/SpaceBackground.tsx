import { StarryBackground } from "./StarryBackground";
import "./SpaceBackground.css";
import noiseImg from "../png_icons/tv-noise2.png";

/**
 * Component options:
 * - `stars` — displays animated starfield (default: `true`)
 * - `noise` — overlays a noise texture (default: `true`)
 * - `gradients` — shows radial glow circles (default: `true`)
 *
 * Example:
 * <SpaceBackground stars={false} noise gradients={false}>
 *   {...}
 * </SpaceBackground>
 * All options default to `true` if not specified
 */

//! shum na ekrane

export interface SpaceBackgroundProps {
  children: React.ReactNode;
  stars?: boolean;
  noise?: boolean;
  gradients?: boolean;
}

export function SpaceBackground({
  children,
  stars = true,
  noise = true,
  gradients = true,
}: SpaceBackgroundProps) {
  return (
    <div
      className="absolute inset-0 z-[80] overflow-hidden flex items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at bottom, #0a0e2a 0%, #000000 100%)",
      }}
    >
      {/* animated starry backdrop */}
      {stars && <StarryBackground />}

      {/* full-screen noise overlay */}
      {noise && (
        <div
          className="noise-overlay"
          style={{
            backgroundImage: `url(${noiseImg})`,
            backgroundSize: "cover",
          }}
        />
      )}

      {/* decorative glows */}
      {gradients && (
        <div className="pointer-events-none z-0">
          <div className="cosmic-circle bg-blue-500 w-96 h-96 -left-40 -top-40" />
          <div className="cosmic-circle bg-purple-600 w-80 h-80 -right-40 bottom-20" />
          <div className="cosmic-circle bg-pink-500 w-64 h-64 right-40 top-1/3" />
        </div>
      )}

      {children}
    </div>
  );
}

//! dlja smeni png, zakinte novij png fail v png_icon i obnovite nazvanie faila sverhu (import noiseImg from "../png_icons/tv-noise2.png";)

//! esli etot vareant ne podhodit, togda prosto zakomentirovat ego i ispolzovat versiju s 3 ili 5 knopkami
