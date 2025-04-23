import { useNavigate } from "react-router-dom";

const HeaderButton = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-4 left-6 z-50">
      <button
        onClick={() => navigate("/")}
        className="text-transparent bg-clip-text 
             bg-gradient-to-r from-red-400 via-indigo-300 to-green-300
             text-2xl sm:text-3xl font-bold 
             bg-transparent 
             transition-transform duration-300 ease-in-out 
             hover:scale-110"
             style={{ 
              textShadow:`
                0 0 20px rgba(255, 255, 255, 0.3),
                0 0 32px rgba(255, 0, 255, 0.3)
                `,
            }}
      >
        NEON PONG
      </button>
    </div>
  );
};

export default HeaderButton;