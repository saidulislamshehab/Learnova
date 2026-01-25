import { Search } from 'lucide-react';

export function Tutorials() {
    return (
        <section className="relative pt-40 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-12">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-2 h-2 bg-[#A5C89E]/80 rounded-full animate-pulse"></div>
                        <span className="text-[#A5C89E]/90 text-xs font-mono tracking-widest">
              // TUTORIALS
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#A5C89E]/40 to-transparent"></div>
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
                        TUTORIALS
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Explore our comprehensive tutorials to master new skills.
                    </p>
                </div>

                {/* Content Placeholder */}
                <div className="flex flex-col items-center justify-center py-24">
                    <div className="w-16 h-16 bg-[#121212]/80 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl flex items-center justify-center mb-6">
                        <Search className="w-8 h-8 text-[#A5C89E]/60" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Coming Soon</h3>
                    <p className="text-gray-400 text-center max-w-md mb-6">
                        We are working hard to bring you the best tutorials. Stay tuned!
                    </p>
                </div>
            </div>
        </section>
    );
}
