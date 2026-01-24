import { useState } from 'react';
import { Clock, Users, Star, ChevronDown, ChevronUp, PlayCircle, FileText, Award, BookOpen } from 'lucide-react';

interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
  onEnroll?: (courseId: string) => void;
}

const courseData: Record<string, any> = {
  'PY-001': {
    id: 'PY-001',
    title: 'COMPLETE PYTHON BOOTCAMP',
    instructor: 'Dr. Sarah Johnson',
    instructorTitle: 'Senior Software Engineer at Google',
    instructorBio: 'Dr. Sarah Johnson has over 15 years of experience in software development and education. She holds a PhD in Computer Science and has taught programming to over 50,000 students worldwide.',
    instructorImage: 'https://images.unsplash.com/photo-1660463531472-a86bb8f9f48e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbnN0cnVjdG9yJTIwdGVhY2hpbmd8ZW58MXx8fHwxNzY4OTAxODYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Comprehensive Python training from fundamentals to advanced concepts including web development and data science applications.',
    longDescription: 'This comprehensive Python bootcamp takes you from absolute beginner to advanced Python developer. Master Python fundamentals, object-oriented programming, web development with Django and Flask, data science with NumPy and Pandas, and automation scripting. Build real-world projects and gain practical experience.',
    duration: '40h',
    students: '15.2K',
    rating: 4.8,
    totalRatings: 3420,
    status: 'ACTIVE',
    category: 'Programming Languages',
    price: '$49.99',
    originalPrice: '$99.99',
    thumbnail: 'https://images.unsplash.com/photo-1759884248009-92c5e957708e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBjb3Vyc2UlMjBjb2Rpbmd8ZW58MXx8fHwxNzY4OTkyMzIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    learningOutcomes: [
      'Master Python syntax and fundamentals',
      'Build web applications with Django and Flask',
      'Perform data analysis with Pandas and NumPy',
      'Automate tasks with Python scripting',
      'Understand object-oriented programming',
      'Work with databases and APIs',
    ],
    modules: [
      {
        title: 'Python Fundamentals',
        lessons: [
          { title: 'Introduction to Python', duration: '15 min' },
          { title: 'Variables and Data Types', duration: '25 min' },
          { title: 'Control Flow and Loops', duration: '30 min' },
          { title: 'Functions and Modules', duration: '35 min' },
        ],
      },
      {
        title: 'Object-Oriented Programming',
        lessons: [
          { title: 'Classes and Objects', duration: '40 min' },
          { title: 'Inheritance and Polymorphism', duration: '35 min' },
          { title: 'Encapsulation and Abstraction', duration: '30 min' },
        ],
      },
      {
        title: 'Web Development with Django',
        lessons: [
          { title: 'Django Setup and Configuration', duration: '20 min' },
          { title: 'Models and Databases', duration: '45 min' },
          { title: 'Views and Templates', duration: '50 min' },
          { title: 'User Authentication', duration: '40 min' },
        ],
      },
      {
        title: 'Data Science Basics',
        lessons: [
          { title: 'Introduction to NumPy', duration: '30 min' },
          { title: 'Data Analysis with Pandas', duration: '45 min' },
          { title: 'Data Visualization', duration: '35 min' },
        ],
      },
    ],
  },
  'FS-002': {
    id: 'FS-002',
    title: 'FULL STACK DEVELOPMENT',
    instructor: 'Mark Thompson',
    instructorTitle: 'Lead Developer at Meta',
    instructorBio: 'Mark Thompson is a full-stack developer with 12 years of experience building scalable web applications. He has worked with top tech companies and trained thousands of developers.',
    instructorImage: 'https://images.unsplash.com/photo-1660463531472-a86bb8f9f48e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbnN0cnVjdG9yJTIwdGVhY2hpbmd8ZW58MXx8fHwxNzY4OTAxODYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Production-grade web applications using React, Node.js, and MongoDB with industry best practices.',
    longDescription: 'Learn to build modern, production-ready full-stack applications from scratch. Master React for frontend development, Node.js and Express for backend APIs, MongoDB for databases, and deploy your applications to the cloud. Gain hands-on experience with real-world projects.',
    duration: '60h',
    students: '12.8K',
    rating: 4.9,
    totalRatings: 2890,
    status: 'ACTIVE',
    category: 'Development',
    price: '$79.99',
    originalPrice: '$149.99',
    thumbnail: 'https://images.unsplash.com/photo-1759884248009-92c5e957708e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBjb3Vyc2UlMjBjb2Rpbmd8ZW58MXx8fHwxNzY4OTkyMzIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    learningOutcomes: [
      'Build responsive UIs with React and modern JavaScript',
      'Create RESTful APIs with Node.js and Express',
      'Design and implement MongoDB databases',
      'Implement user authentication and authorization',
      'Deploy applications to cloud platforms',
      'Follow industry best practices and patterns',
    ],
    modules: [
      {
        title: 'Frontend Development with React',
        lessons: [
          { title: 'React Fundamentals', duration: '45 min' },
          { title: 'State Management', duration: '50 min' },
          { title: 'React Hooks', duration: '40 min' },
          { title: 'Routing with React Router', duration: '35 min' },
        ],
      },
      {
        title: 'Backend Development with Node.js',
        lessons: [
          { title: 'Node.js Basics', duration: '30 min' },
          { title: 'Express Framework', duration: '45 min' },
          { title: 'RESTful API Design', duration: '50 min' },
          { title: 'Middleware and Error Handling', duration: '40 min' },
        ],
      },
      {
        title: 'Database with MongoDB',
        lessons: [
          { title: 'MongoDB Fundamentals', duration: '35 min' },
          { title: 'Mongoose ODM', duration: '40 min' },
          { title: 'Data Modeling', duration: '45 min' },
        ],
      },
      {
        title: 'Authentication & Deployment',
        lessons: [
          { title: 'JWT Authentication', duration: '50 min' },
          { title: 'Security Best Practices', duration: '40 min' },
          { title: 'Deployment to Cloud', duration: '55 min' },
        ],
      },
    ],
  },
  'DS-003': {
    id: 'DS-003',
    title: 'DATA STRUCTURES & ALGORITHMS',
    instructor: 'Prof. Michael Chen',
    instructorTitle: 'Professor of Computer Science at Stanford',
    instructorBio: 'Prof. Michael Chen is a renowned computer science educator and researcher with expertise in algorithms and competitive programming. He has published numerous papers and coached winning ICPC teams.',
    instructorImage: 'https://images.unsplash.com/photo-1660463531472-a86bb8f9f48e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbnN0cnVjdG9yJTIwdGVhY2hpbmd8ZW58MXx8fHwxNzY4OTAxODYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Advanced DSA concepts with coding interview preparation and competitive programming techniques.',
    longDescription: 'Master data structures and algorithms essential for technical interviews and competitive programming. Learn arrays, linked lists, trees, graphs, dynamic programming, and advanced algorithms. Practice with real interview questions from top tech companies.',
    duration: '50h',
    students: '18.4K',
    rating: 4.7,
    totalRatings: 4120,
    status: 'ACTIVE',
    category: 'DSA / Placements',
    price: '$59.99',
    originalPrice: '$119.99',
    thumbnail: 'https://images.unsplash.com/photo-1759884248009-92c5e957708e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBjb3Vyc2UlMjBjb2Rpbmd8ZW58MXx8fHwxNzY4OTkyMzIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    learningOutcomes: [
      'Master fundamental data structures',
      'Understand algorithm complexity analysis',
      'Solve coding interview problems efficiently',
      'Apply dynamic programming techniques',
      'Implement graph algorithms',
      'Optimize code performance',
    ],
    modules: [
      {
        title: 'Arrays and Strings',
        lessons: [
          { title: 'Array Fundamentals', duration: '25 min' },
          { title: 'Two Pointer Technique', duration: '30 min' },
          { title: 'Sliding Window Problems', duration: '35 min' },
        ],
      },
      {
        title: 'Linked Lists and Stacks',
        lessons: [
          { title: 'Linked List Operations', duration: '40 min' },
          { title: 'Stack and Queue', duration: '35 min' },
          { title: 'Advanced List Problems', duration: '45 min' },
        ],
      },
      {
        title: 'Trees and Graphs',
        lessons: [
          { title: 'Binary Trees', duration: '50 min' },
          { title: 'Tree Traversals', duration: '40 min' },
          { title: 'Graph Algorithms', duration: '55 min' },
        ],
      },
      {
        title: 'Dynamic Programming',
        lessons: [
          { title: 'DP Fundamentals', duration: '45 min' },
          { title: 'Common DP Patterns', duration: '50 min' },
          { title: 'Advanced DP Problems', duration: '60 min' },
        ],
      },
    ],
  },
};

