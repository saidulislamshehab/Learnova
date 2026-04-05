import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import NavLogo from '../Sources/logo.png';

// Interface for SignUp props
interface SignUpProps {
  onSwitchToSignIn: () => void;
  onBackToHome: () => void;
  onShowNotification?: (message: string, type: 'success' | 'error') => void;
}

/**
 * SignUp Component
 * Renders the user registration form.
 * includes fields for name, email, and password with validation placeholders.
 */
export function SignUp({
  onSwitchToSignIn,
  onBackToHome,
  onShowNotification,
}: SignUpProps) {
  // State for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<
    string | null
  >(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Use window.location.hostname to allow access from network (e.g. 192.168.x.x)
      const response = await fetch(`http://${window.location.hostname}:8000/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors or other errors
        if (data.errors) {
            // Flatten errors or just show the first one
            const errorMessages = Object.values(data.errors).flat().join(", ");
            throw new Error(errorMessages);
        }
        throw new Error(data.message || "Registration failed");
      }

      console.log("Sign up successful:", data);
      
      if (onShowNotification) {
          onShowNotification("Account successfully created! Please sign in.", "success");
      }
      
      // Automatically switch to sign in or log in
      onSwitchToSignIn();

    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-32 pb-20">
      <div className="w-full max-w-md">
        {/* Terminal Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 overflow-hidden">
            <img src={NavLogo} alt="Learnova Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-400 text-sm font-mono">
            LEARNOVA SYSTEM v1.0 // NEW USER
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-3xl p-8 shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-4">
                <p className="text-red-400 text-sm font-mono text-center">{error}</p>
              </div>
            )}

            {/* Name Field */}
            <div className="relative">
              <label className="block text-xs font-mono text-gray-500 mb-2 tracking-wider">
                FULL NAME
              </label>
              <div
                className={`relative flex items-center border rounded-xl transition-all ${focusedField === "name"
                  ? "border-[#A5C89E]/60 bg-[#A5C89E]/5"
                  : "border-[#A5C89E]/20 bg-[#1a1a1a]/50"
                  }`}
              >
                <User className="absolute left-4 w-5 h-5 text-[#A5C89E]/60" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent text-white pl-12 pr-4 py-3 outline-none placeholder:text-gray-600 text-sm"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <label className="block text-xs font-mono text-gray-500 mb-2 tracking-wider">
                EMAIL ADDRESS
              </label>
              <div
                className={`relative flex items-center border rounded-xl transition-all ${focusedField === "email"
                  ? "border-[#A5C89E]/60 bg-[#A5C89E]/5"
                  : "border-[#A5C89E]/20 bg-[#1a1a1a]/50"
                  }`}
              >
                <Mail className="absolute left-4 w-5 h-5 text-[#A5C89E]/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="your.email@example.com"
                  className="w-full bg-transparent text-white pl-12 pr-4 py-3 outline-none placeholder:text-gray-600 text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-xs font-mono text-gray-500 mb-2 tracking-wider">
                PASSWORD
              </label>
              <div
                className={`relative flex items-center border rounded-xl transition-all ${focusedField === "password"
                  ? "border-[#A5C89E]/60 bg-[#A5C89E]/5"
                  : "border-[#A5C89E]/20 bg-[#1a1a1a]/50"
                  }`}
              >
                <Lock className="absolute left-4 w-5 h-5 text-[#A5C89E]/60" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Create a strong password"
                  className="w-full bg-transparent text-white pl-12 pr-12 py-3 outline-none placeholder:text-gray-600 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-500 hover:text-[#A5C89E]/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label className="block text-xs font-mono text-gray-500 mb-2 tracking-wider">
                CONFIRM PASSWORD
              </label>
              <div
                className={`relative flex items-center border rounded-xl transition-all ${focusedField === "confirmPassword"
                  ? "border-[#A5C89E]/60 bg-[#A5C89E]/5"
                  : "border-[#A5C89E]/20 bg-[#1a1a1a]/50"
                  }`}
              >
                <Lock className="absolute left-4 w-5 h-5 text-[#A5C89E]/60" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  onFocus={() =>
                    setFocusedField("confirmPassword")
                  }
                  onBlur={() => setFocusedField(null)}
                  placeholder="Re-enter your password"
                  className="w-full bg-transparent text-white pl-12 pr-12 py-3 outline-none placeholder:text-gray-600 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 text-gray-500 hover:text-[#A5C89E]/60 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#A5C89E]/80 hover:bg-[#A5C89E]/90 text-black font-medium py-3 rounded-xl transition-all shadow-lg shadow-[#A5C89E]/20 hover:shadow-[#A5C89E]/30 text-sm tracking-wide ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#A5C89E]/20"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#121212] px-4 text-gray-500 font-mono">
                OR
              </span>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={() => console.log('Google sign up')}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 rounded-xl transition-all hover:shadow-lg flex items-center justify-center space-x-3 border border-gray-300 text-sm"
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
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#A5C89E]/20"></div>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <button
                onClick={onSwitchToSignIn}
                className="text-[#A5C89E]/90 hover:text-[#A5C89E] font-medium transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={onBackToHome}
            className="text-gray-500 hover:text-[#A5C89E] text-sm font-mono transition-colors"
          >
            ← BACK TO HOME
          </button>
        </div>
      </div>
    </div>
  );
}