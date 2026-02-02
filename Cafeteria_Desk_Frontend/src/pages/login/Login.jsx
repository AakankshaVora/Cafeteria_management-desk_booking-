import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login(email); // only auth state change
    // Navigation happens in useEffect below
  };

  // 🔑 redirect AFTER user is set
  useEffect(() => {
    if (user) {
      if (user.role === "cafeteria") {
        toast.success("Logged in as Cafeteria Admin");
        navigate("/cafeteria");
      }
      else if (user.role === "desk") {
        toast.success("Logged in as Desk Admin");
        navigate("/desk");
      }
      else {
        toast.success("Logged in as Employee");
        navigate("/employee");
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-100 to-purple-50 relative overflow-hidden">

      {/* Background Blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-300 rounded-full blur-[120px] opacity-30"></div>
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-purple-300 rounded-full blur-[120px] opacity-30"></div>

      <Card className="w-full max-w-md p-10 z-10 shadow-2xl border-white/60">

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500">
            Sign in to access your dashboard
          </p>
        </div>

        <div className="space-y-6">
          <Input
            label="Email Address"
            placeholder="role@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />

          <div className="space-y-1">
            <Input
              label="Password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end">
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                Forgot password?
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600 cursor-pointer select-none">
              Remember me
            </label>
          </div>

          <Button
            onClick={handleLogin}
            variant="primary"
            className="w-full h-12 text-lg shadow-indigo-200"
            icon={LogIn}
          >
            Sign In
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-10">
          © 2026 Cafeteria & Desk Booking System
        </p>
      </Card>

    </div>
  );
};

export default Login;
