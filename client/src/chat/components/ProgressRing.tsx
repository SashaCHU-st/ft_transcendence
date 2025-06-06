import React from "react";

interface ProgressRingProps {
  percent: number;
  label?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ percent, label = "Win rate" }) => {
  const size = 140;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = React.useState(circumference);

  React.useEffect(() => {
    const target = circumference * (1 - percent / 100);
    // trigger animation on the next frame so the transition is visible
    requestAnimationFrame(() => setOffset(target));
  }, [percent, circumference]);

  return (
    <svg width={size} height={size} className="overflow-visible">
      <defs>
        <filter
          id="glow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          filterUnits="userSpaceOnUse"
        >
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00bfff" />
        </filter>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={10}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#00bfff"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1.5s ease-out", filter: "url(#glow)" }}
      />
      <text
        x="50%"
        y="45%"
        dy="0.3em"
        textAnchor="middle"
        className="fill-white font-bold text-2xl font-orbitron"
      >
        {percent}%
      </text>
      <text
        x="50%"
        y="42%"
        dy="2.2em"
        textAnchor="middle"
        className="fill-blue-300 text-sm"
      >
        {label}
      </text>
    </svg>
  );
};

export default ProgressRing;
