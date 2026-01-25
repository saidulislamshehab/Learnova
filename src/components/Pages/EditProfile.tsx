import { useState } from 'react';
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
  Globe
} from 'lucide-react';

interface EditProfileProps {
  onBack: () => void;
  onSave: () => void;
}

export function EditProfile({ onBack, onSave }: EditProfileProps) {
  // Form state - pre-filled with existing data
  const [formData, setFormData] = useState({
    fullName: "Sarah Anderson",
    phone: "+1 (617) 555-0123",
    gender: "Female",
    country: "United States",
    city: "Cambridge",
    designation: "Full Stack Developer",
    experience: "3 years",
    company: "Tech Innovations Inc.",
    qualification: "B.S. Computer Science",
    institution: "Massachusetts Institute of Technology",
    bio: "Computer Science student passionate about AI, Machine Learning, and Full-Stack Development. Love building innovative solutions and sharing knowledge with the community.",
    github: "sarahanderson",
    linkedin: "sarah-anderson"
  });

  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY3Njg5MDE4Mnww&ixlib=rb-4.1.0&q=80&w=400");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = () => {
    // In a real app, this would trigger a file upload dialog
    alert('Image upload functionality would be triggered here');
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to backend
    console.log('Saving profile data:', formData);
    alert('Profile updated successfully!');
    onSave();
  };

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-gray-400 hover:text-[#A5C89E] transition-all group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white/90 mb-2">Edit Profile</h1>
          <p className="text-gray-400">Update your personal and professional information</p>
        </div>

        {/* Main Form Container */}
        <div className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-2xl p-8 md:p-10 shadow-xl">
          
          {/* Profile Picture Section */}
          <div className="mb-10 pb-8 border-b border-[#A5C89E]/10">
            <h2 className="text-xl font-bold text-white/90 mb-6 flex items-center">
              <User className="w-5 h-5 mr-3 text-[#A5C89E]" />
              Profile Picture
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-full border-4 border-[#A5C89E]/30 overflow-hidden shadow-xl">
                <img 
                  src={profileImage} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
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

          {/* Personal Information Section */}
          <div className="mb-10 pb-8 border-b border-[#A5C89E]/10">
            <h2 className="text-xl font-bold text-white/90 mb-6 flex items-center">
              <User className="w-5 h-5 mr-3 text-[#A5C89E]" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Full Name *
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Phone Number
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Country
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  City
                </label>
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

          {/* Professional Information Section */}
          <div className="mb-10 pb-8 border-b border-[#A5C89E]/10">
            <h2 className="text-xl font-bold text-white/90 mb-6 flex items-center">
              <Briefcase className="w-5 h-5 mr-3 text-[#A5C89E]" />
              Professional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Designation
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Experience
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all"
                    placeholder="e.g., 3 years"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Company Name
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Qualification
                </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Institution
                </label>
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

          {/* Bio Section */}
          <div className="mb-10 pb-8 border-b border-[#A5C89E]/10">
            <h2 className="text-xl font-bold text-white/90 mb-6 flex items-center">
              <User className="w-5 h-5 mr-3 text-[#A5C89E]" />
              About You
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={5}
                maxLength={500}
                className="w-full px-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all resize-none"
                placeholder="Tell us about yourself, your interests, and what you're passionate about..."
              />
              <div className="mt-2 text-right text-xs text-gray-500">
                {formData.bio.length}/500 characters
              </div>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white/90 mb-6 flex items-center">
              <Globe className="w-5 h-5 mr-3 text-[#A5C89E]" />
              Social Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  GitHub Link
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all"
                    placeholder="github.com/username"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  LinkedIn Link
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg text-white/90 focus:outline-none focus:border-[#A5C89E]/50 focus:ring-1 focus:ring-[#A5C89E]/30 transition-all"
                    placeholder="linkedin.com/in/username"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={handleSaveChanges}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-8 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium shadow-lg shadow-[#A5C89E]/20"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
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
      </div>
    </div>
  );
}
