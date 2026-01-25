import { BookOpen, Clock, TrendingUp, ChevronRight } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  duration: string;
}

interface MyCoursesProps {
  onBack: () => void;
  onCourseClick: (courseId: string) => void;
}

export function MyCourses({ onBack, onCourseClick }: MyCoursesProps) {
  // Mock enrolled courses data
  const enrolledCourses: Course[] = [
    {
      id: 'PY-001',
      title: 'Complete Python Programming',
      instructor: 'Dr. Sarah Johnson',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop',
      progress: 65,
      totalLessons: 48,
      completedLessons: 31,
      duration: '12h 30m'
    },
    {
      id: 'WEB-002',
      title: 'Full-Stack Web Development',
      instructor: 'Michael Chen',
      thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop',
      progress: 40,
      totalLessons: 52,
      completedLessons: 21,
      duration: '18h 45m'
    },
    {
      id: 'ML-003',
      title: 'Machine Learning Fundamentals',
      instructor: 'Dr. Emily Rodriguez',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop',
      progress: 80,
      totalLessons: 36,
      completedLessons: 29,
      duration: '15h 20m'
    },
    {
      id: 'DS-004',
      title: 'Data Structures & Algorithms',
      instructor: 'Prof. James Wilson',
      thumbnail: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&auto=format&fit=crop',
      progress: 25,
      totalLessons: 44,
      completedLessons: 11,
      duration: '20h 15m'
    },
    {
      id: 'REACT-005',
      title: 'Advanced React & Next.js',
      instructor: 'Alex Thompson',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
      progress: 55,
      totalLessons: 40,
      completedLessons: 22,
      duration: '16h 40m'
    },
    {
      id: 'CLOUD-006',
      title: 'Cloud Computing with AWS',
      instructor: 'Jennifer Lee',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
      progress: 15,
      totalLessons: 38,
      completedLessons: 6,
      duration: '14h 55m'
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-gray-400 hover:text-[#A5C89E] transition-all group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white/90 mb-3">
            My Courses
          </h1>
          <p className="text-gray-400 text-lg">
            Continue your learning journey
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Enrolled Courses</p>
                <p className="text-3xl font-bold text-white/90">{enrolledCourses.length}</p>
              </div>
              <div className="p-3 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-[#A5C89E]" />
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">In Progress</p>
                <p className="text-3xl font-bold text-white/90">
                  {enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length}
                </p>
              </div>
              <div className="p-3 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-[#A5C89E]" />
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Hours</p>
                <p className="text-3xl font-bold text-white/90">
                  {enrolledCourses.reduce((acc, course) => {
                    const hours = parseFloat(course.duration.split('h')[0]);
                    return acc + hours;
                  }, 0).toFixed(0)}h
                </p>
              </div>
              <div className="p-3 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-lg">
                <Clock className="w-6 h-6 text-[#A5C89E]" />
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => onCourseClick(course.id)}
              className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-2xl overflow-hidden hover:border-[#A5C89E]/40 hover:shadow-2xl hover:shadow-[#A5C89E]/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-transparent"></div>
                
                {/* Progress Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-[#A5C89E]/90 backdrop-blur-sm text-black text-xs font-bold rounded-full">
                  {course.progress}% Complete
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white/90 mb-2 group-hover:text-[#A5C89E] transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  by {course.instructor}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>{course.completedLessons} of {course.totalLessons} lessons</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#A5C89E] to-[#A5C89E]/70 transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Continue Button */}
                <button className="w-full flex items-center justify-center py-3 bg-[#A5C89E]/10 border border-[#A5C89E]/30 text-[#A5C89E] rounded-lg hover:bg-[#A5C89E]/20 hover:border-[#A5C89E]/50 transition-all group-hover:shadow-lg group-hover:shadow-[#A5C89E]/10">
                  <span className="font-medium">Continue Learning</span>
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no courses) */}
        {enrolledCourses.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-[#A5C89E]/60" />
            </div>
            <h3 className="text-2xl font-bold text-white/90 mb-3">
              No Courses Yet
            </h3>
            <p className="text-gray-500 mb-8">
              Start your learning journey by enrolling in a course
            </p>
            <button 
              onClick={onBack}
              className="px-8 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium"
            >
              Explore Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
