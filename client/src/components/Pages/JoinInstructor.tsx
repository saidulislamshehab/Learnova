import { ApplyInstructor } from './ApplyInstructor';

interface JoinInstructorProps {
  onBack: () => void;
}

export function JoinInstructor({ onBack }: JoinInstructorProps) {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="relative max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-2 h-2 bg-[#A5C89E]/80 rounded-full animate-pulse"></div>
            <span className="text-[#A5C89E]/90 text-xs font-mono tracking-widest">
              INSTRUCTOR PROGRAM
            </span>
            <div className="w-2 h-2 bg-[#A5C89E]/80 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
            Become an Instructor
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Create and publish courses to teach thousands of students worldwide
          </p>
        </div>

        {/* Instructor Application Card */}
        <div className="max-w-2xl mx-auto">
          <ApplyInstructor onBack={onBack} />
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#121212]/60 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl p-6 text-center">
            <div className="w-10 h-10 bg-[#A5C89E]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-white/90 font-bold mb-2">Teach Your Way</h3>
            <p className="text-sm text-gray-500">
              Create comprehensive courses on topics you master
            </p>
          </div>

          <div className="bg-[#121212]/60 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl p-6 text-center">
            <div className="w-10 h-10 bg-[#A5C89E]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-white/90 font-bold mb-2">Earn Revenue</h3>
            <p className="text-sm text-gray-500">
              Get paid for every student who enrolls in your courses
            </p>
          </div>

          <div className="bg-[#121212]/60 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl p-6 text-center">
            <div className="w-10 h-10 bg-[#A5C89E]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-white/90 font-bold mb-2">Global Reach</h3>
            <p className="text-sm text-gray-500">
              Connect with students from around the world
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
