import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserPlus,
  FileText,
  BookOpen,
  GraduationCap,
  Award,
  MessageSquare,
  Menu,
  X,
  Eye,
  Trash2,
  Check,
  XCircle,
  TrendingUp,
  Search,
  Filter,
  ChevronLeft,
  AlertTriangle,
} from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

type ActiveSection =
  | 'overview'
  | 'users'
  | 'instructor-applications'
  | 'expert-applications'
  | 'articles-approval'
  | 'courses-approval'
  | 'instructors'
  | 'experts'
  | 'reports'
  | 'feedback';

type DetailView =
  | { type: 'none' }
  | { type: 'user'; id: string }
  | { type: 'instructor-app'; id: string }
  | { type: 'expert-app'; id: string }
  | { type: 'article'; id: string }
  | { type: 'course'; id: string }
  | { type: 'instructor-profile'; id: string }
  | { type: 'expert-profile'; id: string };

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [detailView, setDetailView] = useState<DetailView>({ type: 'none' });
  const [searchQuery, setSearchQuery] = useState('');

  // Standard background component
  const BackgroundEffects = () => (
    <>
      {/* Grid Background - Same as Homepage */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(128, 128, 128, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(128, 128, 128, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Noise Texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' /%3E%3C/svg%3E")`,
        }}
      />

      {/* Glowing Dots */}
      <div className="fixed top-1/4 left-1/4 w-2 h-2 bg-[#ABDADC] rounded-full blur-sm opacity-40 animate-pulse pointer-events-none z-0"></div>
      <div className="fixed top-1/3 right-1/3 w-2 h-2 bg-[#ABDADC] rounded-full blur-sm opacity-30 animate-pulse pointer-events-none z-0"></div>
      <div className="fixed top-2/3 left-1/2 w-2 h-2 bg-[#ABDADC] rounded-full blur-sm opacity-50 animate-pulse pointer-events-none z-0"></div>
    </>
  );

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'instructor-applications', label: 'Instructor Applications', icon: UserPlus },
    { id: 'expert-applications', label: 'Expert Applications', icon: UserCheck },
    { id: 'articles-approval', label: 'Articles Approval', icon: FileText },
    { id: 'courses-approval', label: 'Courses Approval', icon: BookOpen },
    { id: 'instructors', label: 'Instructors', icon: GraduationCap },
    { id: 'experts', label: 'Experts', icon: Award },
    { id: 'reports', label: 'Article Reports', icon: AlertTriangle },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  ] as const;

  // Mock data
  const stats = [
    { label: 'Total Users', value: '12,847', icon: Users, trend: '+12.5%', color: '#A5C89E' },
    {
      label: 'Total Instructors',
      value: '324',
      icon: GraduationCap,
      trend: '+8.2%',
      color: '#A5C89E',
    },
    { label: 'Total Experts', value: '156', icon: Award, trend: '+5.1%', color: '#A5C89E' },
    { label: 'Total Articles', value: '2,891', icon: FileText, trend: '+15.3%', color: '#A5C89E' },
    { label: 'Total Courses', value: '478', icon: BookOpen, trend: '+10.7%', color: '#A5C89E' },
  ];

  const users = [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      role: 'Student',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Sarah Williams',
      email: 'sarah.williams@email.com',
      role: 'Instructor',
      status: 'Active',
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      role: 'Expert',
      status: 'Active',
    },
    {
      id: '4',
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      role: 'Student',
      status: 'Inactive',
    },
    {
      id: '5',
      name: 'James Brown',
      email: 'james.brown@email.com',
      role: 'Instructor',
      status: 'Active',
    },
  ];

  const instructorApplications = [
    {
      id: '1',
      name: 'David Martinez',
      email: 'david.m@email.com',
      expertise: 'Web Development',
      appliedDate: '2026-01-15',
      status: 'Pending',
    },
    {
      id: '2',
      name: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      expertise: 'Data Science',
      appliedDate: '2026-01-18',
      status: 'Pending',
    },
    {
      id: '3',
      name: 'Robert Taylor',
      email: 'robert.t@email.com',
      expertise: 'Mobile Development',
      appliedDate: '2026-01-20',
      status: 'Pending',
    },
  ];

  const expertApplications = [
    {
      id: '1',
      name: 'Dr. Emily Wilson',
      email: 'emily.w@email.com',
      expertise: 'Machine Learning',
      appliedDate: '2026-01-16',
      status: 'Pending',
    },
    {
      id: '2',
      name: 'Prof. John Smith',
      email: 'john.s@email.com',
      expertise: 'Algorithms',
      appliedDate: '2026-01-19',
      status: 'Pending',
    },
  ];

  const pendingArticles = [
    {
      id: '1',
      title: 'Introduction to React Hooks',
      author: 'Sarah Williams',
      category: 'Development',
      submittedDate: '2026-01-20',
      status: 'Pending',
    },
    {
      id: '2',
      title: 'Understanding Neural Networks',
      author: 'Dr. Emily Wilson',
      category: 'AI / ML',
      submittedDate: '2026-01-19',
      status: 'Pending',
    },
    {
      id: '3',
      title: 'Advanced Data Structures',
      author: 'Prof. John Smith',
      category: 'DSA',
      submittedDate: '2026-01-18',
      status: 'Pending',
    },
  ];

  const pendingCourses = [
    {
      id: '1',
      title: 'Full Stack Web Development Bootcamp',
      instructor: 'David Martinez',
      category: 'Development',
      submittedDate: '2026-01-17',
      status: 'Pending',
    },
    {
      id: '2',
      title: 'Machine Learning A-Z',
      instructor: 'Lisa Anderson',
      category: 'ML & Data Science',
      submittedDate: '2026-01-16',
      status: 'Pending',
    },
  ];

  const instructors = [
    {
      id: '1',
      name: 'Sarah Williams',
      email: 'sarah.williams@email.com',
      courses: 12,
      students: 3420,
      rating: 4.8,
    },
    {
      id: '2',
      name: 'James Brown',
      email: 'james.brown@email.com',
      courses: 8,
      students: 2150,
      rating: 4.6,
    },
    {
      id: '3',
      name: 'David Martinez',
      email: 'david.m@email.com',
      courses: 5,
      students: 890,
      rating: 4.9,
    },
  ];

  const experts = [
    {
      id: '1',
      name: 'Dr. Emily Wilson',
      email: 'emily.w@email.com',
      articles: 45,
      followers: 12500,
      rating: 4.9,
    },
    {
      id: '2',
      name: 'Prof. John Smith',
      email: 'john.s@email.com',
      articles: 38,
      followers: 9800,
      rating: 4.7,
    },
  ];

  const feedbackEntries = [
    {
      id: '1',
      user: 'Alex Johnson',
      subject: 'Great platform!',
      message: 'I love the courses and the UI is amazing. Keep up the good work!',
      date: '2026-01-21',
      status: 'New',
    },
    {
      id: '2',
      user: 'Emma Davis',
      subject: 'Bug report',
      message: 'I found a bug in the payment section. The checkout page freezes sometimes.',
      date: '2026-01-20',
      status: 'In Progress',
    },
    {
      id: '3',
      user: 'Mike Chen',
      subject: 'Feature request',
      message: 'It would be great to have dark mode toggle in the settings.',
      date: '2026-01-19',
      status: 'Resolved',
    },
  ];

  const articleReports = [
    {
      id: '1',
      articleId: 'ART-001',
      articleTitle: 'Getting Started with React Hooks',
      reportType: 'Inappropriate Content',
      description: 'This article contains misleading information about React Hooks lifecycle methods. The examples shown are outdated and could confuse beginners.',
      reportedBy: 'Sarah Miller',
      reportedAt: '2026-01-23',
      status: 'Pending',
    },
    {
      id: '2',
      articleId: 'ART-002',
      articleTitle: 'Understanding TypeScript Generics',
      reportType: 'Technical Inaccuracy',
      description: 'The code example in section 3 has syntax errors and doesn\'t compile. The generic constraints are incorrectly implemented.',
      reportedBy: 'David Chen',
      reportedAt: '2026-01-23',
      status: 'Pending',
    },
    {
      id: '3',
      articleId: 'ART-004',
      articleTitle: 'Building Scalable Node.js Applications',
      reportType: 'Plagiarism',
      description: 'Content appears to be copied from another source without proper attribution. Large sections match verbatim from a Medium article.',
      reportedBy: 'Emily Rodriguez',
      reportedAt: '2026-01-22',
      status: 'Under Review',
    },
    {
      id: '4',
      articleId: 'ART-004',
      articleTitle: 'Building Scalable Node.js Applications',
      reportType: 'Outdated Information',
      description: 'The article references deprecated Node.js APIs that are no longer supported in v18+. This could mislead developers.',
      reportedBy: 'Michael Johnson',
      reportedAt: '2026-01-22',
      status: 'Pending',
    },
    {
      id: '5',
      articleId: 'ART-001',
      articleTitle: 'Getting Started with React Hooks',
      reportType: 'Spam',
      description: 'Multiple promotional links without proper context. The article seems to be promoting a paid course rather than providing educational content.',
      reportedBy: 'Jennifer Wang',
      reportedAt: '2026-01-21',
      status: 'Resolved',
    },
    {
      id: '6',
      articleId: 'ART-007',
      articleTitle: 'CSS Grid Layout Mastery',
      reportType: 'Broken Code Examples',
      description: 'All code examples in the article are missing CSS properties and don\'t render correctly when tested.',
      reportedBy: 'Alex Thompson',
      reportedAt: '2026-01-21',
      status: 'Under Review',
    },
    {
      id: '7',
      articleId: 'ART-009',
      articleTitle: 'Advanced Python Decorators',
      reportType: 'Misleading Title',
      description: 'The article title promises advanced content but only covers basic decorator concepts. This is misleading for intermediate/advanced users.',
      reportedBy: 'Lisa Anderson',
      reportedAt: '2026-01-20',
      status: 'Pending',
    },
    {
      id: '8',
      articleId: 'ART-002',
      articleTitle: 'Understanding TypeScript Generics',
      reportType: 'Inappropriate Content',
      description: 'Contains offensive language in the comments section that hasn\'t been moderated.',
      reportedBy: 'Robert Kim',
      reportedAt: '2026-01-20',
      status: 'Resolved',
    },
  ];

  const handleApprove = (type: string, id: string) => {
    alert(`Approved ${type} #${id}`);
  };

  const handleReject = (type: string, id: string) => {
    alert(`Rejected ${type} #${id}`);
  };

  const handleDelete = (type: string, id: string) => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      alert(`Deleted ${type} #${id}`);
    }
  };

  const handleViewDetails = (view: DetailView) => {
    setDetailView(view);
  };

  const handleBackToList = () => {
    setDetailView({ type: 'none' });
  };

  // Render detail views
  if (detailView.type === 'article' && detailView.id) {
    const article = pendingArticles.find((a) => a.id === detailView.id);
    if (article) {
      return (
        <div className="min-h-screen bg-[#0b0b0b] text-white">
          {/* Grid Background - Same as Homepage */}
          <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(128, 128, 128, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(128, 128, 128, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />

          {/* Noise Texture */}
          <div
            className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' /%3E%3C/svg%3E")`,
            }}
          />

          {/* Glowing Dots */}
          <div className="fixed top-1/4 left-1/4 w-2 h-2 bg-[#ABDADC] rounded-full blur-sm opacity-40 animate-pulse pointer-events-none z-0"></div>
          <div className="fixed top-1/3 right-1/3 w-2 h-2 bg-[#ABDADC] rounded-full blur-sm opacity-30 animate-pulse pointer-events-none z-0"></div>

          {/* Header */}
          <div className="border-b border-[#A5C89E]/20 bg-[#121212]/80 backdrop-blur-xl relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
              <button
                onClick={handleBackToList}
                className="text-[#A5C89E] hover:text-[#A5C89E]/80 text-sm mb-3 flex items-center gap-2 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Articles
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Article Review</h1>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
            <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-4">{article.title}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <span>Author: {article.author}</span>
                  <span>Category: {article.category}</span>
                  <span>Submitted: {article.submittedDate}</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-gray-300 leading-relaxed">
                  This is a comprehensive guide to React Hooks. In this article, we'll explore
                  useState, useEffect, useContext, and other essential hooks. You'll learn how to
                  manage state effectively, handle side effects, and build powerful React
                  applications using modern patterns.
                </p>
                <p className="text-gray-300 leading-relaxed mt-4">
                  React Hooks revolutionized the way we write React components. They allow us to
                  use state and other React features without writing a class. This makes our code
                  more readable and easier to maintain.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleApprove('article', article.id)}
                  className="px-6 py-3 bg-[#A5C89E]/20 border border-[#A5C89E]/50 text-[#A5C89E] rounded-xl hover:bg-[#A5C89E]/30 transition-all font-medium flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Approve Article
                </button>
                <button
                  onClick={() => handleReject('article', article.id)}
                  className="px-6 py-3 bg-[#121212]/80 border border-gray-600/50 text-gray-300 rounded-xl hover:bg-[#121212] transition-all font-medium flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Article
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  if (detailView.type === 'course' && detailView.id) {
    const course = pendingCourses.find((c) => c.id === detailView.id);
    if (course) {
      return (
        <div className="min-h-screen bg-[#0b0b0b] text-white">
          <BackgroundEffects />

          <div className="border-b border-[#A5C89E]/20 bg-[#121212]/80 backdrop-blur-xl relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
              <button
                onClick={handleBackToList}
                className="text-[#A5C89E] hover:text-[#A5C89E]/80 text-sm mb-3 flex items-center gap-2 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Courses
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Course Review</h1>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
            <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-4">{course.title}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <span>Instructor: {course.instructor}</span>
                  <span>Category: {course.category}</span>
                  <span>Submitted: {course.submittedDate}</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-[#A5C89E]">Course Description</h3>
                <p className="text-gray-300 leading-relaxed">
                  A comprehensive bootcamp covering frontend and backend development. Learn HTML,
                  CSS, JavaScript, React, Node.js, Express, MongoDB, and deploy full-stack
                  applications.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-[#A5C89E]">Course Content</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Introduction to Web Development</li>
                  <li>• HTML & CSS Fundamentals</li>
                  <li>• JavaScript Essentials</li>
                  <li>• React.js Complete Guide</li>
                  <li>• Backend with Node.js and Express</li>
                  <li>• Database with MongoDB</li>
                  <li>• Deployment and DevOps</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleApprove('course', course.id)}
                  className="px-6 py-3 bg-[#A5C89E]/20 border border-[#A5C89E]/50 text-[#A5C89E] rounded-xl hover:bg-[#A5C89E]/30 transition-all font-medium flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Approve Course
                </button>
                <button
                  onClick={() => handleReject('course', course.id)}
                  className="px-6 py-3 bg-[#121212]/80 border border-gray-600/50 text-gray-300 rounded-xl hover:bg-[#121212] transition-all font-medium flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Course
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  if (detailView.type === 'instructor-app' && detailView.id) {
    const application = instructorApplications.find((a) => a.id === detailView.id);
    if (application) {
      return (
        <div className="min-h-screen bg-[#0b0b0b] text-white">
          <BackgroundEffects />

          <div className="border-b border-[#A5C89E]/20 bg-[#121212]/80 backdrop-blur-xl relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
              <button
                onClick={handleBackToList}
                className="text-[#A5C89E] hover:text-[#A5C89E]/80 text-sm mb-3 flex items-center gap-2 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Applications
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Instructor Application</h1>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
            <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{application.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 text-gray-300">{application.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Expertise:</span>
                    <span className="ml-2 text-gray-300">{application.expertise}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Applied Date:</span>
                    <span className="ml-2 text-gray-300">{application.appliedDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className="ml-2 text-yellow-400">{application.status}</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-[#A5C89E]">About</h3>
                <p className="text-gray-300 leading-relaxed">
                  Experienced full-stack developer with 8+ years in web development. Specialized in
                  React, Node.js, and modern JavaScript frameworks. Passionate about teaching and
                  helping others learn to code.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-[#A5C89E]">Experience</h3>
                <p className="text-gray-300">Senior Developer at Tech Corp (5 years)</p>
                <p className="text-gray-300">Freelance Instructor (3 years)</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleApprove('instructor application', application.id)}
                  className="px-6 py-3 bg-[#A5C89E]/20 border border-[#A5C89E]/50 text-[#A5C89E] rounded-xl hover:bg-[#A5C89E]/30 transition-all font-medium flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Approve Application
                </button>
                <button
                  onClick={() => handleReject('instructor application', application.id)}
                  className="px-6 py-3 bg-[#121212]/80 border border-gray-600/50 text-gray-300 rounded-xl hover:bg-[#121212] transition-all font-medium flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Application
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  if (detailView.type === 'expert-app' && detailView.id) {
    const application = expertApplications.find((a) => a.id === detailView.id);
    if (application) {
      return (
        <div className="min-h-screen bg-[#0b0b0b] text-white">
          <BackgroundEffects />

          <div className="border-b border-[#A5C89E]/20 bg-[#121212]/80 backdrop-blur-xl relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
              <button
                onClick={handleBackToList}
                className="text-[#A5C89E] hover:text-[#A5C89E]/80 text-sm mb-3 flex items-center gap-2 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Applications
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Expert Application</h1>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
            <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{application.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 text-gray-300">{application.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Expertise:</span>
                    <span className="ml-2 text-gray-300">{application.expertise}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Applied Date:</span>
                    <span className="ml-2 text-gray-300">{application.appliedDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className="ml-2 text-yellow-400">{application.status}</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-[#A5C89E]">About</h3>
                <p className="text-gray-300 leading-relaxed">
                  Ph.D. in Machine Learning from Stanford University. Published over 50 research
                  papers in top-tier conferences. Experienced in teaching ML and AI at university
                  level.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-[#A5C89E]">Credentials</h3>
                <p className="text-gray-300">Ph.D. Machine Learning - Stanford University</p>
                <p className="text-gray-300">Associate Professor at MIT</p>
                <p className="text-gray-300">50+ Research Publications</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleApprove('expert application', application.id)}
                  className="px-6 py-3 bg-[#A5C89E]/20 border border-[#A5C89E]/50 text-[#A5C89E] rounded-xl hover:bg-[#A5C89E]/30 transition-all font-medium flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Approve Application
                </button>
                <button
                  onClick={() => handleReject('expert application', application.id)}
                  className="px-6 py-3 bg-[#121212]/80 border border-gray-600/50 text-gray-300 rounded-xl hover:bg-[#121212] transition-all font-medium flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Application
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  if (detailView.type === 'instructor-profile' && detailView.id) {
    const instructor = instructors.find((i) => i.id === detailView.id);
    if (instructor) {
      return (
        <div className="min-h-screen bg-[#0b0b0b] text-white">
          <BackgroundEffects />

          <div className="border-b border-[#A5C89E]/20 bg-[#121212]/80 backdrop-blur-xl relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
              <button
                onClick={handleBackToList}
                className="text-[#A5C89E] hover:text-[#A5C89E]/80 text-sm mb-3 flex items-center gap-2 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Instructors
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Instructor Profile</h1>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
            <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-[#A5C89E]/20 border border-[#A5C89E]/50 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-12 h-12 text-[#A5C89E]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{instructor.name}</h2>
                  <p className="text-gray-400">{instructor.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#0b0b0b]/80 border border-[#A5C89E]/20 p-6 rounded-xl">
                  <p className="text-gray-500 text-sm mb-1">Courses</p>
                  <p className="text-3xl font-bold text-[#A5C89E]">{instructor.courses}</p>
                </div>
                <div className="bg-[#0b0b0b]/80 border border-[#A5C89E]/20 p-6 rounded-xl">
                  <p className="text-gray-500 text-sm mb-1">Students</p>
                  <p className="text-3xl font-bold text-[#A5C89E]">
                    {instructor.students.toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#0b0b0b]/80 border border-[#A5C89E]/20 p-6 rounded-xl">
                  <p className="text-gray-500 text-sm mb-1">Rating</p>
                  <p className="text-3xl font-bold text-[#A5C89E]">{instructor.rating} ★</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 text-[#A5C89E]">Published Courses</h3>
                <div className="space-y-3">
                  <div className="bg-[#0b0b0b]/80 border border-[#A5C89E]/10 p-4 rounded-xl">
                    <p className="text-gray-200">Full Stack Web Development</p>
                  </div>
                  <div className="bg-[#0b0b0b]/80 border border-[#A5C89E]/10 p-4 rounded-xl">
                    <p className="text-gray-200">React Advanced Patterns</p>
                  </div>
                  <div className="bg-[#0b0b0b]/80 border border-[#A5C89E]/10 p-4 rounded-xl">
                    <p className="text-gray-200">JavaScript ES6+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  if (detailView.type === 'expert-profile' && detailView.id) {
    const expert = experts.find((e) => e.id === detailView.id);
    if (expert) {
      return (
        <div className="min-h-screen bg-[#0b0b0b] text-white">
          <BackgroundEffects />

          <div className="border-b border-[#A5C89E]/20 bg-[#121212]/80 backdrop-blur-xl relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
              <button
                onClick={handleBackToList}
                className="text-[#A5C89E] hover:text-[#A5C89E]/80 text-sm mb-3 flex items-center gap-2 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Experts
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Expert Profile</h1>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
            <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-[#A5C89E]/20 border border-[#A5C89E]/50 rounded-2xl flex items-center justify-center">
                  <Award className="w-12 h-12 text-[#A5C89E]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{expert.name}</h2>
                  <p className="text-gray-400">{expert.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#0b0b0b]/80 border border-[#A5C89E]/20 p-6 rounded-xl">
                  <p className="text-gray-500 text-sm mb-1">Articles</p>
                  <p className="text-3xl font-bold text-[#A5C89E]">{expert.articles}</p>
                </div>
                <div className="bg-[#0b0b0b]/80 border border-[#A5C89E]/20 p-6 rounded-xl">
                  <p className="text-gray-500 text-sm mb-1">Followers</p>
                  <p className="text-3xl font-bold text-[#A5C89E]">
                    {expert.followers.toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#0b0b0b]/80 border border-[#A5C89E]/20 p-6 rounded-xl">
                  <p className="text-gray-500 text-sm mb-1">Rating</p>
                  <p className="text-3xl font-bold text-[#A5C89E]">{expert.rating} ★</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 text-[#A5C89E]">Recent Articles</h3>
                <div className="space-y-3">
                  <div className="bg-[#0b0b0b]/80 border border-[#A5C89E]/10 p-4 rounded-xl">
                    <p className="text-gray-200">Understanding Neural Networks</p>
                  </div>
                  <div className="bg-[#0b0b0b]/80 border border-[#A5C89E]/10 p-4 rounded-xl">
                    <p className="text-gray-200">Deep Learning Fundamentals</p>
                  </div>
                  <div className="bg-[#0b0b0b]/80 border border-[#A5C89E]/10 p-4 rounded-xl">
                    <p className="text-gray-200">Machine Learning Best Practices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // Main Dashboard Layout
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <BackgroundEffects />

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 sm:h-20 bg-white/90 backdrop-blur-xl border-b border-gray-200 z-40 shadow-sm">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between max-w-full">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Learnova Management</p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="px-3 sm:px-5 py-2 sm:py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:text-gray-900 hover:shadow-sm transition-all text-xs sm:text-sm font-medium"
          >
            <span className="hidden sm:inline">Exit Admin Panel</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 sm:top-20 left-0 bottom-0 w-64 sm:w-72 bg-white border-r border-gray-200 transition-transform duration-300 z-30 overflow-y-auto shadow-lg ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-xs sm:text-sm text-gray-500 mb-4 tracking-wider uppercase font-semibold">Navigation</h2>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsSidebarOpen(false);
                    setDetailView({ type: 'none' });
                  }}
                  className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl text-sm font-medium transition-all ${isActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 border border-transparent'
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left text-xs sm:text-sm truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-20 top-16 sm:top-20"
        />
      )}

      {/* Main Content */}
      <main className="pt-16 sm:pt-20 lg:pl-72 relative z-10">
        <div className="p-4 sm:p-6 lg:p-8 relative">
          {/* Dashboard Overview */}
          {activeSection === 'overview' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Platform Overview</h2>
                <p className="text-gray-600 text-sm">Monitor key metrics and platform statistics</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        <span className="text-green-600 text-xs sm:text-sm font-medium">{stat.trend}</span>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-gray-800">New user registered: Alex Johnson</p>
                        <p className="text-gray-500 text-sm mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-gray-800">Course approved: React Masterclass</p>
                        <p className="text-gray-500 text-sm mt-1">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-gray-800">
                          New instructor application: David Martinez
                        </p>
                        <p className="text-gray-500 text-sm mt-1">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-gray-800">Article published: Understanding AI</p>
                        <p className="text-gray-500 text-sm mt-1">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Management */}
          {activeSection === 'users' && (
            <div>
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Users Management</h2>
                  <p className="text-gray-600 text-sm">
                    Total users: {users.length.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:shadow-sm transition-all">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-700">
                          Name
                        </th>
                        <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-700 hidden md:table-cell">
                          Email
                        </th>
                        <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-700">
                          Role
                        </th>
                        <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 font-medium">{user.name}</td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell">{user.email}</td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                            <span className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                              {user.role}
                            </span>
                          </td>

                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex gap-1 sm:gap-2">
                              <button
                                onClick={() =>
                                  handleViewDetails({ type: 'user', id: user.id })
                                }
                                className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-all text-xs font-medium flex items-center gap-1"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDelete('user', user.id)}
                                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 px-2">
                <p className="text-sm text-gray-500">
                  Showing {users.length} of {stats[0].value} users
                </p>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Instructor Applications */}
          {activeSection === 'instructor-applications' && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Instructor Applications</h2>
                <p className="text-gray-600 text-sm">
                  Pending applications: {instructorApplications.length}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Name
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Email
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Expertise
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Applied Date
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {instructorApplications.map((app) => (
                        <tr
                          key={app.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{app.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{app.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{app.expertise}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{app.appliedDate}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleViewDetails({ type: 'instructor-app', id: app.id })
                                }
                                className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-xs font-medium"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleApprove('instructor application', app.id)}
                                className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-all text-xs font-medium"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject('instructor application', app.id)}
                                className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-all text-xs font-medium"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Expert Applications */}
          {activeSection === 'expert-applications' && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Expert Applications</h2>
                <p className="text-gray-600 text-sm">
                  Pending applications: {expertApplications.length}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Name
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Email
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Expertise
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Applied Date
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {expertApplications.map((app) => (
                        <tr
                          key={app.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{app.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{app.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{app.expertise}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{app.appliedDate}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleViewDetails({ type: 'expert-app', id: app.id })
                                }
                                className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-xs font-medium"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleApprove('expert application', app.id)}
                                className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-all text-xs font-medium"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject('expert application', app.id)}
                                className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-all text-xs font-medium"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Articles Approval */}
          {activeSection === 'articles-approval' && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Articles Approval</h2>
                <p className="text-gray-600 text-sm">
                  Pending articles: {pendingArticles.length}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Title
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Author
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Category
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Submitted
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingArticles.map((article) => (
                        <tr
                          key={article.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {article.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{article.author}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{article.category}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {article.submittedDate}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleViewDetails({ type: 'article', id: article.id })
                                }
                                className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-xs font-medium"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleApprove('article', article.id)}
                                className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-all text-xs font-medium"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject('article', article.id)}
                                className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-all text-xs font-medium"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Courses Approval */}
          {activeSection === 'courses-approval' && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Courses Approval</h2>
                <p className="text-gray-600 text-sm">
                  Pending courses: {pendingCourses.length}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Title
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Instructor
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Category
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Submitted
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingCourses.map((course) => (
                        <tr
                          key={course.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {course.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{course.instructor}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{course.category}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {course.submittedDate}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleViewDetails({ type: 'course', id: course.id })
                                }
                                className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-xs font-medium"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleApprove('course', course.id)}
                                className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-all text-xs font-medium"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject('course', course.id)}
                                className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-all text-xs font-medium"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Instructors */}
          {activeSection === 'instructors' && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Instructors</h2>
                <p className="text-gray-600 text-sm">
                  Total instructors: {instructors.length}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                          Name
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                          Email
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                          Courses
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                          Students
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                          Rating
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {instructors.map((instructor) => (
                        <tr
                          key={instructor.id}
                          className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {instructor.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{instructor.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{instructor.courses}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {instructor.students.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-amber-600 font-medium">
                            {instructor.rating} ★
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                handleViewDetails({ type: 'instructor-profile', id: instructor.id })
                              }
                              className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-all text-xs font-medium"
                            >
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Experts */}
          {activeSection === 'experts' && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Experts</h2>
                <p className="text-gray-600 text-sm">Total experts: {experts.length}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                          Name
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                          Email
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                          Articles
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                          Followers
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                          Rating
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {experts.map((expert) => (
                        <tr
                          key={expert.id}
                          className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {expert.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{expert.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{expert.articles}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {expert.followers.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-amber-600 font-medium">{expert.rating} ★</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                handleViewDetails({ type: 'expert-profile', id: expert.id })
                              }
                              className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-all text-xs font-medium"
                            >
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Article Reports */}
          {activeSection === 'reports' && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Article Reports</h2>
                <p className="text-gray-600 text-sm">
                  Total reports: {articleReports.length}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {articleReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    {/* Report Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {report.reportType}
                          </h3>
                          <p className="text-xs text-gray-500">
                            Reported by {report.reportedBy} • {report.reportedAt}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-medium border ${report.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : report.status === 'Under Review'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-green-50 text-green-700 border-green-200'
                          }`}
                      >
                        {report.status}
                      </span>
                    </div>

                    {/* Article Info */}
                    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-500">Article ID:</span>
                        <span className="text-xs font-mono font-bold text-blue-700">
                          {report.articleId}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {report.articleTitle}
                      </p>
                    </div>

                    {/* Report Description */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2">Description:</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {report.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                      <button className="px-4 py-2 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-xs font-medium">
                        Review Article
                      </button>
                      <button className="px-4 py-2 bg-green-50 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-all text-xs font-medium">
                        Resolve
                      </button>
                      <button className="px-4 py-2 bg-red-50 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-all text-xs font-medium">
                        Take Action
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          {activeSection === 'feedback' && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Feedback</h2>
                <p className="text-gray-600 text-sm">
                  Total feedback: {feedbackEntries.length}
                </p>
              </div>

              <div className="space-y-4">
                {feedbackEntries.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{feedback.subject}</h3>
                        <p className="text-sm text-gray-600">
                          From: {feedback.user} • {feedback.date}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-medium border ${feedback.status === 'New'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : feedback.status === 'In Progress'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}
                      >
                        {feedback.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{feedback.message}</p>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-sm font-medium">
                        Mark as In Progress
                      </button>
                      <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                        Mark as Resolved
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
