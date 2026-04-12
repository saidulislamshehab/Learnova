import { API_URL } from '@/utils/constants';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Clock, Users, ChevronDown } from 'lucide-react';
import { Pagination } from '../Common/Pagination';

interface Course {
  CourseID: number;
  Title: string;
  Category: string;
  Description: string | null;
  Price: string | number;
  Old_Price?: string | number | null;
  Thumbnail: string | null;
  Total_Hours: string | number | null;
  Status: string;
  Students_Count?: number;
  Rating?: number;
  Course_Code?: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
    picture: string | null;
  };
}

const categories = [
  'All Categories',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Artificial Intelligence',
  'Cloud Computing',
  'Cybersecurity',
  'DevOps',
  'Blockchain',
  'Game Development',
  'UI/UX Design',
  'Database Management',
];

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 31) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

interface AllCoursesProps {
  category?: string;
  onCourseClick?: (courseId: string | number) => void;
}

export function AllCourses({ category = 'All Categories', onCourseClick }: AllCoursesProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(15);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/courses`);
        setCourses(response.data.courses || []);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter courses based on search and category
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.user?.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.Description ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === 'All Categories' || course.Category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Reset to page 1 when search or category changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setIsCategoryOpen(false);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
    <section className="relative pt-40 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-2 h-2 bg-[#A5C89E]/80 rounded-full animate-pulse"></div>
            <span className="text-[#A5C89E]/90 text-xs font-mono tracking-widest">
              // COURSE DISCOVERY
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#A5C89E]/40 to-transparent"></div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
            ALL COURSES
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Browse and explore all available courses. Find the perfect learning path for your goals.
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="mb-12 flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-[#121212]/80 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#A5C89E] transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative md:w-64">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full bg-[#121212]/80 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl py-4 px-4 text-white text-left flex items-center justify-between hover:border-[#A5C89E] transition-colors"
            >
              <span className="text-sm font-medium tracking-wide">
                {selectedCategory}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isCategoryOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isCategoryOpen && (
              <div className="absolute top-full mt-2 w-full bg-[#121212]/95 backdrop-blur-xl border border-[#A5C89E]/30 rounded-lg shadow-2xl z-50 py-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`w-full text-left px-4 py-2 transition-all text-sm font-medium ${
                      selectedCategory === category
                        ? 'text-[#A5C89E] bg-[#A5C89E]/5'
                        : 'text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/5'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm font-mono text-gray-500">
            <span className="text-[#A5C89E]">{filteredCourses.length}</span> {filteredCourses.length === 1 ? 'course' : 'courses'} found
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-[#A5C89E]/20 border-t-[#A5C89E] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-mono text-sm tracking-widest">LOADING_COURSES...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="text-red-400 font-mono text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#A5C89E]/10 border border-[#A5C89E]/30 text-[#A5C89E] rounded-lg hover:bg-[#A5C89E]/20 transition-all font-mono text-xs"
            >
              RETRY_FETCH
            </button>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCourses.map((course, index) => (
              <div
                key={course.CourseID}
                className="group relative bg-[#121212]/60 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl overflow-hidden hover:border-[#A5C89E] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Course Header */}
                <div className="relative h-40 bg-gradient-to-br from-[#A5C89E]/15 to-transparent border-b border-[#A5C89E]/20 p-6 overflow-hidden">
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <img 
                      src={course.Thumbnail || 'https://res.cloudinary.com/dp1li5tkd/image/upload/v1775459948/eg8mybzg20bdnsau78vs.jpg'} 
                      alt="" 
                      className="w-full h-full object-cover grayscale" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#000]/60 to-[#121212]/95 mix-blend-multiply"></div>
                  </div>
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="text-xs font-mono text-[#A5C89E] bg-[#A5C89E]/10 px-2 py-1 rounded border border-[#A5C89E]/30">
                      {course.Course_Code || `ID-${course.CourseID}`}
                    </div>
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          course.Status?.toLowerCase() === 'beta' ? 'bg-yellow-500' : 'bg-green-500'
                        } animate-pulse`}
                      ></div>
                      <span className="text-[10px] text-gray-500 font-mono uppercase">{course.Status}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-6 text-2xl font-bold text-white/5 font-mono z-10">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-[#A5C89E] transition-colors line-clamp-1">
                      {course.Title}
                    </h3>
                    <div className="text-[9px] text-[#A5C89E]/60 font-mono uppercase tracking-widest whitespace-nowrap bg-[#A5C89E]/5 px-2 py-0.5 rounded border border-[#A5C89E]/10">
                      {formatTimeAgo(course.created_at)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-5 h-5 rounded-full border border-[#A5C89E]/30 overflow-hidden bg-gray-900">
                      <img 
                        src={course.user?.picture || '/default-avatar.png'} 
                        alt="" 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = '/default-avatar.png')}
                      />
                    </div>
                    <p className="text-xs text-gray-400 font-mono">{course.user?.name || 'Academic Expert'}</p>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2 min-h-[40px]">
                    {course.Description || 'Explore the fundamentals and advanced concepts in this comprehensive course.'}
                  </p>

                  {/* Price */}
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-2xl font-bold text-[#A5C89E] tracking-tighter">${course.Price}</span>
                    {course.Old_Price && (
                      <span className="text-sm text-gray-600 line-through tracking-tighter">${course.Old_Price}</span>
                    )}
                  </div>

                  {/* Course Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-6 font-mono border-t border-white/5 pt-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#A5C89E]/60" />
                      <span>{course.Total_Hours ? `${course.Total_Hours}h` : 'TBD'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3 text-[#A5C89E]/60" />
                      <span>{course.Students_Count || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-[#A5C89E]/80">★</span>
                      <span>{course.Rating || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Enroll Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onCourseClick?.(course.CourseID);
                    }}
                    className="w-full py-3 bg-transparent border border-[#A5C89E]/60 text-[#A5C89E]/90 rounded-lg hover:bg-[#A5C89E]/80 hover:text-black hover:shadow-[0_0_15px_rgba(165,200,158,0.3)] transition-all duration-300 font-bold text-sm tracking-wide uppercase"
                  >
                    ENROLL_NOW
                  </button>
                </div>

                {/* Hover Accent */}
                <div className="absolute top-0 right-0 w-0 h-0.5 bg-[#A5C89E]/80 group-hover:w-full transition-all duration-300"></div>
              </div>
            ))}

          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 bg-[#121212]/80 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-[#A5C89E]/60" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No courses found</h3>
            <p className="text-gray-400 text-center max-w-md mb-6">
              We couldn't find any courses matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
              }}
              className="px-6 py-3 bg-transparent border border-[#A5C89E]/60 text-[#A5C89E]/90 rounded-lg hover:bg-[#A5C89E]/10 transition-all font-medium text-sm tracking-wide"
            >
              RESET_FILTERS
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredCourses.length > coursesPerPage && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </section>
  );
}