import { useState } from 'react';
import { FileText, CheckCircle2, Clock } from 'lucide-react';

interface JoinExpertProps {
  onBack: () => void;
}

export function JoinExpert({ onBack }: JoinExpertProps) {
  const [applicationStatus, setApplicationStatus] = useState<'none' | 'submitted'>('none');

  const handleApply = () => {
    setApplicationStatus('submitted');
  };

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
          {applicationStatus === 'none' ? (
            // Initial Application Prompt
            <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-12 text-center">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="p-6 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-2xl">
                  <FileText className="w-12 h-12 text-[#A5C89E]" />
                </div>
              </div>

              {/* Message */}
              <h2 className="text-2xl font-bold text-white/90 mb-3">
                You are not an expert writer yet
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed max-w-md mx-auto">
                Apply to become an expert writer and start publishing technical articles that help developers worldwide.
              </p>

              {/* Apply Button */}
              <button
                onClick={handleApply}
                className="inline-flex items-center px-8 py-4 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium group hover:shadow-lg hover:shadow-[#A5C89E]/20"
              >
                <FileText className="w-5 h-5 mr-2" />
                <span>Apply to Become an Expert Writer</span>
              </button>

              {/* Info Text */}
              <p className="text-sm text-gray-500 mt-6">
                Your application will be reviewed by our team
              </p>
            </div>
          ) : (
            // Application Submitted Status
            <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-12 text-center">
              {/* Success Icon */}
              <div className="mb-6 flex justify-center">
                <div className="p-6 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-2xl">
                  <CheckCircle2 className="w-12 h-12 text-[#A5C89E]" />
                </div>
              </div>

              {/* Success Message */}
              <h2 className="text-2xl font-bold text-white/90 mb-3">
                Application Submitted
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md mx-auto">
                Thank you for your interest in becoming an expert writer! Your application is currently under review.
              </p>

              {/* Status Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-full text-[#A5C89E] mb-8">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Pending Review</span>
              </div>

              {/* Info Text */}
              <p className="text-sm text-gray-500 mb-6">
                We'll notify you once your application has been reviewed. This typically takes 2-3 business days.
              </p>

              {/* Back Button */}
              <button
                onClick={onBack}
                className="inline-flex items-center px-6 py-3 bg-[#121212]/80 border border-[#A5C89E]/30 text-gray-300 rounded-lg hover:border-[#A5C89E]/50 hover:text-[#A5C89E] transition-all"
              >
                Back to Home
              </button>
            </div>
          )}
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
