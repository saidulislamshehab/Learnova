import { useState } from "react";
import { Mail } from "lucide-react";
import NavLogo from '../../Sources/logo.png';

interface ForgotPasswordProps {
  onSwitchToSignIn: () => void;
  onBackToHome: () => void;
  onShowNotification?: (message: string, type: 'success' | 'error') => void;
}

export function ForgotPassword({
  onSwitchToSignIn,
  onBackToHome,
  onShowNotification,
}: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send password reset link.");
      }

      setIsSubmitted(true);
      if (onShowNotification) {
        onShowNotification("Password reset link sent! Please check your email.", "success");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      if (onShowNotification) {
        onShowNotification(err.message || "An unexpected error occurred.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-20">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={NavLogo} alt="Learnova Logo" className="w-full h-full object-cover" />
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

        <div className="bg-[#121212]/80 backdrop-blur-2xl border border-[#A5C89E]/20 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-wide">
            Forgot Password
          </h1>
          <p className="text-gray-500 text-sm mb-6 sm:mb-8 font-mono">
            Enter your email to reset your password
          </p>

          {isSubmitted ? (
            <div className="text-center">
              <p className="text-green-400 font-mono">A password reset link has been sent to your email address.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                  <p className="text-red-400 text-sm font-mono text-center">{error}</p>
                </div>
              )}

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

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#A5C89E]/80 hover:bg-[#A5C89E]/90 text-black font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#A5C89E]/20 tracking-wide ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? "SENDING..." : "SEND RESET LINK"}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={onSwitchToSignIn}
              className="text-gray-500 hover:text-[#A5C89E]/90 text-sm transition-colors"
            >
              ← Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
