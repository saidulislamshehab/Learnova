import { API_URL } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, Users, ArrowUpRight } from 'lucide-react';
import { CourseSkeleton } from '@/components/Common/Skeleton';

interface Course {
  CourseID: number;
  Title: string;
  Description: string | null;
  Price: string | number | null;
  Total_Hours: string | number | null;
  Status: string;
  Course_Code?: string | null;
  Thumbnail?: string | null;
  Rating?: string | number | null;
  created_at: string;
  enrollments_count?: number;
  user?: {
    name?: string;
    picture?: string | null;
  };
}

interface CoursesProps {
  onCourseClick?: (courseId: string) => void;
}

function formatStudents(count: number) {
  if (count >= 1000) {
    const value = count / 1000;
    return `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)}K`;
  }

  return String(count);
}

function formatDuration(hours: string | number | null) {
  if (hours === null || hours === undefined || hours === '') {
    return '0h';
  }

  const parsed = Number(hours);
  if (Number.isNaN(parsed)) {
    return `${hours}`;
  }

  return `${parsed}h`;
}

function formatTimeAgo(dateString: string) {
  if (!dateString) {
    return 'Recently';
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

export function Courses({ onCourseClick }: CoursesProps) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(`${API_URL}/courses/top`, {
          headers: { Accept: 'application/json' },
        });

        const rawCourses = response.data?.courses ?? [];
        const list = (Array.isArray(rawCourses) ? rawCourses : [])
          .map((course: any) => ({
            CourseID: Number(course.CourseID ?? course.id),
            Title: String(course.Title ?? course.title ?? 'Untitled Course'),
            Description: course.Description ?? course.description ?? null,
            Price: course.Price ?? course.price ?? null,
            Total_Hours: course.Total_Hours ?? course.total_hours ?? null,
            Status: String(course.Status ?? course.status ?? 'published'),
            Course_Code: course.Course_Code ?? course.course_code ?? null,
            Thumbnail: course.Thumbnail ?? course.thumbnail ?? null,
            Rating: course.Rating ?? course.rating ?? null,
            created_at: String(course.created_at ?? ''),
            enrollments_count: Number(course.enrollments_count ?? course.Enrollments_Count ?? 0),
            user: {
              name: course.user?.name ?? course.instructor_name ?? '',
              picture: course.user?.picture ?? null,
            },
          }))
          .filter((course: Course) => Number.isFinite(course.CourseID))
          .slice(0, 6);

        setCourses(list);
      } catch (err) {
        console.error(err);
        setError('Failed to load featured courses.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTopCourses();
  }, []);

  return (
    <section id="courses" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-[#A5C89E]/90 text-xs font-mono tracking-widest">// FEATURED COURSES</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#A5C89E]/40 to-transparent"></div>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">COURSE CATALOG</h2>
              <p className="text-gray-400 text-lg max-w-2xl">
                Top published courses ranked by enrollments
              </p>
            </div>
            <button 
              onClick={() => navigate('/allcourses')}
              className="mt-4 md:mt-0 text-[#A5C89E]/90 text-sm font-mono hover:underline flex items-center space-x-2"
            >
              <span>VIEW_ALL_COURSES</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <CourseSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="bg-[#121212]/60 backdrop-blur-sm border border-red-500/30 rounded-xl p-6 text-red-300 text-sm">
            {error}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => {
              const studentCount = course.enrollments_count ?? 0;
              const instructorName = course.user?.name?.trim() || 'Unknown Instructor';
              const courseId = String(course.CourseID);

              return (
                <div
                  key={course.CourseID}
                  className="group relative bg-[#121212]/60 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl overflow-hidden hover:border-[#A5C89E] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 bg-gradient-to-br from-[#A5C89E]/10 to-transparent border-b border-[#A5C89E]/20 overflow-hidden">
                    <img
                      src={course.Thumbnail || 'https://res.cloudinary.com/dp1li5tkd/image/upload/v1775459948/eg8mybzg20bdnsau78vs.jpg'}
                      alt={course.Title}
                      className="absolute inset-0 h-full w-full object-cover opacity-35 group-hover:opacity-50 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b]/95 via-[#0b0b0b]/55 to-transparent"></div>
                    <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-xs font-mono text-[#A5C89E] bg-[#A5C89E]/10 px-2 py-1 rounded border border-[#A5C89E]/30 backdrop-blur-sm">
                          {course.Course_Code || `ID-${course.CourseID}`}
                        </div>
                        <div className="flex items-center space-x-1 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-[10px] text-gray-300 font-mono uppercase">
                            {Number(course.Rating ?? 0).toFixed(1)} RATING
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 tracking-wide group-hover:text-[#A5C89E] transition-colors line-clamp-1">
                      {course.Title}
                    </h3>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-[#A5C89E]/30 bg-[#0b0b0b] flex-shrink-0">
                          {course.user?.picture ? (
                            <img
                              src={course.user.picture}
                              alt={instructorName}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-[#A5C89E]/90 font-semibold">
                              {instructorName
                                .split(' ')
                                .filter(Boolean)
                                .slice(0, 2)
                                .map((part) => part[0])
                                .join('')
                                .toUpperCase() || 'IN'}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-[#A5C89E]/80 font-mono truncate">{instructorName}</p>
                      </div>
                      <div className="text-[9px] text-[#A5C89E]/60 font-mono uppercase tracking-widest whitespace-nowrap bg-[#A5C89E]/5 px-2 py-0.5 rounded border border-[#A5C89E]/10">
                        {formatTimeAgo(course.created_at)}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">
                      {course.Description || 'No description available.'}
                    </p>

                    <div className="mb-4">
                      <span className="text-2xl font-bold text-[#A5C89E]">
                        {course.Price !== null && course.Price !== undefined && course.Price !== ''
                          ? `$${course.Price}`
                          : 'Free'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 font-mono">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDuration(course.Total_Hours)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{formatStudents(studentCount)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>★</span>
                        <span>{Number(course.Rating ?? 0).toFixed(1)}</span>
                      </div>
                    </div>

                    <button
                      className="w-full py-3 bg-transparent border border-[#A5C89E]/60 text-[#A5C89E]/90 rounded-lg hover:bg-[#A5C89E]/80 hover:text-black transition-all font-medium text-sm tracking-wide"
                      onClick={() => onCourseClick?.(courseId)}
                    >
                      ENROLL_NOW
                    </button>
                  </div>

                  <div className="absolute top-0 right-0 w-0 h-0.5 bg-[#A5C89E]/80 group-hover:w-full transition-all duration-300"></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#121212]/60 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl p-6 text-gray-400 text-sm">
            No published courses found.
          </div>
        )}
      </div>
    </section>
  );
}
