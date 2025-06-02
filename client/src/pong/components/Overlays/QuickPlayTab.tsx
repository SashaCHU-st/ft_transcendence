import React from "react";

interface QuickPlayTabProps {
  onRandomMatch: () => void;
}

export function QuickPlayTab({ onRandomMatch }: QuickPlayTabProps) {
  return (
    <div>
      <div className="online-options">
        <button
          type="button"
          className="online-option"
          onClick={onRandomMatch}
        >
          <h3>Random match</h3>
          <p>Find a random opponent online</p>
        </button>
      </div>
    </div>
  );
}
