import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignInForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem("token", data.token); // ✅ Store JWT token
      console.log("Logged in with JWT:", data.token);
      onSuccess(); // Close modal or redirect
      navigate("/profile");
    } catch (error: any) {
      setError(error.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {err && <p className="text-red-500">{err}</p>}
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
      <button type="submit" className="btn-primary w-full">Login</button>
    </form>
  );
};

export default SignInForm;
