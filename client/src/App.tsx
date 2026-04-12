import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { Navbar } from './components/Pages/Homepage/Navbar';
import { Hero } from './components/Pages/Homepage/Hero';
import { ExploreTopics } from './components/Pages/Homepage/ExploreTopics';
import { Courses } from './components/Pages/course/Courses';
import { Footer } from './components/Pages/Homepage/Footer';
import { SignIn } from './components/Pages/Authentication/SignIn';
import { SignUp } from './components/Pages/Authentication/SignUp';
import { ForgotPassword } from './components/Pages/Authentication/ForgotPassword';
import { ResetPassword } from './components/Pages/Authentication/ResetPassword';
import { AllCourses } from './components/Pages/course/AllCourses';
import { Articles } from './components/Pages/article/Articles';
import { ArticleDetail } from './components/Pages/article/ArticleDetail';
import { CourseDetail } from './components/Pages/course/CourseDetail';
import { CoursePayment } from './components/Pages/course/CoursePayment';
import { MyProfile } from './components/Pages/Profile/MyProfile';
import { EditProfile } from './components/Pages/Profile/EditProfile';
import { MyCourses } from './components/Pages/course/MyCourses';
import { CourseContent } from './components/Pages/course/CourseContent';
import { Bookmarks } from './components/Pages/course/Bookmarks';
import { WriteArticle } from './components/Pages/article/WriteArticle';
import { JoinInstructor } from './components/Pages/Instructor/JoinInstructor';
import { JoinExpert } from './components/Pages/expert/JoinExpert';
import { PublishCourse } from './components/Pages/Instructor/PublishCourse';
import { Feedback } from './components/Pages/Profile/Feedback';
import { InstructorMyCourses } from './components/Pages/Instructor/InstructorMyCourses';
import { Settings } from './components/Pages/Profile/Settings';
import { Analytics } from "@vercel/analytics/react"
import { AdminPanel } from './components/Pages/Admin/AdminPanel';
import { Tutorials } from './components/Pages/course/Tutorials';
import { AdminExpertApplications } from './components/Pages/Admin/AdminExpertApplications';
import { clearAuthSession, getAuthToken } from './utils/authStorage';

