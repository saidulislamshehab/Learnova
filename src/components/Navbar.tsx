import { useState, useEffect, useRef } from "react";
import {
  Search,
  Menu,
  X,
  Terminal,
  ChevronDown,
  User,
  Code2,
  Brain,
  Globe,
  Cloud,
  FileCode,
  BookOpen,
  Bell,
} from "lucide-react";

interface NavbarProps {
  currentView: string;
  isAuthenticated: boolean;
  onSignIn: () => void;
  onSignUp: () => void;
  onHome: () => void;
  onLogout: () => void;
  onAllCourses: (category?: string) => void;
  onArticles: () => void;
  onMyProfile?: () => void;
  onMyCourses?: () => void;
  onBookmarks?: () => void;
  onWriteArticle?: () => void;
  onJoinInstructor?: () => void;
  onJoinExpert?: () => void;
  onPublishCourse?: () => void;
  onFeedback?: () => void;
  onInstructorMyCourses?: () => void;
  onSettings?: () => void;
  onAdminPanel?: () => void;
}

export function Navbar({
  currentView,
  isAuthenticated,
  onSignIn,
  onSignUp,
  onHome,
  onLogout,
  onAllCourses,
  onArticles,
  onMyProfile,
  onMyCourses,
  onBookmarks,
  onWriteArticle,
  onJoinInstructor,
  onJoinExpert,
  onPublishCourse,
  onFeedback,
  onInstructorMyCourses,
  onSettings,
  onAdminPanel,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isTutorialsOpen, setIsTutorialsOpen] = useState(false);
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] =
    useState(false);
  const [isMobileTutorialsOpen, setIsMobileTutorialsOpen] =
    useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const coursesRef = useRef<HTMLDivElement>(null);
  const tutorialsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Sample notifications data
  const notifications = [
    { id: 1, title: 'New course available: Advanced React Patterns', isRead: false },
    { id: 2, title: 'Your article "Introduction to AI" got 50 likes', isRead: false },
    { id: 3, title: 'Sarah Chen commented on your post', isRead: true },
    { id: 4, title: 'New badge unlocked: Expert Contributor', isRead: true },
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const courseCategories = [
    { name: "DSA / Placements", icon: Code2, href: "#dsa" },
    { name: "ML & Data Science", icon: Brain, href: "#ml" },
    { name: "Development", icon: Globe, href: "#development" },
    { name: "Cloud / DevOps", icon: Cloud, href: "#cloud" },
    {
      name: "Programming Languages",
      icon: FileCode,
      href: "#programming",
    },
    {
      name: "All Courses",
      icon: BookOpen,
      href: "#all-courses",
    },
  ];

  const tutorialTopics = [
    "C",
    "C++",
    "Java",
    "Python",
    "JavaScript",
    "Data Structures",
    "Algorithms",
    "Web Development",
    "AI / ML",
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    // Click outside handler for dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        coursesRef.current &&
        !coursesRef.current.contains(event.target as Node)
      ) {
        setIsCoursesOpen(false);
      }
      if (
        tutorialsRef.current &&
        !tutorialsRef.current.contains(event.target as Node)
      ) {
        setIsTutorialsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    if (isCoursesOpen || isTutorialsOpen || isProfileOpen || isNotificationOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside,
      );
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [isCoursesOpen, isTutorialsOpen, isProfileOpen, isNotificationOpen]);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <div
        className={`bg-gradient-to-r from-[#121212]/40 via-[#121212]/30 to-[#121212]/40 backdrop-blur-2xl border border-[#A5C89E]/30 rounded-full px-6 py-3 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] ${isScrolled ? "shadow-lg shadow-[#A5C89E]/20 border-[#A5C89E]/40" : ""}`}
        style={{
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          boxShadow: isScrolled
            ? '0 8px 32px 0 rgba(165, 200, 158, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
            : '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onHome}
              className="flex items-center space-x-3 group"
            >
              <div className="w-8 h-8 bg-[#A5C89E]/80 rounded-lg flex items-center justify-center group-hover:bg-[#A5C89E]/90 transition-colors">
                <Terminal className="w-5 h-5 text-black" />
              </div>
              <div>
                <span className="text-white font-bold text-lg tracking-wide">
                  LEARNOVA
                </span>
                <div className="text-[#A5C89E] text-[10px] font-mono tracking-wider text-left">
                  SYSTEM v1.0
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group" ref={coursesRef}>
              <button
                className="relative text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-medium tracking-wide flex items-center after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#A5C89E] after:transition-all after:duration-300 after:ease-in-out group-hover:after:w-full"
                onClick={() => setIsCoursesOpen(!isCoursesOpen)}
              >
                COURSES
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${isCoursesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isCoursesOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-64 bg-[#121212]/95 backdrop-blur-xl border border-[#A5C89E]/30 rounded-lg shadow-2xl z-50 py-2"
                  style={{
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                >
                  <h3 className="text-xs font-mono text-[#ACBAC4]/70 mb-2 tracking-wider px-4 pt-2">
                    BROWSE COURSES
                  </h3>
                  <div className="space-y-0">
                    {courseCategories.map((category) => {
                      const Icon = category.icon;
                      const isAllCourses =
                        category.name === "All Courses";
                      return (
                        <button
                          key={category.name}
                          onClick={() => {
                            onAllCourses(
                              isAllCourses
                                ? undefined
                                : category.name,
                            );
                            setIsCoursesOpen(false);
                          }}
                          className="flex items-center w-full text-left px-4 py-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/5 transition-all text-sm font-medium"
                        >
                          <Icon className="w-4 h-4 mr-2 opacity-60" />
                          {category.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <a
              href="#articles"
              className="relative text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-medium tracking-wide after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#A5C89E] after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
              onClick={onArticles}
            >
              ARTICLES
            </a>
            <div className="relative group" ref={tutorialsRef}>
              <button
                className="relative text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-medium tracking-wide flex items-center after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#A5C89E] after:transition-all after:duration-300 after:ease-in-out group-hover:after:w-full"
                onClick={() =>
                  setIsTutorialsOpen(!isTutorialsOpen)
                }
              >
                TUTORIALS
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${isTutorialsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isTutorialsOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-64 bg-[#121212]/75 backdrop-blur-xl border border-[#A5C89E]/30 rounded-lg shadow-2xl z-50 py-2"
                  style={{
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                >
                  <h3 className="text-xs font-mono text-[#ACBAC4]/70 mb-2 tracking-wider px-4 pt-2">
                    BROWSE TUTORIALS
                  </h3>
                  <div className="space-y-0">
                    {tutorialTopics.map((topic) => (
                      <a
                        key={topic}
                        href="#tutorials"
                        className="block w-full text-left px-4 py-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/5 transition-all text-sm font-medium"
                        onClick={() =>
                          setIsTutorialsOpen(false)
                        }
                      >
                        {topic}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="group relative w-8 h-8 hover:w-64 flex items-center justify-center text-gray-400 hover:text-[#A5C89E]/90 transition-all duration-300 overflow-hidden hover:bg-[#1a1a1a]/80 rounded-full hover:border hover:border-[#A5C89E]/30">
              <Search className="w-4 h-4 absolute left-2 group-hover:left-3 transition-all duration-300" />
              <input
                type="text"
                placeholder="Search courses..."
                className="absolute inset-0 bg-transparent text-white text-sm pl-10 pr-4 outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 placeholder:text-gray-500"
              />
            </button>

            {/* Notification Button */}
            {isAuthenticated && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative w-10 h-10 bg-[#121212]/60 border border-[#A5C89E]/30 rounded-full flex items-center justify-center text-gray-400 hover:text-[#A5C89E] hover:bg-[#121212]/80 hover:border-[#A5C89E]/50 transition-all"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#A5C89E] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-80 bg-[#121212]/95 backdrop-blur-xl border border-[#A5C89E]/30 rounded-lg shadow-2xl z-50 overflow-hidden animate-fadeSlideDown"
                    style={{
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                    }}
                  >
                    {/* Header */}
                    <div className="px-4 pt-4 pb-3 border-b border-[#A5C89E]/20">
                      <h3 className="text-sm font-bold text-white">Notifications</h3>
                    </div>

                    {/* Notification List */}
                    {notifications.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <button
                            key={notification.id}
                            className={`w-full text-left px-4 py-3 transition-all border-b border-[#A5C89E]/10 last:border-b-0 ${notification.isRead
                                ? 'bg-transparent hover:bg-[#A5C89E]/5'
                                : 'bg-[#A5C89E]/5 hover:bg-[#A5C89E]/10'
                              }`}
                          >
                            <div className="flex items-start gap-2">
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-[#A5C89E] rounded-full mt-1.5 flex-shrink-0" />
                              )}
                              <p className={`text-sm leading-relaxed ${notification.isRead ? 'text-gray-400' : 'text-gray-300'
                                }`}>
                                {notification.title}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-12 text-center">
                        <Bell className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No new notifications</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() =>
                    setIsProfileOpen(!isProfileOpen)
                  }
                  className="w-10 h-10 bg-[#A5C89E]/20 border border-[#A5C89E]/40 rounded-full flex items-center justify-center text-[#A5C89E]/90 hover:bg-[#A5C89E]/30 transition-all"
                >
                  <User className="w-5 h-5" />
                </button>
                {isProfileOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-52 bg-[#121212]/95 backdrop-blur-xl border border-[#A5C89E]/30 rounded-lg shadow-2xl z-50 py-2"
                    style={{
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                    }}
                  >
                    <h3 className="text-xs font-mono text-[#ACBAC4]/70 mb-2 tracking-wider px-4 pt-2">
                      PROFILE MENU
                    </h3>
                    <div className="space-y-0">
                      <a
                        href="#my-profile"
                        onClick={(e) => {
                          e.preventDefault();
                          onMyProfile?.();
                          setIsProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/5 transition-all text-sm font-medium"
                      >
                        My Profile
                      </a>
                      <a
                        href="#my-courses"
                        className="block w-full text-left px-4 py-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/5 transition-all text-sm font-medium"
                        onClick={(e) => {
                          e.preventDefault();
                          onMyCourses?.();
                          setIsProfileOpen(false);
                        }}
                      >
                        My Courses
                      </a>
                      <a
                        href="#bookmarks"
                        className="block w-full text-left px-4 py-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/5 transition-all text-sm font-medium"
                        onClick={(e) => {
                          e.preventDefault();
                          onBookmarks?.();
                          setIsProfileOpen(false);
                        }}
                      >
                        Bookmarks
                      </a>

                      <div className="pt-1 mt-1 border-t border-[#A5C89E]/20">
                        <a
                          href="#join-expert"
                          className="block w-full text-left px-4 py-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/5 transition-all text-sm font-medium"
                          onClick={(e) => {
                            e.preventDefault();
                            onJoinExpert?.();
                            setIsProfileOpen(false);
                          }}
                        >
                          Join as Expert
                        </a>
                        <a
                          href="#join-instructor"
                          className="block w-full text-left px-4 py-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/5 transition-all text-sm font-medium"
                          onClick={(e) => {
                            e.preventDefault();
                            onJoinInstructor?.();
                            setIsProfileOpen(false);
                          }}
                        >
                          Join as Instructor
                        </a>
                      </div>

                      <div className="pt-1 mt-1 border-t border-[#A5C89E]/20">
                        <a
                          href="#write-article"
                          className="block w-full text-left px-4 py-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/5 transition-all text-sm font-medium"
                          onClick={(e) => {
                            e.preventDefault();
                            onWriteArticle?.();
                            setIsProfileOpen(false);
                          }}
                        >
                          Write Article
                        </a>
                        <a
                          href="#publish-course"
                          className="block w-full text-left px-4 py-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/5 transition-all text-sm font-medium"
                          onClick={(e) => {
                            e.preventDefault();
                            onPublishCourse?.();
                            setIsProfileOpen(false);
                          }}
                        >
                          Publish Course
                        </a>
                      </div>

                      <div className="pt-1 mt-1 border-t border-[#A5C89E]/20">
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            onSettings?.();
                            setIsProfileOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/5 transition-all text-sm font-medium cursor-pointer"
                        >
                          Settings
                        </a>
                        <a
                          href="#admin-panel"
                          className="block w-full text-left px-4 py-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/5 transition-all text-sm font-medium"
                          onClick={(e) => {
                            e.preventDefault();
                            onAdminPanel?.();
                            setIsProfileOpen(false);
                          }}
                        >
                          Admin Panel
                        </a>
                        <a
                          href="#feedback"
                          className="block w-full text-left px-4 py-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/5 transition-all text-sm font-medium"
                          onClick={(e) => {
                            e.preventDefault();
                            onFeedback?.();
                            setIsProfileOpen(false);
                          }}
                        >
                          Feedback
                        </a>
                      </div>

                      <div className="pt-1 mt-1 border-t border-[#A5C89E]/20">
                        <button
                          onClick={onLogout}
                          className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all text-sm font-medium"
                        >
                          Log Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  className="px-4 py-1.5 text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-medium tracking-wide"
                  onClick={onSignIn}
                >
                  SIGN IN
                </button>
                <button
                  className="px-5 py-1.5 bg-transparent border border-[#A5C89E]/60 text-[#A5C89E]/90 rounded-full hover:bg-[#A5C89E]/80 hover:text-black transition-all text-sm font-medium tracking-wide"
                  onClick={onSignUp}
                >
                  SIGN UP
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#A5C89E]"
            onClick={() =>
              setIsMobileMenuOpen(!isMobileMenuOpen)
            }
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 bg-[#121212]/95 backdrop-blur-xl border border-[#A5C89E]/20 rounded-2xl p-6">
          <div className="space-y-4">
            <div className="relative">
              <button
                className="text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-medium tracking-wide"
                onClick={() =>
                  setIsMobileCoursesOpen(!isMobileCoursesOpen)
                }
              >
                COURSES
                <ChevronDown className="w-4 h-4 inline-block ml-1" />
              </button>
              {isMobileCoursesOpen && (
                <div className="mt-3 ml-4 space-y-2.5 pl-4 border-l border-[#A5C89E]/20 animate-fadeSlideDown">
                  <h3 className="text-xs font-mono text-gray-500 mb-3 tracking-wider">
                    BROWSE COURSES
                  </h3>
                  {courseCategories.map((category) => {
                    const Icon = category.icon;
                    const isAllCourses =
                      category.name === "All Courses";
                    return (
                      <button
                        key={category.name}
                        onClick={() => {
                          onAllCourses(
                            isAllCourses
                              ? undefined
                              : category.name,
                          );
                          setIsMobileCoursesOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full text-left text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/5 transition-all text-sm font-medium tracking-wide py-2 px-3 rounded-lg"
                      >
                        <Icon className="w-4 h-4 mr-2 opacity-60" />
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <a
              href="#articles"
              className="block text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-medium tracking-wide"
              onClick={onArticles}
            >
              ARTICLES
            </a>
            <div className="relative">
              <button
                className="text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-medium tracking-wide"
                onClick={() =>
                  setIsMobileTutorialsOpen(
                    !isMobileTutorialsOpen,
                  )
                }
              >
                TUTORIALS
                <ChevronDown className="w-4 h-4 inline-block ml-1" />
              </button>
              {isMobileTutorialsOpen && (
                <div className="mt-3 ml-4 space-y-2.5 pl-4 border-l border-[#A5C89E]/20 animate-fadeSlideDown">
                  <h3 className="text-xs font-mono text-gray-500 mb-3 tracking-wider">
                    BROWSE TUTORIALS
                  </h3>
                  {tutorialTopics.map((topic) => (
                    <a
                      key={topic}
                      href="#tutorials"
                      className="block text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/5 transition-all text-sm font-medium tracking-wide py-2 px-3 rounded-lg"
                      onClick={() => {
                        setIsMobileTutorialsOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {topic}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="pt-4 border-t border-[#A5C89E]/20 space-y-3">
              {isAuthenticated ? (
                <>
                  <a
                    href="#my-profile"
                    className="block w-full px-4 py-2 text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-medium tracking-wide text-left"
                  >
                    MY PROFILE
                  </a>
                  <a
                    href="#my-courses"
                    className="block w-full px-4 py-2 text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-medium tracking-wide text-left"
                    onClick={(e) => {
                      e.preventDefault();
                      onMyCourses?.();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    MY COURSES
                  </a>
                  <a
                    href="#edit-profile"
                    className="block w-full px-4 py-2 text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-medium tracking-wide text-left"
                  >
                    EDIT PROFILE
                  </a>
                  <button
                    className="w-full px-4 py-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium tracking-wide text-left"
                    onClick={onLogout}
                  >
                    LOG OUT
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="w-full px-4 py-2 text-gray-400 hover:text-[#A5C89E] transition-colors text-sm font-medium tracking-wide text-left"
                    onClick={onSignIn}
                  >
                    SIGN IN
                  </button>
                  <button
                    className="w-full px-5 py-2 bg-transparent border border-[#A5C89E]/60 text-[#A5C89E]/90 rounded-full hover:bg-[#A5C89E]/80 hover:text-black transition-all text-sm font-medium tracking-wide"
                    onClick={onSignUp}
                  >
                    SIGN UP
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}