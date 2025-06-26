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
        bg-transparent
        text-pink-600
        font-bold
        font-orbitron
        tracking-[.10em]
        py-2
        px-8
        rounded
        text-md
        lg:text-2xl
        xl:text-2xl
        2xl:text-4xl
        border-2
        border-pink-500
        hover:bg-indigo-950
        shadow-[0_0_15px_#db2777]
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
        min-w-[280px]
        
        sm:w-[280px]
        lg:w-[350px]
        
        
        duration-200
        ease-in-out
      "
      onClick={onClick}
    >
      {children}
    </div>
  );
};
