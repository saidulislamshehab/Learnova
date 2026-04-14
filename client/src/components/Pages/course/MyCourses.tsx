import { API_URL } from '@/utils/constants';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, Clock, TrendingUp, ChevronRight } from 'lucide-react';

interface Course {
  id: string;
  dbId: number;
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
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Please sign in to view your courses.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/courses/enrolled`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const mappedCourses = response.data.courses.map((c: any) => ({
          id: c.Course_Code || `ID-${c.CourseID}`,
          dbId: c.CourseID,
          title: c.Title,
          instructor: c.Instructor_Name || 'Expert Academic',
          thumbnail: c.Thumbnail || 'https://res.cloudinary.com/dp1li5tkd/image/upload/v1775459948/eg8mybzg20bdnsau78vs.jpg',
          progress: c.Progress_Percent || 0,
          totalLessons: 10, // Placeholder as we haven't implemented lesson counting yet
          completedLessons: 0, // Placeholder
          duration: c.Total_Hours ? `${c.Total_Hours}h` : 'TBD'
        }));
        
        setEnrolledCourses(mappedCourses);
      } catch (err: any) {
        setError('Failed to load courses. Please try again.');
        console.error('Error fetching enrolled courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#A5C89E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-gray-400 hover:text-[#A5C89E] transition-all group font-mono text-sm uppercase"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white/90 mb-3 tracking-tight">
            Enrolled Courses
          </h1>
          <p className="text-gray-400 text-lg">
            {error || 'Continue your learning journey'}
          </p>
        </div>

        {!error && enrolledCourses.length > 0 && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-[10px] font-mono uppercase mb-1 tracking-widest">Enrolled</p>
                    <p className="text-3xl font-bold text-white/90">{enrolledCourses.length}</p>
                  </div>
                  <div className="p-3 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-lg">
                    <BookOpen className="w-5 h-5 text-[#A5C89E]" />
                  </div>
                </div>
              </div>

              <div className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-[10px] font-mono uppercase mb-1 tracking-widest">In Progress</p>
                    <p className="text-3xl font-bold text-white/90">
                      {enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length}
                    </p>
                  </div>
                  <div className="p-3 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-[#A5C89E]" />
                  </div>
                </div>
              </div>

              <div className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-[10px] font-mono uppercase mb-1 tracking-widest">Achievements</p>
                    <p className="text-3xl font-bold text-white/90">
                      {enrolledCourses.filter(c => c.progress === 100).length}
                    </p>
                  </div>
                  <div className="p-3 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-lg">
                    <Clock className="w-5 h-5 text-[#A5C89E]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div
                  key={course.dbId}
                  onClick={() => onCourseClick(course.dbId.toString())}
                  className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-2xl overflow-hidden hover:border-[#A5C89E]/40 hover:shadow-2xl hover:shadow-[#A5C89E]/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[#A5C89E]/90 backdrop-blur-sm text-black text-[10px] font-bold rounded-full uppercase tracking-tighter">
                      {course.progress}% Completed
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white/90 mb-1 group-hover:text-[#A5C89E] transition-colors line-clamp-1 uppercase tracking-tight">
                      {course.title}
                    </h3>
                    <p className="text-gray-500 text-[11px] font-mono mb-4 uppercase tracking-tighter">
                      Instructor: {course.instructor}
                    </p>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-[10px] text-gray-500 mb-2 font-mono uppercase tracking-[0.1em]">
                        <span>Curriculum Status</span>
                        <span>{course.duration}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#A5C89E] to-[#A5C89E]/70 transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <button className="w-full flex items-center justify-center py-3 bg-[#A5C89E]/5 border border-[#A5C89E]/20 text-[#A5C89E] rounded-lg hover:bg-[#A5C89E]/10 hover:border-[#A5C89E]/40 transition-all group-hover:shadow-lg group-hover:shadow-[#A5C89E]/10 text-xs font-bold tracking-widest uppercase">
                      <span>Resume Course</span>
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && enrolledCourses.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-[#A5C89E]/10 rounded-3xl">
            <div className="w-20 h-20 bg-[#A5C89E]/5 border border-[#A5C89E]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-[#A5C89E]/40" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Empty Curriculum</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto font-mono text-sm leading-relaxed">
              Explore our platform to find courses and start your professional journey today.
            </p>
            <button 
              onClick={onBack}
              className="px-10 py-4 bg-[#A5C89E]/80 text-black rounded-xl hover:bg-[#A5C89E] transition-all font-bold uppercase tracking-widest text-sm"
            >
              Discover Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
