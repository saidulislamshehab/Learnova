import React from 'react';

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="relative">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
        >
          <defs>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </radialGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="innerGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background glow circle */}
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="url(#glowGradient)"
            opacity="0.6"
          />
          
          {/* Outer hexagon with glow */}
          <path
            d="M24 4 L36 12 L36 28 L24 36 L12 28 L12 12 Z"
            stroke="url(#purpleGradient)"
            strokeWidth="2.5"
            fill="transparent"
            filter="url(#glow)"
            opacity="0.9"
          />
          
          {/* Inner geometric pattern - main diamond */}
          <path
            d="M24 10 L32 18 L24 26 L16 18 Z"
            fill="url(#purpleGradient)"
            fillOpacity="0.4"
            filter="url(#innerGlow)"
          />
          
          {/* Middle diamond */}
          <path
            d="M24 14 L28 18 L24 22 L20 18 Z"
            fill="url(#purpleGradient)"
            fillOpacity="0.7"
          />
          
          {/* Center core */}
          <circle
            cx="24"
            cy="18"
            r="3"
            fill="#8B5CF6"
            filter="url(#innerGlow)"
          />
          
          {/* Blockchain connection nodes */}
          <circle cx="24" cy="32" r="2.5" fill="#8B5CF6" />
          <circle cx="15" cy="35" r="1.5" fill="#8B5CF6" opacity="0.7" />
          <circle cx="33" cy="35" r="1.5" fill="#8B5CF6" opacity="0.7" />
          
          {/* Connection lines */}
          <line x1="24" y1="29" x2="24" y2="32" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="33" x2="16.5" y2="34.5" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <line x1="26" y1="33" x2="31.5" y2="34.5" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          
          {/* Decorative dots */}
          <circle cx="12" cy="24" r="1" fill="#8B5CF6" opacity="0.5" />
          <circle cx="36" cy="24" r="1" fill="#8B5CF6" opacity="0.5" />
        </svg>
        
        {/* Animated pulse ring */}
        <div className="absolute inset-0 rounded-full border-2 border-[#8B5CF6]/30 animate-ping"></div>
      </div>
      
      <div className="flex flex-col">
        <div className="text-3xl font-bold leading-tight">
          <span className="text-white tracking-tight">Supra</span>
          <span className="text-[#8B5CF6] text-glow-purple tracking-tight">tmos</span>
        </div>
      </div>
    </div>
  );
};