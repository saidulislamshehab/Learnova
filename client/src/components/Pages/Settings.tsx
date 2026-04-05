import { useState } from 'react';

import {
  User,
  Lock,
  Shield,
  Bell,
  Palette,
  Trash2,
  ChevronRight,
  Menu,
  X,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
} from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
  onEditProfile?: () => void;
}

type SettingsSection = 'profile' | 'password' | '2fa' | 'notifications' | 'delete';

export function Settings({ onBack, onEditProfile }: SettingsProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [platformNotifications, setPlatformNotifications] = useState(true);

  // Delete account confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const menuItems = [
    { id: 'profile' as SettingsSection, label: 'Edit Profile', icon: User },
    { id: 'password' as SettingsSection, label: 'Change Password', icon: Lock },
    { id: '2fa' as SettingsSection, label: 'Two-Factor Authentication', icon: Shield },
    { id: 'notifications' as SettingsSection, label: 'Notifications', icon: Bell },

    { id: 'delete' as SettingsSection, label: 'Delete Account', icon: Trash2 },
  ];

  const handleSectionChange = (section: SettingsSection) => {
    setActiveSection(section);
    setIsSidebarOpen(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic
    console.log('Password change submitted');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    // Handle account deletion logic
    console.log('Account deletion confirmed');
    setShowDeleteConfirm(false);
  };

  // Standard background component
  const BackgroundEffects = () => (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(128, 128, 128, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(128, 128, 128, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' /%3E%3C/svg%3E")`,
        }}
      />
      <div className="fixed top-1/4 left-1/4 w-2 h-2 bg-[#ABDADC] rounded-full blur-sm opacity-40 animate-pulse pointer-events-none z-0"></div>
      <div className="fixed top-1/3 right-1/3 w-2 h-2 bg-[#ABDADC] rounded-full blur-sm opacity-30 animate-pulse pointer-events-none z-0"></div>
    </>
  );

  const activeItem = menuItems.find(i => i.id === activeSection);
  const activeLabel = activeItem?.label || 'Settings';

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white font-sans selection:bg-[#A5C89E] selection:text-black">
      <BackgroundEffects />

      {/* Top Bar - Fixed Full Width */}
      <div className="fixed top-0 left-0 right-0 h-16 sm:h-20 bg-[#121212]/90 backdrop-blur-xl border-b border-[#A5C89E]/20 z-40 shadow-lg shadow-black/20">
        <div className="h-full px-4 sm:px-8 flex items-center justify-between max-w-full">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors p-1"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#A5C89E]/10 flex items-center justify-center border border-[#A5C89E]/20">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#A5C89E]" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">SETTINGS</h1>
                <p className="text-[10px] sm:text-xs text-[#A5C89E] font-mono tracking-wider hidden sm:block">
                  USER PREFERENCES
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={onBack}
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-[#121212] border border-gray-800 text-gray-300 rounded-xl hover:border-[#A5C89E]/50 hover:text-white hover:bg-[#A5C89E]/5 transition-all text-xs sm:text-sm font-medium group flex items-center gap-2"
            >
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar - Below Top Bar */}
      <aside
        className={`fixed top-16 sm:top-20 left-0 bottom-0 w-64 sm:w-72 bg-[#121212]/95 backdrop-blur-2xl border-r border-[#A5C89E]/20 transition-transform duration-300 z-30 overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-xs font-mono text-gray-500 mb-4 tracking-widest pl-2">NAVIGATION</h2>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleSectionChange(item.id);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                    ? 'bg-[#A5C89E] text-black shadow-[0_0_15px_-3px_#A5C89E]/40'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${isActive ? 'text-black' : 'text-gray-500 group-hover:text-white'
                      }`}
                  />
                  <span className="flex-1 text-left tracking-wide">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer Info */}
          <div className="mt-8 pt-6 border-t border-white/5 px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A5C89E]/20 to-[#A5C89E]/5 flex items-center justify-center border border-[#A5C89E]/10">
                <User className="w-4 h-4 text-[#A5C89E]" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">Connected</p>
                <p className="text-[10px] text-gray-500 truncate font-mono">SECURE SESSION</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-20 top-16 sm:top-20"
        />
      )}

      {/* Main Content */}
      <main className="pt-16 sm:pt-20 lg:pl-72 relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Breadcrumb / Header */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-400">
            <span className="hover:text-white transition-colors cursor-pointer">Settings</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#A5C89E]">{activeLabel}</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {activeLabel}
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl">
              Manage your {activeLabel.toLowerCase()} and account preferences
            </p>
          </div>

          {/* Edit Profile Section */}
          {activeSection === 'profile' && (
            <div className="bg-[#121212]/60 backdrop-blur-xl border border-[#A5C89E]/20 rounded-2xl p-6 sm:p-10">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-full bg-[#A5C89E]/10 flex items-center justify-center border border-[#A5C89E]/20 shadow-[0_0_30px_-10px_#A5C89E]">
                  <User className="w-8 h-8 text-[#A5C89E]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Profile Information</h3>
                  <p className="text-gray-500 mt-1">Your public profile details</p>
                </div>
              </div>

              <div className="space-y-6 max-w-2xl">
                <p className="text-gray-300 leading-relaxed">
                  Edit your bio, avatar, and other personal information visible to other users.
                  Keep your profile up to date to get the best recommendations.
                </p>
                <div className="pt-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onEditProfile?.();
                    }}
                    className="inline-flex items-center px-8 py-4 bg-[#A5C89E] text-black rounded-xl hover:bg-[#bce3b5] hover:scale-[1.02] active:scale-[0.98] transition-all font-bold shadow-lg shadow-[#A5C89E]/20"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Go to Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Change Password Section */}
          {activeSection === 'password' && (
            <div className="bg-[#121212]/60 backdrop-blur-xl border border-[#A5C89E]/20 rounded-2xl p-6 sm:p-10">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-full bg-[#A5C89E]/10 flex items-center justify-center border border-[#A5C89E]/20">
                  <Lock className="w-8 h-8 text-[#A5C89E]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Password Security</h3>
                  <p className="text-gray-500 mt-1">Update your access credentials</p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-mono tracking-wider text-gray-400 mb-2 ml-1">
                    CURRENT PASSWORD
                  </label>
                  <div className="relative group">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-5 py-4 bg-[#0b0b0b]/60 border border-[#A5C89E]/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#A5C89E]/60 focus:bg-[#0b0b0b] transition-all font-mono text-sm"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#A5C89E] transition-colors"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-mono tracking-wider text-gray-400 mb-2 ml-1">
                    NEW PASSWORD
                  </label>
                  <div className="relative group">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-5 py-4 bg-[#0b0b0b]/60 border border-[#A5C89E]/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#A5C89E]/60 focus:bg-[#0b0b0b] transition-all font-mono text-sm"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#A5C89E] transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-mono tracking-wider text-gray-400 mb-2 ml-1">
                    CONFIRM NEW PASSWORD
                  </label>
                  <div className="relative group">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-5 py-4 bg-[#0b0b0b]/60 border border-[#A5C89E]/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#A5C89E]/60 focus:bg-[#0b0b0b] transition-all font-mono text-sm"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#A5C89E] transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center px-8 py-4 bg-[#A5C89E] text-black rounded-xl hover:bg-[#bce3b5] hover:scale-[1.02] active:scale-[0.98] transition-all font-bold shadow-lg shadow-[#A5C89E]/20 font-mono tracking-wide"
                  >
                    <Save className="w-5 h-5 mr-3" />
                    UPDATE_PASSWORD
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Two-Factor Authentication Section */}
          {activeSection === '2fa' && (
            <div className="bg-[#121212]/60 backdrop-blur-xl border border-[#A5C89E]/20 rounded-2xl p-6 sm:p-10">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-full bg-[#A5C89E]/10 flex items-center justify-center border border-[#A5C89E]/20">
                  <Shield className="w-8 h-8 text-[#A5C89E]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Two-Factor Authentication</h3>
                  <p className="text-gray-500 mt-1">Enhanced account security</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-[#0b0b0b]/60 border border-[#A5C89E]/20 rounded-xl transition-colors hover:border-[#A5C89E]/40">
                  <div className="flex-1 pr-6">
                    <h4 className="text-white font-bold mb-1">Enable 2FA</h4>
                    <p className="text-gray-400 text-sm">
                      Require a verification code from your authenticator app when signing in.
                    </p>
                  </div>
                  <button
                    onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#A5C89E] focus:ring-offset-2 focus:ring-offset-[#0b0b0b] ${is2FAEnabled ? 'bg-[#A5C89E]' : 'bg-gray-700'
                      }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${is2FAEnabled ? 'translate-x-[22px]' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>

                {is2FAEnabled && (
                  <div className="p-8 bg-[#A5C89E]/5 border border-[#A5C89E]/20 rounded-xl animate-in fade-in slide-in-from-top-4">
                    <h4 className="text-[#A5C89E] font-bold mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Setup Required
                    </h4>
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                      To finish setting up two-factor authentication, you'll need to user an authenticator app (like Google Authenticator) to scan a QR code.
                    </p>
                    <button className="inline-flex items-center px-6 py-3 bg-[#A5C89E]/10 text-[#A5C89E] border border-[#A5C89E]/50 rounded-lg hover:bg-[#A5C89E] hover:text-black transition-all font-medium font-mono text-xs tracking-wider uppercase">
                      SETUP_AUTHENTICATOR
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="bg-[#121212]/60 backdrop-blur-xl border border-[#A5C89E]/20 rounded-2xl p-6 sm:p-10">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-full bg-[#A5C89E]/10 flex items-center justify-center border border-[#A5C89E]/20">
                  <Bell className="w-8 h-8 text-[#A5C89E]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Notification Preferences</h3>
                  <p className="text-gray-500 mt-1">Manage how we contact you</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Email Notifications */}
                <div className="flex items-center justify-between p-6 bg-[#0b0b0b]/60 border border-[#A5C89E]/20 rounded-xl transition-colors hover:border-[#A5C89E]/40">
                  <div className="flex-1 pr-6">
                    <h4 className="text-white font-bold mb-1">Email Notifications</h4>
                    <p className="text-gray-400 text-sm">
                      Receive updates and announcements via email
                    </p>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#A5C89E] focus:ring-offset-2 focus:ring-offset-[#0b0b0b] ${emailNotifications ? 'bg-[#A5C89E]' : 'bg-gray-700'
                      }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-[22px]' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>

                {/* Platform Notifications */}
                <div className="flex items-center justify-between p-6 bg-[#0b0b0b]/60 border border-[#A5C89E]/20 rounded-xl transition-colors hover:border-[#A5C89E]/40">
                  <div className="flex-1 pr-6">
                    <h4 className="text-white font-bold mb-1">Platform Notifications</h4>
                    <p className="text-gray-400 text-sm">
                      See in-app notifications for comments, likes, and achievement unlocks.
                    </p>
                  </div>
                  <button
                    onClick={() => setPlatformNotifications(!platformNotifications)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#A5C89E] focus:ring-offset-2 focus:ring-offset-[#0b0b0b] ${platformNotifications ? 'bg-[#A5C89E]' : 'bg-gray-700'
                      }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${platformNotifications ? 'translate-x-[22px]' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Account Section */}
          {activeSection === 'delete' && (
            <div className="bg-[#121212]/60 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 sm:p-10">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 hover:bg-red-500/20 transition-colors">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Delete Account</h3>
                  <p className="text-gray-500 mt-1">Permanently remove your data</p>
                </div>
              </div>

              <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl mb-10">
                <div className="flex gap-4">
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-red-400 font-bold mb-2">Critical Warning</h4>
                    <p className="text-red-200/60 text-sm leading-relaxed">
                      This action cannot be undone. All your purchased courses, progress certificates,
                      and personal data will be strictly deleted from our servers.
                      Please back up any data you need before proceeding.
                    </p>
                  </div>
                </div>
              </div>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center px-8 py-4 bg-transparent border border-red-500/30 text-gray-300 rounded-xl hover:bg-red-500/10 hover:border-red-500 hover:text-red-500 transition-all font-medium group"
                >
                  <Trash2 className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  Request Account Deletion
                </button>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <p className="text-gray-300 font-medium">
                      To confirm, type <span className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded border border-white/10">DELETE</span> below:
                    </p>
                    {/* Simplified for demo - in real app would verify input */}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleDeleteAccount}
                      className="inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-bold shadow-lg shadow-red-600/20"
                    >
                      Yes, Delete My Account
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-gray-600 text-gray-300 rounded-xl hover:bg-white/5 transition-all font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}