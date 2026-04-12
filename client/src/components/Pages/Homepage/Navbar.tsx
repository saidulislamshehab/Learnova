import { API_URL } from '@/utils/constants';
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
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
import NavLogo from '../../Sources/logo.png';
import Loading from '../../ui/Loading';

// Interface defining the props for the Navbar component
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
  onMyArticles?: () => void;
  onJoinInstructor?: () => void;
  onJoinExpert?: () => void;
  onPublishCourse?: () => void;
  onFeedback?: () => void;
  onInstructorMyCourses?: () => void;
  onSettings?: () => void;
  onAdminPanel?: () => void;
  onTutorials?: () => void;
}

/**
 * Navbar Component
 * Displays the top navigation bar with logo, links, search, notifications, and user profile.
 * Handles both desktop and mobile views.
 */
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
  onMyArticles,
  onJoinInstructor,
  onJoinExpert,
  onPublishCourse,
  onFeedback,
  onInstructorMyCourses,
  onSettings,
  onAdminPanel,
  onTutorials,
}: NavbarProps) {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string>('Learner');
  const [profileEmail, setProfileEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<'student' | 'expert' | 'instructor' | 'admin'>('student');
  // State to track if the page is scrolled to adjust navbar styling
  const [isScrolled, setIsScrolled] = useState(false);
  // State for controlling mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);
  // State for displaying current time
  const [currentTime, setCurrentTime] = useState("00:00");
  // States for managing dropdown visibilities
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isTutorialsOpen, setIsTutorialsOpen] = useState(false);
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] =
    useState(false);
  const [isMobileTutorialsOpen, setIsMobileTutorialsOpen] =
    useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchCounts, setSearchCounts] = useState({
    all: 0,
    articles: 0,
    courses: 0,
    tutorials: 0,
  });
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showDesktopSuggestions, setShowDesktopSuggestions] = useState(false);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);
  const [isDesktopSearchExpanded, setIsDesktopSearchExpanded] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState<'all' | 'article' | 'course' | 'tutorial'>('all');
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(0);
  const [searchTotal, setSearchTotal] = useState(0);
  // Refs for click outside detection
  const coursesRef = useRef<HTMLDivElement>(null);
  const tutorialsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRefDesktop = useRef<HTMLDivElement>(null);
  const notificationRefMobile = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const fetchSearchSuggestions = async (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/search/suggestions?query=${encodeURIComponent(trimmed)}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        setSearchSuggestions([]);
        return;
      }

      const data = await response.json();
      setSearchSuggestions(Array.isArray(data?.results) ? data.results : []);
    } catch {
      setSearchSuggestions([]);
    }
  };

  const fetchSearchResults = async (
    query: string,
    options?: { tab?: 'all' | 'article' | 'course' | 'tutorial'; page?: number; openModal?: boolean }
  ) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults([]);
      setSearchCounts({ all: 0, articles: 0, courses: 0, tutorials: 0 });
      setSearchTotal(0);
      setSearchTotalPages(0);
      return;
    }

    const tab = options?.tab ?? activeSearchTab;
    const page = options?.page ?? searchPage;
    const shouldOpenModal = options?.openModal ?? false;

    try {
      setIsSearchLoading(true);
      const response = await fetch(
        `${API_URL}/search?query=${encodeURIComponent(trimmed)}&type=${tab}&page=${page}&per_page=6`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        setSearchResults([]);
        setSearchTotal(0);
        setSearchTotalPages(0);
        setSearchCounts({ all: 0, articles: 0, courses: 0, tutorials: 0 });
        if (shouldOpenModal) {
          setIsSearchModalOpen(true);
        }
        return;
      }

      const data = await response.json();
      setSearchResults(Array.isArray(data?.items) ? data.items : []);
      setSearchTotal(Number(data?.total) || 0);
      setSearchTotalPages(Number(data?.total_pages) || 0);
      setSearchPage(Number(data?.page) || 1);
      setSearchCounts({
        all: Number(data?.counts?.all) || 0,
        articles: Number(data?.counts?.articles) || 0,
        courses: Number(data?.counts?.courses) || 0,
        tutorials: Number(data?.counts?.tutorials) || 0,
      });
      if (shouldOpenModal) {
        setIsSearchModalOpen(true);
      }
    } catch {
      setSearchResults([]);
      setSearchTotal(0);
      setSearchTotalPages(0);
      setSearchCounts({ all: 0, articles: 0, courses: 0, tutorials: 0 });
      if (shouldOpenModal) {
        setIsSearchModalOpen(true);
      }
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleSelectSearchItem = (item: any) => {
    const itemType = String(item?.type || '').toLowerCase();
    const id = item?.id;

    setIsSearchModalOpen(false);
    setShowDesktopSuggestions(false);
    setShowMobileSuggestions(false);
    setIsDesktopSearchExpanded(false);
    setIsMobileMenuOpen(false);

    if (itemType === 'article' && id) {
      navigate(`/article/${id}`);
      return;
    }

    if (itemType === 'course' && id) {
      navigate(`/course/${id}`);
      return;
    }

    if (itemType === 'tutorial') {
      if (onTutorials) {
        onTutorials();
      } else {
        navigate('/tutorials');
      }
    }
  };

  const handleSearchEnter = async () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      return;
    }
    setShowDesktopSuggestions(false);
    setShowMobileSuggestions(false);
    setIsDesktopSearchExpanded(false);
    setActiveSearchTab('all');
    setSearchPage(1);
    await fetchSearchResults(trimmed, { tab: 'all', page: 1, openModal: true });
  };

  const pageWindowStart = Math.max(1, searchPage - 1);
  const pageWindowEnd = Math.min(searchTotalPages, pageWindowStart + 2);
  const visiblePages = Array.from(
    { length: Math.max(0, pageWindowEnd - pageWindowStart + 1) },
    (_, index) => pageWindowStart + index
  );

  const renderSuggestionItem = (item: any) => (
    <button
      key={`${item.type}-${item.id}`}
      className="navbar-search-suggestion-item"
      onMouseDown={(event) => {
        event.preventDefault();
        handleSelectSearchItem(item);
      }}
    >
      <div className="navbar-search-suggestion-main">
        <span className="navbar-search-suggestion-type">{String(item.type || '').toUpperCase()}</span>
        <span className="navbar-search-suggestion-title">{item.title}</span>
      </div>
      {item.subtitle ? <span className="navbar-search-suggestion-sub">{item.subtitle}</span> : null}
    </button>
  );

  const renderSearchResultCard = (item: any) => (
    <button
      key={`${item.type}-${item.id}`}
      className="navbar-search-result-card"
      onClick={() => handleSelectSearchItem(item)}
    >
      <div className="navbar-search-result-card-head">
        <span className="navbar-search-result-type">{String(item.type || '').toUpperCase()}</span>
      </div>
      <h4 className="navbar-search-result-title">{item.title}</h4>
      <p className="navbar-search-result-description">
        {item.description || item.subtitle || 'No description available'}
      </p>
    </button>
  );

  interface Notification {
    id: number;
    type: string;
    message: string;
    author_name?: string;
    resource_id?: number;
    is_read: boolean;
    created_at: string;
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/notifications`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unread_count);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id: number) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

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

  const canSeeWriteArticle = userRole === 'admin' || userRole === 'expert';
  const canSeePublishCourse = userRole === 'admin' || userRole === 'instructor';
  const canSeeAdminPanel = userRole === 'admin';
  const canSeeJoinOptions = userRole === 'student';
  const canSeeCreatorActions = canSeeWriteArticle || canSeePublishCourse;
  const displayRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);

  useEffect(() => {
    if (!isAuthenticated) {
      setProfilePicture(null);
      setProfileName('Learner');
      setProfileEmail('');
      setUserRole('student');
      return;
    }

    const token = localStorage.getItem('auth_token');
    const cachedUser = localStorage.getItem('auth_user');

    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser) as { picture?: string | null; role?: string | null; name?: string | null; email?: string | null };
        setProfilePicture(parsed.picture ?? null);
        setProfileName(parsed.name || 'Learner');
        setProfileEmail(parsed.email || '');
        const normalizedRole = (parsed.role || 'student').toLowerCase();
        if (normalizedRole === 'admin' || normalizedRole === 'expert' || normalizedRole === 'instructor') {
          setUserRole(normalizedRole);
        } else {
          setUserRole('student');
        }
      } catch {
        setProfilePicture(null);
        setProfileName('Learner');
        setProfileEmail('');
        setUserRole('student');
      }
    }

    if (!token) {
      return;
    }

    const syncProfilePicture = async () => {
      try {
        const response = await fetch(`${API_URL}/me`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          return;
        }

        const user = (await response.json()) as { picture?: string | null; role?: string | null; name?: string | null; email?: string | null };
        setProfilePicture(user.picture ?? null);
        setProfileName(user.name || 'Learner');
        setProfileEmail(user.email || '');
        const normalizedRole = (user.role || 'student').toLowerCase();
        if (normalizedRole === 'admin' || normalizedRole === 'expert' || normalizedRole === 'instructor') {
          setUserRole(normalizedRole);
        } else {
          setUserRole('student');
        }

        if (cachedUser) {
          try {
            const parsed = JSON.parse(cachedUser) as Record<string, unknown>;
            localStorage.setItem('auth_user', JSON.stringify({ ...parsed, picture: user.picture ?? null }));
          } catch {
            localStorage.setItem('auth_user', JSON.stringify(user));
          }
        } else {
          localStorage.setItem('auth_user', JSON.stringify(user));
        }
      } catch {
        // Keep existing avatar fallback if request fails.
      }
    };

    syncProfilePicture();
  }, [isAuthenticated, currentView]);

  // Fetch notifications on mount and periodically
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Every 30s
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  // Effect to handle scroll events and update time
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

    // Click outside handler for dropdowns to close them when clicking elsewhere
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
        notificationRefDesktop.current &&
        !notificationRefDesktop.current.contains(event.target as Node) &&
        notificationRefMobile.current &&
        !notificationRefMobile.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }

      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node)
      ) {
        setShowDesktopSuggestions(false);
        setIsDesktopSearchExpanded(false);
      }

      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowMobileSuggestions(false);
      }
    };

    if (
      isCoursesOpen ||
      isTutorialsOpen ||
      isProfileOpen ||
      isNotificationOpen ||
      showDesktopSuggestions ||
      showMobileSuggestions ||
      isDesktopSearchExpanded
    ) {
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
  }, [
    isCoursesOpen,
    isTutorialsOpen,
    isProfileOpen,
    isNotificationOpen,
    showDesktopSuggestions,
    showMobileSuggestions,
    isDesktopSearchExpanded,
  ]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchSearchSuggestions(searchQuery);
    }, 200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (!isSearchModalOpen) {
      return;
    }

    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setSearchTotal(0);
      setSearchTotalPages(0);
      setSearchCounts({ all: 0, articles: 0, courses: 0, tutorials: 0 });
      return;
    }

    const timeout = window.setTimeout(() => {
      void fetchSearchResults(trimmed, { tab: activeSearchTab, page: searchPage });
    }, 260);

    return () => window.clearTimeout(timeout);
  }, [isSearchModalOpen, searchQuery, activeSearchTab, searchPage]);

  return (
    <>
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
            <Link
              to="/"
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
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div
              className="relative group"
              ref={coursesRef}
              onMouseEnter={() => setIsCoursesOpen(true)}
              onMouseLeave={() => setIsCoursesOpen(false)}
            >
              <button
                className="navbar-nav-link navbar-nav-link-underline"
                onClick={() => {
                  onAllCourses(undefined);
                  setIsCoursesOpen(false);
                }}
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
            <Link
              to="/articles"
              className="navbar-nav-link navbar-nav-link-underline"
            >
              ARTICLES
            </Link>
            <div
              className="relative group"
              ref={tutorialsRef}
              onMouseEnter={() => setIsTutorialsOpen(true)}
              onMouseLeave={() => setIsTutorialsOpen(false)}
            >
              <button
                className="navbar-nav-link navbar-nav-link-underline"
                onClick={() => {
                  if (onTutorials) {
                    onTutorials();
                  } else {
                    navigate('/tutorials');
                  }
                  setIsTutorialsOpen(false);
                }}
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
            <div className="navbar-search-container" ref={desktopSearchRef}>
              <button
                type="button"
                className={`navbar-search-btn ${isDesktopSearchExpanded ? 'expanded' : ''}`}
                onClick={() => {
                  setIsDesktopSearchExpanded(true);
                  setShowDesktopSuggestions(true);
                }}
              >
                <Search className="w-4 h-4 absolute left-2 group-hover:left-3 transition-all duration-300" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="navbar-search-input"
                  value={searchQuery}
                  onFocus={() => {
                    setIsDesktopSearchExpanded(true);
                    setShowDesktopSuggestions(true);
                  }}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      void handleSearchEnter();
                    }
                  }}
                />
              </button>
              {showDesktopSuggestions && searchQuery.trim().length > 0 ? (
                <div className="navbar-search-suggestion-panel">
                  {searchSuggestions.length > 0 ? (
                    searchSuggestions.map((item) => renderSuggestionItem(item))
                  ) : (
                    <div className="navbar-search-suggestion-empty">No quick matches</div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Notification Button */}
            {isAuthenticated && (
              <div className="relative" ref={notificationRefDesktop}>
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="navbar-icon-btn focus:outline-none"
                >
                  <Bell className="w-5 h-5" fill="currentColor" stroke="none" />
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
                    <div className="px-4 pt-4 pb-3 border-b border-[#A5C89E]/20 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            markAllAsRead();
                          }}
                          className="text-[10px] text-[#A5C89E] hover:text-[#A5C89E]/80 font-bold uppercase tracking-wider p-1"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {/* Notification List */}
                    {notifications.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className={`navbar-notification-item w-full text-left transition-colors ${notification.is_read
                              ? 'navbar-notification-item-read'
                              : 'navbar-notification-item-unread bg-[#A5C89E]/5'
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              {!notification.is_read && (
                                <div className="w-1.5 h-1.5 bg-[#A5C89E] rounded-full mt-1.5 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <p className={`text-xs leading-relaxed ${notification.is_read ? 'text-gray-400' : 'text-gray-200'}`}>
                                  {notification.author_name && (
                                    <span className="font-bold text-[#A5C89E] mr-1">{notification.author_name}</span>
                                  )}
                                  {notification.message}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-1">
                                  {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notification.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-12 text-center">
                        <Bell className="w-10 h-10 text-gray-700 mx-auto mb-3 opacity-20" />
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
                  className="navbar-profile-btn overflow-hidden rounded-full"
                >
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </button>
                {isProfileOpen && (
                  <div
                    className="navbar-profile-dropdown"
                    style={{
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                    }}
                  >
                    <div className="px-4 pt-4 pb-3 border-b border-[#A5C89E]/20">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-[#A5C89E]/40 bg-[#0b0b0b] shrink-0">
                          {profilePicture ? (
                            <img src={profilePicture} alt={profileName} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#A5C89E]">
                              <User className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{profileName}</p>
                          {profileEmail ? (
                            <p className="text-xs text-gray-400 truncate">{profileEmail}</p>
                          ) : (
                            <p className="text-xs text-gray-500">No email</p>
                          )}
                          <span className="inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-[#A5C89E]/10 border border-[#A5C89E]/30 text-[#A5C89E]">
                            {displayRole}
                          </span>
                        </div>
                      </div>
                    </div>
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
                        Enrolled Courses
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

                      {canSeeJoinOptions && (
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
                      )}

                      {canSeeCreatorActions && (
                        <div className="pt-1 mt-1 border-t border-[#A5C89E]/20">
                          {canSeeWriteArticle && (
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
                          )}
                          {canSeeWriteArticle && (
                            <a
                              href="#my-articles"
                              className="navbar-dropdown-item"
                              onClick={(e) => {
                                e.preventDefault();
                                onMyArticles?.();
                                setIsProfileOpen(false);
                              }}
                            >
                              My Articles
                            </a>
                          )}
                          {canSeePublishCourse && (
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
                          )}
                          {canSeePublishCourse && (
                            <a
                              href="#my-courses"
                              className="navbar-dropdown-item"
                              onClick={(e) => {
                                e.preventDefault();
                                onInstructorMyCourses?.();
                                setIsProfileOpen(false);
                              }}
                            >
                              My Courses
                            </a>
                          )}
                        </div>
                      )}

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
                        {canSeeAdminPanel && (
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
                        )}
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

          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile Notification Button */}
            {isAuthenticated && (
              <div className="relative" ref={notificationRefMobile}>
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="navbar-icon-btn focus:outline-none"
                >
                  <Bell className="w-5 h-5" fill="currentColor" stroke="none" />
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
                    <div className="px-4 pt-4 pb-3 border-b border-[#A5C89E]/20 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            markAllAsRead();
                          }}
                          className="text-[10px] text-[#A5C89E] hover:text-[#A5C89E]/80 font-bold uppercase tracking-wider p-1"
                        >
                          Mark all
                        </button>
                      )}
                    </div>

                    {/* Notification List */}
                    {notifications.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className={`navbar-notification-item w-full text-left transition-colors ${notification.is_read
                              ? 'navbar-notification-item-read'
                              : 'navbar-notification-item-unread bg-[#A5C89E]/5'
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              {!notification.is_read && (
                                <div className="w-1.5 h-1.5 bg-[#A5C89E] rounded-full mt-1.5 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <p className={`text-xs leading-relaxed ${notification.is_read ? 'text-gray-400' : 'text-gray-200'}`}>
                                  {notification.author_name && (
                                    <span className="font-bold text-[#A5C89E] mr-1">{notification.author_name}</span>
                                  )}
                                  {notification.message}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-1">
                                  {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-12 text-center">
                        <Bell className="w-10 h-10 text-gray-700 mx-auto mb-3 opacity-20" />
                        <p className="text-sm text-gray-500">No new notifications</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

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
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="navbar-mobile-dropdown">
          <div className="space-y-4">
            {/* Mobile Search */}
            <div className="relative" ref={mobileSearchRef}>
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full bg-[#1a1a1a]/50 border border-[#A5C89E]/20 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#A5C89E]/40"
                value={searchQuery}
                onFocus={() => setShowMobileSuggestions(true)}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    void handleSearchEnter();
                  }
                }}
              />
              {showMobileSuggestions && searchQuery.trim().length > 0 ? (
                <div className="navbar-search-suggestion-panel navbar-search-suggestion-panel-mobile">
                  {searchSuggestions.length > 0 ? (
                    searchSuggestions.map((item) => renderSuggestionItem(item))
                  ) : (
                    <div className="navbar-search-suggestion-empty">No quick matches</div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Mobile Navigation Links */}
            <div className="relative">
              <button
                className="navbar-mobile-link-btn"
                onClick={() =>
                  setIsMobileCoursesOpen(!isMobileCoursesOpen)
                }
              >
                COURSES
                <ChevronDown className={`w-4 h-4 inline-block ml-1 transition-transform ${isMobileCoursesOpen ? "rotate-180" : ""}`} />
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

            <Link
              to="/articles"
              className="navbar-mobile-link"
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            >
              ARTICLES
            </Link>

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
                <ChevronDown className={`w-4 h-4 inline-block ml-1 transition-transform ${isMobileTutorialsOpen ? "rotate-180" : ""}`} />
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
                  {/* Profile Links */}
                  <Link
                    to="/myprofile"
                    className="navbar-mobile-link"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    MY PROFILE
                  </Link>
                  <Link
                    to="/mycourses"
                    className="navbar-mobile-link"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    ENROLLED COURSES
                  </Link>
                  <Link
                    to="/bookmarks"
                    className="navbar-mobile-link"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    BOOKMARKS
                  </Link>

                  <div className="h-px bg-[#A5C89E]/10 my-2"></div>

                  {/* Contributor Section */}
                  {canSeeJoinOptions && (
                    <>
                      <Link
                        to="/joinexpert"
                        className="navbar-mobile-link"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        JOIN AS EXPERT
                      </Link>
                      <Link
                        to="/joininstructor"
                        className="navbar-mobile-link"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        JOIN AS INSTRUCTOR
                      </Link>
                    </>
                  )}
                  {canSeeWriteArticle && (
                    <Link
                      to="/writearticle"
                      className="navbar-mobile-link"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      WRITE ARTICLE
                    </Link>
                  )}
                  {canSeeWriteArticle && (
                    <Link
                      to="/myarticles"
                      className="navbar-mobile-link"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      MY ARTICLES
                    </Link>
                  )}
                  {canSeePublishCourse && (
                    <Link
                      to="/publishcourse"
                      className="navbar-mobile-link"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      PUBLISH COURSE
                    </Link>
                  )}
                  {canSeePublishCourse && (
                    <Link
                      to="/instructormycourses"
                      className="navbar-mobile-link"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      MY COURSES
                    </Link>
                  )}

                  <div className="h-px bg-[#A5C89E]/10 my-2"></div>

                  {/* System Section */}
                  <button
                    className="navbar-mobile-link w-full text-left"
                    onClick={() => {
                      onSettings?.();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    SETTINGS
                  </button>
                  {canSeeAdminPanel && (
                    <Link
                      to="/adminpanel"
                      className="navbar-mobile-link"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      ADMIN PANEL
                    </Link>
                  )}
                  <Link
                    to="/feedback"
                    className="navbar-mobile-link"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    FEEDBACK
                  </Link>

                  <div className="h-px bg-[#A5C89E]/10 my-2"></div>

                  <button
                    className="navbar-mobile-link text-red-400 hover:text-red-300 w-full text-left"
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    LOG OUT
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="navbar-mobile-link w-full text-left"
                    onClick={() => {
                      onSignIn();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    SIGN IN
                  </button>
                  <button
                    className="navbar-signup-btn w-full mt-2"
                    onClick={() => {
                      onSignUp();
                      setIsMobileMenuOpen(false);
                    }}
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
    {isSearchModalOpen && (
      <div className="navbar-search-modal-overlay" onClick={() => setIsSearchModalOpen(false)}>
        <div className="navbar-search-modal" onClick={(event) => event.stopPropagation()}>
          <div className="navbar-search-modal-header">
            <div className="navbar-search-modal-header-main">
              <h3 className="navbar-search-modal-title">Results for "{searchQuery}"</h3>
              <p className="navbar-search-modal-subtitle">{searchTotal} matches</p>
            </div>
            <button className="navbar-search-modal-close" onClick={() => setIsSearchModalOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="navbar-search-modal-tabs">
            <button
              className={`navbar-search-tab ${activeSearchTab === 'all' ? 'active' : ''}`}
              onClick={() => {
                setActiveSearchTab('all');
                setSearchPage(1);
              }}
            >
              All ({searchCounts.all})
            </button>
            <button
              className={`navbar-search-tab ${activeSearchTab === 'article' ? 'active' : ''}`}
              onClick={() => {
                setActiveSearchTab('article');
                setSearchPage(1);
              }}
            >
              Articles ({searchCounts.articles})
            </button>
            <button
              className={`navbar-search-tab ${activeSearchTab === 'course' ? 'active' : ''}`}
              onClick={() => {
                setActiveSearchTab('course');
                setSearchPage(1);
              }}
            >
              Courses ({searchCounts.courses})
            </button>
            <button
              className={`navbar-search-tab ${activeSearchTab === 'tutorial' ? 'active' : ''}`}
              onClick={() => {
                setActiveSearchTab('tutorial');
                setSearchPage(1);
              }}
            >
              Tutorials ({searchCounts.tutorials})
            </button>
          </div>

          <div className="navbar-search-modal-content">
            {isSearchLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loading message="Searching..." size="sm" />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="navbar-search-empty-state">
                <h4>No results found</h4>
                <p>Try a different keyword or switch a category tab.</p>
              </div>
            ) : (
              <div className="navbar-search-results-grid">
                {searchResults.map((item) => renderSearchResultCard(item))}
              </div>
            )}
          </div>

          <div className="navbar-search-pagination">
            <button
              className="navbar-search-pagination-btn"
              disabled={searchPage <= 1 || searchTotalPages === 0}
              onClick={() => setSearchPage((prev) => Math.max(1, prev - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <div className="navbar-search-pagination-pages">
              {visiblePages.map((pageNo) => (
                <button
                  key={pageNo}
                  className={`navbar-search-page-pill ${pageNo === searchPage ? 'active' : ''}`}
                  onClick={() => setSearchPage(pageNo)}
                >
                  {pageNo}
                </button>
              ))}
            </div>
            <button
              className="navbar-search-pagination-btn"
              disabled={searchPage >= searchTotalPages || searchTotalPages === 0}
              onClick={() => setSearchPage((prev) => Math.min(searchTotalPages, prev + 1))}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
