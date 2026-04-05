import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { Navbar } from './components/Pages/Navbar';
import { Hero } from './components/Pages/Hero';
import { ExploreTopics } from './components/Pages/ExploreTopics';
import { Courses } from './components/Pages/Courses';
import { Footer } from './components/Pages/Footer';
import { SignIn } from './components/Pages/SignIn';
import { SignUp } from './components/Pages/SignUp';
import { AllCourses } from './components/Pages/AllCourses';
import { Articles } from './components/Pages/Articles';
import { ArticleDetail } from './components/Pages/ArticleDetail';
import { CourseDetail } from './components/Pages/CourseDetail';
import { CoursePayment } from './components/Pages/CoursePayment';
import { MyProfile } from './components/Pages/MyProfile';
import { EditProfile } from './components/Pages/EditProfile';
import { MyCourses } from './components/Pages/MyCourses';
import { CourseContent } from './components/Pages/CourseContent';
import { Bookmarks } from './components/Pages/Bookmarks';
import { WriteArticle } from './components/Pages/WriteArticle';
import { JoinInstructor } from './components/Pages/JoinInstructor';
import { JoinExpert } from './components/Pages/JoinExpert';
import { PublishCourse } from './components/Pages/PublishCourse';
import { Feedback } from './components/Pages/Feedback';
import { InstructorMyCourses } from './components/Pages/InstructorMyCourses';
import { Settings } from './components/Pages/Settings';
import { Analytics } from "@vercel/analytics/react"
import { AdminPanel } from './components/Pages/AdminPanel';
import { Tutorials } from './components/Pages/Tutorials';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State to track user authentication status
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(localStorage.getItem('auth_token')));
  // State for selected category in courses
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  // State for keys/IDs to navigate to specific details
  const [selectedArticleId, setSelectedArticleId] = useState<number>(1);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('PY-001');
  const [editCourseId, setEditCourseId] = useState<string>('');
  // State for notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Sync authentication state
  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem('auth_token')));
  }, [location.pathname]);

  // Helper to show notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handler for successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/');
  };

  // Handler for logging out
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setIsAuthenticated(false);
    navigate('/');
    showNotification('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] relative transition-colors duration-300">
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `
            linear-gradient(rgba(128, 128, 128, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(128, 128, 128, 0.1) 1px, transparent 1px)
          `,
        backgroundSize: '80px 80px'
      }}></div>

      {/* Noise Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' /%3E%3C/svg%3E")`
      }}></div>

      {/* Glowing Dots */}
      <div className="fixed top-1/4 left-1/4 w-2 h-2 bg-[#ABDADC] rounded-full blur-sm opacity-40 animate-pulse pointer-events-none z-0"></div>
      <div className="fixed top-1/3 right-1/3 w-2 h-2 bg-[#ABDADC] rounded-full blur-sm opacity-30 animate-pulse pointer-events-none z-0"></div>
      <div className="fixed top-2/3 left-1/2 w-2 h-2 bg-[#ABDADC] rounded-full blur-sm opacity-50 animate-pulse pointer-events-none z-0"></div>

      {/* Notification Popup */}
      {notification && (
        <div className="fixed bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in-up w-auto max-w-[90vw]">
          <div className="bg-[#1a1a1a]/95 backdrop-blur-xl border border-[#A5C89E]/20 text-white px-6 py-3 rounded-full shadow-2xl flex items-center justify-center space-x-3 whitespace-nowrap">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${notification.type === 'success' ? 'bg-[#A5C89E]' : 'bg-red-500'}`}></div>
            <span className="text-sm font-mono tracking-wide truncate">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Hide navbar when in admin panel */}
        {!['/adminpanel', '/settings'].includes(location.pathname) && (
          <Navbar
            currentView={location.pathname.substring(1) || 'home'}
            isAuthenticated={isAuthenticated}
            onSignIn={() => navigate('/signin')}
            onSignUp={() => navigate('/signup')}
            onHome={() => navigate('/')}
            onLogout={handleLogout}
            onAllCourses={(category = 'All Categories') => {
                setSelectedCategory(category);
                navigate('/allcourses');
            }}
            onArticles={() => navigate('/articles')}
            onMyProfile={() => navigate('/myprofile')}
            onMyCourses={() => navigate('/mycourses')}
            onBookmarks={() => navigate('/bookmarks')}
            onWriteArticle={() => navigate('/writearticle')}
            onJoinInstructor={() => navigate('/joininstructor')}
            onJoinExpert={() => navigate('/joinexpert')}
            onPublishCourse={() => navigate('/publishcourse')}
            onFeedback={() => navigate('/feedback')}
            onInstructorMyCourses={() => navigate('/instructormycourses')}
            onSettings={() => navigate('/settings')}
            onAdminPanel={() => navigate('/adminpanel')}
            onTutorials={() => navigate('/tutorials')}
          />
        )}

        <Routes>
            <Route path="/" element={
                 <>
                 <Hero
                   onExploreCourses={() => navigate('/allcourses')}
                   onViewDocs={() => navigate('/articles')}
                 />
                 <ExploreTopics onViewAllArticles={() => navigate('/articles')} />
                 <Courses onCourseClick={(id) => { setSelectedCourseId(id); navigate('/coursedetail'); }} />
                 <Footer />
               </>
            } />

            <Route path="/signin" element={
                <SignIn
                    onSwitchToSignUp={() => navigate('/signup')}
                    onBackToHome={() => navigate('/')}
                    onLogin={handleLogin}
                    onShowNotification={showNotification}
                />
            } />

            <Route path="/signup" element={
                <SignUp
                    onSwitchToSignIn={() => navigate('/signin')}
                    onBackToHome={() => navigate('/')}
                    onShowNotification={showNotification}
                />
            } />

            <Route path="/allcourses" element={
                <>
                    <AllCourses
                        category={selectedCategory}
                        onCourseClick={(id) => { setSelectedCourseId(id); navigate('/coursedetail'); }}
                    />
                    <Footer />
                </>
            } />

            <Route path="/articles" element={
                <>
                    <Articles onArticleClick={(id) => { setSelectedArticleId(id); navigate('/articledetail'); }} />
                    <Footer />
                </>
            } />

            <Route path="/articledetail" element={
                <>
                    <ArticleDetail
                        articleId={selectedArticleId}
                        onBack={() => navigate('/articles')}
                    />
                    <Footer />
                </>
            } />

            <Route path="/coursedetail" element={
                <>
                    <CourseDetail
                        courseId={selectedCourseId}
                        onBack={() => navigate('/allcourses')}
                        onEnroll={(id) => {
                            setSelectedCourseId(id);
                            navigate('/payment');
                        }}
                    />
                    <Footer />
                </>
            } />

            <Route path="/payment" element={
                <>
                    <CoursePayment
                        courseId={selectedCourseId}
                        onBack={() => navigate('/coursedetail')}
                    />
                    <Footer />
                </>
            } />

            <Route path="/myprofile" element={
                <>
                    <MyProfile
                        onBack={() => navigate('/')}
                        onEditProfile={() => navigate('/editprofile')}
                    />
                    <Footer />
                </>
            } />

            <Route path="/dashboard" element={
                <>
                    <MyProfile
                        onBack={() => navigate('/')}
                        onEditProfile={() => navigate('/editprofile')}
                    />
                    <Footer />
                </>
            } />

            <Route path="/editprofile" element={
                <>
                    <EditProfile
                        onBack={() => navigate('/myprofile')}
                        onSave={() => navigate('/myprofile')}
                    />
                    <Footer />
                </>
            } />

            <Route path="/mycourses" element={
                <>
                    <MyCourses
                        onBack={() => navigate('/')}
                        onCourseClick={(id) => {
                            setSelectedCourseId(id);
                            navigate('/coursecontent');
                        }}
                    />
                    <Footer />
                </>
            } />

            <Route path="/coursecontent" element={
                <>
                    <CourseContent
                        courseId={selectedCourseId}
                        onBack={() => navigate('/mycourses')}
                    />
                    <Footer />
                </>
            } />

            <Route path="/bookmarks" element={
                <>
                    <Bookmarks
                        onArticleClick={(id) => { setSelectedArticleId(id); navigate('/articledetail'); }}
                    />
                    <Footer />
                </>
            } />

            <Route path="/writearticle" element={
                <>
                    <WriteArticle
                        onBack={() => navigate('/articles')}
                    />
                    <Footer />
                </>
            } />

            <Route path="/joininstructor" element={
                <>
                    <JoinInstructor
                        onBack={() => navigate('/')}
                    />
                    <Footer />
                </>
            } />

            <Route path="/joinexpert" element={
                <>
                    <JoinExpert
                        onBack={() => navigate('/')}
                    />
                    <Footer />
                </>
            } />

            <Route path="/publishcourse" element={
                <>
                    <PublishCourse
                        onBack={() => navigate('/')}
                        onMyCourses={() => navigate('/instructormycourses')}
                        editMode={!!editCourseId}
                        editCourseId={editCourseId}
                    />
                    <Footer />
                </>
            } />

            <Route path="/feedback" element={
                <>
                    <Feedback
                        onBack={() => navigate('/')}
                    />
                    <Footer />
                </>
            } />

            <Route path="/instructormycourses" element={
                <>
                    <InstructorMyCourses
                        onBack={() => navigate('/')}
                        onCreateCourse={() => {
                            setEditCourseId('');
                            navigate('/publishcourse');
                        }}
                        onEditCourse={(id) => {
                            setEditCourseId(id);
                            navigate('/publishcourse');
                        }}
                    />
                    <Footer />
                </>
            } />

            <Route path="/settings" element={
                <>
                    <Settings
                        onBack={() => navigate('/')}
                        onEditProfile={() => navigate('/editprofile')}
                    />
                </>
            } />

            <Route path="/adminpanel" element={
                <AdminPanel
                    onBack={() => navigate('/')}
                />
            } />

            <Route path="/tutorials" element={
                <>
                    <Tutorials />
                    <Footer />
                </>
            } />
        </Routes>
      </div>
      <Analytics />
    </div>
  );
}