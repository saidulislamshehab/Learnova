import { API_URL } from '@/utils/constants';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BookOpen,
  Check,
  ChevronLeft,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
  XCircle,
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
  | 'tutorials'
  | 'reports'
  | 'feedback';

type DetailView =
  | { type: 'none' }
  | { type: 'instructor-app'; id: string }
  | { type: 'expert-app'; id: string }
  | { type: 'article'; id: string }
  | { type: 'course'; id: string };

type StatusTone = 'pending' | 'approved' | 'rejected' | 'info' | 'resolved' | 'in_progress';

const STATUS_CLASS: Record<StatusTone, string> = {
  pending: 'admin-status admin-status-pending',
  approved: 'admin-status admin-status-approved',
  rejected: 'admin-status admin-status-rejected',
  info: 'admin-status admin-status-info',
  resolved: 'admin-status admin-status-approved',
  in_progress: 'admin-status admin-status-info',
};

const MENU_ITEMS: Array<{ id: ActiveSection; label: string; icon: any }> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'instructor-applications', label: 'Instructor Apps', icon: UserPlus },
  { id: 'expert-applications', label: 'Expert Apps', icon: UserCheck },
  { id: 'articles-approval', label: 'Articles Review', icon: FileText },
  { id: 'courses-approval', label: 'Courses Review', icon: BookOpen },
  { id: 'tutorials', label: 'Tutorials', icon: GraduationCap },
  { id: 'reports', label: 'Reports', icon: AlertTriangle },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
];

const EMPTY_NEW_USER_FORM = {
  name: '',
  email: '',
  password: '',
  role: '',
};

const getStatusTone = (value: string): StatusTone => {
  const normalized = String(value || '').toLowerCase();
  if (normalized === 'approved' || normalized === 'published') {
    return 'approved';
  }
  if (normalized === 'rejected' || normalized === 'draft') {
    return 'rejected';
  }
  if (normalized === 'resolved') {
    return 'resolved';
  }
  if (normalized === 'in_progress' || normalized === 'under review' || normalized === 'under_review') {
    return 'in_progress';
  }
  return 'pending';
};

const isHomepageFeatured = (value: unknown): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value === 1;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === '1' || normalized === 'true' || normalized === 'yes';
  }
  return false;
};

