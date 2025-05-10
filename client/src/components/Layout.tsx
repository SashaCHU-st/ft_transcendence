// //import { Outlet } from "react-router-dom";
// import HeaderButton from "./HeaderButton";
// import AuthButtons from "./LogIn_SignIn";
// import { useState } from "react";
// import AuthPage from "../pages/AuthPage/AuthPage";
// import { useLocation, Outlet } from "react-router-dom";

// const Layout = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
//   const location = useLocation();
//   const isMainPage = location.pathname === "/";

//  // const openModal = () => setShowModal(true);
//  const openModal = (mode: "login" | "signup") => {
//   setAuthMode(mode);
//   setShowModal(true);
// };
//   const closeModal = () => setShowModal(false);

//   return (
//     <div>

//       <HeaderButton />
//       {isMainPage && <AuthButtons openModal={openModal} />}
	   
//       <Outlet context= {{openModal}}/>
//       {showModal && <AuthPage mode={authMode} onClose={closeModal} />}
//     </div>
//   );
// };

// export default Layout;

//<AuthButtons openModal={openModal} />




import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AuthPage from '../pages/AuthPage/AuthPage';

const Layout: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'signup'>('login');
  const location = useLocation();

  const openModal = (mode: 'login' | 'signup' = 'login') => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div>
      <Outlet context={{ openModal }} />
      {isModalOpen && !isAuthRoute && <AuthPage mode={modalMode} onClose={closeModal} />}
    </div>
  );
};

export default Layout;