import { API_BASE_URL } from './utils/constants';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State to track user authentication status
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getAuthToken()));
  // State for selected category in courses
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  // State for keys/IDs to navigate to specific details
  const [selectedArticleId, setSelectedArticleId] = useState<number>(1);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('PY-001');
  const [editCourseId, setEditCourseId] = useState<string>('');
  // State for notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  // State for current user's identifier from database
  const [currentUserIdentifier, setCurrentUserIdentifier] = useState<string | null>(null);

  // Sync authentication state
  useEffect(() => {
    setIsAuthenticated(Boolean(getAuthToken()));
  }, [location.pathname]);

  // Helper to fetch username from database
  const getUserIdentifierFromDatabase = async () => {
        const token = getAuthToken();
    if (!token) return 'user';

    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return 'user';
      }

      const data = await response.json();
      // Use name (username) as identifier from database, fallback to email
      return data.name || data.email || 'user';
    } catch {
      return 'user';
    }
  };

  // Handler for navigating to profile - fetches username from database
  const handleMyProfileClick = async () => {
    const userIdentifier = await getUserIdentifierFromDatabase();
    navigate(`/profile/${encodeURIComponent(userIdentifier)}`);
  };

  // Handler for navigating to edit profile - fetches username from database
  const handleEditProfileClick = async () => {
    const userIdentifier = await getUserIdentifierFromDatabase();
    navigate(`/profile/${encodeURIComponent(userIdentifier)}/edit`);
  };

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
        clearAuthSession();
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
                {!['/adminpanel', '/settings', '/admin/expert-applications'].includes(location.pathname) && (
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
            onMyProfile={handleMyProfileClick}
            onMyCourses={() => navigate('/mycourses')}
            onBookmarks={() => navigate('/bookmarks')}
            onWriteArticle={() => navigate('/writearticle')}
            onMyArticles={() => navigate('/myarticles')}
            onJoinInstructor={() => navigate('/joininstructor')}
            onJoinExpert={() => navigate('/joinexpert')}
            onPublishCourse={() => {
                setEditCourseId('');
                navigate('/publishcourse');
            }}
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
                 <ExploreTopics onViewAllTutorials={() => navigate('/tutorials')} />
                 <Courses onCourseClick={(id) => navigate(`/course/${id}`)} />
                 <Footer />
               </>
            } />

            <Route path="/signin" element={
                <SignIn
                    onSwitchToSignUp={() => navigate('/signup')}
                    onBackToHome={() => navigate('/')}
                    onForgotPassword={() => navigate('/forgot-password')}
                    onLogin={handleLogin}
                    onShowNotification={showNotification}
                />
            } />

            <Route path="/forgot-password" element={
                <ForgotPassword
                    onSwitchToSignIn={() => navigate('/signin')}
                    onBackToHome={() => navigate('/')}
                    onShowNotification={showNotification}
                />
            } />

            <Route path="/reset-password" element={
                <ResetPassword
                    onSwitchToSignIn={() => navigate('/signin')}
                    onBackToHome={() => navigate('/')}
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
                        onCourseClick={(id) => navigate(`/course/${id}`)}
                    />
                    <Footer />
                </>
            } />

            <Route path="/articles" element={
                <>
                    <Articles onArticleClick={(id) => navigate(`/article/${id}`)} />
                    <Footer />
                </>
            } />

            <Route path="/article/:id" element={
                <>
                    <ArticleDetail
                        onBack={() => navigate('/articles')}
                    />
                    <Footer />
                </>
            } />

            <Route path="/course/:id" element={
                <>
                    <CourseDetail
                        onBack={() => navigate('/allcourses')}
                        onEnroll={(id) => navigate(`/course/${id}/payment`)}
                    />
                    <Footer />
                </>
            } />

            <Route path="/course/:id/payment" element={
                <>
                    <CoursePayment
                        onBack={() => navigate(-1)}
                    />
                    <Footer />
                </>
            } />

            <Route path="/myprofile" element={
                <>
                    <MyProfile
                        onBack={() => navigate('/')}
                        onEditProfile={handleEditProfileClick}
                    />
                    <Footer />
                </>
            } />

            <Route path="/profile/:username" element={
                <>
                    <MyProfile
                        onBack={() => navigate('/')}
                        onEditProfile={handleEditProfileClick}
                    />
                    <Footer />
                </>
            } />

            <Route path="/dashboard" element={
                <>
                    <MyProfile
                        onBack={() => navigate('/')}
                        onEditProfile={handleEditProfileClick}
                    />
                    <Footer />
                </>
            } />

            <Route path="/editprofile" element={
                <>
                    <EditProfile
                        onBack={handleMyProfileClick}
                        onSave={handleMyProfileClick}
                    />
                    <Footer />
                </>
            } />

            <Route path="/profile/:username/edit" element={
                <>
                    <EditProfile
                        onBack={handleMyProfileClick}
                        onSave={handleMyProfileClick}
                    />
                    <Footer />
                </>
            } />

            <Route path="/mycourses" element={
                <>
                    <MyCourses
                        onBack={() => navigate('/')}
                        onCourseClick={(id) => navigate(`/course/${id}/content`)}
                    />
                    <Footer />
                </>
            } />

            <Route path="/course/:id/content" element={
                <>
                    <CourseContent
                        onBack={() => navigate('/mycourses')}
                    />
                    <Footer />
                </>
            } />

            <Route path="/bookmarks" element={
                <>
                    <Bookmarks
                        onArticleClick={(id) => navigate(`/article/${id}`)}
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

            <Route path="/myarticles" element={
                <>
                    <WriteArticle
                        onBack={() => navigate('/articles')}
                        initialView="list"
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
                        onBack={() => {
                            setEditCourseId('');
                            navigate('/');
                        }}
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

            <Route path="/admin/expert-applications" element={
                <AdminExpertApplications
                    onBack={() => navigate('/adminpanel')}
                />
            } />

            <Route path="/tutorials" element={
                <>
                    <Tutorials />
                    <Footer />
                </>
            } />
            <Route path="/tutorials/:id" element={
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