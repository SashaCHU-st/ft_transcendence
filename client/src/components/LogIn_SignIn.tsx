import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthButtons = () => {
  const navigate = useNavigate();

  const toLoginPage = () => {
    navigate('/auth');
  };

  const toSignUpPage = () => {
    navigate('/auth');
  };

  return (
    <div className="fixed top-4 right-6 z-50 flex gap-4">
      {/* Log In Button */}
      <button
        onClick={toLoginPage}
        className="px-2 sm:px-2 md:px-4 py-1 sm:py-1 md:py-2 rounded-2xl font-bold bg-transparent outline-3 outline-offset-2 outline-double 
            border border-blue-300  text-white transition-all duration-300 ease-in-out hover:scale-110
            text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg"
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

      {/* Sign Up Button */}
      <button
        onClick={toSignUpPage}
        className="px-2 sm:px-2 md:px-4 py-1 sm:py-1 md:py-2  rounded-2xl font-bold bg-transparent outline-3 outline-offset-2 outline-double
             border border-blue-300  text-white transition-all duration-300 ease-in-out hover:scale-110
             text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg"
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