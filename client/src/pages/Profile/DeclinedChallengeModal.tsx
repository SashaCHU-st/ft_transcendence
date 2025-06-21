import React from "react";
//import Avatar from "./Avatar"

interface DeclinedChallengeModalProps {
  declinedUsername: string | null;
  // declinedUserAvatar?: string; 
  onClose: () => void;
}

const DeclinedChallengeModal: React.FC<DeclinedChallengeModalProps> = ({
  declinedUsername,
 // declinedUserAvatar
  onClose,
}) => {
  if (!declinedUsername) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" >
      <div className="bg-gray-800  bg-opacity-70 rounded-xl border border-blue-500 
                  p-6 shadow-[0_0_15px_#60a5fa] text-center text-blue-200 w-full max-w-md max-h-[80vh]
                   overflow-y-auto space-y-6">
        <h2 className="text-xl text-blue-500 font-orbitron font-bold mb-4">
          CHALLENGE DECLINED!
        </h2>
        <div className="border border-blue-200 rounded-lg p-4 bg-gray shadow">
            {/* <Avatar
						user={{ avatar: declinedUserAvatar || "/prof_img/avatar1.png", username: declinedUsername}}
						className="w-10 h-10"
					  />	 */}
            <p className="mb-4 font-orbitron text-lg">
              {declinedUsername} has declined your challenge.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 font-orbitron bg-pink-700  text-white rounded hover:bg-pink-600"
            >
              OK
            </button>
         </div>
      </div>
    </div>
  );
};


export default DeclinedChallengeModal;
