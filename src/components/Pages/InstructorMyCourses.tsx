import { useState } from 'react';
import { BookOpen, Plus, Edit, Calendar, Tag, MessageCircle, X, Send, User } from 'lucide-react';

interface InstructorMyCoursesProps {
  onBack: () => void;
  onCreateCourse: () => void;
  onEditCourse: (courseId: string) => void;
}

type CourseStatus = 'all' | 'draft' | 'pending' | 'published';

interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'draft' | 'pending' | 'published';
  lastUpdated: string;
  thumbnail?: string;
}

// Mock data for instructor courses
const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Advanced Python Programming',
    category: 'Programming',
    description: 'Master advanced Python concepts including decorators, generators, and async programming.',
    status: 'published',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'course-2',
    title: 'Machine Learning Fundamentals',
    category: 'AI & ML',
    description: 'Learn the basics of machine learning with hands-on projects and real-world examples.',
    status: 'pending',
    lastUpdated: '2024-01-18',
  },
  {
    id: 'course-3',
    title: 'Web Development with React',
    category: 'Web Development',
    description: 'Build modern web applications using React, hooks, and best practices.',
    status: 'draft',
    lastUpdated: '2024-01-20',
  },
];

export function InstructorMyCourses({ onBack, onCreateCourse, onEditCourse }: InstructorMyCoursesProps) {
  const [activeStatus, setActiveStatus] = useState<CourseStatus>('all');
  const [courses] = useState<Course[]>(mockCourses);

  // Messaging state
  const [showMessaging, setShowMessaging] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');

  // Mock student messages data
  const studentMessages = {
    'course-1': [
      {
        studentId: 'student-1',
        studentName: 'John Davis',
        lastMessage: 'Can you explain decorators in lesson 3?',
        lastMessageTime: '2 hours ago',
        unread: 2,
        messages: [
          { role: 'student' as const, text: 'Hi! I\'m having trouble understanding decorators.', time: '3 hours ago' },
          { role: 'instructor' as const, text: 'Hi John! I\'d be happy to help. What specifically is confusing?', time: '2 hours 30 min ago' },
          { role: 'student' as const, text: 'Can you explain decorators in lesson 3?', time: '2 hours ago' },
        ],
      },
      {
        studentId: 'student-2',
        studentName: 'Emily Chen',
        lastMessage: 'Thank you for the explanation!',
        lastMessageTime: '1 day ago',
        unread: 0,
        messages: [
          { role: 'student' as const, text: 'I loved the async programming section!', time: '2 days ago' },
          { role: 'instructor' as const, text: 'Thank you! Glad you found it helpful.', time: '1 day ago' },
          { role: 'student' as const, text: 'Thank you for the explanation!', time: '1 day ago' },
        ],
      },
      {
        studentId: 'student-3',
        studentName: 'Michael Brown',
        lastMessage: 'Could you review my code?',
        lastMessageTime: '5 hours ago',
        unread: 1,
        messages: [
          { role: 'student' as const, text: 'Could you review my code?', time: '5 hours ago' },
        ],
      },
    ],
    'course-2': [
      {
        studentId: 'student-4',
        studentName: 'Sarah Wilson',
        lastMessage: 'Question about regression models',
        lastMessageTime: '1 hour ago',
        unread: 1,
        messages: [
          { role: 'student' as const, text: 'Question about regression models', time: '1 hour ago' },
        ],
      },
    ],
    'course-3': [],
  };

  const handleOpenMessaging = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();
    setSelectedCourse(course);
    const messages = studentMessages[course.id as keyof typeof studentMessages];
    if (messages && messages.length > 0) {
      setSelectedStudent(messages[0].studentId);
    }
    setShowMessaging(true);
  };

  const handleSendReply = () => {
    if (!replyInput.trim() || !selectedCourse || !selectedStudent) return;

    // Here you would add the message to the messages array
    // For now, just clear the input
    setReplyInput('');
  };

  const getCourseMessageCount = (courseId: string) => {
    const messages = studentMessages[courseId as keyof typeof studentMessages];
    if (!messages) return 0;
    return messages.reduce((total, student) => total + student.unread, 0);
  };

  const getSelectedStudentMessages = () => {
    if (!selectedCourse || !selectedStudent) return [];
    const messages = studentMessages[selectedCourse.id as keyof typeof studentMessages];
    const student = messages?.find(s => s.studentId === selectedStudent);
    return student?.messages || [];
  };

  const getSelectedStudentName = () => {
    if (!selectedCourse || !selectedStudent) return '';
    const messages = studentMessages[selectedCourse.id as keyof typeof studentMessages];
    const student = messages?.find(s => s.studentId === selectedStudent);
    return student?.studentName || '';
  };

  const filteredCourses = courses.filter(course => 
    activeStatus === 'all' ? true : course.status === activeStatus
  );

  const getStatusBadgeStyle = (status: Course['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'pending':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'draft':
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const statusFilters: { label: string; value: CourseStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Pending', value: 'pending' },
    { label: 'Published', value: 'published' },
  ];

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="relative max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              My Courses
            </h1>
            <p className="text-gray-400">
              Manage all your courses in one place
            </p>
          </div>
          <button
            onClick={onCreateCourse}
            className="inline-flex items-center justify-center px-6 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium hover:shadow-lg hover:shadow-[#A5C89E]/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Course
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="inline-flex gap-2 bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-lg p-1">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveStatus(filter.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeStatus === filter.value
                    ? 'bg-[#A5C89E]/20 text-[#A5C89E] border border-[#A5C89E]/40'
                    : 'text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          // Empty State
          <div className="text-center py-20 bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl">
            <div className="inline-flex items-center justify-center p-4 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-full mb-4">
              <BookOpen className="w-12 h-12 text-[#A5C89E]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {activeStatus === 'all' 
                ? "You haven't created any courses yet."
                : `No ${activeStatus} courses found.`}
            </h3>
            <p className="text-gray-400 mb-6">
              {activeStatus === 'all'
                ? 'Start creating your first course and share your knowledge.'
                : 'Try selecting a different status filter.'}
            </p>
            {activeStatus === 'all' && (
              <button
                onClick={onCreateCourse}
                className="inline-flex items-center px-8 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium hover:shadow-lg hover:shadow-[#A5C89E]/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Course
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => onEditCourse(course.id)}
                className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-6 hover:border-[#A5C89E]/60 transition-all cursor-pointer group"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyle(
                      course.status
                    )}`}
                  >
                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                  </span>
                  <Edit className="w-4 h-4 text-gray-600 group-hover:text-[#A5C89E] transition-colors" />
                </div>

                {/* Course Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#A5C89E] transition-colors line-clamp-2">
                  {course.title}
                </h3>

                {/* Category */}
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">{course.category}</span>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Last Updated */}
                <div className="flex items-center gap-2 pt-4 border-t border-[#A5C89E]/20">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-600">
                    Updated {new Date(course.lastUpdated).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Student Messages Button */}
                <button
                  onClick={(e) => handleOpenMessaging(e, course)}
                  className="flex items-center gap-2 px-4 py-2 mt-4 bg-[#121212]/60 border border-[#A5C89E]/40 text-[#A5C89E] rounded-lg hover:bg-[#A5C89E]/10 hover:border-[#A5C89E]/60 transition-all font-medium text-sm w-full justify-center relative"
                >
                  <MessageCircle className="w-4 h-4" />
                  Student Messages
                  {getCourseMessageCount(course.id) > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {getCourseMessageCount(course.id)}
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Messaging Dashboard Modal */}
        {showMessaging && selectedCourse && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowMessaging(false)}
          >
            <div
              className="bg-[#121212]/95 backdrop-blur-xl border border-[#A5C89E]/30 rounded-xl shadow-2xl w-full max-w-6xl h-[700px] flex flex-col"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-4 border-b border-[#A5C89E]/20">
                <div>
                  <h3 className="text-xl font-bold text-white">Student Messages</h3>
                  <p className="text-xs text-gray-400 mt-1">{selectedCourse.title}</p>
                </div>
                <button
                  onClick={() => setShowMessaging(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Two-Column Layout */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Students List */}
                <div className="w-80 border-r border-[#A5C89E]/20 overflow-y-auto">
                  <div className="p-4">
                    <h4 className="text-xs font-mono text-gray-500 mb-3 tracking-wider">STUDENTS</h4>
                    {studentMessages[selectedCourse.id as keyof typeof studentMessages].length === 0 ? (
                      <div className="py-12 text-center">
                        <MessageCircle className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No messages yet for this course</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {studentMessages[selectedCourse.id as keyof typeof studentMessages].map(student => (
                          <button
                            key={student.studentId}
                            className={`w-full text-left p-3 rounded-lg transition-all ${
                              selectedStudent === student.studentId
                                ? 'bg-[#A5C89E]/10 border border-[#A5C89E]/40'
                                : 'bg-[#0b0b0b]/40 border border-transparent hover:bg-[#0b0b0b]/60'
                            }`}
                            onClick={() => setSelectedStudent(student.studentId)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-[#A5C89E]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-[#A5C89E]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h5 className="text-sm font-semibold text-white truncate">{student.studentName}</h5>
                                  {student.unread > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                      {student.unread}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 truncate mb-1">{student.lastMessage}</p>
                                <p className="text-xs text-gray-600">{student.lastMessageTime}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Panel - Chat Window */}
                <div className="flex-1 flex flex-col">
                  {selectedStudent ? (
                    <>
                      {/* Chat Header */}
                      <div className="px-6 py-4 border-b border-[#A5C89E]/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#A5C89E]/20 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-[#A5C89E]" />
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-white">{getSelectedStudentName()}</h4>
                            <p className="text-xs text-gray-500">Student</p>
                          </div>
                        </div>
                      </div>

                      {/* Messages Area */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {getSelectedStudentMessages().map((message, index) => (
                          <div
                            key={index}
                            className={`flex gap-3 ${
                              message.role === 'instructor' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {message.role === 'student' && (
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-[#A5C89E]/20 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-[#A5C89E]" />
                                </div>
                              </div>
                            )}
                            <div
                              className={`max-w-[70%] px-4 py-3 rounded-lg ${
                                message.role === 'instructor'
                                  ? 'bg-[#A5C89E]/10 border border-[#A5C89E]/30 text-white'
                                  : 'bg-[#0b0b0b]/60 border border-[#A5C89E]/20 text-gray-300'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{message.text}</p>
                              <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                            </div>
                            {message.role === 'instructor' && (
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-[#A5C89E]/20 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-[#A5C89E]" />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Reply Input Area */}
                      <div className="p-6 pt-4 border-t border-[#A5C89E]/20">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={replyInput}
                            onChange={(e) => setReplyInput(e.target.value)}
                            placeholder="Reply to student…"
                            className="flex-1 px-4 py-3 bg-[#0b0b0b]/60 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#A5C89E]/60 transition-all"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSendReply();
                              }
                            }}
                          />
                          <button
                            onClick={handleSendReply}
                            disabled={!replyInput.trim()}
                            className="px-5 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#A5C89E]/80 flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            <span className="hidden sm:inline">Send</span>
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          Press Enter to send • Respond to your student's questions
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">Select a student to view messages</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}