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
import NavLogo from '../Sources/NavLogo.png';

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
  onTutorials?: () => void;
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
  onTutorials,
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
    "All Tutorials",
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
    <nav className="navbar-root">
      <div
        className={`navbar-container ${isScrolled ? "scrolled" : ""}`}
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
              className="navbar-logo-btn"
            >
              <div className="navbar-logo-icon-wrapper">
                <img src={NavLogo} alt="Learnova Logo" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div>
                <span className="navbar-logo-text">
                  LEARNOVA
                </span>
                <div className="navbar-logo-version">
                  SYSTEM v1.0
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group" ref={coursesRef}>
              <button
                className="navbar-nav-link navbar-nav-link-underline"
                onClick={() => setIsCoursesOpen(!isCoursesOpen)}
              >
                COURSES
                <ChevronDown
                  className={`navbar-chevron ${isCoursesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isCoursesOpen && (
                <div
                  className="navbar-dropdown-wrapper"
                  style={{
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                >
                  <h3 className="navbar-dropdown-header">
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
                          className="navbar-dropdown-item"
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
              className="navbar-nav-link navbar-nav-link-underline"
              onClick={onArticles}
            >
              ARTICLES
            </a>
            <div className="relative group" ref={tutorialsRef}>
              <button
                className="navbar-nav-link navbar-nav-link-underline"
                onClick={() =>
                  setIsTutorialsOpen(!isTutorialsOpen)
                }
              >
                TUTORIALS
                <ChevronDown
                  className={`navbar-chevron ${isTutorialsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isTutorialsOpen && (
                <div
                  className="navbar-dropdown-wrapper"
                  style={{
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                >
                  <h3 className="navbar-dropdown-header">
                    BROWSE TUTORIALS
                  </h3>
                  <div className="space-y-0">
                    {tutorialTopics.map((topic) => (
                      <button
                        key={topic}
                        className="navbar-dropdown-item"
                        onClick={() => {
                          if (topic === "All Tutorials") {
                            onTutorials?.();
                          }
                          setIsTutorialsOpen(false);
                        }}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="navbar-search-btn">
              <Search className="w-4 h-4 absolute left-2 group-hover:left-3 transition-all duration-300" />
              <input
                type="text"
                placeholder="Search courses..."
                className="navbar-search-input"
              />
            </button>

            {/* Notification Button */}
            {isAuthenticated && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="navbar-icon-btn"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="navbar-notification-badge">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationOpen && (
                  <div
                    className="navbar-notification-dropdown"
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
                            className={`navbar-notification-item ${notification.isRead
                              ? 'navbar-notification-item-read'
                              : 'navbar-notification-item-unread'
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
                  className="navbar-profile-btn"
                >
                  <User className="w-5 h-5" />
                </button>
                {isProfileOpen && (
                  <div
                    className="navbar-profile-dropdown"
                    style={{
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                    }}
                  >
                    <h3 className="navbar-dropdown-header">
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
                        className="navbar-dropdown-item"
                      >
                        My Profile
                      </a>
                      <a
                        href="#my-courses"
                        className="navbar-dropdown-item"
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
                        className="navbar-dropdown-item"
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
                          className="navbar-dropdown-item"
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
                          className="navbar-dropdown-item"
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
                          className="navbar-dropdown-item cursor-pointer"
                        >
                          Settings
                        </a>
                        <a
                          href="#admin-panel"
                          className="navbar-dropdown-item"
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
                          className="navbar-dropdown-item"
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
                          className="navbar-dropdown-item-destructive"
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
                  className="navbar-signin-btn"
                  onClick={onSignIn}
                >
                  SIGN IN
                </button>
                <button
                  className="navbar-signup-btn"
                  onClick={onSignUp}
                >
                  SIGN UP
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="navbar-mobile-menu-btn"
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
        <div className="navbar-mobile-dropdown">
          <div className="space-y-4">
            <div className="relative">
              <button
                className="navbar-mobile-link-btn"
                onClick={() =>
                  setIsMobileCoursesOpen(!isMobileCoursesOpen)
                }
              >
                COURSES
                <ChevronDown className="w-4 h-4 inline-block ml-1" />
              </button>
              {isMobileCoursesOpen && (
                <div className="navbar-mobile-sub-dropdown">
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
                        className="navbar-mobile-sub-item"
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
              className="navbar-mobile-link"
              onClick={onArticles}
            >
              ARTICLES
            </a>
            <div className="relative">
              <button
                className="navbar-mobile-link-btn"
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
                <div className="navbar-mobile-sub-dropdown">
                  <h3 className="text-xs font-mono text-gray-500 mb-3 tracking-wider">
                    BROWSE TUTORIALS
                  </h3>
                  {tutorialTopics.map((topic) => (
                    <button
                      key={topic}
                      className="navbar-mobile-sub-item"
                      onClick={() => {
                        if (topic === "All Tutorials") {
                          onTutorials?.();
                        }
                        setIsMobileTutorialsOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="pt-4 border-t border-[#A5C89E]/20 space-y-3">
              {isAuthenticated ? (
                <>
                  <a
                    href="#my-profile"
                    className="navbar-mobile-link"
                  >
                    MY PROFILE
                  </a>
                  <a
                    href="#my-courses"
                    className="navbar-mobile-link"
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
                    className="navbar-mobile-link"
                  >
                    EDIT PROFILE
                  </a>
                  <button
                    className="navbar-mobile-link text-red-400 hover:text-red-300"
                    onClick={onLogout}
                  >
                    LOG OUT
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="navbar-mobile-link"
                    onClick={onSignIn}
                  >
                    SIGN IN
                  </button>
                  <button
                    className="navbar-signup-btn w-full"
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