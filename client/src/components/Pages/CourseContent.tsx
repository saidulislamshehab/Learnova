import { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Play, 
  Clock,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  X,
  Send,
  User
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseContentProps {
  courseId: string;
  onBack: () => void;
}

export function CourseContent({ courseId, onBack }: CourseContentProps) {
  const [selectedLesson, setSelectedLesson] = useState<string>('lesson-1-1');
  const [expandedModules, setExpandedModules] = useState<string[]>(['module-1', 'module-2', 'module-3', 'module-4']);

  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'instructor'; text: string; time: string }[]>([
    { role: 'instructor', text: 'Hello! Feel free to ask me any questions about the course.', time: '10:30 AM' },
    { role: 'user', text: 'Hi! I have a question about variables in lesson 2.', time: '10:45 AM' },
    { role: 'instructor', text: 'Sure, I\'d be happy to help! What specifically would you like to know?', time: '10:47 AM' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Mock course data
  const courseData = {
    id: courseId,
    title: 'Complete Python Programming',
    instructor: 'Dr. Sarah Johnson',
    modules: [
      {
        id: 'module-1',
        title: 'Introduction to Python',
        lessons: [
          { 
            id: 'lesson-1-1', 
            title: 'Welcome to Python', 
            duration: '5:30', 
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            description: 'Get started with Python programming. Learn what Python is, why it\'s popular, and what you can build with it.',
            completed: true 
          },
          { 
            id: 'lesson-1-2', 
            title: 'Setting Up Your Environment', 
            duration: '8:15', 
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            description: 'Learn how to install Python and set up your development environment for coding.',
            completed: true 
          },
          { 
            id: 'lesson-1-3', 
            title: 'Your First Python Program', 
            duration: '10:45', 
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            description: 'Write and run your first Python program. Understand the basic syntax and structure.',
            completed: true 
          },
          { 
            id: 'lesson-1-4', 
            title: 'Python Basics Overview', 
            duration: '6:20', 
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            description: 'A comprehensive overview of Python fundamentals and key concepts.',
            completed: false 
          }
        ]
      },
      {
        id: 'module-2',
        title: 'Python Fundamentals',
        lessons: [
          { 
            id: 'lesson-2-1', 
            title: 'Variables and Data Types', 
            duration: '12:30', 
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            description: 'Understand variables, data types, and how to work with different types of data in Python.',
            completed: true 
          },
          { 
            id: 'lesson-2-2', 
            title: 'Operators and Expressions', 
            duration: '15:20', 
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            description: 'Learn about arithmetic, comparison, and logical operators in Python.',
            completed: true 
          },
          { 
            id: 'lesson-2-3', 
            title: 'Control Flow Statements', 
            duration: '18:45', 
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            description: 'Master if-else statements, loops, and control flow in your programs.',
            completed: false 
          },
          { 
            id: 'lesson-2-4', 
            title: 'Practice Exercises', 
            duration: '10:00', 
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            description: 'Apply what you\'ve learned with hands-on practice exercises.',
            completed: false 
          }
        ]
      },
      {
        id: 'module-3',
        title: 'Data Structures',
        lessons: [
          { 
            id: 'lesson-3-1', 
            title: 'Lists and Tuples', 
            duration: '14:20', 
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            description: 'Learn how to work with lists and tuples to store collections of data.',
            completed: false 
          },
          { 
            id: 'lesson-3-2', 
            title: 'Dictionaries and Sets', 
            duration: '16:30', 
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            description: 'Understand dictionaries and sets for efficient data management.',
            completed: false 
          },
          { 
            id: 'lesson-3-3', 
            title: 'Working with Strings', 
            duration: '12:15', 
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            description: 'Master string manipulation and common string operations.',
            completed: false 
          },
          { 
            id: 'lesson-3-4', 
            title: 'Data Structures Quiz', 
            duration: '8:00', 
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            description: 'Test your knowledge with a comprehensive quiz on data structures.',
            completed: false 
          }
        ]
      },
      {
        id: 'module-4',
        title: 'Functions and Modules',
        lessons: [
          { 
            id: 'lesson-4-1', 
            title: 'Defining Functions', 
            duration: '13:45', 
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            description: 'Learn how to create reusable functions in Python.',
            completed: false 
          },
          { 
            id: 'lesson-4-2', 
            title: 'Function Parameters', 
            duration: '11:20', 
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            description: 'Understand different types of function parameters and arguments.',
            completed: false 
          },
          { 
            id: 'lesson-4-3', 
            title: 'Lambda Functions', 
            duration: '9:30', 
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            description: 'Explore lambda functions and functional programming concepts.',
            completed: false 
          },
          { 
            id: 'lesson-4-4', 
            title: 'Python Modules', 
            duration: '15:00', 
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            description: 'Learn how to organize code using modules and packages.',
            completed: false 
          }
        ]
      }
    ]
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Get current lesson details
  const currentLesson = courseData.modules
    .flatMap(m => m.lessons)
    .find(l => l.id === selectedLesson);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage = {
      role: 'user' as const,
      text: chatInput,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInput('');

    // Simulate instructor response
    setTimeout(() => {
      const response = {
        role: 'instructor' as const,
        text: 'Thanks for your question! I\'ll review it and get back to you shortly with a detailed explanation.',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, response]);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-gray-400 hover:text-[#A5C89E] transition-all group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Courses
        </button>

        {/* Course Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white/90 mb-2">
              {courseData.title}
            </h1>
            <p className="text-gray-400">
              by {courseData.instructor}
            </p>
          </div>
          <button
            onClick={() => setShowChat(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#121212]/80 border border-[#A5C89E]/40 text-[#A5C89E] rounded-lg hover:bg-[#A5C89E]/10 hover:border-[#A5C89E]/60 transition-all font-medium text-sm whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            Message Instructor
          </button>
        </div>

        {/* Current Lesson Video */}
        {currentLesson && (
          <div className="mb-12">
            {/* Video Player */}
            <div className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-2xl overflow-hidden mb-6">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={currentLesson.videoUrl}
                  title={currentLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            {/* Lesson Info */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white/90">
                  {currentLesson.title}
                </h2>
                {currentLesson.completed && (
                  <span className="flex items-center text-[#A5C89E] text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Completed
                  </span>
                )}
              </div>
              <div className="flex items-center text-gray-500 mb-4">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">{currentLesson.duration}</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {currentLesson.description}
              </p>
              {!currentLesson.completed && (
                <button className="mt-4 px-6 py-2.5 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium text-sm">
                  Mark as Complete
                </button>
              )}
            </div>
          </div>
        )}

        {/* Course Modules and Lessons */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white/90 mb-6">Course Content</h3>
          
          {courseData.modules.flatMap((module) => module.lessons).map((lesson, index) => (
            <div 
              key={lesson.id}
              className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-2xl px-6 py-4 hover:bg-[#A5C89E]/5 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-[#A5C89E]/10 rounded-lg flex items-center justify-center border border-[#A5C89E]/30 flex-shrink-0">
                      <span className="text-[#A5C89E] text-sm font-mono">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h4 className="text-white/90 font-semibold">{lesson.title}</h4>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed ml-11">
                    {lesson.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-500 text-sm font-mono">
                    {lesson.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Modal */}
        {showChat && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowChat(false)}
          >
            <div
              className="bg-[#121212]/95 backdrop-blur-xl border border-[#A5C89E]/30 rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between p-6 pb-4 border-b border-[#A5C89E]/20">
                <div>
                  <h3 className="text-lg font-bold text-white">{courseData.instructor}</h3>
                  <p className="text-xs text-gray-400">{courseData.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Online</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageCircle className="w-12 h-12 text-gray-700 mb-3" />
                    <p className="text-gray-400 text-sm">
                      Start a conversation with your instructor
                    </p>
                  </div>
                ) : (
                  chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'instructor' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-[#A5C89E]/20 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-[#A5C89E]" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] px-4 py-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-[#A5C89E]/10 border border-[#A5C89E]/30 text-white'
                            : 'bg-[#0b0b0b]/60 border border-[#A5C89E]/20 text-gray-300'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                      </div>
                      {message.role === 'user' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-[#A5C89E]/20 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-[#A5C89E]" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 pt-4 border-t border-[#A5C89E]/20">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask your question…"
                    className="flex-1 px-4 py-3 bg-[#0b0b0b]/60 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#A5C89E]/60 transition-all"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                    className="px-5 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#A5C89E]/80 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Press Enter to send • Get help from your instructor
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}