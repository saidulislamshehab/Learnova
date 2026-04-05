import { useState } from 'react';
import { Search, Clock, Users, ArrowUpRight, ChevronDown } from 'lucide-react';
import { Pagination } from './Pagination';

const allCourses = [
  {
    id: 'PY-001',
    title: 'COMPLETE PYTHON BOOTCAMP',
    instructor: 'Dr. Sarah Johnson',
    description: 'Comprehensive Python training from fundamentals to advanced concepts including web development and data science applications.',
    duration: '40h',
    students: '15.2K',
    rating: 4.8,
    status: 'ACTIVE',
    category: 'Programming Languages',
    price: '$49.99',
  },
  {
    id: 'FS-002',
    title: 'FULL STACK DEVELOPMENT',
    instructor: 'Mark Thompson',
    description: 'Production-grade web applications using React, Node.js, and MongoDB with industry best practices.',
    duration: '60h',
    students: '12.8K',
    rating: 4.9,
    status: 'ACTIVE',
    category: 'Development',
    price: '$79.99',
  },
  {
    id: 'DS-003',
    title: 'DATA STRUCTURES & ALGORITHMS',
    instructor: 'Prof. Michael Chen',
    description: 'Advanced DSA concepts with coding interview preparation and competitive programming techniques.',
    duration: '50h',
    students: '18.4K',
    rating: 4.7,
    status: 'ACTIVE',
    category: 'DSA / Placements',
    price: '$59.99',
  },
  {
    id: 'ML-004',
    title: 'MACHINE LEARNING A-Z',
    instructor: 'Dr. Emily Rodriguez',
    description: 'Complete ML pipeline from theory to deployment including supervised and unsupervised learning.',
    duration: '45h',
    students: '10.2K',
    rating: 4.9,
    status: 'BETA',
    category: 'ML & Data Science',
    price: '$89.99',
  },
  {
    id: 'JS-005',
    title: 'ADVANCED JAVASCRIPT',
    instructor: 'Alex Martinez',
    description: 'Deep dive into async programming, closures, prototypes, and modern JavaScript frameworks.',
    duration: '35h',
    students: '14.5K',
    rating: 4.8,
    status: 'ACTIVE',
    category: 'Programming Languages',
    price: '$44.99',
  },
  {
    id: 'CL-006',
    title: 'CLOUD COMPUTING AWS',
    instructor: 'Rachel Green',
    description: 'AWS services, cloud architecture patterns, deployment strategies, and DevOps workflows.',
    duration: '55h',
    students: '9.8K',
    rating: 4.6,
    status: 'ACTIVE',
    category: 'Cloud / DevOps',
    price: '$69.99',
  },
  {
    id: 'RE-007',
    title: 'REACT MASTERY',
    instructor: 'John Davidson',
    description: 'Master React hooks, context API, Redux, and performance optimization techniques.',
    duration: '42h',
    students: '16.3K',
    rating: 4.9,
    status: 'ACTIVE',
    category: 'Development',
    price: '$54.99',
  },
  {
    id: 'JV-008',
    title: 'JAVA COMPLETE GUIDE',
    instructor: 'Dr. Andrew Wilson',
    description: 'From Java basics to Spring Boot, microservices, and enterprise application development.',
    duration: '65h',
    students: '13.5K',
    rating: 4.7,
    status: 'ACTIVE',
    category: 'Programming Languages',
    price: '$64.99',
  },
  {
    id: 'DL-009',
    title: 'DEEP LEARNING SPECIALIZATION',
    instructor: 'Dr. Lisa Wang',
    description: 'Neural networks, CNNs, RNNs, and transformers with PyTorch and TensorFlow.',
    duration: '58h',
    students: '8.7K',
    rating: 4.8,
    status: 'BETA',
    category: 'ML & Data Science',
    price: '$99.99',
  },
  {
    id: 'DO-010',
    title: 'DOCKER & KUBERNETES',
    instructor: 'Michael Stevens',
    description: 'Container orchestration, CI/CD pipelines, and cloud-native application deployment.',
    duration: '38h',
    students: '11.2K',
    rating: 4.6,
    status: 'ACTIVE',
    category: 'Cloud / DevOps',
    price: '$59.99',
  },
  {
    id: 'CP-011',
    title: 'C++ FOR COMPETITIVE PROGRAMMING',
    instructor: 'Prof. Robert Lee',
    description: 'STL, algorithms, data structures, and problem-solving techniques for coding competitions.',
    duration: '48h',
    students: '9.5K',
    rating: 4.7,
    status: 'ACTIVE',
    category: 'DSA / Placements',
    price: '$49.99',
  },
  {
    id: 'TS-012',
    title: 'TYPESCRIPT FUNDAMENTALS',
    instructor: 'Emma Clarke',
    description: 'Type-safe JavaScript development with advanced TypeScript features and patterns.',
    duration: '32h',
    students: '10.8K',
    rating: 4.8,
    status: 'ACTIVE',
    category: 'Programming Languages',
    price: '$39.99',
  },
  {
    id: 'DA-013',
    title: 'DATA ANALYTICS WITH PYTHON',
    instructor: 'Dr. James Anderson',
    description: 'Data manipulation, visualization, and statistical analysis using Pandas and NumPy.',
    duration: '44h',
    students: '12.1K',
    rating: 4.7,
    status: 'ACTIVE',
    category: 'ML & Data Science',
    price: '$79.99',
  },
  {
    id: 'IP-014',
    title: 'INTERVIEW PREPARATION BOOTCAMP',
    instructor: 'Sarah Mitchell',
    description: 'System design, behavioral interviews, and coding challenges for top tech companies.',
    duration: '52h',
    students: '17.6K',
    rating: 4.9,
    status: 'ACTIVE',
    category: 'DSA / Placements',
    price: '$69.99',
  },
  {
    id: 'NG-015',
    title: 'ANGULAR COMPLETE COURSE',
    instructor: 'David Brown',
    description: 'Build scalable single-page applications with Angular, RxJS, and NgRx.',
    duration: '46h',
    students: '8.9K',
    rating: 4.6,
    status: 'ACTIVE',
    category: 'Development',
    price: '$59.99',
  },
  {
    id: 'GO-016',
    title: 'GOLANG BACKEND DEVELOPMENT',
    instructor: 'Kevin Parker',
    description: 'High-performance backend services with Go, gRPC, and microservices architecture.',
    duration: '50h',
    students: '7.4K',
    rating: 4.8,
    status: 'BETA',
    category: 'Development',
    price: '$79.99',
  },
  {
    id: 'TF-017',
    title: 'TERRAFORM & INFRASTRUCTURE',
    instructor: 'Laura Adams',
    description: 'Infrastructure as Code with Terraform, AWS, and automated deployment strategies.',
    duration: '36h',
    students: '6.8K',
    rating: 4.7,
    status: 'ACTIVE',
    category: 'Cloud / DevOps',
    price: '$49.99',
  },
  {
    id: 'NL-018',
    title: 'NATURAL LANGUAGE PROCESSING',
    instructor: 'Dr. Nina Patel',
    description: 'Text processing, sentiment analysis, and language models with BERT and GPT.',
    duration: '54h',
    students: '5.9K',
    rating: 4.8,
    status: 'BETA',
    category: 'ML & Data Science',
    price: '$89.99',
  },
];

