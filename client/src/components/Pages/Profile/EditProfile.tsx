import { API_URL } from '@/utils/constants';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Github,
  Linkedin,
  Upload,
  Save,
  X,
  Phone,
  Building2,
  Award,
  Globe,
} from 'lucide-react';
import Loading from '../../ui/Loading';

interface EditProfileProps {
  onBack: () => void;
  onSave: () => void;
}

interface CurrentUser {
  name?: string | null;
  picture?: string | null;
  bio?: string | null;
  gender?: string | null;
  country?: string | null;
  number?: string | null;
  city?: string | null;
  designation?: string | null;
  experience?: number | string | null;
  company_name?: string | null;
  qualifications?: string | null;
  institution?: string | null;
  github_link?: string | null;
  linkedin_link?: string | null;
}

interface FormDataState {
  fullName: string;
  phone: string;
  gender: string;
  country: string;
  city: string;
  designation: string;
  experience: string;
  company: string;
  qualification: string;
  institution: string;
  bio: string;
  github: string;
  linkedin: string;
}

interface CloudinaryUploadResponse {
  secure_url?: string;
  error?: {
    message?: string;
  };
}

const DEFAULT_AVATAR = 'https://res.cloudinary.com/dp1li5tkd/image/upload/v1776439457/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-illustration-vector_xxnra2.jpg';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dp1li5tkd/image/upload';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;
const initialFormData: FormDataState = {
  fullName: '',
  phone: '',
  gender: '',
  country: '',
  city: '',
  designation: '',
  experience: '',
  company: '',
  qualification: '',
  institution: '',
  bio: '',
  github: '',
  linkedin: '',
};

