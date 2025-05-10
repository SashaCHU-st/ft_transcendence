import React, { ReactNode, ButtonHTMLAttributes } from "react";

// ==== Primary Button ====
type PrimaryButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <button
      className="
        bg-white
        text-black
        font-bold
        py-2
        px-8
        rounded
        text-xl
        shadow-md
        hover:bg-gray-300
      "
      {...props}
    >
      {children}
    </button>
  );
};




// ==== Card Wrapper ====
type CardWrapperProps = {
  children: ReactNode;
  onClick?: () => void;
};

export const CardWrapper: React.FC<CardWrapperProps> = ({
  children,
  onClick,
}) => {
  return (
    <div
      className="
        bg-gray-800
        rounded-lg
        p-3
        shadow-sm
        transition
        hover:bg-gray-700
        cursor-pointer
        w-full
        min-w-[240px]
        max-w-[260px]
        duration-200
        ease-in-out
      "
      onClick={onClick}
    >
      {children}
    </div>
  );
};
