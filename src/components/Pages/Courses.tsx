import { Clock, Users, ArrowUpRight } from 'lucide-react';

const courses = [
  {
    id: 'PY-001',
    title: 'COMPLETE PYTHON BOOTCAMP',
    instructor: 'Dr. Sarah Johnson',
    description: 'Comprehensive Python training from fundamentals to advanced concepts including web development and data science applications.',
    duration: '40h',
    students: '15.2K',
    rating: 4.8,
    status: 'ACTIVE',
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
    price: '$69.99',
  },
];

interface CoursesProps {
  onCourseClick?: (courseId: string) => void;
}

export function Courses({ onCourseClick }: CoursesProps) {
  return (
    <section id="courses" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-[#A5C89E]/90 text-xs font-mono tracking-widest">// FEATURED COURSES</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#A5C89E]/40 to-transparent"></div>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">COURSE CATALOG</h2>
              <p className="text-gray-400 text-lg max-w-2xl">Expert-led training modules for modern developers</p>
            </div>
            <button className="mt-4 md:mt-0 text-[#A5C89E]/90 text-sm font-mono hover:underline flex items-center space-x-2">
              <span>VIEW_ALL_COURSES</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div
              key={index}
              className="group relative bg-[#121212]/60 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl overflow-hidden hover:border-[#A5C89E] transition-all duration-300 hover:-translate-y-1"
            >
              {/* Course Header */}
              <div className="relative h-40 bg-gradient-to-br from-[#A5C89E]/10 to-transparent border-b border-[#A5C89E]/20 p-6">
                <div className="flex items-start justify-between">
                  <div className="text-xs font-mono text-[#A5C89E] bg-[#A5C89E]/10 px-2 py-1 rounded border border-[#A5C89E]/30">
                    {course.id}
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${course.status === 'BETA' ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></div>
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
                <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">{course.description}</p>

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
                <button
                  className="w-full py-3 bg-transparent border border-[#A5C89E]/60 text-[#A5C89E]/90 rounded-lg hover:bg-[#A5C89E]/80 hover:text-black transition-all font-medium text-sm tracking-wide"
                  onClick={() => onCourseClick?.(course.id)}
                >
                  ENROLL_NOW
                </button>
              </div>

              {/* Hover Accent */}
              <div className="absolute top-0 right-0 w-0 h-0.5 bg-[#A5C89E]/80 group-hover:w-full transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}