export function AdminPanel({ onBack }: AdminPanelProps) {
  const API_BASE = `${API_URL}`;

  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [detailView, setDetailView] = useState<DetailView>({ type: 'none' });
  const [searchQuery, setSearchQuery] = useState('');

  const [instructorApplications, setInstructorApplications] = useState<any[]>([]);
  const [isLoadingInstructorApplications, setIsLoadingInstructorApplications] = useState(false);

  const [expertApplications, setExpertApplications] = useState<any[]>([]);
  const [isLoadingExpertApplications, setIsLoadingExpertApplications] = useState(false);

  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [adminCourseApprovals, setAdminCourseApprovals] = useState<any[]>([]);
  const [isLoadingCourseApprovals, setIsLoadingCourseApprovals] = useState(false);
  const [courseApprovalsError, setCourseApprovalsError] = useState<string | null>(null);

  const [pendingArticles, setPendingArticles] = useState<any[]>([]);
  const [isLoadingPendingArticles, setIsLoadingPendingArticles] = useState(false);
  const [pendingArticlesError, setPendingArticlesError] = useState<string | null>(null);

  const [adminReports, setAdminReports] = useState<any[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);

  const [isLoadingReviewArticle, setIsLoadingReviewArticle] = useState(false);
  const [reviewArticle, setReviewArticle] = useState<any | null>(null);

  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState(EMPTY_NEW_USER_FORM);

  const [feedbackEntries, setFeedbackEntries] = useState<any[]>([]);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const [tutorials, setTutorials] = useState<any[]>([]);
  const [isLoadingTutorials, setIsLoadingTutorials] = useState(false);
  const [tutorialsError, setTutorialsError] = useState<string | null>(null);
  const [homepageFeatureUpdatingId, setHomepageFeatureUpdatingId] = useState<number | null>(null);
  const [editingTutorial, setEditingTutorial] = useState<any>(null);
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchingArticles, setIsSearchingArticles] = useState(false);
  const featuredTutorialCount = tutorials.filter((item: any) => isHomepageFeatured(item.Is_Homepage_Featured)).length;

  useEffect(() => {
    document.body.classList.add('admin-theme');
    return () => {
      document.body.classList.remove('admin-theme');
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return;
    }

    document.body.style.overflow = 'unset';
    document.documentElement.style.overflow = 'unset';
  }, [isSidebarOpen]);

  const fetchInstructorApplications = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setInstructorApplications([]);
      return;
    }

    try {
      setIsLoadingInstructorApplications(true);
      const response = await axios.get(`${API_BASE}/admin/instructor-applications`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const list = (response.data?.applications ?? []).map((item: any) => ({
        id: String(item.id),
        name: item.user?.name ?? 'Unknown',
        email: item.user?.email ?? 'N/A',
        expertise: item.expertise || item.user?.bio || 'Not provided',
        appliedDate: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
        status: item.status ? String(item.status) : 'pending',
      }));

      setInstructorApplications(list);
    } catch {
      setInstructorApplications([]);
    } finally {
      setIsLoadingInstructorApplications(false);
    }
  };

  const fetchExpertApplications = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setExpertApplications([]);
      return;
    }

    try {
      setIsLoadingExpertApplications(true);
      const response = await axios.get(`${API_BASE}/admin/expert-applications`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const list = (response.data?.applications ?? []).map((item: any) => ({
        id: String(item.id),
        name: item.user?.name ?? 'Unknown',
        email: item.user?.email ?? 'N/A',
        expertise: item.expertise || item.user?.bio || 'Not provided',
        appliedDate: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
        status: item.status ? String(item.status) : 'pending',
      }));

      setExpertApplications(list);
    } catch {
      setExpertApplications([]);
    } finally {
      setIsLoadingExpertApplications(false);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setAdminUsers([]);
      setUsersError('Please sign in as an admin to view users.');
      return;
    }

    try {
      setIsLoadingUsers(true);
      setUsersError(null);
      const response = await axios.get(`${API_BASE}/admin/users`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const rawUsers = response.data?.users ?? response.data?.data?.users ?? response.data?.data ?? [];
      const list = (Array.isArray(rawUsers) ? rawUsers : []).map((item: any) => ({
        id: String(item.id),
        name: item.name ?? 'Unknown',
        email: item.email ?? 'N/A',
        role: item.role ? String(item.role).toUpperCase() : 'STUDENT',
        status: 'active',
        joinDate: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
      }));

      setAdminUsers(list);
    } catch (error: any) {
      setAdminUsers([]);
      if (error?.response?.status === 403) {
        setUsersError('You do not have permission to view users.');
      } else if (error?.response?.status === 401) {
        setUsersError('Session expired. Please sign in again.');
      } else {
        setUsersError(error?.response?.data?.message || 'Failed to load users.');
      }
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchCourseApprovals = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setAdminCourseApprovals([]);
      setCourseApprovalsError('Please sign in as admin to view pending courses.');
      return;
    }

    try {
      setIsLoadingCourseApprovals(true);
      setCourseApprovalsError(null);
      const response = await axios.get(`${API_BASE}/admin/courses/pending`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const rawCourses = response.data?.courses ?? response.data?.data ?? [];
      const list = (Array.isArray(rawCourses) ? rawCourses : []).map((item: any) => ({
        id: String(item.CourseID ?? item.id),
        title: item.Title ?? item.title ?? 'Untitled Course',
        instructor: item.user?.name ?? item.instructor_name ?? 'Unknown',
        category: item.category_name ?? item.Category ?? 'Uncategorized',
        description: item.short_description ?? item.Description ?? 'No description provided.',
        submittedDate: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
        status: item.status ? String(item.status) : 'pending',
      }));

      setAdminCourseApprovals(list);
    } catch (error: any) {
      setAdminCourseApprovals([]);
      setCourseApprovalsError(error?.response?.data?.message || 'Failed to load pending courses.');
    } finally {
      setIsLoadingCourseApprovals(false);
    }
  };

  const fetchPendingArticles = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setPendingArticles([]);
      setPendingArticlesError('Please sign in as admin to view pending articles.');
      return;
    }

    try {
      setIsLoadingPendingArticles(true);
      setPendingArticlesError(null);
      const response = await axios.get(`${API_BASE}/admin/articles/pending`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const rawArticles = response.data?.articles ?? response.data?.data ?? [];
      const list = (Array.isArray(rawArticles) ? rawArticles : []).map((item: any) => ({
        id: String(item.id ?? item.Article_ID),
        title: item.Title ?? item.title ?? 'Untitled Article',
        author: item.user?.name ?? 'Unknown',
        category: item.Category ?? item.category ?? 'General',
        submittedDate: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
        status: item.Status ?? item.status ?? 'pending',
        content: item.Content ?? item.content ?? '',
      }));

      setPendingArticles(list);
    } catch (error: any) {
      setPendingArticles([]);
      setPendingArticlesError(error?.response?.data?.message || 'Failed to load pending articles.');
    } finally {
      setIsLoadingPendingArticles(false);
    }
  };

  const fetchReports = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setAdminReports([]);
      setReportsError('Please sign in as admin to view article reports.');
      return;
    }

    try {
      setIsLoadingReports(true);
      setReportsError(null);
      const response = await axios.get(`${API_BASE}/admin/reports`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const rawReports = response.data?.reports ?? response.data?.data ?? [];
      const list = (Array.isArray(rawReports) ? rawReports : []).map((item: any) => ({
        id: String(item.R_ID ?? item.id),
        articleId: String(item.Article_ID ?? item.article_id ?? ''),
        articleTitle: item.article?.Title ?? item.article?.title ?? 'Unknown Article',
        reportType: item.Report_Type ?? item.report_type ?? 'Unknown',
        description: item.Description ?? item.description ?? '',
        reportedBy: item.user?.name ?? 'Unknown',
        reportedAt: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
        status: String(item.Status ?? item.status ?? 'pending'),
      }));

      setAdminReports(list);
    } catch (error: any) {
      setAdminReports([]);
      setReportsError(error?.response?.data?.message || 'Failed to load article reports.');
    } finally {
      setIsLoadingReports(false);
    }
  };

  const fetchFeedbacks = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setFeedbackEntries([]);
      setFeedbackError('Please sign in as admin to view feedback.');
      return;
    }

    try {
      setIsLoadingFeedback(true);
      setFeedbackError(null);
      const response = await axios.get(`${API_BASE}/admin/feedbacks`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const rawFeedbacks = response.data?.feedbacks ?? [];
      const list = (Array.isArray(rawFeedbacks) ? rawFeedbacks : []).map((item: any) => ({
        id: String(item.F_ID ?? item.id),
        user: item.user?.name ?? 'Unknown',
        email: item.user?.email ?? '',
        subject: item.Subject ?? item.subject ?? 'No subject',
        type: item.Type ?? item.type ?? 'general',
        message: item.Description ?? item.description ?? '',
        date: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
        status: item.Status ?? item.status ?? 'pending',
      }));

      setFeedbackEntries(list);
    } catch (error: any) {
      setFeedbackEntries([]);
      setFeedbackError(error?.response?.data?.message || 'Failed to load feedback.');
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const fetchTutorials = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setTutorials([]);
      return;
    }

    setIsLoadingTutorials(true);
    setTutorialsError(null);
    try {
      const response = await axios.get(`${API_BASE}/admin/tutorials`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setTutorials(response.data.tutorials || []);
    } catch (err: any) {
      setTutorialsError(err.response?.data?.message || 'Failed to fetch tutorials');
    } finally {
      setIsLoadingTutorials(false);
    }
  };

  const searchArticlesForTutorial = async (query: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token || !query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearchingArticles(true);
    try {
      const response = await axios.get(`${API_BASE}/admin/tutorials/search-articles`, {
        params: { query },
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchResults(response.data.articles || []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearchingArticles(false);
    }
  };

  useEffect(() => {
    void fetchInstructorApplications();
    void fetchExpertApplications();
    void fetchUsers();
    void fetchCourseApprovals();
    void fetchPendingArticles();
    void fetchReports();
  }, []);

  useEffect(() => {
    setSearchQuery('');

    if (activeSection === 'users') {
      void fetchUsers();
    }
    if (activeSection === 'instructor-applications') {
      void fetchInstructorApplications();
    }
    if (activeSection === 'expert-applications') {
      void fetchExpertApplications();
    }
    if (activeSection === 'courses-approval') {
      void fetchCourseApprovals();
    }
    if (activeSection === 'articles-approval') {
      void fetchPendingArticles();
    }
    if (activeSection === 'reports') {
      void fetchReports();
    }
    if (activeSection === 'feedback') {
      void fetchFeedbacks();
    }
    if (activeSection === 'tutorials') {
      void fetchTutorials();
    }
  }, [activeSection]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void searchArticlesForTutorial(articleSearchQuery);
    }, 300);

    return () => clearTimeout(timeout);
  }, [articleSearchQuery]);

  const handleCreateUser = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Please sign in as admin.');
      return;
    }

    if (!newUserForm.name.trim() || !newUserForm.email.trim() || !newUserForm.password.trim() || !newUserForm.role) {
      alert('Name, email, password, and role are required.');
      return;
    }

    try {
      setIsCreatingUser(true);
      await axios.post(
        `${API_BASE}/admin/users`,
        {
          name: newUserForm.name.trim(),
          email: newUserForm.email.trim(),
          password: newUserForm.password,
          role: newUserForm.role,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsAddUserModalOpen(false);
      setNewUserForm(EMPTY_NEW_USER_FORM);
      await fetchUsers();
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message;
      const firstValidationError = error?.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]
        : null;
      const validationMessage = Array.isArray(firstValidationError) ? firstValidationError[0] : null;
      alert(apiMessage || validationMessage || 'Failed to add user.');
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    if (type !== 'user') {
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Please sign in as admin.');
      return;
    }

    try {
      setDeletingUserId(id);
      await axios.delete(`${API_BASE}/admin/users/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setAdminUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleApprove = (type: string, id: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Please sign in as admin.');
      return;
    }

    if (type === 'course') {
      void axios
        .put(
          `${API_BASE}/admin/courses/${id}`,
          { status: 'published' },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          void fetchCourseApprovals();
        })
        .catch((error) => {
          alert(error?.response?.data?.message || 'Failed to approve course');
        });
      return;
    }

    if (type === 'instructor application') {
      void axios
        .put(
          `${API_BASE}/admin/instructor-applications/${id}`,
          { status: 'approved' },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          void fetchInstructorApplications();
        })
        .catch((error) => {
          alert(error?.response?.data?.message || 'Failed to approve application');
        });
      return;
    }

    if (type === 'expert application') {
      void axios
        .put(
          `${API_BASE}/admin/expert-applications/${id}`,
          { status: 'approved' },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          void fetchExpertApplications();
        })
        .catch((error) => {
          alert(error?.response?.data?.message || 'Failed to approve application');
        });
      return;
    }

    if (type === 'article') {
      void axios
        .put(
          `${API_BASE}/admin/articles/${id}`,
          { status: 'published' },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          void fetchPendingArticles();
        })
        .catch((error) => {
          alert(error?.response?.data?.message || 'Failed to approve article');
        });
      return;
    }
  };

  const handleReject = (type: string, id: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Please sign in as admin.');
      return;
    }

    if (type === 'course') {
      void axios
        .put(
          `${API_BASE}/admin/courses/${id}`,
          { status: 'draft' },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          void fetchCourseApprovals();
        })
        .catch((error) => {
          alert(error?.response?.data?.message || 'Failed to reject course');
        });
      return;
    }

    if (type === 'instructor application') {
      void axios
        .put(
          `${API_BASE}/admin/instructor-applications/${id}`,
          { status: 'rejected' },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          void fetchInstructorApplications();
        })
        .catch((error) => {
          alert(error?.response?.data?.message || 'Failed to reject application');
        });
      return;
    }

    if (type === 'expert application') {
      void axios
        .put(
          `${API_BASE}/admin/expert-applications/${id}`,
          { status: 'rejected' },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          void fetchExpertApplications();
        })
        .catch((error) => {
          alert(error?.response?.data?.message || 'Failed to reject application');
        });
      return;
    }

    if (type === 'article') {
      void axios
        .put(
          `${API_BASE}/admin/articles/${id}`,
          { status: 'rejected' },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          void fetchPendingArticles();
        })
        .catch((error) => {
          alert(error?.response?.data?.message || 'Failed to reject article');
        });
      return;
    }
  };

  const updateReportStatus = async (id: string, status: 'pending' | 'under_review' | 'resolved') => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Please sign in as admin.');
      return;
    }

    try {
      await axios.put(
        `${API_BASE}/admin/reports/${id}`,
        { status },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchReports();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to update report status.');
    }
  };

  const updateFeedbackStatus = async (id: string, status: 'pending' | 'in_progress' | 'resolved') => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Please sign in as admin.');
      return;
    }

    try {
      await axios.put(
        `${API_BASE}/admin/feedbacks/${id}`,
        { status },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchFeedbacks();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to update feedback status.');
    }
  };

  const handleReviewReportedArticle = async (articleId: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Please sign in as admin.');
      return;
    }

    try {
      setIsLoadingReviewArticle(true);
      const existingArticle = pendingArticles.find((article) => article.id === articleId);
      if (existingArticle) {
        setReviewArticle(existingArticle);
        setDetailView({ type: 'article', id: articleId });
        return;
      }

      const response = await axios.get(`${API_BASE}/articles/${articleId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const rawArticle = response.data?.article ?? null;
      if (rawArticle) {
        setReviewArticle({
          id: String(rawArticle.id ?? rawArticle.Article_ID ?? articleId),
          title: rawArticle.Title ?? rawArticle.title ?? 'Untitled Article',
          author: rawArticle.user?.name ?? 'Unknown',
          category: rawArticle.Category ?? rawArticle.category ?? 'General',
          submittedDate: rawArticle.created_at ? new Date(rawArticle.created_at).toLocaleDateString() : 'N/A',
          status: rawArticle.Status ?? rawArticle.status ?? 'published',
          content: rawArticle.Content ?? rawArticle.content ?? '',
        });
      } else {
        setReviewArticle(null);
      }
      setDetailView({ type: 'article', id: articleId });
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to load article for review.');
    } finally {
      setIsLoadingReviewArticle(false);
    }
  };

  const handleEditTutorial = async (id: number) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return;
    }

    try {
      const response = await axios.get(`${API_BASE}/admin/tutorials/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const tutorial = response.data.tutorial;
      setEditingTutorial({
        id: tutorial.T_ID,
        title: tutorial.Title,
        category: tutorial.Category,
        description: tutorial.Description,
        status: tutorial.Status,
        articles:
          tutorial.articles?.map((item: any) => ({
            ...item,
            Article_ID: item.Article_ID,
          })) ?? [],
      });
    } catch {
      alert('Failed to fetch tutorial details.');
    }
  };

  const handleSaveTutorial = async (status: 'draft' | 'published') => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return;
    }

    if (!editingTutorial.title || !editingTutorial.category || !editingTutorial.description || editingTutorial.articles.length === 0) {
      alert('Please fill in all basic info and add at least one article.');
      return;
    }

    try {
      const payload = {
        title: editingTutorial.title,
        category: editingTutorial.category,
        description: editingTutorial.description,
        status,
        articles: editingTutorial.articles.map((article: any, index: number) => ({
          id: article.Article_ID || article.id,
          order: index + 1,
        })),
      };

      await axios.post(`${API_BASE}/admin/tutorials`, payload, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setEditingTutorial(null);
      await fetchTutorials();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save tutorial');
    }
  };

  const handleDeleteTutorial = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this tutorial? This action cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Please sign in as admin.');
      return;
    }

    try {
      await axios.delete(`${API_BASE}/admin/tutorials/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchTutorials();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete tutorial');
    }
  };

  const handleToggleHomepageFeature = async (tutorial: any) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Please sign in as admin.');
      return;
    }

    const isFeatured = isHomepageFeatured(tutorial.Is_Homepage_Featured);
    const featuredCount = tutorials.filter((item) => isHomepageFeatured(item.Is_Homepage_Featured)).length;
    if (!isFeatured && featuredCount >= 6) {
      alert('You can feature only 6 tutorials on the homepage.');
      return;
    }

    try {
      setHomepageFeatureUpdatingId(Number(tutorial.T_ID));
      await axios.put(
        `${API_BASE}/admin/tutorials/${tutorial.T_ID}/homepage-featured`,
        { featured: !isFeatured },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchTutorials();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to update homepage feature setting.');
    } finally {
      setHomepageFeatureUpdatingId(null);
    }
  };

  const handleAddArticleToTutorial = (article: any) => {
    const articleId = article.Article_ID || article.id;
    if (editingTutorial.articles.find((item: any) => (item.Article_ID || item.id) === articleId)) {
      return;
    }
    setEditingTutorial({
      ...editingTutorial,
      articles: [...editingTutorial.articles, article],
    });
  };

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return adminUsers;
    }

    return adminUsers.filter((user) =>
      [user.name, user.email, user.role].some((value) => String(value).toLowerCase().includes(query))
    );
  }, [adminUsers, searchQuery]);

  const filteredInstructorApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return instructorApplications;
    }

    return instructorApplications.filter((item) =>
      [item.name, item.email, item.expertise].some((value) => String(value).toLowerCase().includes(query))
    );
  }, [instructorApplications, searchQuery]);

  const filteredExpertApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return expertApplications;
    }

    return expertApplications.filter((item) =>
      [item.name, item.email, item.expertise].some((value) => String(value).toLowerCase().includes(query))
    );
  }, [expertApplications, searchQuery]);

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return pendingArticles;
    }

    return pendingArticles.filter((article) =>
      [article.title, article.author, article.category].some((value) => String(value).toLowerCase().includes(query))
    );
  }, [pendingArticles, searchQuery]);

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return adminCourseApprovals;
    }

    return adminCourseApprovals.filter((course) =>
      [course.title, course.instructor, course.category].some((value) => String(value).toLowerCase().includes(query))
    );
  }, [adminCourseApprovals, searchQuery]);

  const summaryCards = [
    {
      label: 'Users',
      value: adminUsers.length,
      helper: 'Registered accounts',
      icon: Users,
    },
    {
      label: 'Pending Courses',
      value: adminCourseApprovals.length,
      helper: 'Need approval',
      icon: BookOpen,
    },
    {
      label: 'Pending Articles',
      value: pendingArticles.length,
      helper: 'Need moderation',
      icon: FileText,
    },
    {
      label: 'Open Reports',
      value: adminReports.filter((item) => getStatusTone(item.status) === 'pending').length,
      helper: 'Potential abuse',
      icon: AlertTriangle,
    },
  ];

  const recentActions = [
    ...instructorApplications
      .filter((item) => getStatusTone(item.status) === 'pending')
      .slice(0, 3)
      .map((item) => ({
        id: `instructor-${item.id}`,
        label: `${item.name} applied as instructor`,
        date: item.appliedDate,
        section: 'instructor-applications' as ActiveSection,
      })),
    ...expertApplications
      .filter((item) => getStatusTone(item.status) === 'pending')
      .slice(0, 3)
      .map((item) => ({
        id: `expert-${item.id}`,
        label: `${item.name} applied as expert`,
        date: item.appliedDate,
        section: 'expert-applications' as ActiveSection,
      })),
    ...pendingArticles.slice(0, 3).map((item) => ({
      id: `article-${item.id}`,
      label: `Article ready for review: ${item.title}`,
      date: item.submittedDate,
      section: 'articles-approval' as ActiveSection,
    })),
  ].slice(0, 8);

  const activeSectionTitle = MENU_ITEMS.find((item) => item.id === activeSection)?.label || 'Overview';

  const refreshCurrentSection = () => {
    if (activeSection === 'overview') {
      void fetchUsers();
      void fetchInstructorApplications();
      void fetchExpertApplications();
      void fetchCourseApprovals();
      void fetchPendingArticles();
      void fetchReports();
      return;
    }
    if (activeSection === 'users') {
      void fetchUsers();
      return;
    }
    if (activeSection === 'instructor-applications') {
      void fetchInstructorApplications();
      return;
    }
    if (activeSection === 'expert-applications') {
      void fetchExpertApplications();
      return;
    }
    if (activeSection === 'articles-approval') {
      void fetchPendingArticles();
      return;
    }
    if (activeSection === 'courses-approval') {
      void fetchCourseApprovals();
      return;
    }
    if (activeSection === 'reports') {
      void fetchReports();
      return;
    }
    if (activeSection === 'feedback') {
      void fetchFeedbacks();
      return;
    }
    if (activeSection === 'tutorials') {
      void fetchTutorials();
    }
  };

  const closeDetail = () => {
    setDetailView({ type: 'none' });
    setReviewArticle(null);
  };

  const renderDetailView = () => {
    if (detailView.type === 'none') {
      return null;
    }

    if (detailView.type === 'article') {
      const article = pendingArticles.find((entry) => entry.id === detailView.id) || reviewArticle;
      if (!article) {
        return null;
      }

      return (
        <section className="admin-content-shell">
          <button onClick={closeDetail} className="admin-link-btn">
            <ChevronLeft className="h-4 w-4" />
            Back to list
          </button>
          <div className="admin-surface admin-surface-padded">
            {isLoadingReviewArticle ? (
              <div className="admin-inline-alert">Loading article details...</div>
            ) : null}
            <h2 className="admin-detail-title">{article.title}</h2>
            <div className="admin-detail-meta">
              <span>Author: {article.author}</span>
              <span>Category: {article.category}</span>
              <span>Submitted: {article.submittedDate}</span>
            </div>
            <div className="admin-detail-content">
              {article.content ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                <p>No content available for this article.</p>
              )}
            </div>
            <div className="admin-detail-actions">
              <button onClick={() => handleApprove('article', article.id)} className="admin-btn admin-btn-primary">
                <Check className="h-4 w-4" />
                Approve Article
              </button>
              <button onClick={() => handleReject('article', article.id)} className="admin-btn admin-btn-muted">
                <XCircle className="h-4 w-4" />
                Reject Article
              </button>
            </div>
          </div>
        </section>
      );
    }

    if (detailView.type === 'course') {
      const course = adminCourseApprovals.find((entry) => entry.id === detailView.id);
      if (!course) {
        return null;
      }

      return (
        <section className="admin-content-shell">
          <button onClick={closeDetail} className="admin-link-btn">
            <ChevronLeft className="h-4 w-4" />
            Back to courses
          </button>
          <div className="admin-surface admin-surface-padded">
            <h2 className="admin-detail-title">{course.title}</h2>
            <div className="admin-detail-meta">
              <span>Instructor: {course.instructor}</span>
              <span>Category: {course.category}</span>
              <span>Submitted: {course.submittedDate}</span>
            </div>
            <p className="admin-detail-content">{course.description}</p>
            <div className="admin-detail-actions">
              <button onClick={() => handleApprove('course', course.id)} className="admin-btn admin-btn-primary">
                <Check className="h-4 w-4" />
                Approve Course
              </button>
              <button onClick={() => handleReject('course', course.id)} className="admin-btn admin-btn-muted">
                <XCircle className="h-4 w-4" />
                Reject Course
              </button>
            </div>
          </div>
        </section>
      );
    }

    const source = detailView.type === 'instructor-app' ? instructorApplications : expertApplications;
    const record = source.find((entry) => entry.id === detailView.id);
    if (!record) {
      return null;
    }

    const appType = detailView.type === 'instructor-app' ? 'instructor application' : 'expert application';
    return (
      <section className="admin-content-shell">
        <button onClick={closeDetail} className="admin-link-btn">
          <ChevronLeft className="h-4 w-4" />
          Back to applications
        </button>
        <div className="admin-surface admin-surface-padded">
          <h2 className="admin-detail-title">{record.name}</h2>
          <div className="admin-detail-meta">
            <span>Email: {record.email}</span>
            <span>Expertise: {record.expertise}</span>
            <span>Applied: {record.appliedDate}</span>
          </div>
          <div className="admin-detail-actions">
            <button onClick={() => handleApprove(appType, record.id)} className="admin-btn admin-btn-primary">
              <Check className="h-4 w-4" />
              Approve
            </button>
            <button onClick={() => handleReject(appType, record.id)} className="admin-btn admin-btn-muted">
              <XCircle className="h-4 w-4" />
              Reject
            </button>
          </div>
        </div>
      </section>
    );
  };

  if (detailView.type !== 'none') {
    return (
      <div className="admin-layout-root">
        <div className="admin-grid-bg" />
        <div className="admin-radial admin-radial-one" />
        <div className="admin-radial admin-radial-two" />
        <div className="admin-page-wrap">{renderDetailView()}</div>
      </div>
    );
  }

  return (
    <div className="admin-layout-root">
      <div className="admin-grid-bg" />
      <div className="admin-radial admin-radial-one" />
      <div className="admin-radial admin-radial-two" />

      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-topbar-left">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="admin-icon-btn lg:hidden"
              aria-label="Toggle navigation"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="admin-heading">Learnova Admin</h1>
            </div>
          </div>

          <div className="admin-topbar-right">
            <button onClick={refreshCurrentSection} className="admin-btn admin-btn-muted">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button onClick={onBack} className="admin-btn admin-btn-danger">
              Exit
            </button>
          </div>
        </div>
      </header>

      <aside className={`admin-sidebar ${isSidebarOpen ? 'admin-sidebar-open' : ''}`}>
        <div className="admin-sidebar-header">
          <ShieldCheck className="h-5 w-5 text-[var(--admin-accent)]" />
        </div>
        <nav className="admin-sidebar-nav">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`admin-sidebar-item ${isActive ? 'admin-sidebar-item-active' : ''}`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {isSidebarOpen ? <button className="admin-overlay lg:hidden" onClick={() => setIsSidebarOpen(false)} /> : null}

      <main className="admin-main">
        <section className="admin-page-wrap">
          <div className="admin-section-header">
            <div>
              <h2 className="admin-section-title">{activeSectionTitle}</h2>
              <p className="admin-section-subtitle">Responsive moderation workspace with reusable dark components.</p>
            </div>
            {activeSection !== 'overview' && activeSection !== 'reports' && activeSection !== 'feedback' && activeSection !== 'tutorials' ? (
              <div className="min-w-[220px]">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search"
                  className="admin-input"
                />
              </div>
            ) : null}
          </div>

          {activeSection === 'overview' ? (
            <>
              <div className="admin-cards-grid">
                {summaryCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <article className="admin-metric-card" key={card.label}>
                      <div className="admin-metric-head">
                        <span>{card.label}</span>
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="admin-metric-value">{card.value.toLocaleString()}</p>
                      <p className="admin-metric-helper">{card.helper}</p>
                    </article>
                  );
                })}
              </div>

              <div className="admin-surface admin-surface-padded">
                <h3 className="admin-subheading">Recent Actions</h3>
                {recentActions.length === 0 ? (
                  <p className="admin-muted">No pending actions right now.</p>
                ) : (
                  <div className="admin-list-stack">
                    {recentActions.map((item) => (
                      <div key={item.id} className="admin-list-row">
                        <div>
                          <p className="admin-list-title">{item.label}</p>
                          <p className="admin-list-caption">{item.date}</p>
                        </div>
                        <button onClick={() => setActiveSection(item.section)} className="admin-btn admin-btn-muted">
                          Open
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}

          {activeSection === 'users' ? (
            <div className="admin-surface admin-surface-padded">
              <div className="admin-toolbar">
                <p className="admin-muted">{filteredUsers.length} users found</p>
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => {
                    setNewUserForm(EMPTY_NEW_USER_FORM);
                    setIsAddUserModalOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add User
                </button>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table min-w-[720px]">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingUsers ? (
                      <tr>
                        <td colSpan={5} className="admin-muted-cell">
                          Loading users...
                        </td>
                      </tr>
                    ) : usersError ? (
                      <tr>
                        <td colSpan={5} className="admin-danger-cell">
                          {usersError}
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="admin-muted-cell">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className="admin-chip">{user.role}</span>
                          </td>
                          <td>{user.joinDate}</td>
                          <td>
                            <div className="admin-inline-actions">
                              <button className="admin-btn admin-btn-muted">View</button>
                              <button
                                className="admin-icon-btn"
                                onClick={() => {
                                  void handleDelete('user', user.id);
                                }}
                                disabled={deletingUserId === user.id}
                                aria-label="Delete user"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {activeSection === 'instructor-applications' ? (
            <div className="admin-surface admin-surface-padded">
              <div className="admin-table-wrap">
                <table className="admin-table min-w-[760px]">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Expertise</th>
                      <th>Applied</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingInstructorApplications ? (
                      <tr>
                        <td colSpan={6} className="admin-muted-cell">
                          Loading applications...
                        </td>
                      </tr>
                    ) : filteredInstructorApplications.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="admin-muted-cell">
                          No applications found.
                        </td>
                      </tr>
                    ) : (
                      filteredInstructorApplications.map((app) => (
                        <tr key={app.id}>
                          <td>{app.name}</td>
                          <td>{app.email}</td>
                          <td>{app.expertise}</td>
                          <td>{app.appliedDate}</td>
                          <td>
                            <span className={STATUS_CLASS[getStatusTone(app.status)]}>{String(app.status)}</span>
                          </td>
                          <td>
                            <div className="admin-inline-actions">
                              <button className="admin-btn admin-btn-muted" onClick={() => setDetailView({ type: 'instructor-app', id: app.id })}>
                                View
                              </button>
                              <button className="admin-btn admin-btn-primary" onClick={() => handleApprove('instructor application', app.id)}>
                                Approve
                              </button>
                              <button className="admin-btn admin-btn-muted" onClick={() => handleReject('instructor application', app.id)}>
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {activeSection === 'expert-applications' ? (
            <div className="admin-surface admin-surface-padded">
              <div className="admin-table-wrap">
                <table className="admin-table min-w-[760px]">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Expertise</th>
                      <th>Applied</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingExpertApplications ? (
                      <tr>
                        <td colSpan={6} className="admin-muted-cell">
                          Loading applications...
                        </td>
                      </tr>
                    ) : filteredExpertApplications.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="admin-muted-cell">
                          No applications found.
                        </td>
                      </tr>
                    ) : (
                      filteredExpertApplications.map((app) => (
                        <tr key={app.id}>
                          <td>{app.name}</td>
                          <td>{app.email}</td>
                          <td>{app.expertise}</td>
                          <td>{app.appliedDate}</td>
                          <td>
                            <span className={STATUS_CLASS[getStatusTone(app.status)]}>{String(app.status)}</span>
                          </td>
                          <td>
                            <div className="admin-inline-actions">
                              <button className="admin-btn admin-btn-muted" onClick={() => setDetailView({ type: 'expert-app', id: app.id })}>
                                View
                              </button>
                              <button className="admin-btn admin-btn-primary" onClick={() => handleApprove('expert application', app.id)}>
                                Approve
                              </button>
                              <button className="admin-btn admin-btn-muted" onClick={() => handleReject('expert application', app.id)}>
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {activeSection === 'articles-approval' ? (
            <div className="admin-surface admin-surface-padded">
              <div className="admin-table-wrap">
                <table className="admin-table min-w-[760px]">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Submitted</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingPendingArticles ? (
                      <tr>
                        <td colSpan={6} className="admin-muted-cell">
                          Loading pending articles...
                        </td>
                      </tr>
                    ) : pendingArticlesError ? (
                      <tr>
                        <td colSpan={6} className="admin-danger-cell">
                          {pendingArticlesError}
                        </td>
                      </tr>
                    ) : filteredArticles.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="admin-muted-cell">
                          No articles found.
                        </td>
                      </tr>
                    ) : (
                      filteredArticles.map((article) => (
                        <tr key={article.id}>
                          <td>{article.title}</td>
                          <td>{article.author}</td>
                          <td>{article.category}</td>
                          <td>{article.submittedDate}</td>
                          <td>
                            <span className={STATUS_CLASS[getStatusTone(article.status)]}>{String(article.status)}</span>
                          </td>
                          <td>
                            <div className="admin-inline-actions">
                              <button className="admin-btn admin-btn-muted" onClick={() => setDetailView({ type: 'article', id: article.id })}>
                                View
                              </button>
                              <button className="admin-btn admin-btn-primary" onClick={() => handleApprove('article', article.id)}>
                                Approve
                              </button>
                              <button className="admin-btn admin-btn-muted" onClick={() => handleReject('article', article.id)}>
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {activeSection === 'courses-approval' ? (
            <div className="admin-surface admin-surface-padded">
              <div className="admin-table-wrap">
                <table className="admin-table min-w-[760px]">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Instructor</th>
                      <th>Category</th>
                      <th>Submitted</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingCourseApprovals ? (
                      <tr>
                        <td colSpan={6} className="admin-muted-cell">
                          Loading pending courses...
                        </td>
                      </tr>
                    ) : courseApprovalsError ? (
                      <tr>
                        <td colSpan={6} className="admin-danger-cell">
                          {courseApprovalsError}
                        </td>
                      </tr>
                    ) : filteredCourses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="admin-muted-cell">
                          No courses found.
                        </td>
                      </tr>
                    ) : (
                      filteredCourses.map((course) => (
                        <tr key={course.id}>
                          <td>{course.title}</td>
                          <td>{course.instructor}</td>
                          <td>{course.category}</td>
                          <td>{course.submittedDate}</td>
                          <td>
                            <span className={STATUS_CLASS[getStatusTone(course.status)]}>{String(course.status)}</span>
                          </td>
                          <td>
                            <div className="admin-inline-actions">
                              <button className="admin-btn admin-btn-muted" onClick={() => setDetailView({ type: 'course', id: course.id })}>
                                View
                              </button>
                              <button className="admin-btn admin-btn-primary" onClick={() => handleApprove('course', course.id)}>
                                Approve
                              </button>
                              <button className="admin-btn admin-btn-muted" onClick={() => handleReject('course', course.id)}>
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {activeSection === 'reports' ? (
            <div className="admin-cards-grid">
              {isLoadingReports ? <div className="admin-surface admin-surface-padded">Loading reports...</div> : null}
              {reportsError ? <div className="admin-surface admin-surface-padded admin-danger-cell">{reportsError}</div> : null}
              {!isLoadingReports && !reportsError
                ? adminReports.map((report) => (
                    <article key={report.id} className="admin-surface admin-surface-padded">
                      <div className="admin-report-head">
                        <p className="admin-list-title">{report.reportType}</p>
                        <span className={STATUS_CLASS[getStatusTone(report.status)]}>{String(report.status)}</span>
                      </div>
                      <p className="admin-list-caption">By {report.reportedBy} • {report.reportedAt}</p>
                      <p className="admin-report-title">{report.articleTitle}</p>
                      <p className="admin-muted">{report.description}</p>
                      <div className="admin-inline-actions mt-4">
                        <button className="admin-btn admin-btn-muted" onClick={() => void handleReviewReportedArticle(report.articleId)}>
                          Review Article
                        </button>
                        <button className="admin-btn admin-btn-primary" onClick={() => updateReportStatus(report.id, 'resolved')}>
                          Resolve
                        </button>
                        <button className="admin-btn admin-btn-muted" onClick={() => updateReportStatus(report.id, 'under_review')}>
                          Take Action
                        </button>
                      </div>
                    </article>
                  ))
                : null}
            </div>
          ) : null}

          {activeSection === 'feedback' ? (
            <div className="admin-list-stack">
              {isLoadingFeedback ? <div className="admin-surface admin-surface-padded">Loading feedback...</div> : null}
              {feedbackError ? <div className="admin-surface admin-surface-padded admin-danger-cell">{feedbackError}</div> : null}
              {!isLoadingFeedback && !feedbackError
                ? feedbackEntries.map((feedback) => (
                    <article key={feedback.id} className="admin-surface admin-surface-padded">
                      <div className="admin-report-head">
                        <div>
                          <p className="admin-list-title">{feedback.subject}</p>
                          <p className="admin-list-caption">From {feedback.user} {feedback.email ? `(${feedback.email})` : ''} • {feedback.date}</p>
                        </div>
                        <span className={STATUS_CLASS[getStatusTone(feedback.status)]}>{String(feedback.status)}</span>
                      </div>
                      <p className="admin-muted mt-3">{feedback.message}</p>
                      <div className="admin-inline-actions mt-4">
                        {feedback.status !== 'in_progress' ? (
                          <button className="admin-btn admin-btn-muted" onClick={() => updateFeedbackStatus(feedback.id, 'in_progress')}>
                            In Progress
                          </button>
                        ) : null}
                        {feedback.status !== 'resolved' ? (
                          <button className="admin-btn admin-btn-primary" onClick={() => updateFeedbackStatus(feedback.id, 'resolved')}>
                            Resolve
                          </button>
                        ) : null}
                        {feedback.status !== 'pending' ? (
                          <button className="admin-btn admin-btn-muted" onClick={() => updateFeedbackStatus(feedback.id, 'pending')}>
                            Reset
                          </button>
                        ) : null}
                      </div>
                    </article>
                  ))
                : null}
            </div>
          ) : null}

          {activeSection === 'tutorials' ? (
            <>
              {!editingTutorial ? (
                <div className="admin-list-stack">
                  <div className="admin-toolbar">
                    <p className="admin-muted">
                      Manage and publish learning paths ({featuredTutorialCount}/6 featured on homepage)
                    </p>
                    <button
                      className="admin-btn admin-btn-primary"
                      onClick={() =>
                        setEditingTutorial({
                          title: '',
                          category: '',
                          description: '',
                          status: 'draft',
                          articles: [],
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Create Tutorial
                    </button>
                  </div>

                  {isLoadingTutorials ? <div className="admin-surface admin-surface-padded">Loading tutorials...</div> : null}
                  {tutorialsError ? <div className="admin-surface admin-surface-padded admin-danger-cell">{tutorialsError}</div> : null}

                  {!isLoadingTutorials && !tutorialsError ? (
                    <div className="admin-cards-grid">
                      {tutorials.map((tutorial: any) => (
                        <article key={tutorial.T_ID} className="admin-surface admin-surface-padded">
                          <div className="admin-report-head">
                            <div>
                              <p className="admin-list-title">{tutorial.Title}</p>
                              {isHomepageFeatured(tutorial.Is_Homepage_Featured) ? (
                                <p className="admin-list-caption">Homepage slot #{tutorial.Homepage_Featured_Order ?? '-'}</p>
                              ) : null}
                            </div>
                            <span className={STATUS_CLASS[getStatusTone(tutorial.Status)]}>{String(tutorial.Status)}</span>
                          </div>
                          <p className="admin-list-caption">{tutorial.Category}</p>
                          <p className="admin-muted mt-2">{tutorial.Description}</p>
                          <div className="admin-inline-actions mt-4">
                            <button className="admin-btn admin-btn-muted" onClick={() => void handleEditTutorial(tutorial.T_ID)}>
                              Edit
                            </button>
                            <button
                              className="admin-btn admin-btn-muted"
                              disabled={homepageFeatureUpdatingId === tutorial.T_ID}
                              onClick={() => void handleToggleHomepageFeature(tutorial)}
                            >
                              {isHomepageFeatured(tutorial.Is_Homepage_Featured) ? 'Remove from Homepage' : 'Show on Homepage'}
                            </button>
                            <button className="admin-btn admin-btn-danger" onClick={() => void handleDeleteTutorial(tutorial.T_ID)}>
                              Delete
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="admin-tutorial-editor">
                  <div className="admin-surface admin-surface-padded">
                    <div className="admin-toolbar">
                      <h3 className="admin-subheading">{editingTutorial.id ? 'Edit Tutorial' : 'Create Tutorial'}</h3>
                      <div className="admin-inline-actions">
                        <button className="admin-btn admin-btn-muted" onClick={() => setEditingTutorial(null)}>
                          Cancel
                        </button>
                        <button className="admin-btn admin-btn-muted" onClick={() => void handleSaveTutorial('draft')}>
                          <Save className="h-4 w-4" />
                          Save Draft
                        </button>
                        <button className="admin-btn admin-btn-primary" onClick={() => void handleSaveTutorial('published')}>
                          Publish
                        </button>
                      </div>
                    </div>

                    <div className="admin-form-grid">
                      <label className="admin-label-wrap">
                        <span>Title</span>
                        <input
                          className="admin-input"
                          value={editingTutorial.title}
                          onChange={(event) => setEditingTutorial({ ...editingTutorial, title: event.target.value })}
                          placeholder="e.g. React Fundamentals"
                        />
                      </label>
                      <label className="admin-label-wrap">
                        <span>Category</span>
                        <input
                          className="admin-input"
                          value={editingTutorial.category}
                          onChange={(event) => setEditingTutorial({ ...editingTutorial, category: event.target.value })}
                          placeholder="e.g. Frontend"
                        />
                      </label>
                      <label className="admin-label-wrap admin-label-wrap-full">
                        <span>Description</span>
                        <textarea
                          className="admin-input admin-textarea"
                          value={editingTutorial.description}
                          onChange={(event) => setEditingTutorial({ ...editingTutorial, description: event.target.value })}
                          placeholder="Describe this tutorial"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="admin-editor-columns">
                    <div className="admin-surface admin-surface-padded">
                      <h4 className="admin-subheading">Article Search</h4>
                      <div className="mt-3">
                        <input
                          className="admin-input"
                          value={articleSearchQuery}
                          onChange={(event) => setArticleSearchQuery(event.target.value)}
                          placeholder="Search published articles"
                        />
                      </div>
                      <div className="admin-list-stack mt-4 max-h-[22rem] overflow-y-auto pr-1">
                        {isSearchingArticles ? <p className="admin-muted">Searching...</p> : null}
                        {!isSearchingArticles
                          ? searchResults
                              .filter(
                                (result: any) =>
                                  !editingTutorial.articles.find(
                                    (selected: any) => (selected.Article_ID || selected.id) === (result.Article_ID || result.id)
                                  )
                              )
                              .map((article: any) => (
                                <div key={article.Article_ID || article.id} className="admin-list-row">
                                  <div>
                                    <p className="admin-list-title">{article.Title || article.title}</p>
                                    <p className="admin-list-caption">{article.Category || article.category}</p>
                                  </div>
                                  <button className="admin-btn admin-btn-muted" onClick={() => handleAddArticleToTutorial(article)}>
                                    <Plus className="h-4 w-4" />
                                    Add
                                  </button>
                                </div>
                              ))
                          : null}
                      </div>
                    </div>

                    <div className="admin-surface admin-surface-padded">
                      <h4 className="admin-subheading">Selected Articles ({editingTutorial.articles.length})</h4>
                      <div className="admin-list-stack mt-4">
                        {editingTutorial.articles.map((article: any, index: number) => (
                          <div key={article.Article_ID || article.id} className="admin-list-row">
                            <div>
                              <p className="admin-list-title">{article.Title || article.title}</p>
                              <p className="admin-list-caption">Order {index + 1}</p>
                            </div>
                            <div className="admin-inline-actions">
                              <button
                                className="admin-icon-btn"
                                disabled={index === 0}
                                onClick={() => {
                                  const next = [...editingTutorial.articles];
                                  [next[index - 1], next[index]] = [next[index], next[index - 1]];
                                  setEditingTutorial({ ...editingTutorial, articles: next });
                                }}
                                aria-label="Move up"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </button>
                              <button
                                className="admin-icon-btn"
                                disabled={index === editingTutorial.articles.length - 1}
                                onClick={() => {
                                  const next = [...editingTutorial.articles];
                                  [next[index + 1], next[index]] = [next[index], next[index + 1]];
                                  setEditingTutorial({ ...editingTutorial, articles: next });
                                }}
                                aria-label="Move down"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </button>
                              <button
                                className="admin-icon-btn"
                                onClick={() => {
                                  const next = editingTutorial.articles.filter((_: any, i: number) => i !== index);
                                  setEditingTutorial({ ...editingTutorial, articles: next });
                                }}
                                aria-label="Remove article"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </section>
      </main>

      {isAddUserModalOpen ? (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-label="Add user">
          <div className="admin-modal">
            <div className="admin-toolbar">
              <h3 className="admin-subheading">Create New User</h3>
              <button className="admin-icon-btn" onClick={() => setIsAddUserModalOpen(false)} aria-label="Close modal">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="admin-form-grid mt-4">
              <label className="admin-label-wrap">
                <span>Full Name</span>
                <input
                  className="admin-input"
                  value={newUserForm.name}
                  onChange={(event) => setNewUserForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="e.g. Alex Johnson"
                />
              </label>
              <label className="admin-label-wrap">
                <span>Email</span>
                <input
                  className="admin-input"
                  type="email"
                  value={newUserForm.email}
                  onChange={(event) => setNewUserForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="e.g. alex@learnova.io"
                />
              </label>
              <label className="admin-label-wrap">
                <span>Password</span>
                <input
                  className="admin-input"
                  type="password"
                  value={newUserForm.password}
                  onChange={(event) => setNewUserForm((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Create temporary password"
                />
              </label>
              <label className="admin-label-wrap">
                <span>Role</span>
                <select
                  className="admin-input"
                  value={newUserForm.role}
                  onChange={(event) => setNewUserForm((prev) => ({ ...prev, role: event.target.value }))}
                >
                  <option value="">Select role</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="expert">Expert</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            </div>
            <div className="admin-toolbar mt-6">
              <div />
              <div className="admin-inline-actions">
                <button className="admin-btn admin-btn-muted" onClick={() => setIsAddUserModalOpen(false)}>
                  Cancel
                </button>
                <button className="admin-btn admin-btn-primary" onClick={() => void handleCreateUser()} disabled={isCreatingUser}>
                  {isCreatingUser ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