const categories = [
  'All Categories',
  'DSA / Placements',
  'Development',
  'ML & Data Science',
  'Cloud / DevOps',
  'Programming Languages',
];

interface AllCoursesProps {
  category?: string;
  onCourseClick?: (courseId: string) => void;
}

export function AllCourses({ category = 'All Categories', onCourseClick }: AllCoursesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(15);

  // Filter courses based on search and category
  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === 'All Categories' || course.category === selectedCategory;

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

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCourses.map((course, index) => (
              <div
                key={course.id}
                className="group relative bg-[#121212]/60 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl overflow-hidden hover:border-[#A5C89E] transition-all duration-300 hover:-translate-y-1"
                onClick={() => onCourseClick?.(course.id)}
              >
                {/* Course Header */}
                <div className="relative h-40 bg-gradient-to-br from-[#A5C89E]/10 to-transparent border-b border-[#A5C89E]/20 p-6">
                  <div className="flex items-start justify-between">
                    <div className="text-xs font-mono text-[#A5C89E] bg-[#A5C89E]/10 px-2 py-1 rounded border border-[#A5C89E]/30">
                      {course.id}
                    </div>
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          course.status === 'BETA' ? 'bg-yellow-500' : 'bg-green-500'
                        } animate-pulse`}
                      ></div>
                      <span className="text-[10px] text-gray-500 font-mono">{course.status}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 text-2xl font-bold text-white/10">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 tracking-wide group-hover:text-[#A5C89E] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[#A5C89E]/80 mb-3 font-mono">{course.instructor}</p>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">
                    {course.description}
                  </p>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-[#A5C89E]">{course.price}</span>
                  </div>

                  {/* Course Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4 font-mono">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{course.students}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>⭐</span>
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  {/* Enroll Button */}
                  <button className="w-full py-3 bg-transparent border border-[#A5C89E]/60 text-[#A5C89E]/90 rounded-lg hover:bg-[#A5C89E]/80 hover:text-black transition-all font-medium text-sm tracking-wide">
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