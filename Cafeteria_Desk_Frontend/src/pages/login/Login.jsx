import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { LogIn, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    // Call login from AuthContext
    const result = await login(email, password);

    if (!result.success) {
      toast.error(result.message);
    } else {
      // Show toast only on manual login success
      const role = result.role || (user && user.role) || "employee"; // Fallback
      // Note: 'user' from context might not be updated yet in this closure, 
      // but 'login' usually returns success. Ideally 'login' should return the user object.
      // Let's assume login returns { success: true } and we can infer role or just say "Logged in successfully"
      // actually, let's look at AuthContext. It returns { success: true }.
      // We can't access the new user state immediately here because of closure.
      // But we can just say "Login Successful" or wait for the redirect.
      // Better yet, let's rely on the fact that we know who we are logging in as? No.
      // Let's just standard toast.
      toast.success("Login Successful");
    }
    // Navigation happens in useEffect when 'user' state updates
  };

  // 🔑 redirect AFTER user is set
  useEffect(() => {
    if (user) {
      if (user.role === "cafeteria_admin") {
        navigate("/cafeteria");
      }
      else if (user.role === "desk_admin") {
        navigate("/desk");
      }
      else {
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
            id="email"
            label="Email Address"
            placeholder="role@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />

          <div className="space-y-1">
            <Input
              id="password"
              label="Password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-indigo-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                Forgot password?
              </Link>
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
        <p className="text-center text-sm text-gray-500 mt-8">
          New here?{" "}
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
            Create an account
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-4">
          © 2026 Cafeteria & Desk Booking System
        </p>
      </Card>

    </div>
  );
};

export default Login;