export function EditProfile({ onBack, onSave }: EditProfileProps) {
  const { username } = useParams<{ username: string }>();
  const [formData, setFormData] = useState<FormDataState>(initialFormData);
  const [profileImage, setProfileImage] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
  const [selectedPicturePreview, setSelectedPicturePreview] = useState<string>('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      setError('You are not logged in. Please sign in and try again.');
      setIsLoadingProfile(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/me`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data: CurrentUser = await response.json();

        if (!response.ok) {
          throw new Error('Failed to load profile information');
        }

        setFormData({
          fullName: data.name ?? '',
          phone: data.number ?? '',
          gender: data.gender ?? '',
          country: data.country ?? '',
          city: data.city ?? '',
          designation: data.designation ?? '',
          experience: data.experience != null ? String(data.experience) : '',
          company: data.company_name ?? '',
          qualification: data.qualifications ?? '',
          institution: data.institution ?? '',
          bio: data.bio ?? '',
          github: data.github_link ?? '',
          linkedin: data.linkedin_link ?? '',
        });

        setProfileImage(data.picture ?? '');
        localStorage.setItem('auth_user', JSON.stringify(data));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load profile';
        setError(message);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetPictureSelection = () => {
    if (selectedPicturePreview) {
      URL.revokeObjectURL(selectedPicturePreview);
    }
    setSelectedPicturePreview('');
    setIsDragActive(false);
  };

  const handleImageUpload = () => {
    resetPictureSelection();
    setIsPictureModalOpen(true);
  };

  const savePictureToProfile = async (pictureUrl: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('You are not logged in. Please sign in and try again.');
    }

    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ picture: pictureUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data?.errors) {
        const message = Object.values(data.errors).flat().join(', ');
        throw new Error(message || 'Failed to save picture in profile');
      }
      throw new Error(data?.message || 'Failed to save picture in profile');
    }

    setProfileImage(data?.user?.picture || pictureUrl);
    if (data?.user) {
      localStorage.setItem('auth_user', JSON.stringify(data.user));
    }
  };

  const uploadPictureToCloudinary = async (file: File) => {
    if (!CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary upload preset is missing. Set VITE_CLOUDINARY_UPLOAD_PRESET in frontend .env.');
    }

    const formDataPayload = new FormData();
    formDataPayload.append('file', file);
    formDataPayload.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formDataPayload,
    });

    const result: CloudinaryUploadResponse = await response.json();

    if (!response.ok || !result.secure_url) {
      throw new Error(result.error?.message || 'Cloudinary upload failed');
    }

    return result.secure_url;
  };

  const handlePictureFileSelect = async (file: File | null) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, or WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Please choose an image smaller than 5MB.');
      return;
    }

    setError(null);

    if (selectedPicturePreview) {
      URL.revokeObjectURL(selectedPicturePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedPicturePreview(previewUrl);

    try {
      setIsUploadingPicture(true);
      const secureUrl = await uploadPictureToCloudinary(file);
      await savePictureToProfile(secureUrl);
      setSuccess('Profile picture uploaded and saved successfully!');
      setIsPictureModalOpen(false);
      resetPictureSelection();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Picture upload failed';
      setError(message);
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    void handlePictureFileSelect(file);
  };

  const normalizeStringOrNull = (value: string): string | null => {
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
  };

  const handleSaveChanges = async () => {
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('You are not logged in. Please sign in and try again.');
      return;
    }

    const experienceValue = formData.experience.trim();
    let parsedExperience: number | null = null;

    if (experienceValue !== '') {
      const asNumber = Number(experienceValue);
      if (!Number.isInteger(asNumber) || asNumber < 0) {
        setError('Experience must be a non-negative whole number of years.');
        return;
      }
      parsedExperience = asNumber;
    }

    const payload = {
      name: normalizeStringOrNull(formData.fullName),
      picture: normalizeStringOrNull(profileImage),
      bio: normalizeStringOrNull(formData.bio),
      gender: normalizeStringOrNull(formData.gender),
      country: normalizeStringOrNull(formData.country),
      number: normalizeStringOrNull(formData.phone),
      city: normalizeStringOrNull(formData.city),
      designation: normalizeStringOrNull(formData.designation),
      experience: parsedExperience,
      company_name: normalizeStringOrNull(formData.company),
      qualifications: normalizeStringOrNull(formData.qualification),
      institution: normalizeStringOrNull(formData.institution),
      github_link: normalizeStringOrNull(formData.github),
      linkedin_link: normalizeStringOrNull(formData.linkedin),
    };

    try {
      setIsSaving(true);
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.errors) {
          const message = Object.values(data.errors).flat().join(', ');
          throw new Error(message || 'Validation failed');
        }
        throw new Error(data?.message || 'Failed to update profile');
      }

      localStorage.setItem('auth_user', JSON.stringify(data.user));
      setSuccess('Profile updated successfully!');
      onSave();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-gray-400 hover:text-[#A5C89E] transition-all group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </button>

        {isLoadingProfile ? (
          <Loading message="Loading profile..." size="lg" />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white/90 mb-2">Edit Profile</h1>
              <p className="text-gray-400">Update your personal and professional information</p>
            </div>

            <div className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-2xl p-8 md:p-10 shadow-xl">
              {error && (
                <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-emerald-300 text-sm">
                  {success}
                </div>
              )}

          <div className="mb-10 pb-8 border-b border-[#A5C89E]/10">
            <h2 className="text-xl font-bold text-white/90 mb-6 flex items-center">
              <User className="w-5 h-5 mr-3 text-[#A5C89E]" />
              Profile Picture
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-full border-4 border-[#A5C89E]/30 overflow-hidden shadow-xl">
                <img src={profileImage || DEFAULT_AVATAR} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={handleImageUpload}
                className="inline-flex items-center px-6 py-2.5 bg-[#A5C89E]/10 border border-[#A5C89E]/40 text-[#A5C89E] rounded-lg hover:bg-[#A5C89E]/20 hover:border-[#A5C89E]/60 transition-all font-medium text-sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Change Picture
              </button>
            </div>
          </div>

          <div className="mb-10 pb-8 border-b border-[#A5C89E]/10">
            <h2 className="text-xl font-bold text-white/90 mb-6 flex items-center">
              <User className="w-5 h-5 mr-3 text-[#A5C89E]" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all"
                    placeholder="Enter country"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all"
                    placeholder="Enter city"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10 pb-8 border-b border-[#A5C89E]/10">
            <h2 className="text-xl font-bold text-white/90 mb-6 flex items-center">
              <Briefcase className="w-5 h-5 mr-3 text-[#A5C89E]" />
              Professional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all"
                  placeholder="e.g., Full Stack Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Experience (years)</label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    min={0}
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all"
                    placeholder="e.g., 3"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all"
                    placeholder="Enter company name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all"
                  placeholder="e.g., B.S. Computer Science"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Institution</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all"
                    placeholder="Enter institution name"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10 pb-8 border-b border-[#A5C89E]/10">
            <h2 className="text-xl font-bold text-white/90 mb-6 flex items-center">
              <User className="w-5 h-5 mr-3 text-[#A5C89E]" />
              About You
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={5}
                maxLength={500}
                className="w-full px-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all resize-none"
                placeholder="Tell us about yourself, your interests, and what you're passionate about..."
              />
              <div className="mt-2 text-right text-xs text-gray-500">{formData.bio.length}/500 characters</div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-bold text-white/90 mb-6 flex items-center">
              <Globe className="w-5 h-5 mr-3 text-[#A5C89E]" />
              Social Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">GitHub Link</label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">LinkedIn Link</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={handleSaveChanges}
              disabled={isSaving || isLoadingProfile}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-8 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium shadow-lg shadow-[#A5C89E]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={onBack}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-8 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/30 text-gray-300 rounded-lg hover:border-[#A5C89E]/50 hover:text-white transition-all font-medium"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
            </>
          )}

          {isPictureModalOpen && (
            <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => setIsPictureModalOpen(false)}>
              <div className="w-full max-w-xl bg-[#0f0f0f] border border-[#A5C89E]/20 rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Upload Profile Picture</h3>
              <button
                onClick={() => setIsPictureModalOpen(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Close upload dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              onDragEnter={(e) => {
                e.preventDefault();
                setIsDragActive(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragActive(false);
              }}
              onDrop={handleDrop}
              className={`rounded-xl border-2 border-dashed p-8 text-center transition-all ${isDragActive ? 'border-[#A5C89E] bg-[#A5C89E]/10' : 'border-[#A5C89E]/30 bg-[#0b0b0b]/80'}`}
            >
              {selectedPicturePreview ? (
                <div className="space-y-4">
                  <img
                    src={selectedPicturePreview}
                    alt="Selected preview"
                    className="mx-auto w-32 h-32 rounded-full object-cover border-2 border-[#A5C89E]/40"
                  />
                  <p className="text-sm text-gray-300">Uploading selected image...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-300 font-medium">Drag and drop an image here for instant upload</p>
                  <p className="text-sm text-gray-500">Supports JPG, PNG, WEBP up to 5MB</p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={(e) => handlePictureFileSelect(e.target.files?.[0] ?? null)}
            />

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={openFilePicker}
                disabled={isUploadingPicture}
                className="flex-1 px-4 py-2.5 border border-[#A5C89E]/40 text-[#A5C89E] rounded-lg hover:bg-[#A5C89E]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Browse Files
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPictureModalOpen(false);
                  resetPictureSelection();
                }}
                disabled={isUploadingPicture}
                className="flex-1 px-4 py-2.5 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploadingPicture ? 'Uploading...' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
