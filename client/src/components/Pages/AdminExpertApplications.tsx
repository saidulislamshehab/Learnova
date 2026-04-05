import { useEffect, useMemo, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
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
  picture?: string | null;
  bio?: string | null;
}

interface ExpertApplication {
  id: number;
  user_id: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user: ApplicationUser;
}

const API_BASE = `http://${window.location.hostname}:8000/api`;

export function AdminExpertApplications({ onBack }: AdminExpertApplicationsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<ExpertApplication[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

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
    void loadApplications();
  }, []);

  const updateStatus = async (applicationId: number, status: 'approved' | 'rejected') => {
    try {
      setActionLoadingId(applicationId);
      await api.put(`/admin/expert-applications/${applicationId}`, { status });
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status } : app))
      );
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
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Expert Writer Applications</h1>
            <p className="text-gray-400 mt-2">Review and approve/reject expert writer requests.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => void loadApplications()}
              className="inline-flex items-center px-4 py-2.5 bg-[#121212]/80 border border-[#A5C89E]/30 text-[#A5C89E] rounded-lg hover:bg-[#A5C89E]/10 transition-all"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2.5 bg-[#121212]/80 border border-[#A5C89E]/30 text-gray-300 rounded-lg hover:border-[#A5C89E]/50 hover:text-[#A5C89E] transition-all"
            >
              Back
            </button>
          </div>
        </div>

        <div className="bg-[#121212]/80 border border-[#A5C89E]/20 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center text-gray-400">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No expert applications found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0f0f0f]/90 border-b border-[#A5C89E]/20">
                  <tr>
                    <th className="px-6 py-4 text-xs tracking-widest text-gray-400">USER</th>
                    <th className="px-6 py-4 text-xs tracking-widest text-gray-400">EMAIL</th>
                    <th className="px-6 py-4 text-xs tracking-widest text-gray-400">STATUS</th>
                    <th className="px-6 py-4 text-xs tracking-widest text-gray-400">APPLIED AT</th>
                    <th className="px-6 py-4 text-xs tracking-widest text-gray-400">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b border-[#A5C89E]/10 hover:bg-[#A5C89E]/5">
                      <td className="px-6 py-4 text-white">
                        <div className="font-medium">{app.user?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">@{app.user?.username || 'no-username'}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{app.user?.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            app.status === 'approved'
                              ? 'bg-green-500/15 text-green-400'
                              : app.status === 'rejected'
                              ? 'bg-red-500/15 text-red-400'
                              : 'bg-yellow-500/15 text-yellow-400'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(app.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            disabled={actionLoadingId === app.id || app.status === 'approved'}
                            onClick={() => void updateStatus(app.id, 'approved')}
                            className="inline-flex items-center px-3 py-1.5 bg-green-500/15 border border-green-500/40 text-green-300 rounded hover:bg-green-500/25 disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                          </button>
                          <button
                            disabled={actionLoadingId === app.id || app.status === 'rejected'}
                            onClick={() => void updateStatus(app.id, 'rejected')}
                            className="inline-flex items-center px-3 py-1.5 bg-red-500/15 border border-red-500/40 text-red-300 rounded hover:bg-red-500/25 disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
