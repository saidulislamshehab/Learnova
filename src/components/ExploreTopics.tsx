import { Database, Cpu, Globe, Network, Brain, Code } from 'lucide-react';

interface ExploreTopicsProps {
  onViewAllArticles?: () => void;
}

const topics = [
  {
    id: '01',
    name: 'DATA STRUCTURES',
    description: 'Master arrays, trees, graphs, and hash tables for optimal algorithm design.',
    icon: Database,
  },
  {
    id: '02',
    name: 'ALGORITHMS',
    description: 'Deep dive into sorting, searching, and dynamic programming techniques.',
    icon: Cpu,
  },
  {
    id: '03',
    name: 'WEB DEVELOPMENT',
    description: 'Build modern applications with React, Node.js, and cutting-edge frameworks.',
    icon: Globe,
  },
  {
    id: '04',
    name: 'DATABASES',
    description: 'SQL, NoSQL, optimization strategies, and distributed database systems.',
    icon: Database,
  },
  {
    id: '05',
    name: 'ARTIFICIAL INTELLIGENCE',
    description: 'Neural networks, machine learning pipelines, and AI model deployment.',
    icon: Brain,
  },
  {
    id: '06',
    name: 'NETWORKING',
    description: 'Protocols, architecture, security implementations, and system communication.',
    icon: Network,
  },
];

export function ExploreTopics({ onViewAllArticles }: ExploreTopicsProps) {
  return (
    <section className="relative py-[90px] sm:px-6 lg:px-8 px-[32px]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1">
              <span className="text-[#A5C89E]/90 text-xs font-mono tracking-widest">// EXPLORE MODULES</span>
              <div className="flex-1 h-px bg-gradient-to-r from-[#A5C89E]/40 to-transparent"></div>
            </div>
            {onViewAllArticles && (
              <button
                onClick={onViewAllArticles}
                className="group flex items-center space-x-2 text-[#A5C89E]/90 hover:text-[#A5C89E] transition-colors text-sm font-mono bg-[rgba(10,10,10,0)]"
              >
                <span>VIEW_ALL_ARTICLES</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
          <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">SYSTEM TOPICS</h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Core modules and specialized tracks for comprehensive learning
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <div
                key={index}
                className="group relative bg-[#121212]/60 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl p-6 hover:border-[#A5C89E] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Index Number */}
                <div className="absolute top-4 right-4 text-3xl font-bold text-[#A5C89E]/10 group-hover:text-[#A5C89E]/20 transition-colors">
                  {topic.id}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#A5C89E]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[#A5C89E]/90" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{topic.name}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{topic.description}</p>

                {/* Button */}
                <div className="flex items-center justify-between">
                  <button className="text-[#A5C89E]/90 text-sm font-mono hover:underline flex items-center space-x-2">
                    <span>VIEW_MODULE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-[10px] text-gray-500 font-mono">ACTIVE</span>
                  </div>
                </div>

                {/* Hover Line - Edge to Edge */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A5C89E]/80 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}