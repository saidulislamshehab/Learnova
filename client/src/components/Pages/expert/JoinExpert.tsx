import { ApplyExpert } from './ApplyExpert';

interface JoinExpertProps {
  onBack: () => void;
}

export function JoinExpert({ onBack }: JoinExpertProps) {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="relative max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-2 h-2 bg-[#A5C89E]/80 rounded-full animate-pulse"></div>
            <span className="text-[#A5C89E]/90 text-xs font-mono tracking-widest">
              EXPERT WRITER PROGRAM
            </span>
            <div className="w-2 h-2 bg-[#A5C89E]/80 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
            Become an Expert Writer
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Write and publish technical articles to share your knowledge with the Learnova community
          </p>
        </div>

        {/* Expert Application Card */}
        <div className="max-w-2xl mx-auto">
          <ApplyExpert onBack={onBack} />
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#121212]/60 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl p-6 text-center">
            <div className="w-10 h-10 bg-[#A5C89E]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✍️</span>
            </div>
            <h3 className="text-white/90 font-bold mb-2">Write Your Way</h3>
            <p className="text-sm text-gray-500">
              Share in-depth technical articles on topics you're passionate about
            </p>
          </div>

          <div className="bg-[#121212]/60 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl p-6 text-center">
            <div className="w-10 h-10 bg-[#A5C89E]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-white/90 font-bold mb-2">Build Authority</h3>
            <p className="text-sm text-gray-500">
              Establish yourself as a thought leader in your field
            </p>
          </div>

          <div className="bg-[#121212]/60 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl p-6 text-center">
            <div className="w-10 h-10 bg-[#A5C89E]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-white/90 font-bold mb-2">Impact Developers</h3>
            <p className="text-sm text-gray-500">
              Help thousands of developers learn and grow their skills
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
