import { useMemo, useState } from "react";
import { Lock, Eye, EyeOff, Mail } from "lucide-react";
import NavLogo from '../../Sources/logo.png';

interface ResetPasswordProps {
  onSwitchToSignIn: () => void;
  onBackToHome: () => void;
  onShowNotification?: (message: string, type: 'success' | 'error') => void;
}

export function ResetPassword({
  onSwitchToSignIn,
  onBackToHome,
  onShowNotification,
}: ResetPasswordProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { token, email } = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      token: params.get('token') || '',
      email: params.get('email') || '',
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token || !email) {
      const message = 'Invalid reset link. Please request a new one.';
      setError(message);
      onShowNotification?.(message, 'error');
      return;
    }

    if (password.length < 8) {
      const message = 'Password must be at least 8 characters.';
      setError(message);
      onShowNotification?.(message, 'error');
      return;
    }

    if (password !== confirmPassword) {
      const message = 'Passwords do not match.';
      setError(message);
      onShowNotification?.(message, 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data?.message || 'Unable to reset password.');
      }

      setIsSubmitted(true);
      onShowNotification?.('Password reset successful. Please sign in.', 'success');
    } catch (err: any) {
      const message = err?.message || 'An unexpected error occurred.';
      setError(message);
      onShowNotification?.(message, 'error');
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
            <span className="text-white font-bold text-xl tracking-wide">LEARNOVA</span>
            <div className="text-[#A5C89E] text-[10px] font-mono tracking-wider">SYSTEM v1.0</div>
          </div>
        </div>

        <div className="bg-[#121212]/80 backdrop-blur-2xl border border-[#A5C89E]/20 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-wide">Reset Password</h1>
          <p className="text-gray-500 text-sm mb-6 sm:mb-8 font-mono">
            Create a new password for your account
          </p>

          {isSubmitted ? (
            <div className="space-y-5">
              <div className="bg-[#A5C89E]/10 border border-[#A5C89E]/40 rounded-xl p-4">
                <p className="text-[#A5C89E] text-sm font-mono text-center">
                  Password updated successfully.
                </p>
              </div>
              <button
                type="button"
                onClick={onSwitchToSignIn}
                className="w-full bg-[#A5C89E]/80 hover:bg-[#A5C89E]/90 text-black font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#A5C89E]/20 tracking-wide"
              >
                GO TO SIGN IN
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                  <p className="text-red-400 text-sm font-mono text-center">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-gray-400 text-xs font-mono tracking-wider mb-2">EMAIL</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-[#0b0b0b]/40 border border-gray-700/50 rounded-xl px-12 py-3.5 text-gray-300 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-mono tracking-wider mb-2">NEW PASSWORD</label>
                <div className="relative">
                  <Lock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-[#A5C89E]/90' : 'text-gray-500'}`}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter new password"
                    className={`w-full bg-[#0b0b0b]/60 border ${focusedField === 'password' ? 'border-[#A5C89E]/60' : 'border-gray-700/50'} rounded-xl pl-12 pr-12 py-3.5 text-white placeholder:text-gray-600 outline-none transition-all focus:shadow-lg focus:shadow-[#A5C89E]/10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#A5C89E]/90 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-mono tracking-wider mb-2">CONFIRM PASSWORD</label>
                <div className="relative">
                  <Lock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'confirmPassword' ? 'text-[#A5C89E]/90' : 'text-gray-500'}`}
                  />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Confirm new password"
                    className={`w-full bg-[#0b0b0b]/60 border ${focusedField === 'confirmPassword' ? 'border-[#A5C89E]/60' : 'border-gray-700/50'} rounded-xl pl-12 pr-12 py-3.5 text-white placeholder:text-gray-600 outline-none transition-all focus:shadow-lg focus:shadow-[#A5C89E]/10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#A5C89E]/90 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#A5C89E]/80 hover:bg-[#A5C89E]/90 text-black font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#A5C89E]/20 tracking-wide ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'UPDATING...' : 'RESET PASSWORD'}
              </button>
            </form>
          )}

          <div className="mt-8 flex items-center justify-between gap-3 text-center">
            <button
              onClick={onSwitchToSignIn}
              className="text-gray-500 hover:text-[#A5C89E]/90 text-sm transition-colors"
            >
              ← Back to Sign In
            </button>
            <button
              onClick={onBackToHome}
              className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
