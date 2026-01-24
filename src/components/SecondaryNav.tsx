import { useEffect, useState } from 'react';

const topics = [
  { label: 'C', status: 'active' },
  { label: 'C++', status: 'active' },
  { label: 'Java', status: 'active' },
  { label: 'Python', status: 'active' },
  { label: 'JavaScript', status: 'active' },
  { label: 'DSA', status: 'active' },
  { label: 'AI', status: 'beta' },
  { label: 'ML', status: 'beta' },
  { label: 'Web Dev', status: 'active' },
];

export function SecondaryNav() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-24 left-0 right-0 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121212]/60 backdrop-blur-lg border-y border-[#ff9f1a]/10">
          <div className="flex items-center space-x-6 overflow-x-auto py-3 scrollbar-hide">
            <span className="text-[#ff9f1a] text-xs font-mono tracking-wider whitespace-nowrap">
              // TOPICS
            </span>
            {topics.map((topic, index) => (
              <a
                key={index}
                href={`#${topic.label.toLowerCase().replace(' ', '-')}`}
                className="group flex items-center space-x-2 text-sm text-gray-400 hover:text-[#ff9f1a] transition-colors whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[#ff9f1a] transition-colors"></span>
                <span className="font-mono">{topic.label}</span>
                {topic.status === 'beta' && (
                  <span className="text-[10px] text-[#ff9f1a] bg-[#ff9f1a]/10 px-1.5 py-0.5 rounded border border-[#ff9f1a]/30">
                    BETA
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}