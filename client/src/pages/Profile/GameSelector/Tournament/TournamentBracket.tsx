import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocationState } from './types/tournament';
import { useTournament } from './utils/useTournament';
import BracketGrid from './components/BracketGrid';
import StartButton from './components/StartButton';
import './styles/neon.css';

const TournamentBracket:React.FC=()=>{
  const { state } = useLocation() as { state: LocationState };
  const navigate=useNavigate();
  const { players, rounds, loading, start } = useTournament(state);

  if(loading) return <div className="
				h-screen 
				flex 
				items-center 
				justify-center 
				bg-main-neon 
				animate-pulse 
				text-white
  ">Loading tournament bracket…</div>;
  if(players.length<3) return(
    <div className="
				h-screen 
				flex 
				flex-col 
				items-center 
				justify-center 
				bg-main-neon 
				text-white
	">
      <p className="text-xl mb-4">Not enough players for the tournament (minimum 3)</p>
      <button onClick={()=>navigate(-1)} className="
					px-4 
					py-2 
					bg-blue-600 
					hover:bg-blue-700 
					rounded
	  ">Back</button>
    </div>
  );

  return(
    <div className="
			w-full 
			h-screen 
			bg-main-neon 
			relative
	">
      <StartButton onClick={start}/>
      <div className="
					flex 
					flex-col 
					items-center 
					justify-center 
					h-full 
					px-2 
					sm:px-4
	  ">
        <BracketGrid rounds={rounds} playersCount={players.length}/>
        <button onClick={()=>navigate(-1)} className="
					mt-6 
					px-4 
					sm:px-6 
					py-2 
					sm:py-3 
					bg-red-600 
					hover:bg-red-700 
					text-white 
					rounded-lg 
					text-base 
					sm:text-lg 
					transition
		">← Back</button>
      </div>
    </div>
  );
};
export default TournamentBracket;