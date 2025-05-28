import React from "react";

interface OverlayCardProps {
  children: React.ReactNode;
  className?: string;
}

export function OverlayCard({ children, className = "" }: OverlayCardProps) {
  return (
    <div
      className={`relative z-10 rounded-2xl border-2 border-[#0A7FC9] p-6 text-center bg-black bg-opacity-30 shadow-[0_0_15px_rgba(0,255,255,0.7)] ${className}`}
    >
      {children}
    </div>
  );
}

interface OverlayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  color?: "magenta" | "cyan";
}

const colorClasses: Record<string, string> = {
  magenta: `
    border-[#BD0E86]
    bg-black bg-opacity-30
    text-[#832264]
    shadow-[0_0_15px_rgba(255,29,153,0.7)]
    hover:scale-105 transition
  `,
  cyan: `
    border-[#0A7FC9]
    bg-black bg-opacity-30
    text-[#0A7FC9]
    shadow-[0_0_15px_rgba(0,255,255,0.7)]
    hover:scale-105 transition
  `,
};

/**
 * OverlayButton
 *
 * A stylized button component for overlays with color variants.
 *
 * Props:
 * - color: "magenta" | "cyan" (optional) — defines button theme. Defaults to "magenta".
 * - className: (optional) — append custom classes if needed.
 *
 * Example usage:
 * <OverlayButton>Play again</OverlayButton>         // magenta (default)
 * <OverlayButton color="cyan">Close</OverlayButton> // cyan themed
 */
export function OverlayButton({
  children,
  className = "",
  color = "magenta",
  ...rest
}: OverlayButtonProps) {
  return (
    <button
      {...rest}
      className={`
        mt-2 px-6 py-2 rounded-xl border-2
        ${colorClasses[color] || ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

interface OverlayHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function OverlayHeading({
  children,
  className = "",
}: OverlayHeadingProps) {
  return (
    <h2
      className={`mb-4 font-extrabold text-[#D3E0FB] drop-shadow-[0_0_10px_rgba(211,224,251,0.8)] ${className}`}
    >
      {children}
    </h2>
  );
}

interface OverlayTextProps {
  children: React.ReactNode;
  className?: string;
}

export function OverlayText({ children, className = "" }: OverlayTextProps) {
  return <p className={`mb-4 text-[#D3E0FB] ${className}`}>{children}</p>;
}
