import { useEffect, useMemo, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { CheckCircle2, RefreshCw, Search, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AdminExpertApplicationsProps {
  onBack: () => void;
}

interface ApplicationUser {
  id: number;
  name: string;
  username?: string | null;
  email: string;
  role: string;
}

interface ExpertApplication {
  id: number;
  user_id: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user: ApplicationUser;
}

const API_BASE = `http://${window.location.hostname}:8000/api`;

const statusClass = (status: ExpertApplication['status']) => {
  if (status === 'approved') {
    return 'admin-status admin-status-approved';
  }
  if (status === 'rejected') {
    return 'admin-status admin-status-rejected';
  }
  return 'admin-status admin-status-pending';
};

export function AdminExpertApplications({ onBack }: AdminExpertApplicationsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<ExpertApplication[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const token = localStorage.getItem('auth_token');

  const api = useMemo(() => {
    return axios.create({
      baseURL: API_BASE,
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }, [token]);

  const filteredApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return applications;
    }

    return applications.filter((application) =>
      [application.user?.name, application.user?.email, application.user?.username, application.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [applications, searchQuery]);

  const loadApplications = async () => {
    if (!token) {
      toast.error('Please sign in as admin.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get<{ applications: ExpertApplication[] }>('/admin/expert-applications');
      setApplications(response.data.applications || []);
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || 'Failed to fetch expert applications'
          : 'Failed to fetch expert applications';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add('admin-theme');
    void loadApplications();
    return () => {
      document.body.classList.remove('admin-theme');
    };
  }, []);

  const updateStatus = async (applicationId: number, status: 'approved' | 'rejected') => {
    try {
      setActionLoadingId(applicationId);
      await api.put(`/admin/expert-applications/${applicationId}`, { status });
      setApplications((prev) => prev.map((item) => (item.id === applicationId ? { ...item, status } : item)));
      toast.success(`Application ${status} successfully`);
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || 'Failed to update application status'
          : 'Failed to update application status';
      toast.error(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <section className="admin-layout-root min-h-screen">
      <div className="admin-grid-bg" />
      <div className="admin-radial admin-radial-one" />
      <div className="admin-radial admin-radial-two" />

      <div className="admin-page-wrap relative z-10 px-4 py-6 sm:px-6 sm:py-8">
        <div className="admin-surface admin-surface-padded mb-5">
          <div className="admin-toolbar">
            <div>
              <p className="admin-label">Moderation Queue</p>
              <h1 className="admin-heading">Expert Writer Applications</h1>
              <p className="admin-muted mt-1">Review, approve, or reject incoming expert requests.</p>
            </div>
            <div className="admin-inline-actions">
              <button onClick={() => void loadApplications()} className="admin-btn admin-btn-muted">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button onClick={onBack} className="admin-btn admin-btn-danger">
                Back
              </button>
            </div>
          </div>
        </div>

        <div className="admin-surface admin-surface-padded">
          <div className="admin-search-wrap mb-4 relative">
            <Search className="admin-search-icon" />
            <input
              className="admin-input"
              placeholder="Search by name, email, username, status"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <button onClick={() => void loadApplications()} className="admin-btn admin-btn-muted">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <div className="admin-table-wrap hidden md:block">
            <table className="admin-table min-w-[760px]">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Applied At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="admin-muted-cell">Loading applications...</td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-muted-cell">No expert applications found.</td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <p className="admin-list-title">{app.user?.name || 'Unknown'}</p>
                        <p className="admin-list-caption">@{app.user?.username || 'no-username'}</p>
                      </td>
                      <td>{app.user?.email || 'N/A'}</td>
                      <td>
                        <span className={statusClass(app.status)}>{app.status}</span>
                      </td>
                      <td>{new Date(app.created_at).toLocaleString()}</td>
                      <td>
                        <div className="admin-inline-actions">
                          <button
                            className="admin-btn admin-btn-primary"
                            disabled={actionLoadingId === app.id || app.status === 'approved'}
                            onClick={() => void updateStatus(app.id, 'approved')}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Approve
                          </button>
                          <button
                            className="admin-btn admin-btn-muted"
                            disabled={actionLoadingId === app.id || app.status === 'rejected'}
                            onClick={() => void updateStatus(app.id, 'rejected')}
                          >
                            <XCircle className="h-4 w-4" />
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

          <div className="md:hidden admin-list-stack">
            {isLoading ? <div className="admin-muted">Loading applications...</div> : null}
            {!isLoading && filteredApplications.length === 0 ? <div className="admin-muted">No expert applications found.</div> : null}
            {!isLoading
              ? filteredApplications.map((app) => (
                  <article key={app.id} className="admin-list-row">
                    <div>
                      <p className="admin-list-title">{app.user?.name || 'Unknown'}</p>
                      <p className="admin-list-caption">{app.user?.email || 'N/A'}</p>
                      <p className="admin-list-caption mt-1">{new Date(app.created_at).toLocaleString()}</p>
                      <span className={`${statusClass(app.status)} mt-2 inline-flex`}>{app.status}</span>
                    </div>
                    <div className="admin-inline-actions">
                      <button
                        className="admin-btn admin-btn-primary"
                        disabled={actionLoadingId === app.id || app.status === 'approved'}
                        onClick={() => void updateStatus(app.id, 'approved')}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button
                        className="admin-btn admin-btn-muted"
                        disabled={actionLoadingId === app.id || app.status === 'rejected'}
                        onClick={() => void updateStatus(app.id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                ))
              : null}
          </div>
        </div>
      </div>
    </section>
  );
}
