import React from 'react';

const AuthButtons = ({ openModal }: { openModal: (mode: "login" | "signup") => void }) => {
  return (
    <div className="fixed top-4 right-8 z-50 flex gap-4">
      <button
        onClick={()=> openModal("login")}
        className="px-2 py-1 rounded-lg font-bold bg-transparent outline-3 outline-offset-2 outline-double 
            border border-blue-300  text-white transition-all duration-300 ease-in-out hover:scale-110
            text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm"
		style={{ 
			textShadow:`
			  0 0 4px rgba(102, 0, 255, 0.9),
			  0 0 8px rgba(102, 0, 255, 0.7),
			  0 0 16px rgba(102, 0, 255, 0.5),
			  0 0 32px rgba(102, 0, 255, 0.3)
			  `,
		  }}
	    >
        LOG IN
      </button>
      <button
        onClick={()=> openModal("signup")}
        className="px-2 py-1 rounded-lg font-bold bg-transparent outline-3 outline-offset-2 outline-double
             border border-blue-300  text-white transition-all duration-300 ease-in-out hover:scale-110
             text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm"
		style={{ 
			textShadow:`
			  0 0 4px rgba(102, 0, 255, 0.9),
			  0 0 8px rgba(102, 0, 255, 0.7),
			  0 0 16px rgba(102, 0, 255, 0.5),
			  0 0 32px rgba(102, 0, 255, 0.3)
			  `,
		  }}
	    >
        SIGN UP
      </button>
    </div>
  );
};


export default AuthButtons;