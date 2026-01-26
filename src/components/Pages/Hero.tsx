import {
  ArrowRight,
  Terminal,
  Code2,
  Database,
} from "lucide-react";
import { TypewriterText } from "./TypewriterText";
import { TerminalTypewriter } from "./TerminalTypewriter";

// Interface for Hero component props defining navigation callbacks
interface HeroProps {
  onExploreCourses: () => void;
  onViewDocs: () => void;
}

/**
 * Hero Component
 * Displays the landing page's main hero section featuring:
 * - Animated typewriter text
 * - Interactive system initialization visuals
 * - Call-to-action buttons for course exploration and documentation
 * - A decorative terminal window showcasing code execution
 */
export function Hero({
  onExploreCourses,
  onViewDocs,
}: HeroProps) {
  return (
    <>
      {/* Inline styles for specific button hover effects and animations */}
      <style>{`
        .view-docs-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          border: 1px solid rgba(165, 200, 158, 0.6);
          color: rgba(165, 200, 158, 0.9);
          font-weight: 600;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: color 0.3s ease;
        }

        .view-docs-btn::before {
          position: absolute;
          content: "";
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(165, 200, 158, 0.9);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        .view-docs-btn:hover {
          color: white;
        }

        .view-docs-btn:hover::before {
          transform: translateX(0);
        }

        .view-docs-btn:active {
          transform: translate(3px, 3px);
          transition-duration: .3s;
        }
      `}</style>
      <section className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              {/* System Label */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-2 h-2 bg-[#A5C89E]/80 rounded-full animate-pulse"></div>
                <span className="text-[#A5C89E]/90 text-xs font-mono tracking-widest">
                  SYSTEM INITIALIZED
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#A5C89E]/40 to-transparent"></div>
              </div>

              {/* Main Heading */}
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 leading-none tracking-tight">
                LEARN
                <br />
                BUILD
                <br />
                <TypewriterText
                  words={[
                    "CODE",
                    "EXECUTE",
                    "SUCCEED",
                    "GROW",
                    "SKILLS",
                    "SHEHAB",
                  ]}
                  typingSpeed={150}
                  deletingSpeed={100}
                  pauseDuration={2000}
                />
              </h1>

              <p className="text-lg text-gray-400 mb-8 max-w-xl leading-relaxed">
                Advanced learning infrastructure for developers.
                Access expert-led courses, system documentation,
                and cutting-edge tech tutorials in a unified
                platform.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  className="group relative inline-block p-[2px] font-semibold leading-6 shadow-2xl cursor-pointer rounded-xl shadow-black/50 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
                  onClick={onExploreCourses}
                >


                  <span className="relative z-10 block px-[24px] py-[15px] rounded-xl bg-[#121212] overflow-hidden">
                    <span className="absolute inset-0 bg-[#A5C89E]/90 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                    <span className="relative z-10 text-[#A5C89E]/90 group-hover:text-white transition-colors duration-300 font-medium tracking-wide text-[15px]">
                      EXPLORE COURSES
                    </span>
                  </span>
                </button>
                <button
                  className="group relative inline-block p-[2px] font-semibold leading-6 shadow-2xl cursor-pointer rounded-xl shadow-black/50 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
                  onClick={onViewDocs}
                >


                  <span className="relative z-10 block px-[32px] py-[15px] rounded-xl bg-[#121212] overflow-hidden">
                    <span className="absolute inset-0 bg-[#A5C89E]/90 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                    <span className="relative z-10 text-[#A5C89E]/90 group-hover:text-white transition-colors duration-300 font-medium tracking-wide text-[15px]">
                      VIEW DOCS
                    </span>
                  </span>
                </button>
              </div>

              {/* System Stats */}
              <div className="grid grid-cols-3 gap-6 max-w-md">
                <div className="border-l-2 border-[#A5C89E]/80 pl-4">
                  <div className="text-3xl font-bold text-white mb-1">
                    500+
                  </div>
                  <div className="text-xs text-gray-500 font-mono tracking-wider">
                    MODULES
                  </div>
                </div>
                <div className="border-l-2 border-[#A5C89E]/60 pl-4">
                  <div className="text-3xl font-bold text-white mb-1">
                    50K+
                  </div>
                  <div className="text-xs text-gray-500 font-mono tracking-wider">
                    USERS
                  </div>
                </div>
                <div className="border-l-2 border-[#A5C89E]/40 pl-4">
                  <div className="text-3xl font-bold text-white mb-1">
                    1K+
                  </div>
                  <div className="text-xs text-gray-500 font-mono tracking-wider">
                    ARTICLES
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Terminal Display */}
            <div className="relative hidden lg:block">
              <div className="relative bg-[#121212]/80 backdrop-blur-sm border border-[#A5C89E]/30 rounded-2xl p-8 shadow-2xl">
                {/* Terminal Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#A5C89E]/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    terminal://learnova
                  </span>
                </div>

                {/* Terminal Content */}
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="text-[#A5C89E]/90">$</span>
                    <span className="text-gray-400">
                      sudo apt-get install knowledge
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-500">
                      Installing dependencies...
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-500">
                      Python 3.11 installed
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-500">
                      JavaScript ES2024 ready
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-500">
                      AI/ML modules loaded
                    </span>
                  </div>
                  <TerminalTypewriter
                    commands={[
                      "npm start learning",
                      'git commit -m "learning"',
                      "npm run build_skills",
                      "git push skills main",
                    ]}
                    typingSpeed={100}
                    deletingSpeed={50}
                    pauseDuration={2000}
                  />
                </div>

                {/* Floating Icons */}
                <div className="absolute -right-6 top-1/4 w-16 h-16 bg-[#121212] border border-[#A5C89E]/30 rounded-xl flex items-center justify-center">
                  <Terminal className="w-8 h-8 text-[#A5C89E]/90" />
                </div>
                <div className="absolute -right-6 top-1/2 w-16 h-16 bg-[#121212] border border-[#A5C89E]/30 rounded-xl flex items-center justify-center">
                  <Code2 className="w-8 h-8 text-[#A5C89E]/90" />
                </div>
                <div className="absolute -right-6 top-3/4 w-16 h-16 bg-[#121212] border border-[#A5C89E]/30 rounded-xl flex items-center justify-center">
                  <Database className="w-8 h-8 text-[#A5C89E]/90" />
                </div>
              </div>

              {/* Corner Accents */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-[#A5C89E]/70"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-[#A5C89E]/70"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}