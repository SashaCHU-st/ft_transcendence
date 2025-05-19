import myImage from '../../assets/mainPageImages/Main_Image.png';
import { useOutletContext } from "react-router-dom";

const MainPage = () => {
  const { openModal } = useOutletContext<{ openModal: (mode?: 'login' | 'signup') => void }>();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="container mx-auto flex flex-col items-center justify-center relative">
        <div className="relative w-full pt-0">
          <img 
            src={myImage} 
            alt="Main Visual" 
            className="w-full h-auto rounded-xl shadow-neon transition-shadow duration-300 ease-in-out"
          />
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
            <button 
              className="rounded-lg outline-3 outline-offset-2 outline-double border-4 border-blue-300 
                        px-8 sm:px-10 md:px-14 py-4 sm:py-3 md:py-5
                        font-bold text-transparent text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
                        bg-clip-text bg-gradient-to-r from-indigo-300 via-blue-300 to-sky-500
                        hover:from-red-50 hover:via-indigo-200 hover:to-purple-100
                        animate-pulse hover:animate-none
                        transition-all duration-300 ease-in-out hover:scale-110 w-full sm:w-auto text-center"
              style={{ 
                textShadow: '2px 2px 10px rgba(209, 255, 249, 0.6)', 
                boxShadow: '0 0 15px 6px rgba(117, 184, 255, 0.5)'
              }}
              onClick={() => openModal('login')}
            >
              NEON PONG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;




// const MainPage = () => {
//   const navigate = useNavigate()
//   const toAuthPage =()=> navigate("/auth")
//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//           <div className="container mx-auto flex flex-col items-center justify-center relative"> 
//             <div className="relative w-full max-w-6xl">
//                 <img 
//                   src={myImage} 
//                   alt="Main Visual" 
//                   className="w-full h-auto rounded-xl transition-shadow duration-300 ease-in-out"
//                   style={{
//                     boxShadow: `
//                       -8px -8px 60px rgba(255, 0, 255, 0.7),
//                       8px -8px 20px rgba(0, 255, 255, 0.7),
//                       -2px  2px 10px rgba(0, 252, 101, 0.7),
//                       8px  8px 20px rgba(113, 240, 2, 0.7),
//                       0 0 10px rgba(255, 0, 255, 0.6),
//                       0 0 20px rgba(255, 0, 255, 0.4),
//                       0 0 40px rgba(255, 0, 255, 0.2)
//                     `,
//                     borderRadius: '16px',
//                     transition: 'box-shadow 0.5s ease-in-out'
//                   }}
//                 />
//                 <div className="absolute top-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-center 
//                   text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
//                 style={{ 
//                   textShadow:`
//                     0 0 4px rgba(102, 0, 255, 0.9),
//                     0 0 8px rgba(102, 0, 255, 0.7),
//                     0 0 16px rgba(102, 0, 255, 0.5),
//                     0 0 32px rgba(102, 0, 255, 0.3)
//                     `,
//                 }}>
//                 NEON PONG
//                 </div>
//                 <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
//                   <button className="rounded-full border-2 border-emerald-300 px-6 sm:px-8 md:px-12 py-2 sm:py-3 md:py-4
//                 font-bold text-transparent text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
//                 bg-clip-text bg-gradient-to-r from-green-300 via-yellow-300 to-rose-500
//                 hover:from-yellow-400 hover:via-red-700 hover:to-purple-600
//                 shadow-lg animate-pulse hover:animate-none
//                 transition-all duration-300 ease-in-out hover:scale-110 w-full sm:w-auto text-center"
//                   style={{ 
//                           textShadow: '2px 2px 6px rgba(255, 0, 255, 0.6)', 
//                           boxShadow: '0 0 15px 2px rgba(255, 0, 255, 0.5)'
//                     }}
//                     onClick={toAuthPage}>
//                      START GAME
//                   </button>
//                 </div>
              
//             </div>
//           </div>
//       </div>
     
     

   
//   )
// }