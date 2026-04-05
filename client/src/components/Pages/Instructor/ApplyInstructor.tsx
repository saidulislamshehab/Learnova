import { useEffect, useMemo, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { CheckCircle2, Clock, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

interface ApplyInstructorProps {
  onBack: () => void;
}

type ApplicationStatus = 'none' | 'pending' | 'approved' | 'rejected';

interface MeResponse {
  id: number;
  name?: string | null;
  email?: string | null;
  bio?: string | null;
  picture?: string | null;
}

interface StatusResponse {
  has_application: boolean;
  application: {
    id: number;
    user_id: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
  } | null;
  is_blocked: boolean;
}

const API_BASE = `http://${window.location.hostname}:8000/api`;

export function ApplyInstructor({ onBack }: ApplyInstructorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>('none');

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

  const checkProfileComplete = (user: MeResponse) => {
    const required = [user.name, user.email, user.bio, user.picture];
    return required.every((value) => String(value ?? '').trim() !== '');
  };

  useEffect(() => {
    const loadState = async () => {
      if (!token) {
        setIsLoading(false);
        setProfileComplete(false);
        setApplicationStatus('none');
        return;
      }

      try {
        const [meResponse, statusResponse] = await Promise.all([
          api.get<MeResponse>('/me'),
          api.get<StatusResponse>('/instructor-applications/my-status'),
        ]);

        setProfileComplete(checkProfileComplete(meResponse.data));

        const status = statusResponse.data.application?.status;
        if (!status) {
          setApplicationStatus('none');
        } else {
          setApplicationStatus(status);
        }
      } catch (error) {
        const fallback = 'Failed to load your profile/application status.';
        const message =
          error instanceof AxiosError ? error.response?.data?.message || fallback : fallback;
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadState();
  }, [api, token]);

  const isBlocked = applicationStatus === 'pending' || applicationStatus === 'approved';

  const handleApply = async () => {
    if (!token) {
      toast.error('Please sign in before applying.');
      return;
    }

    if (!profileComplete) {
      toast.error('Please complete your profile before applying');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post('/instructor-applications');
      setApplicationStatus(response.data?.application?.status || 'pending');
      toast.success('Application submitted successfully. Status: pending');
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          setApplicationStatus(error.response.data?.application?.status || 'pending');
          toast.error('Application already submitted');
          return;
        }
        if (error.response?.status === 422) {
          toast.error(error.response.data?.message || 'Please complete your profile before applying');
          return;
        }
        toast.error(error.response?.data?.message || 'Failed to submit application');
        return;
      }

      toast.error('Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-12 text-center">
        <p className="text-gray-400">Checking your profile and application status...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-12 text-center">
      <div className="mb-6 flex justify-center">
        <div className="p-6 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-2xl">
          {isBlocked ? <CheckCircle2 className="w-12 h-12 text-[#A5C89E]" /> : <GraduationCap className="w-12 h-12 text-[#A5C89E]" />}
        </div>
      </div>

      {!isBlocked ? (
        <>
          <h2 className="text-2xl font-bold text-white/90 mb-3">You are not an instructor yet</h2>
          <p className="text-gray-400 mb-8 leading-relaxed max-w-md mx-auto">
            Apply to become an instructor and start creating courses that impact thousands of learners on Learnova.
          </p>

          <button
            onClick={handleApply}
            disabled={isSubmitting}
            className="inline-flex items-center px-8 py-4 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium hover:shadow-lg hover:shadow-[#A5C89E]/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <GraduationCap className="w-5 h-5 mr-2" />
            <span>{isSubmitting ? 'Submitting...' : 'Apply to Become an Instructor'}</span>
          </button>

          {!profileComplete && (
            <p className="text-sm text-red-400 mt-5">Please complete your profile before applying</p>
          )}

          <p className="text-sm text-gray-500 mt-6">Your application will be reviewed by our team</p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-white/90 mb-3">Application already submitted</h2>
          <p className="text-gray-400 mb-6 leading-relaxed max-w-md mx-auto">
            Your instructor application is currently {applicationStatus}. You cannot submit a duplicate application now.
          </p>

          <div className="inline-flex items-center px-4 py-2 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-full text-[#A5C89E] mb-8">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Status: {applicationStatus}</span>
          </div>

          <p className="text-sm text-gray-500 mb-6">We will notify you after review.</p>
        </>
      )}

      <button
        onClick={onBack}
        className="inline-flex items-center px-6 py-3 bg-[#121212]/80 border border-[#A5C89E]/30 text-gray-300 rounded-lg hover:border-[#A5C89E]/50 hover:text-[#A5C89E] transition-all"
      >
        Back to Home
      </button>
    </div>
  );
}
