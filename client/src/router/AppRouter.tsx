import React from 'react'
import MainPage from '../pages/MainPage/MainPage'
import AuthPage from '../pages/AuthPage/AuthPage'
import { BrowserRouter, Route, Routes} from "react-router-dom";

const AppRouter = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path ="/" element={<MainPage/>}/>
          <Route path ="/login" element={<AuthPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default AppRouter
