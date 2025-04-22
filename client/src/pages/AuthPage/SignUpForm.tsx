import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, nickname, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem("token", data.token); // ✅ Store JWT token
      console.log("Signed up with JWT:", data.token);
      onSuccess();
      navigate("/profile");
    } catch (error: any) {
      setError(error.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      {err && <p className="text-red-500">{err}</p>}
      <input
        type="text"
        placeholder="Name"
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Nickname"
        className="input"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="btn-primary w-full">Sign Up</button>
    </form>
  );
};

export default SignUpForm;