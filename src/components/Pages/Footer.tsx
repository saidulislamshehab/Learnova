import {
  Github,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";
import NavLogo from '../Sources/Logo.png';

/**
 * Footer Component
 * Displays the bottom section of the application, including:
 * - Branding and system information
 * - Social media links
 * - Quick access navigation links
 * - Resource links
 * - Newsletter subscription form
 */
export function Footer() {
  return (
    <footer className="relative border-t border-[#A5C89E]/20 py-16 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
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
            <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-md">
              Advanced learning infrastructure for developers.
              Empowering the next generation with cutting-edge
              education.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 bg-[#121212] border border-[#A5C89E]/30 rounded-lg flex items-center justify-center hover:bg-[#A5C89E]/10 transition-all"
              >
                <Github className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#121212] border border-[#A5C89E]/30 rounded-lg flex items-center justify-center hover:bg-[#A5C89E]/10 transition-all"
              >
                <Twitter className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#121212] border border-[#A5C89E]/30 rounded-lg flex items-center justify-center hover:bg-[#A5C89E]/10 transition-all"
              >
                <Linkedin className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#121212] border border-[#A5C89E]/30 rounded-lg flex items-center justify-center hover:bg-[#A5C89E]/10 transition-all"
              >
                <Mail className="w-4 h-4 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold mb-4 tracking-wide text-sm">
              QUICK_ACCESS
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#courses"
                  className="text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-mono"
                >
                  Courses
                </a>
              </li>
              <li>
                <a
                  href="#articles"
                  className="text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-mono"
                >
                  Articles
                </a>
              </li>
              <li>
                <a
                  href="#tutorials"
                  className="text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-mono"
                >
                  Tutorials
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-mono"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-4 tracking-wide text-sm">
              RESOURCES
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-mono"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-mono"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-mono"
                >
                  API
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-mono"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-y border-[#A5C89E]/20 py-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-white font-bold mb-2 tracking-wide">
                SUBSCRIBE_TO_UPDATES
              </h3>
              <p className="text-gray-400 text-sm font-mono">
                Get notified about new courses
              </p>
            </div>
            <div className="flex max-w-md w-full">
              <input
                type="email"
                placeholder="your.email@domain.com"
                className="flex-1 px-4 py-3 bg-[#121212] border border-[#A5C89E]/30 rounded-l-lg text-white text-sm font-mono focus:outline-none focus:border-[#A5C89E]/60 placeholder-gray-600"
              />
              <button className="px-6 py-3 bg-[#A5C89E]/80 text-black rounded-r-lg hover:bg-[#A5C89E]/70 transition-all text-sm font-bold tracking-wide">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-gray-500 text-xs font-mono">
            © 2024 LEARNOVA. ALL_RIGHTS_RESERVED.
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-gray-500 hover:text-[#A5C89E] transition-colors text-xs font-mono"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-[#A5C89E] transition-colors text-xs font-mono"
            >
              Terms
            </a>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-gray-500 text-xs font-mono">
                SYSTEM_ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}