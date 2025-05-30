import React from "react";

export interface TabButtonProps<T>
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: T;
  active: boolean;
  onSelect: (val: T) => void;
  children: React.ReactNode;
}

function InnerTabButton<T>(
  { value, active, onSelect, className = "", children, ...rest }: TabButtonProps<T>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const base =
    "px-6 py-3 cursor-pointer border-b-2 transition-colors text-[#aaa] hover:text-white focus:outline-none focus:text-white";
  const activeClasses = active ? "text-[#00a1ff] border-b-[#00a1ff]" : "border-transparent";

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={`${base} ${activeClasses} ${className}`}
      onClick={() => onSelect(value)}
      ref={ref}
      {...rest}
    >
      {children}
    </button>
  );
}

const TabButton = React.forwardRef(InnerTabButton) as <T>(
  props: TabButtonProps<T> & { ref?: React.Ref<HTMLButtonElement> }
) => JSX.Element;

export default TabButton;
