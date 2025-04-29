//import { Outlet } from "react-router-dom";
import HeaderButton from "./HeaderButton";
import AuthButtons from "./LogIn_SignIn";
import { useState } from "react";
import AuthPage from "../pages/AuthPage/AuthPage";
import { useLocation, Outlet } from "react-router-dom";

const Layout = () => {
  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const location = useLocation();
  const isMainPage = location.pathname === "/";

 // const openModal = () => setShowModal(true);
 const openModal = (mode: "login" | "signup") => {
  setAuthMode(mode);
  setShowModal(true);
};
  const closeModal = () => setShowModal(false);

  return (
    <div>

      <HeaderButton />
      {isMainPage && <AuthButtons openModal={openModal} />}
	   
      <Outlet context= {{openModal}}/>
      {showModal && <AuthPage mode={authMode} onClose={closeModal} />}
    </div>
  );
};

export default Layout;

//<AuthButtons openModal={openModal} />