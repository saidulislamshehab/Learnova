import { useState } from "react";
import { Mail, Lock, Terminal } from "lucide-react";

interface SignInProps {
  onSwitchToSignUp: () => void;
  onBackToHome: () => void;
  onLogin: () => void;
}

export function SignIn({
  onSwitchToSignUp,
  onBackToHome,
  onLogin,
}: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<
    string | null
  >(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log("Sign in with:", email, password);
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-32 pb-20">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-[#A5C89E]/80 rounded-lg flex items-center justify-center">
            <Terminal className="w-6 h-6 text-black" />
          </div>
          <div>
            <span className="text-white font-bold text-xl tracking-wide">
              LEARNOVA
            </span>
            <div className="text-[#A5C89E] text-[10px] font-mono tracking-wider">
              SYSTEM v1.0
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-[#121212]/80 backdrop-blur-2xl border border-[#A5C89E]/20 rounded-3xl p-8 shadow-2xl shadow-black/50">
          <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">
            Sign In to Learnova
          </h1>
          <p className="text-gray-500 text-sm mb-8 font-mono">
            Access your learning dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-gray-400 text-xs font-mono tracking-wider mb-2">
                EMAIL
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "email" ? "text-[#A5C89E]/90" : "text-gray-500"}`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="your.email@example.com"
                  className={`w-full bg-[#0b0b0b]/60 border ${focusedField === "email" ? "border-[#A5C89E]/60" : "border-gray-700/50"} rounded-xl px-12 py-3.5 text-white placeholder:text-gray-600 outline-none transition-all focus:shadow-lg focus:shadow-[#A5C89E]/10`}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-400 text-xs font-mono tracking-wider mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "password" ? "text-[#A5C89E]/90" : "text-gray-500"}`}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  className={`w-full bg-[#0b0b0b]/60 border ${focusedField === "password" ? "border-[#A5C89E]/60" : "border-gray-700/50"} rounded-xl px-12 py-3.5 text-white placeholder:text-gray-600 outline-none transition-all focus:shadow-lg focus:shadow-[#A5C89E]/10`}
                  required
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a
                href="#forgot"
                className="text-gray-500 hover:text-[#A5C89E]/90 text-sm transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-[#A5C89E]/80 hover:bg-[#A5C89E]/90 text-black font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#A5C89E]/20 tracking-wide"
            >
              SIGN IN
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            <span className="px-4 text-gray-500 text-xs font-mono">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={() => console.log('Google sign in')}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-3.5 rounded-xl transition-all hover:shadow-lg flex items-center justify-center space-x-3 border border-gray-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-500 text-sm">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToSignUp}
              className="text-[#A5C89E]/90 hover:text-[#A5C89E] font-medium transition-colors"
            >
              Sign Up
            </button>
          </p>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={onBackToHome}
              className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
            >
              ← Back to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}