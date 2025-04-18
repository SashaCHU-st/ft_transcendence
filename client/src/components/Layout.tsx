import { Outlet } from "react-router-dom";
import HeaderButton from "./HeaderButton";
import AuthButtons from "./LogIn_SignIn";

const Layout = () => {
  return (
    <div>
      <HeaderButton />
	  <AuthButtons />
      <Outlet />
    </div>
  );
};

export default Layout;