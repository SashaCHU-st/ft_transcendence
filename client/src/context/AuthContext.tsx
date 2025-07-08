import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import api from "../types/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const verifyToken = async () => {
      try {
        const { data } = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data?.user?.id) {
          localStorage.setItem("id", String(data.user.id));
          setIsAuthenticated(true);
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
      }
    };

    verifyToken();
  }, [navigate]);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      const user_id = localStorage.getItem("id");
      const response = await fetch("https://localhost:3000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id }),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error("Failed to logout");

      toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to logout. Please try again.");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      setIsAuthenticated(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
