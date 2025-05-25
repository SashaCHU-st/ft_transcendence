import React from "react";

interface OverlayWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function OverlayWrapper({ children, className = "" }: OverlayWrapperProps) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 ${className}`}
    >
      {children}
    </div>
  );
}

interface NeonCardProps {
  borderColor: string;
  from: string;
  via?: string;
  to: string;
  className?: string;
  children: React.ReactNode;
}

export function NeonCard({
  borderColor,
  from,
  via,
  to,
  className = "",
  children,
}: NeonCardProps) {
  return (
    <div
      className={`rounded-2xl border-2 ${borderColor} p-6 text-center bg-gradient-to-br ${from} ${via ? via : ""} ${to} shadow-neon-lg ${className}`}
    >
      {children}
    </div>
  );
}

interface NeonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderColor: string;
  className?: string;
  children: React.ReactNode;
}

export function NeonButton({
  borderColor,
  className = "",
  children,
  ...rest
}: NeonButtonProps) {
  return (
    <button
      {...rest}
      className={`mt-2 px-6 py-2 rounded-lg border-2 ${borderColor} shadow-neon-button hover:scale-105 transition ${className}`}
    >
      {children}
    </button>
  );
}
