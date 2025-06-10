//import myImage from '../../assets/mainPageImages/Main_Image.png';
import { useOutletContext } from "react-router-dom";
import mainVideo from '../../assets/mainPageImages/Main_Video.mp4';
import { SpaceBackground } from "../../pong/components/SpaceBackground";


const MainPage = () => {
  const { openModal } = useOutletContext<{ openModal: (mode?: 'login' | 'signup') => void }>();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <SpaceBackground />
      </div>
      <div className="container mx-auto flex flex-col items-center justify-center h-full relative z-10">
          <h1 className="animate-pulse [animation-duration:3s] p-16 
                  text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black font-orbitron 
                  text-[#D3E0FB] "
          style={{ textShadow: '0 0 12px #007BFF, 0 0 20px #007BFF' }}
          >
            SUPER PONG
          </h1>
        
          <div className="relative w-full">
            <video
              src={mainVideo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto rounded-xl transition-shadow duration-300 ease-in-out"
            />
          <div className=" absolute sm:bottom-2 bottom-2 md:bottom-2 lg:bottom-4 
                  right-20 sm:right-32 md:right-44 lg:right-64 xl:right-72 2xl:right-96 
                  transform -translate-x-1/2 z-20">
            <button
              className="rounded-xl o border-2 px-5 py-2 border-blue-300
                        lg:px-5 lg:py-2 md:px-5 md:py-2 2xl:px-5 2xl:py-3 xl:py-3
                        font-bold text-transparent text-md sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl
                        bg-clip-text bg-gradient-to-r from-indigo-300 via-blue-300 to-sky-500
                        hover:from-red-50 hover:via-indigo-200 hover:to-purple-100
                        animate-bounce [animation-duration:1s] hover:animate-none
                        transition-all ease-in-out hover:scale-110 w-full sm:w-auto text-center
                       bg-black bg-opacity-40
                       text-[#40BFFF]
                        shadow-[0_0_15px_rgba(0,255,255,0.7)]"
              //   style={{
              //   textShadow: '2px 2px 10px rgba(209, 255, 249, 0.6)',
              //   boxShadow: '0 0 15px 6px rgba(117, 184, 255, 0.5)'
              // }}
              onClick={() => openModal('login')}
            >
              GO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;