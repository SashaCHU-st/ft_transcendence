// // import React, { Profiler } from 'react'
// import MainPage from '../pages/MainPage/MainPage'
// //import AuthPage from '../pages/AuthPage/AuthPage'
// import Profile from '../pages/Profile/Profile';
// import { BrowserRouter, Route, Routes} from "react-router-dom";
// import Layout from '../components/Layout.tsx';

// const AppRouter = () => {
//   return (
//     <div>
//       <BrowserRouter>
//         <Routes>
//           <Route element={<Layout />}>
//             <Route path ="/" element={<MainPage/>}/>
//             <Route path ="/profile" element={<Profile/>}/>
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </div>
//   )
// }

// export default AppRouter



// // {/* <Route path ="/auth" element={<AuthPage/>}/> */}

import TournamentBracket from '../pages/Profile/GameSelector/Tournament/TournamentBracket'; //!
import MainPage from '../pages/MainPage/MainPage';
import Profile from '../pages/Profile/Profile';
import AuthPage from '../pages/AuthPage/AuthPage';
import PongGame from '../pong/Pong3D';
import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const AppRouter = () => {
  const { isAuthenticated } = useAuth();
  return (
    
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/profile" 
          element={
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
          } 
          />
          <Route path="/pong" element={<PongGame />} />
          <Route path="/login" element={
           // <AuthPage mode="login" onClose={() => {}} />
           isAuthenticated ? (
            <Navigate to="/profile" replace />
          ) : (
            <AuthPage mode="login" onClose={() => {}} />
          )
            } />
          <Route path="/signup" element={<AuthPage mode="signup" onClose={() => {}} />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/tournament" 
            element={<TournamentBracket />
              
            } 
            /> //!
        </Route>
      </Routes>
   
  );
};

export default AppRouter;