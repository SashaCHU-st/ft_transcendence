import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword, validateName, validateUsername } from "../../utils/InputValidation";

interface SignUpFormProps {
  onSuccess?: () => void; // Made optional if not always provided
  closeModal?: () => void; // Add closeModal prop
}

const SignUpForm = ({ onSuccess, closeModal }: SignUpFormProps) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const nameError = validateName(name);
    const usernameError = validateUsername(username);
    setEmailError(emailError);
    setPasswordError(passwordError);
    setNameError(nameError);
    setUsernameError(usernameError);

    if (emailError || passwordError || nameError || usernameError)
      return;

    try {
      const res = await fetch("https://localhost:3000/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      login(data.accessToken);
      localStorage.setItem("id", data.id);
      onSuccess?.();
      closeModal?.();

      navigate("/profile");
    } catch (error: any) {
      setError(error.message || "Signup failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl tracking-[.10em] font-orbitron font-bold mb-5 text-center">
        REGISTRATION
      </h2>
      <form onSubmit={handleSignUp} className="space-y-4">
        {err && <p className="text-red-500 text-center">{err}</p>}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Name"
            autoFocus
            className="w-full bg-black text-white bg-opacity-30 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800"
            value={name}
            //onChange={(e) => setName(e.target.value)}
             onChange={(e) => {
              const value = e.target.value;
              setName(value);
              setNameError(validateName(value));
            }}
            required
          />
          {nameError && (<p className="text-red-500 text-sm">{nameError}</p>)}
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 bg-black text-white bg-opacity-30 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800"
            value={username}
            //onChange={(e) => setUsername(e.target.value)}
            onChange={(e) => {
              const value = e.target.value;
              setUsername(value);
              setUsernameError(validateUsername(value));
            }}
            required
          />
          {usernameError && (<p className="text-red-500 text-sm">{usernameError}</p>)}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-black text-white bg-opacity-30 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800"
            value={email}
            //onChange={(e) => setEmail(e.target.value)}
            onChange={(e) =>{ 
                setEmail(e.target.value); 
                setEmailError(validateEmail(e.target.value));
            }}
            required
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          <div className="relative">
            <input
              //type="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 bg-black text-white bg-opacity-30 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800"
              value={password}
              //onChange={(e) => setPassword(e.target.value)}
               onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                setPasswordError(validatePassword(value));
              }}
              required
            />
            {passwordError && (<p className="text-red-500 text-sm">{passwordError}</p>)}
            <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-gray-400 hover:text-white focus:outline-none"
                >
                  {showPassword ? "🙈" : "👁️"}
              </button>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-1/2 bg-indigo-950 tracking-[.10em] font-orbitron hover:bg-rose-950 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
