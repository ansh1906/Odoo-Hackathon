import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
    const nextErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!username.trim()) {
      nextErrors.username = "Username is required.";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return (
      !nextErrors.username &&
      !nextErrors.email &&
      !nextErrors.password &&
      !nextErrors.confirmPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register(username, email, password);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      const messages = [];
      if (data?.username) messages.push(data.username[0]);
      if (data?.email) messages.push(data.email[0]);
      setApiError(messages.join(" or "));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 lg:grid lg:grid-cols-2">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes flowline {
          to { stroke-dashoffset: -200; }
        }
      `}</style>

      {/* Left panel — brand / illustration */}
      <div className="relative hidden overflow-hidden border-r border-white/5 bg-slate-950 lg:flex lg:flex-col lg:justify-between">
        {/* Ambient background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.6) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-[130px]" />

        {/* Flow line signature element */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
          viewBox="0 0 600 800"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M 80 120 C 260 160, 320 300, 200 400 C 90 490, 260 560, 460 640"
            stroke="url(#flowGradient)"
            strokeWidth="1.5"
            strokeDasharray="6 10"
            style={{ animation: "flowline 8s linear infinite" }}
          />
          <defs>
            <linearGradient id="flowGradient" x1="0" y1="0" x2="600" y2="800">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative z-10 px-12 pt-14">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-bold text-slate-950">
              AF
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              AssetFlow
            </span>
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center px-12">
          <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight text-white">
            Enterprise Asset &amp; Resource Management System
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            Track, allocate, and maintain every organizational asset from a
            single, unified control plane.
          </p>
        </div>

        <div className="relative z-10 px-12 pb-8">
          <p className="text-xs text-slate-600">© 2026 AssetFlow</p>
        </div>
      </div>

      {/* Right panel — register form */}
      <div className="flex min-h-screen w-full items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Logo (mobile + desktop) */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-base font-bold tracking-wide text-indigo-300 shadow-inner">
              AF
            </div>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white">
              Create your account
            </h2>
            <p className="mt-2.5 text-sm text-slate-400">
              Create an AssetFlow account to continue.
            </p>
          </div>

          {apiError && (
            <div className="mb-5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {apiError}
            </div>
          )}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Username
              </label>

              <div className="relative">
                <User
                  size={17}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-invalid={Boolean(errors.username)}
                  aria-describedby={
                    errors.username ? "username-error" : undefined
                  }
                  className={`w-full rounded-lg border bg-white/[0.03] py-2.5 pl-10 pr-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:bg-white/[0.05] focus:ring-2 ${
                    errors.username
                      ? "border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/25"
                      : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500/25"
                  }`}
                />
              </div>

              {errors.username && (
                <p id="username-error" className="mt-1.5 text-xs text-rose-400">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full rounded-lg border bg-white/[0.03] py-2.5 pl-10 pr-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:bg-white/[0.05] focus:ring-2 ${
                    errors.email
                      ? "border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/25"
                      : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500/25"
                  }`}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-xs text-rose-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock
                  size={17}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className={`w-full rounded-lg border bg-white/[0.03] py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:bg-white/[0.05] focus:ring-2 ${
                    errors.password
                      ? "border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/25"
                      : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500/25"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300 focus:outline-none focus-visible:text-indigo-400"
                >
                  {showPassword ? (
                    <EyeOff size={17} strokeWidth={1.75} />
                  ) : (
                    <Eye size={17} strokeWidth={1.75} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1.5 text-xs text-rose-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="mb-1.5">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-slate-300"
                >
                  Confirm Password
                </label>
              </div>
              <div className="relative">
                <Lock
                  size={17}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  aria-invalid={Boolean(errors.confirmPassword)}
                  aria-describedby={
                    errors.confirmPassword ? "confirm-password-error" : undefined
                  }
                  className={`w-full rounded-lg border bg-white/[0.03] py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:bg-white/[0.05] focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/25"
                      : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500/25"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  aria-pressed={showConfirmPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300 focus:outline-none focus-visible:text-indigo-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} strokeWidth={1.75} />
                  ) : (
                    <Eye size={17} strokeWidth={1.75} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p
                  id="confirm-password-error"
                  className="mt-1.5 text-xs text-rose-400"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 py-3.5 text-sm font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-medium text-slate-500">
              Already have an account?
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full rounded-lg border border-white/15 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-indigo-400/50 hover:bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
          >
            Sign In
          </button>

          <p className="mt-3 text-center text-xs text-slate-500">
            Sign up creates an employee account — admin roles assigned later.
          </p>

          <p className="mt-8 text-center text-xs text-slate-600">
            © 2026 AssetFlow
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
