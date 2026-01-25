import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
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

type SettingsSection = 'profile' | 'password' | '2fa' | 'notifications' | 'theme' | 'delete';

export function Settings({ onBack, onEditProfile }: SettingsProps) {
  const { theme, setTheme } = useTheme();
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
    { id: 'theme' as SettingsSection, label: 'Theme Settings', icon: Palette },
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

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="relative max-w-7xl mx-auto">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-24 left-4 z-50 p-3 bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-lg text-gray-300 hover:text-[#A5C89E] transition-all"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <aside
            className={`fixed lg:sticky top-20 left-0 h-[calc(100vh-5rem)] lg:h-auto w-64 bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-4 transition-transform duration-300 z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              }`}
          >
            <h2 className="text-xl font-bold text-white mb-6 px-2">Settings</h2>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                        ? 'bg-[#A5C89E]/10 border border-[#A5C89E]/30 text-[#A5C89E]'
                        : 'text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/5'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            />
          )}

          {/* Right Content Area */}
          <main className="flex-1 min-w-0">
            {/* Edit Profile Section */}
            {activeSection === 'profile' && (
              <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Edit Profile</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Update your personal information and profile details
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onEditProfile?.();
                  }}
                  className="inline-flex items-center px-6 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium hover:shadow-lg hover:shadow-[#A5C89E]/20"
                >
                  <User className="w-4 h-4 mr-2" />
                  Go to Edit Profile
                </button>
              </div>
            )}

            {/* Change Password Section */}
            {activeSection === 'password' && (
              <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Change Password</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Update your password to keep your account secure
                </p>

                <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#A5C89E] transition-all"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#A5C89E] transition-colors"
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#A5C89E] transition-all"
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#A5C89E] transition-colors"
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#A5C89E] transition-all"
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#A5C89E] transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium hover:shadow-lg hover:shadow-[#A5C89E]/20"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Password
                  </button>
                </form>
              </div>
            )}

            {/* Two-Factor Authentication Section */}
            {activeSection === '2fa' && (
              <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Two-Factor Authentication</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Add an extra layer of security to your account
                </p>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">Enable 2FA</h4>
                      <p className="text-gray-500 text-sm">
                        Protect your account with two-factor authentication
                      </p>
                    </div>
                    <button
                      onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${is2FAEnabled ? 'bg-[#A5C89E]' : 'bg-gray-600'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${is2FAEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>

                  {is2FAEnabled && (
                    <div className="p-4 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-lg">
                      <p className="text-gray-300 text-sm mb-4">
                        Set up two-factor authentication using an authenticator app
                      </p>
                      <button className="inline-flex items-center px-6 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium hover:shadow-lg hover:shadow-[#A5C89E]/20">
                        <Shield className="w-4 h-4 mr-2" />
                        Setup 2FA
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Notifications</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Manage how you receive notifications
                </p>

                <div className="space-y-4">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-4 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">Email Notifications</h4>
                      <p className="text-gray-500 text-sm">
                        Receive updates and announcements via email
                      </p>
                    </div>
                    <button
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifications ? 'bg-[#A5C89E]' : 'bg-gray-600'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>

                  {/* Platform Notifications */}
                  <div className="flex items-center justify-between p-4 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">Platform Notifications</h4>
                      <p className="text-gray-500 text-sm">
                        Get notified about activity on the platform
                      </p>
                    </div>
                    <button
                      onClick={() => setPlatformNotifications(!platformNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${platformNotifications ? 'bg-[#A5C89E]' : 'bg-gray-600'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${platformNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Theme Settings Section */}
            {activeSection === 'theme' && (
              <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Theme Settings</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Customize your visual experience
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* Theme: Lavender Gray */}
                  <button
                    onClick={() => setTheme('#ACBAC4')}
                    className={`group relative p-4 bg-[#0b0b0b]/80 border rounded-xl hover:scale-105 transition-all duration-300 ${theme === '#ACBAC4'
                        ? 'border-[#ACBAC4] shadow-lg shadow-[#ACBAC4]/20'
                        : 'border-[#A5C89E]/20 hover:border-[#ACBAC4]/40'
                      }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-16 h-16 rounded-full bg-[#ACBAC4] shadow-lg shadow-[#ACBAC4]/30 transition-transform group-hover:scale-110">
                        {theme === '#ACBAC4' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-[#ACBAC4]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-white mb-1">Lavender</p>
                        <p className="text-[10px] text-gray-500 font-mono">#ACBAC4</p>
                      </div>
                    </div>
                  </button>

                  {/* Theme: Warm Beige */}
                  <button
                    onClick={() => setTheme('#E1D9BC')}
                    className={`group relative p-4 bg-[#0b0b0b]/80 border rounded-xl hover:scale-105 transition-all duration-300 ${theme === '#E1D9BC'
                        ? 'border-[#E1D9BC] shadow-lg shadow-[#E1D9BC]/20'
                        : 'border-[#A5C89E]/20 hover:border-[#E1D9BC]/40'
                      }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-16 h-16 rounded-full bg-[#E1D9BC] shadow-lg shadow-[#E1D9BC]/30 transition-transform group-hover:scale-110">
                        {theme === '#E1D9BC' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-[#E1D9BC]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-white mb-1">Warm Beige</p>
                        <p className="text-[10px] text-gray-500 font-mono">#E1D9BC</p>
                      </div>
                    </div>
                  </button>

                  {/* Theme: Golden Yellow */}
                  <button
                    onClick={() => setTheme('#F7DB91')}
                    className={`group relative p-4 bg-[#0b0b0b]/80 border rounded-xl hover:scale-105 transition-all duration-300 ${theme === '#F7DB91'
                        ? 'border-[#F7DB91] shadow-lg shadow-[#F7DB91]/20'
                        : 'border-[#A5C89E]/20 hover:border-[#F7DB91]/40'
                      }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-16 h-16 rounded-full bg-[#F7DB91] shadow-lg shadow-[#F7DB91]/30 transition-transform group-hover:scale-110">
                        {theme === '#F7DB91' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-[#F7DB91]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-white mb-1">Golden</p>
                        <p className="text-[10px] text-gray-500 font-mono">#F7DB91</p>
                      </div>
                    </div>
                  </button>

                  {/* Theme: Lime Green */}
                  <button
                    onClick={() => setTheme('#D8E983')}
                    className={`group relative p-4 bg-[#0b0b0b]/80 border rounded-xl hover:scale-105 transition-all duration-300 ${theme === '#D8E983'
                        ? 'border-[#D8E983] shadow-lg shadow-[#D8E983]/20'
                        : 'border-[#A5C89E]/20 hover:border-[#D8E983]/40'
                      }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-16 h-16 rounded-full bg-[#D8E983] shadow-lg shadow-[#D8E983]/30 transition-transform group-hover:scale-110">
                        {theme === '#D8E983' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-[#D8E983]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-white mb-1">Lime</p>
                        <p className="text-[10px] text-gray-500 font-mono">#D8E983</p>
                      </div>
                    </div>
                  </button>

                  {/* Theme: Sage Green */}
                  <button
                    onClick={() => setTheme('#A5C89E')}
                    className={`group relative p-4 bg-[#0b0b0b]/80 border rounded-xl hover:scale-105 transition-all duration-300 ${theme === '#A5C89E'
                        ? 'border-[#A5C89E] shadow-lg shadow-[#A5C89E]/20'
                        : 'border-[#A5C89E]/20 hover:border-[#A5C89E]/40'
                      }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-16 h-16 rounded-full bg-[#A5C89E] shadow-lg shadow-[#A5C89E]/30 transition-transform group-hover:scale-110">
                        {theme === '#A5C89E' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-[#A5C89E]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-white mb-1">Sage</p>
                        <p className="text-[10px] text-gray-500 font-mono">#A5C89E</p>
                      </div>
                    </div>
                  </button>

                  {/* Theme: Dusty Rose */}
                  <button
                    onClick={() => setTheme('#9F8383')}
                    className={`group relative p-4 bg-[#0b0b0b]/80 border rounded-xl hover:scale-105 transition-all duration-300 ${theme === '#9F8383'
                        ? 'border-[#9F8383] shadow-lg shadow-[#9F8383]/20'
                        : 'border-[#A5C89E]/20 hover:border-[#9F8383]/40'
                      }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-16 h-16 rounded-full bg-[#9F8383] shadow-lg shadow-[#9F8383]/30 transition-transform group-hover:scale-110">
                        {theme === '#9F8383' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-[#9F8383]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-white mb-1">Dusty Rose</p>
                        <p className="text-[10px] text-gray-500 font-mono">#9F8383</p>
                      </div>
                    </div>
                  </button>

                  {/* Theme: Coral Orange */}
                  <button
                    onClick={() => setTheme('#FD8A6B')}
                    className={`group relative p-4 bg-[#0b0b0b]/80 border rounded-xl hover:scale-105 transition-all duration-300 ${theme === '#FD8A6B'
                        ? 'border-[#FD8A6B] shadow-lg shadow-[#FD8A6B]/20'
                        : 'border-[#A5C89E]/20 hover:border-[#FD8A6B]/40'
                      }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-16 h-16 rounded-full bg-[#FD8A6B] shadow-lg shadow-[#FD8A6B]/30 transition-transform group-hover:scale-110">
                        {theme === '#FD8A6B' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-[#FD8A6B]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-white mb-1">Coral</p>
                        <p className="text-[10px] text-gray-500 font-mono">#FD8A6B</p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="mt-6 p-4 bg-[#A5C89E]/5 border border-[#A5C89E]/20 rounded-lg">
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#A5C89E]" />
                    <span>Theme changes apply globally across the entire website</span>
                  </p>
                </div>
              </div>
            )}

            {/* Delete Account Section */}
            {activeSection === 'delete' && (
              <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Delete Account</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Permanently delete your account and all associated data
                </p>

                <div className="p-4 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg mb-6">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white font-medium mb-1">Warning</h4>
                      <p className="text-gray-400 text-sm">
                        This action cannot be undone. All your courses, progress, and data will be
                        permanently deleted.
                      </p>
                    </div>
                  </div>
                </div>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center px-6 py-3 bg-[#121212]/80 border border-[#A5C89E]/30 text-gray-300 rounded-lg hover:border-[#A5C89E]/50 hover:text-[#A5C89E] transition-all font-medium"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-300 text-sm">
                      Are you absolutely sure you want to delete your account?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDeleteAccount}
                        className="inline-flex items-center px-6 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium hover:shadow-lg hover:shadow-[#A5C89E]/20"
                      >
                        Yes, Delete My Account
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="inline-flex items-center px-6 py-3 bg-[#121212]/80 border border-[#A5C89E]/30 text-gray-300 rounded-lg hover:border-[#A5C89E]/50 hover:text-[#A5C89E] transition-all font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}