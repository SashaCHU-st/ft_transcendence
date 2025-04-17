import React from 'react'
import { useNavigate } from 'react-router-dom'
import myImage from '../../assets/mainPageImages/PingpongPaddle.jpg';

const MainPage = () => {
  const navigate = useNavigate()
  const toAuthPage =()=> navigate("/auth")
  return (
    <div className="h-screen flex flex-col items-center justify-center">
       <div className="relative flex flex-col items-center w-full">
          <img 
            src={myImage} 
            alt="Main Visual" 
            className="max-w-[80%] h-auto object-cover border-2 border-solid border-fuchsia-200"
          />
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          text-white text-8xl font-bold"
          style={{ 
            textShadow: '9px 12px 10px rgba(255, 0, 255, 0.6)', 
          }}>
          <p>SUPER PONG</p>

    </div>
      </div>
      <div className="flex items-center justify-center">
        <button 
          className="px-9 py-3 mx-8 my-8 rounded-full outline-2 
          outline-blue-500/50 border-2 border-emerald-300 w-sm text-6xl 
          font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-yellow-300 to-rose-500
          hover:from-yellow-400 hover:via-red-700 hover:to-purple-600 shadow-lg animate-pulse duration-[3000ms] 
          hover:animate-none transition-all delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-150"
          style={{ 
              textShadow: '2px 2px 6px rgba(255, 0, 255, 0.6)', 
              boxShadow: '0 0 15px 2px rgba(255, 0, 255, 0.5)'
           }}
          onClick={toAuthPage}>
            START GAME
        </button>
      </div>

    </div>
  )
}
export default MainPage