// Default course data for courses not in the detailed list
const getDefaultCourseData = (courseId: string) => ({
  id: courseId,
  title: 'COURSE TITLE',
  instructor: 'Instructor Name',
  instructorTitle: 'Senior Instructor',
  instructorBio: 'Experienced educator with expertise in this field.',
  instructorImage: 'https://images.unsplash.com/photo-1660463531472-a86bb8f9f48e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbnN0cnVjdG9yJTIwdGVhY2hpbmd8ZW58MXx8fHwxNzY4OTAxODYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  description: 'Learn the fundamentals and advanced concepts of this subject.',
  longDescription: 'This comprehensive course covers everything you need to know about this topic. Gain practical skills and hands-on experience through real-world projects.',
  duration: '40h',
  students: '10.5K',
  rating: 4.7,
  totalRatings: 2500,
  status: 'ACTIVE',
  category: 'General',
  price: '$54.99',
  originalPrice: '$99.99',
  thumbnail: 'https://images.unsplash.com/photo-1759884248009-92c5e957708e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBjb3Vyc2UlMjBjb2Rpbmd8ZW58MXx8fHwxNzY4OTkyMzIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  learningOutcomes: [
    'Understand core concepts',
    'Apply practical techniques',
    'Build real-world projects',
    'Master advanced topics',
  ],
  modules: [
    {
      title: 'Introduction',
      lessons: [
        { title: 'Getting Started', duration: '20 min' },
        { title: 'Basic Concepts', duration: '30 min' },
      ],
    },
    {
      title: 'Advanced Topics',
      lessons: [
        { title: 'Advanced Techniques', duration: '45 min' },
        { title: 'Best Practices', duration: '35 min' },
      ],
    },
  ],
});

