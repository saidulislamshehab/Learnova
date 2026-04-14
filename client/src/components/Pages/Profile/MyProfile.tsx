import { API_URL } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Edit3,
  Phone,
  Mail,
  Building2,
  Globe,
  Github,
  Linkedin,
} from 'lucide-react';
import { Skeleton, SkeletonText, SkeletonAvatar } from '@/components/Common/Skeleton';

interface MyProfileProps {
  onBack: () => void;
  onEditProfile?: () => void;
}

interface UserProfile {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  picture?: string | null;
  bio?: string | null;
  gender?: string | null;
  number?: string | null;
  designation?: string | null;
  company_name?: string | null;
  experience?: number | string | null;
  qualifications?: string | null;
  institution?: string | null;
  city?: string | null;
  country?: string | null;
  github_link?: string | null;
  linkedin_link?: string | null;
}

const DEFAULT_AVATAR =
  'https://res.cloudinary.com/dp1li5tkd/image/upload/v1774902128/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4195_txcng6.jpg';

const getTextValue = (value?: string | number | null, fallback = 'Not set') => {
  if (value === null || value === undefined) {
    return fallback;
  }

  const text = String(value).trim();
  return text === '' ? fallback : text;
};

export function MyProfile({ onBack, onEditProfile }: MyProfileProps) {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      setError('You are not logged in. Please sign in to view your profile.');
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/me`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to fetch profile data');
        }

        setUserData(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load profile';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const displayName = getTextValue(userData?.name, 'Learner');
  const displayAvatar = userData?.picture || DEFAULT_AVATAR;
  const displayRole = getTextValue(userData?.role, 'student');
  const displayLocation =
    [userData?.city, userData?.country].filter(Boolean).join(', ') || getTextValue(userData?.institution, 'Not set');
  const displayExperience =
    userData?.experience !== null && userData?.experience !== undefined && String(userData.experience).trim() !== ''
      ? `${userData.experience} years`
      : 'Not set';
  const displayQualification = getTextValue(userData?.qualifications, 'Not set');
  const displayBio = getTextValue(userData?.bio, 'No bio added yet.');

  const personalInfoItems = [
    { label: 'Email', value: getTextValue(userData?.email), icon: Mail },
    { label: 'Phone', value: getTextValue(userData?.number), icon: Phone },
    { label: 'Gender', value: getTextValue(userData?.gender ? String(userData.gender).replace(/_/g, ' ') : null), icon: User },
    { label: 'Location', value: displayLocation, icon: MapPin },
  ];

  const professionalInfoItems = [
    { label: 'Designation', value: getTextValue(userData?.designation), icon: Briefcase },
    { label: 'Company', value: getTextValue(userData?.company_name), icon: Building2 },
    { label: 'Institution', value: getTextValue(userData?.institution), icon: GraduationCap },
    { label: 'Experience', value: displayExperience, icon: Briefcase },
    { label: 'Qualification', value: displayQualification, icon: GraduationCap },
  ];

  const shimmerClass = 'animate-pulse bg-gradient-to-r from-[#141414] via-[#252525] to-[#141414]';

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-gray-400 hover:text-[#A5C89E] transition-all group"
        >
          <svg
            className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        {isLoading && (
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="bg-[#0f0f0f]/40 backdrop-blur-xl border border-[#A5C89E]/10 rounded-2xl p-8 md:p-10 text-center space-y-4">
              <div className="mx-auto w-24 h-24 md:w-28 md:h-28">
                <SkeletonAvatar size="100%" />
              </div>
              <Skeleton width="200px" height="2rem" className="mx-auto" />
              <Skeleton width="150px" height="1rem" className="mx-auto" />
              <div className="flex justify-center gap-3">
                <Skeleton width="100px" height="2rem" borderRadius="1rem" />
              </div>
              <div className="flex justify-center gap-4 max-w-2xl mx-auto pt-4">
                <Skeleton width="48%" height="3rem" borderRadius="0.75rem" />
                <Skeleton width="48%" height="3rem" borderRadius="0.75rem" />
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="bg-[#0f0f0f]/40 border border-[#A5C89E]/10 rounded-2xl p-8 space-y-8">
              <div className="flex justify-between items-center">
                <Skeleton width="250px" height="2rem" />
                <Skeleton width="100px" height="2.5rem" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Skeleton width="150px" height="1.25rem" />
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <SkeletonAvatar size="1.5rem" />
                      <div className="flex-1 space-y-2">
                        <Skeleton width="30%" height="0.75rem" />
                        <Skeleton width="60%" height="1rem" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <Skeleton width="150px" height="1.25rem" />
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <SkeletonAvatar size="1.5rem" />
                      <div className="flex-1 space-y-2">
                        <Skeleton width="30%" height="0.75rem" />
                        <Skeleton width="60%" height="1rem" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && (
        <div className="relative overflow-hidden bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-2xl p-8 md:p-10 mb-6 shadow-xl text-center">
          <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-[#A5C89E]/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-[#A5C89E]/5 blur-3xl" />

          <div className="relative mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-[#A5C89E]/35 overflow-hidden shadow-2xl shadow-[#A5C89E]/10 mb-6">
            <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
          </div>

          <h1 className="relative text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]">{displayName}</h1>
          <p className="relative text-gray-400 text-sm mb-4">Welcome to your profile dashboard</p>
          <div className="relative flex items-center justify-center text-[#A5C89E]/80 mb-5">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{displayLocation}</span>
          </div>
          <span className="relative inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#A5C89E]/15 text-[#A5C89E] border border-[#A5C89E]/30 uppercase tracking-wide">
            {displayRole}
          </span>

          <div className="relative mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            <div className="bg-[#0b0b0b]/70 border border-[#A5C89E]/20 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Experience</p>
              <p className="text-sm text-white/90">{displayExperience}</p>
            </div>
            <div className="bg-[#0b0b0b]/70 border border-[#A5C89E]/20 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Qualification</p>
              <p className="text-sm text-white/90 truncate">{displayQualification}</p>
            </div>
          </div>
        </div>
        )}

        {error && (
          <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-6 mb-6 shadow-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && userData && (
          <div className="space-y-6">
            <div className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-2xl p-6 md:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-white/90 flex items-center">
                  <User className="w-5 h-5 mr-3 text-[#A5C89E]" />
                  Profile Information
                </h2>
                <button
                  onClick={onEditProfile}
                  className="inline-flex items-center justify-center px-4 py-2 bg-[#A5C89E]/10 border border-[#A5C89E]/40 text-[#A5C89E] rounded-lg hover:bg-[#A5C89E]/20 hover:border-[#A5C89E]/60 transition-all font-medium text-sm"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#A5C89E]/15 bg-[#0b0b0b]/70 p-5">
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Personal Details</h3>
                  <div className="space-y-4">
                    {personalInfoItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-[#A5C89E]/10 border border-[#A5C89E]/20">
                            <Icon className="w-4 h-4 text-[#A5C89E]" />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
                            <p className="text-sm text-gray-200 capitalize break-all">{item.value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-[#A5C89E]/15 bg-[#0b0b0b]/70 p-5">
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Professional Details</h3>
                  <div className="space-y-4">
                    {professionalInfoItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-[#A5C89E]/10 border border-[#A5C89E]/20">
                            <Icon className="w-4 h-4 text-[#A5C89E]" />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
                            <p className="text-sm text-gray-200">{item.value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-2xl p-6 md:p-8 shadow-xl">
                <h3 className="text-lg font-semibold text-white/90 mb-4">About</h3>
                <p className="text-gray-300 leading-relaxed">{displayBio}</p>
              </div>

              <div className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-white/90 mb-4">Social</h3>
                <div className="space-y-3">
                  {userData.github_link ? (
                    <a
                      href={userData.github_link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-[#A5C89E] hover:text-[#c5e6bf] text-sm break-all"
                    >
                      <Github className="w-4 h-4" />
                      {userData.github_link}
                    </a>
                  ) : (
                    <p className="flex items-center gap-2 text-gray-500 text-sm">
                      <Github className="w-4 h-4" />
                      GitHub not set
                    </p>
                  )}

                  {userData.linkedin_link ? (
                    <a
                      href={userData.linkedin_link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-[#A5C89E] hover:text-[#c5e6bf] text-sm break-all"
                    >
                      <Linkedin className="w-4 h-4" />
                      {userData.linkedin_link}
                    </a>
                  ) : (
                    <p className="flex items-center gap-2 text-gray-500 text-sm">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn not set
                    </p>
                  )}
                </div>
              </div>
            </div>

            {displayBio === 'No bio added yet.' && displayExperience === 'Not set' && displayQualification === 'Not set' && !userData.designation && !userData.company_name && !userData.institution && !userData.number && !userData.github_link && !userData.linkedin_link && (
              <div className="rounded-xl border border-[#A5C89E]/20 bg-[#A5C89E]/5 p-4">
                <p className="text-sm text-gray-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#A5C89E]" />
                  Your profile has basic details only. Use Edit Profile to add more information.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
