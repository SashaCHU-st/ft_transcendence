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
        className="px-4 py-2 rounded-2xl text-base font-bold bg-transparent outline-3 outline-offset-2 outline-double border border-emerald-200  text-white transition-all duration-300 ease-in-out hover:scale-110"
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
        className="px-4 py-2 rounded-2xl text-base font-bold bg-transparent outline-3 outline-offset-2 outline-double border border-emerald-200  text-white transition-all duration-300 ease-in-out hover:scale-110"
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