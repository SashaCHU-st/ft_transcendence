import React, { useState } from "react";
//import { useNavigate } from "react-router-dom";
import SignInForm from "./LogInForm";
import SignUpForm from "./SignUpForm";

const AuthPage = ({
  onClose,
  mode,
}: {
  onClose: () => void;
  mode: "login" | "signup";
}) => {
  const [isLogin, setIsLogin] = useState(mode === "login");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-30 rounded-lg shadow-xl p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-blue-100 hover:text-red-500 text-lg font-bold"
        >
          ✕
        </button>
        {isLogin ? (
          <SignInForm onSuccess={onClose} />
        ) : (
          <SignUpForm onSuccess={onClose} />
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
// const AuthPage = () => {
//   const [loginMode, setLoginMode] = useState(false); // should be true?
//   const navigate = useNavigate();
//   const [signUpMode, setSignUPMode] = useState(true); // should be false?
//   const [err, setError] = useState("");
//   const [name, setName] = useState("");
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const switchHandler = () => {
//     setLoginMode((prevMode) => !prevMode); //changing mode
//   };
//   const authHandler = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     // Loading
//     if (loginMode) {
//       try {
//         const response = await fetch(`http://localhost:3000/login`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email,
//             password,
//           }),
//         });
//         const responseData = await response.json();
//         if (!response.ok) {
//           throw new Error(responseData.message);
//         }
//         console.log("Login ok =>", responseData);
//         navigate("/profile")
//       } catch (err: unknown) {
//         if (err instanceof Error) {
//           setError(err.message);
//         } else {
//           setError("smth went wrong");
//         }
//       }
//     } else {
//       try {
//         const response = await fetch(`http://localhost:3000/signup`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             name,
//             username,
//             email,
//             password,
//           }),
//         });
//         const responseData = await response.json();
//         if (!response.ok) {
//           throw new Error(responseData.message);
//         }
//         console.log("SignUp all good", responseData);
//         navigate("/profile")
//       } catch (err: unknown) {
//         if (err instanceof Error) {
//           setError(err.message);
//         } else {
//           setError("smth went wrong");
//         }
//       }
//     }
//   };
//   return (
//     <div className="form_wrap">
//       <form onSubmit={authHandler} className="form1">
//         {err && <div className="error_message">{err}</div>}
//         {!loginMode && (
//           <>
//             <div className="form_group">
//               <label htmlFor="name">Name </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//             <div className="form_group">
//               <label htmlFor="name">username </label>
//               <input
//                 type="text"
//                 name="username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </div>
//           </>
//         )}

//         <div className="form_group">
//           <label htmlFor="name">Email </label>
//           <input
//             type="email"
//             name="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <div className="form_group">
//           <label htmlFor="name">Password </label>
//           <input
//             type="password"
//             name="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         {/* LATER CONFIRMATION */}
//         {/* <label>
//           Password confirmation
//           <input type="password" name="password" />
//         </label> */}
//         <div className="form_group">
//           <button type="submit">{loginMode ? "LOGIN" : "SIGNUP"}</button>
//         </div>
//         <div className="form_group">
//           <button type="button" onClick={switchHandler}>
//             SWITCH TO {loginMode ? "SIGNUP" : "LOGIN"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

export default AuthPage;