export function CourseDetail({ courseId, onBack, onEnroll }: CourseDetailProps) {
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);

  const course = courseData[courseId] || getDefaultCourseData(courseId);

  const toggleModule = (index: number) => {
    setExpandedModules((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating)
                ? 'fill-[#A5C89E] text-[#A5C89E]'
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="relative max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center space-x-2 text-gray-400 hover:text-[#A5C89E] transition-colors group"
        >
          <span className="text-sm font-mono">← BACK TO COURSES</span>
        </button>

        {/* Course Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            {/* Category Badge */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-2 h-2 bg-[#A5C89E]/80 rounded-full animate-pulse"></div>
              <span className="text-[#A5C89E]/90 text-xs font-mono tracking-widest">
                {course.category}
              </span>
            </div>

            {/* Course Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              {course.title}
            </h1>

            {/* Course Description */}
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              {course.description}
            </p>

            {/* Rating & Students */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center space-x-2">
                {renderStars(course.rating)}
                <span className="text-white font-semibold">{course.rating}</span>
                <span className="text-gray-500 text-sm">
                  ({course.totalRatings.toLocaleString()} ratings)
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Users className="w-5 h-5" />
                <span className="font-mono text-sm">{course.students} students enrolled</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-sm">{course.duration} total</span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-bold text-[#A5C89E]">{course.price}</span>
              </div>
            </div>

            {/* Enroll Button - Desktop */}
            <button className="hidden lg:inline-flex px-8 py-4 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-semibold text-sm tracking-wide" onClick={() => onEnroll?.(courseId)}>
              ENROLL NOW
            </button>
          </div>

          {/* Course Thumbnail */}
          <div className="lg:col-span-1">
            <div className="relative rounded-xl overflow-hidden border border-[#A5C89E]/20">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-64 lg:h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-xs font-mono text-[#A5C89E] bg-[#A5C89E]/10 px-2 py-1 rounded border border-[#A5C89E]/30 inline-block">
                  {course.id}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enroll Button - Mobile */}
        <div className="lg:hidden mb-12">
          <button className="w-full px-8 py-4 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-semibold text-sm tracking-wide" onClick={() => onEnroll?.(courseId)}>
            ENROLL NOW
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Course Overview */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <BookOpen className="w-5 h-5 text-[#A5C89E]" />
                <h2 className="text-2xl font-bold text-white">Course Overview</h2>
              </div>
              <div className="bg-[#121212]/60 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl p-6">
                <p className="text-gray-300 leading-relaxed mb-6">
                  {course.longDescription}
                </p>
                {course.learningOutcomes && (
                  <>
                    <h3 className="text-white font-semibold mb-4">What you'll learn:</h3>
                    <ul className="space-y-3">
                      {course.learningOutcomes.map((outcome: string, index: number) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Award className="w-5 h-5 text-[#A5C89E] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-400">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Course Content */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-5 h-5 text-[#A5C89E]" />
                <h2 className="text-2xl font-bold text-white">Course Content</h2>
              </div>
              <div className="space-y-3">
                {course.modules?.flatMap((module: any) => module.lessons).map((lesson: any, index: number) => (
                  <div
                    key={index}
                    className="bg-[#121212]/60 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl px-6 py-4 hover:bg-[#A5C89E]/5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-[#A5C89E]/10 rounded-lg flex items-center justify-center border border-[#A5C89E]/30 flex-shrink-0">
                            <span className="text-[#A5C89E] text-sm font-mono">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <h3 className="text-white font-semibold">{lesson.title}</h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed ml-11">
                          {lesson.description || 'Learn the fundamentals and master the key concepts in this lesson.'}
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
            </div>
          </div>

          {/* Right Column - Instructor */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-32">
              <h2 className="text-2xl font-bold text-white mb-6">Instructor</h2>
              <div className="bg-[#121212]/60 backdrop-blur-sm border border-[#A5C89E]/20 rounded-xl p-6">
                {/* Instructor Image */}
                <div className="mb-4">
                  <img
                    src={course.instructorImage}
                    alt={course.instructor}
                    className="w-24 h-24 rounded-full object-cover border-2 border-[#A5C89E]/30"
                  />
                </div>

                {/* Instructor Info */}
                <h3 className="text-xl font-bold text-white mb-2">{course.instructor}</h3>
                <p className="text-[#A5C89E] text-sm mb-4 font-mono">{course.instructorTitle}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{course.instructorBio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}