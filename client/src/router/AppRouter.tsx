// import React, { Profiler } from 'react'
import MainPage from '../pages/MainPage/MainPage'
import AuthPage from '../pages/AuthPage/AuthPage'
import Profile from '../pages/Profile/Profile';
import { BrowserRouter, Route, Routes} from "react-router-dom";

const AppRouter = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path ="/" element={<MainPage/>}/>
          <Route path ="/auth" element={<AuthPage/>}/>
          <Route path ="/profile" element={<Profile/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default AppRouter
