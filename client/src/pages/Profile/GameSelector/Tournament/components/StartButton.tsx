/**
 * Centrally positioned neon button that starts the tournament.
 */
import React from 'react';

interface Props {
  onClick: () => void;
}

const StartButton: React.FC<Props> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed 
	top-[15%] 
	left-1/2 
	transform -translate-x-1/2 
	px-16 
	py-8 
	bg-green-500 
	hover:bg-green-600 
	text-white 
	rounded-lg 
	text-2xl 
	sm:text-3xl 
	font-bold 
	neon-button 
	transition 
	z-10"
  >
    Start
  </button>
);

export default StartButton;