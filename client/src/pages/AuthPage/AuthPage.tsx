import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [loginMode, setLoginMode] = useState(false); // should be true?
  const navigate = useNavigate();
  const [signUpMode, setSignUPMode] = useState(true); // should be false?
  const [err, setError] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const switchHandler = () => {
    setLoginMode((prevMode) => !prevMode); //changing mode
  };
  const authHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Loading
    if (loginMode) {
      try {
        const response = await fetch(`http://localhost:3000/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        console.log("Login ok =>", responseData);
        navigate("/profile")
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("smth went wrong");
        }
      }
    } else {
      try {
        const response = await fetch(`http://localhost:3000/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            nickname,
            email,
            password,
          }),
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        console.log("SignUp all good", responseData);
        navigate("/profile")
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("smth went wrong");
        }
      }
    }
  };
  return (
    <div className="form_wrap">
      <form onSubmit={authHandler} className="form1">
        {err && <div className="error_message">{err}</div>}
        {!loginMode && (
          <>
            <div className="form_group">
              <label htmlFor="name">Name </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form_group">
              <label htmlFor="name">NickName </label>
              <input
                type="text"
                name="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="form_group">
          <label htmlFor="name">Email </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form_group">
          <label htmlFor="name">Password </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* LATER CONFIRMATION */}
        {/* <label>
          Password confirmation
          <input type="password" name="password" />
        </label> */}
        <div className="form_group">
          <button type="submit">{loginMode ? "LOGIN" : "SIGNUP"}</button>
        </div>
        <div className="form_group">
          <button type="button" onClick={switchHandler}>
            SWITCH TO {loginMode ? "SIGNUP" : "LOGIN"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
