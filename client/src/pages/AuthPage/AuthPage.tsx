import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignInForm from "./LogInForm";
import SignUpForm from "./SignUpForm";

const AuthPage = ({
  onClose,
  mode,
}: {
  onClose?: () => void;
  mode: "login" | "signup";
}) => {
  const [isLogin, setIsLogin] = useState(mode === "login");
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/"); // or whatever fallback route you want
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-30 rounded-lg shadow-xl p-6 max-w-md w-full relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-blue-100 hover:text-red-500 text-lg font-bold"
        >
          ✕
        </button>
        {isLogin ? (
          <SignInForm onSuccess={handleClose} />
        ) : (
          <SignUpForm onSuccess={handleClose} />
        )}
        <div className="text-center mt-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-200 hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
