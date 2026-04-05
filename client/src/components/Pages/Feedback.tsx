import { useState } from 'react';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';

interface FeedbackProps {
  onBack: () => void;
}

export function Feedback({ onBack }: FeedbackProps) {
  const [subject, setSubject] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !feedbackType || !message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after showing success
      setTimeout(() => {
        setSubject('');
        setFeedbackType('');
        setMessage('');
        setIsSubmitted(false);
      }, 3000);
    }, 1000);
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="relative max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-lg mb-4">
            <MessageSquare className="w-6 h-6 text-[#A5C89E]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Feedback
          </h1>
          <p className="text-gray-400 text-lg">
            We'd love to hear your thoughts to improve Learnova
          </p>
        </div>

        {/* Feedback Form */}
        <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Subject Field */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter the subject of your feedback"
                  className="w-full px-4 py-3 bg-[#0d0d0d]/80 border border-[#A5C89E]/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#A5C89E]/60 transition-all"
                  required
                />
              </div>

              {/* Feedback Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Feedback Type
                </label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d0d0d]/80 border border-[#A5C89E]/30 rounded-lg text-white focus:outline-none focus:border-[#A5C89E]/60 transition-all"
                  required
                >
                  <option value="" disabled>
                    Select feedback type
                  </option>
                  <option value="suggestion">Suggestion</option>
                  <option value="bug">Bug Report</option>
                  <option value="general">General Feedback</option>
                </select>
              </div>

              {/* Message Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts, suggestions, or report any issues..."
                  rows={8}
                  className="w-full px-4 py-3 bg-[#0d0d0d]/80 border border-[#A5C89E]/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#A5C89E]/60 transition-all resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center px-8 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium hover:shadow-lg hover:shadow-[#A5C89E]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          ) : (
            // Success State
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center p-4 bg-green-500/10 border border-green-500/30 rounded-full mb-4">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Thank you for your feedback!
              </h3>
              <p className="text-gray-400">
                We appreciate your input and will review it shortly.
              </p>
            </div>
          )}
        </div>

        {/* Helper Text */}
        <div className="mt-8 p-4 bg-[#121212]/60 border border-[#A5C89E]/20 rounded-lg">
          <p className="text-sm text-gray-500 text-center">
            <span className="text-[#A5C89E] font-medium">💡 Note:</span> Your
            feedback helps us improve Learnova for everyone. We read every
            submission carefully.
          </p>
        </div>
      </div>
    </section>
  );
}
