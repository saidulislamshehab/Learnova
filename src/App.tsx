import { useState } from 'react';

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
import { AdminPanel } from './components/Pages/AdminPanel';
import { Tutorials } from './components/Pages/Tutorials';

type View = 'home' | 'signin' | 'signup' | 'allcourses' | 'articles' | 'articledetail' | 'coursedetail'
  | 'payment' | 'myprofile' | 'editprofile' | 'mycourses' | 'coursecontent' | 'bookmarks' | 'writearticle'
  | 'joininstructor' | 'joinexpert' | 'publishcourse' | 'feedback' | 'instructormycourses' | 'settings'
  | 'adminpanel' | 'tutorials';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedArticleId, setSelectedArticleId] = useState<number>(1);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('PY-001');
  const [editCourseId, setEditCourseId] = useState<string>('');

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('home');
  };

  const handleNavigateToAllCourses = (category: string = 'All Categories') => {
    setSelectedCategory(category);
    setCurrentView('allcourses');
  };

  const handleNavigateToArticleDetail = (articleId: number) => {
    setSelectedArticleId(articleId);
    setCurrentView('articledetail');
  };

  const handleNavigateToCourseDetail = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('coursedetail');
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

      {/* Content */}
      <div className="relative z-10">
        {/* Hide navbar when in admin panel */}
        {currentView !== 'adminpanel' && currentView !== 'settings' && (
          <Navbar
            currentView={currentView}
            isAuthenticated={isAuthenticated}
            onSignIn={() => setCurrentView('signin')}
            onSignUp={() => setCurrentView('signup')}
            onHome={() => setCurrentView('home')}
            onLogout={handleLogout}
            onAllCourses={handleNavigateToAllCourses}
            onArticles={() => setCurrentView('articles')}
            onMyProfile={() => setCurrentView('myprofile')}
            onMyCourses={() => setCurrentView('mycourses')}
            onBookmarks={() => setCurrentView('bookmarks')}
            onWriteArticle={() => setCurrentView('writearticle')}
            onJoinInstructor={() => setCurrentView('joininstructor')}
            onJoinExpert={() => setCurrentView('joinexpert')}
            onPublishCourse={() => setCurrentView('publishcourse')}
            onFeedback={() => setCurrentView('feedback')}
            onInstructorMyCourses={() => setCurrentView('instructormycourses')}
            onSettings={() => setCurrentView('settings')}
            onAdminPanel={() => setCurrentView('adminpanel')}
            onTutorials={() => setCurrentView('tutorials')}
          />
        )}

        {currentView === 'home' && (
          <>
            <Hero
              onExploreCourses={() => handleNavigateToAllCourses()}
              onViewDocs={() => setCurrentView('articles')}
            />
            <ExploreTopics onViewAllArticles={() => setCurrentView('articles')} />
            <Courses onCourseClick={handleNavigateToCourseDetail} />
            <Footer />
          </>
        )}

        {currentView === 'signin' && (
          <SignIn
            onSwitchToSignUp={() => setCurrentView('signup')}
            onBackToHome={() => setCurrentView('home')}
            onLogin={handleLogin}
          />
        )}

        {currentView === 'signup' && (
          <SignUp
            onSwitchToSignIn={() => setCurrentView('signin')}
            onBackToHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'allcourses' && (
          <>
            <AllCourses
              category={selectedCategory}
              onCourseClick={handleNavigateToCourseDetail}
            />
            <Footer />
          </>
        )}

        {currentView === 'articles' && (
          <>
            <Articles onArticleClick={handleNavigateToArticleDetail} />
            <Footer />
          </>
        )}

        {currentView === 'articledetail' && (
          <>
            <ArticleDetail
              articleId={selectedArticleId}
              onBack={() => setCurrentView('articles')}
            />
            <Footer />
          </>
        )}

        {currentView === 'coursedetail' && (
          <>
            <CourseDetail
              courseId={selectedCourseId}
              onBack={() => setCurrentView('allcourses')}
              onEnroll={(courseId) => {
                setSelectedCourseId(courseId);
                setCurrentView('payment');
              }}
            />
            <Footer />
          </>
        )}

        {currentView === 'payment' && (
          <>
            <CoursePayment
              courseId={selectedCourseId}
              onBack={() => setCurrentView('coursedetail')}
            />
            <Footer />
          </>
        )}

        {currentView === 'myprofile' && (
          <>
            <MyProfile
              onBack={() => setCurrentView('home')}
              onEditProfile={() => setCurrentView('editprofile')}
            />
            <Footer />
          </>
        )}

        {currentView === 'editprofile' && (
          <>
            <EditProfile
              onBack={() => setCurrentView('myprofile')}
              onSave={() => setCurrentView('myprofile')}
            />
            <Footer />
          </>
        )}

        {currentView === 'mycourses' && (
          <>
            <MyCourses
              onBack={() => setCurrentView('home')}
              onCourseClick={(courseId) => {
                setSelectedCourseId(courseId);
                setCurrentView('coursecontent');
              }}
            />
            <Footer />
          </>
        )}

        {currentView === 'coursecontent' && (
          <>
            <CourseContent
              courseId={selectedCourseId}
              onBack={() => setCurrentView('mycourses')}
            />
            <Footer />
          </>
        )}

        {currentView === 'bookmarks' && (
          <>
            <Bookmarks
              onArticleClick={handleNavigateToArticleDetail}
            />
            <Footer />
          </>
        )}

        {currentView === 'writearticle' && (
          <>
            <WriteArticle
              onBack={() => setCurrentView('articles')}
            />
            <Footer />
          </>
        )}

        {currentView === 'joininstructor' && (
          <>
            <JoinInstructor
              onBack={() => setCurrentView('home')}
            />
            <Footer />
          </>
        )}

        {currentView === 'joinexpert' && (
          <>
            <JoinExpert
              onBack={() => setCurrentView('home')}
            />
            <Footer />
          </>
        )}

        {currentView === 'publishcourse' && (
          <>
            <PublishCourse
              onBack={() => setCurrentView('home')}
              onMyCourses={() => setCurrentView('instructormycourses')}
              editMode={!!editCourseId}
              editCourseId={editCourseId}
            />
            <Footer />
          </>
        )}

        {currentView === 'feedback' && (
          <>
            <Feedback
              onBack={() => setCurrentView('home')}
            />
            <Footer />
          </>
        )}

        {currentView === 'instructormycourses' && (
          <>
            <InstructorMyCourses
              onBack={() => setCurrentView('home')}
              onCreateCourse={() => {
                setEditCourseId('');
                setCurrentView('publishcourse');
              }}
              onEditCourse={(courseId) => {
                setEditCourseId(courseId);
                setCurrentView('publishcourse');
              }}
            />
            <Footer />
          </>
        )}

        {currentView === 'settings' && (
          <>
            <Settings
              onBack={() => setCurrentView('home')}
              onEditProfile={() => setCurrentView('editprofile')}
            />
          </>
        )}

        {currentView === 'adminpanel' && (
          <AdminPanel
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'tutorials' && (
          <>
            <Tutorials />
            <Footer />
          </>
        )}
      </div>
    </div>
  );
}