// import React, { Profiler } from 'react'
import MainPage from '../pages/MainPage/MainPage'
import AuthPage from '../pages/AuthPage/AuthPage'
import Profile from '../pages/Profile/Profile';
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from '../components/Layout.tsx';
//import { Toaster } from 'react-hot-toast';

const AppRouter = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path ="/" element={<MainPage/>}/>
            <Route path ="/auth" element={<AuthPage/>}/>
            <Route path ="/profile" element={<Profile/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default AppRouter
