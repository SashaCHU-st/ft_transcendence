import { useNavigate } from "react-router-dom";

const HeaderButton = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-4 left-6 z-50">
      <button
        onClick={() => navigate("/")}
        className="text-transparent bg-clip-text 
             bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300
             text-xl sm:text-3xl md:text-4xl font-bold 
             bg-transparent 
             transition-transform duration-300 ease-in-out 
             hover:scale-110"
             style={{ 
              textShadow:`
                2px 2px 10px rgba(255, 255, 255, 0.3),
                0px 0px 25px rgba(209, 255, 249, 0.6)
                `,
            }}
      >
        NEON PONG
      </button>
    </div>
  );
};

export default HeaderButton;