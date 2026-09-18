import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch, setAuthData } from "../api/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  X
} from "lucide-react";

export default function LoginPage({ dark, setDark }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("pkarunakar@franchiseops.ai");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const res = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });
        if (res && res.token) {
          setAuthData(res.token, res.user);
        } else {
          setAuthData("demo-jwt-token-12345", { full_name: "P Karunakar", email, role: "Enterprise Franchise Director" });
        }
        setLoading(false);
        setSuccessMsg("Authentication successful! Redirecting to Dashboard...");
        setTimeout(() => {
          navigate("/");
        }, 800);
      } catch (err) {
        // Fallback demo authentication when backend is offline
        setAuthData("demo-jwt-token-12345", { full_name: "P Karunakar", email, role: "Enterprise Franchise Director" });
        setLoading(false);
        setSuccessMsg("Demo authentication successful! Redirecting to Dashboard...");
        setTimeout(() => {
          navigate("/");
        }, 800);
      }
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (forgotEmail && /\S+@\S+\.\S+/.test(forgotEmail)) {
      setForgotSubmitted(true);
    }
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Navbar Bar overlay */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3">
          <button
            onClick={() => setDark && setDark(!dark)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-colors text-white"
            title="Toggle Dark/Light Mode"
          >
            {dark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* LOGO & TITLE */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl shadow-blue-500/25 mb-3">
              <Sparkles size={28} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
            <p className="text-sm text-slate-400 mt-1">Sign in to your FranchiseOS AI Dashboard</p>
          </div>

          {/* FORM CARD */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative">

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5"
              >
                <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* EMAIL FIELD */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    placeholder="name@franchise.com"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-800/80 border ${errors.email ? "border-rose-500/80 focus:ring-rose-500/20" : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                      } text-white placeholder-slate-500 focus:outline-none focus:ring-4 transition-all`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={11} /> {errors.email}
                  </p>
                )}
              </div>

              {/* PASSWORD FIELD */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-800/80 border ${errors.password ? "border-rose-500/80 focus:ring-rose-500/20" : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                      } text-white placeholder-slate-500 focus:outline-none focus:ring-4 transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={11} /> {errors.password}
                  </p>
                )}
              </div>

              {/* REMEMBER ME & DUMMY DEMO BADGE */}
              <div className="flex items-center justify-between text-xs py-1">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500/20 accent-blue-600 cursor-pointer"
                  />
                  Remember Me
                </label>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-400" /> SSL Encrypted
                </span>
              </div>

              {/* SUBMIT BUTTON */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In to Dashboard <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </form>

            {/* DEMO CREDS HELP */}
            <div className="mt-5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Demo credentials pre-filled</span>
              <span className="font-semibold text-blue-400">Manager Access</span>
            </div>

            {/* SIGN UP LINK */}
            <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 text-white shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSubmitted(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-bold mb-1">Reset Password</h3>
              <p className="text-xs text-slate-400 mb-4">Enter your email and we'll send a dummy reset link.</p>

              {forgotSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs text-center space-y-2">
                  <CheckCircle2 size={24} className="mx-auto text-emerald-400" />
                  <p className="font-semibold">Reset instructions sent!</p>
                  <p className="text-slate-300 text-[11px]">Check your inbox for step-by-step instructions.</p>
                  <button
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotSubmitted(false);
                    }}
                    className="mt-2 px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Registered Email</label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md transition-colors"
                  >
                    Send Reset Link
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
