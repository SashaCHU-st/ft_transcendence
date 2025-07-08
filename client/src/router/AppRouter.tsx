import MainPage from '../pages/MainPage/MainPage';
import Profile from '../pages/Profile/Profile';
import AuthPage from '../pages/AuthPage/AuthPage';
import PongGame from '../pong/Pong3D';
import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from '../components/Layouts/Layout';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const AppRouter = () => {
  const { isAuthenticated } = useAuth();
  return (
    
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={
             isAuthenticated ? (
            <Navigate to="/profile" replace />
          ) : (
             <MainPage/>
          )
          } />

          <Route path="/profile" 
          element={
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
          } 
          />

          <Route path="/pong" 
            element={
              <ProtectedRoute>
                <PongGame />
              </ProtectedRoute>
          } />

          <Route path="/login" element={
           isAuthenticated ? (
            <Navigate to="/profile" replace />
          ) : (
            <AuthPage mode="login" />
          )
          } />

          <Route path="/signup" 
            element={
              <ProtectedRoute>
                <AuthPage mode="signup" onClose={() => {}} />
              </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
   
  );
};

export default AppRouter;