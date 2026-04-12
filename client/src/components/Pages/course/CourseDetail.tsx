import { API_URL } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Clock, Users, Star, ChevronDown, ChevronUp, PlayCircle, FileText, Award, BookOpen } from 'lucide-react';

interface CourseDetailProps {
  onBack: () => void;
  onEnroll?: (courseId: string) => void;
}

export function CourseDetail({ onBack, onEnroll }: CourseDetailProps) {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/courses/${id}`);
        const data = response.data.course;
        
        // Map backend data to frontend structure to keep UI the same
        const mappedCourse = {
          id: data.Course_Code || `ID-${data.CourseID}`,
          dbId: data.CourseID,
          title: data.Title,
          instructor: data.user?.name || data.Instructor_Name || 'Instructor Name',
          instructorTitle: data.Instructor_Title || 'Senior Instructor',
          instructorBio: data.Instructor_Bio || 'Experienced educator with expertise in this field.',
          instructorImage: data.user?.picture || data.Instructor_Image || 'https://images.unsplash.com/photo-1660463531472-a86bb8f9f48e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbnN0cnVjdG9yJTIwdGVhY2hpbmd8ZW58MXx8fHwxNzY4OTAxODYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
          description: data.Description,
          longDescription: data.Overview || data.Description,
          duration: data.Total_Hours ? `${data.Total_Hours}h` : '40h',
          students: data.Students_Count ? `${data.Students_Count / 1000}K` : '10.5K',
          rating: data.Rating || 4.7,
          totalRatings: data.Total_Ratings || 2500,
          status: data.Status || 'ACTIVE',
          category: data.Category || 'General',
          price: `$${data.Price}`,
          originalPrice: data.Old_Price ? `$${data.Old_Price}` : '$99.99',
          thumbnail: data.Thumbnail || 'https://res.cloudinary.com/dp1li5tkd/image/upload/v1775459948/eg8mybzg20bdnsau78vs.jpg',
          learningOutcomes: data.Learning_Outcomes || [
            'Understand core concepts',
            'Apply practical techniques',
            'Build real-world projects',
            'Master advanced topics',
          ],
          modules: [
            {
              title: 'Course Contents',
              lessons: data.contents?.map((c: any) => ({
                title: c.title,
                duration: c.duration || '20 min',
                description: c.description
              })) || []
            }
          ]
        };
        setCourse(mappedCourse);
      } catch (err) {
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#A5C89E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-400 mb-4">{error || 'Course not found'}</p>
        <button onClick={onBack} className="text-[#A5C89E] hover:underline">← Back to Catalog</button>
      </div>
    );
  }

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
            <button className="hidden lg:inline-flex px-8 py-4 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-semibold text-sm tracking-wide" onClick={() => onEnroll?.(course.dbId)}>
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
          <button className="w-full px-8 py-4 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-semibold text-sm tracking-wide" onClick={() => onEnroll?.(course.dbId)}>
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
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {course.longDescription}
                </p>
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