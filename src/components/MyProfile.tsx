import { useState } from 'react';
import { 
  User, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Edit3, 
  AlertCircle
} from 'lucide-react';

interface MyProfileProps {
  onBack: () => void;
  onEditProfile?: () => void;
}

export function MyProfile({ onBack, onEditProfile }: MyProfileProps) {
  // Mock user data
  const userData = {
    name: "Sarah Anderson",
    institution: "Massachusetts Institute of Technology",
    bio: "Computer Science student passionate about AI, Machine Learning, and Full-Stack Development. Love building innovative solutions and sharing knowledge with the community.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY3Njg5MDE4Mnww&ixlib=rb-4.1.0&q=80&w=400",
    experience: "3 years in web development",
    qualification: "B.S. Computer Science"
  };

  // Check if profile is complete (simple check)
  const isProfileIncomplete = !userData.bio || !userData.experience || !userData.qualification;

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-gray-400 hover:text-[#A5C89E] transition-all group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        {/* Profile Header Card */}
        <div className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-2xl p-8 md:p-10 mb-6 shadow-xl">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full border-4 border-[#A5C89E]/30 overflow-hidden shadow-2xl shadow-[#A5C89E]/10 mb-6">
              <img 
                src={userData.avatar} 
                alt={userData.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white/90 mb-3">
                {userData.name}
              </h1>
              <div className="flex items-center justify-center text-[#A5C89E]/80 mb-6">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{userData.institution}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion Prompt */}
        {isProfileIncomplete && (
          <div className="bg-[#A5C89E]/5 backdrop-blur-xl border border-[#A5C89E]/30 rounded-xl p-6 mb-6 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-3 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-[#A5C89E]" />
              </div>
              <div className="flex-1">
                <p className="text-white/90 font-medium mb-1">
                  Complete your profile to let others know you better.
                </p>
                <p className="text-gray-400 text-sm">
                  Add more details about your experience and qualifications.
                </p>
              </div>
              <button 
                onClick={onEditProfile}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium text-sm whitespace-nowrap"
              >
                Complete Profile
              </button>
            </div>
          </div>
        )}

        {/* Profile Details Card */}
        <div className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#A5C89E]/20 rounded-2xl p-8 md:p-10 mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white/90 flex items-center">
              <User className="w-5 h-5 mr-3 text-[#A5C89E]" />
              Profile Information
            </h2>
            <button 
              onClick={onEditProfile}
              className="inline-flex items-center px-4 py-2 bg-[#A5C89E]/10 border border-[#A5C89E]/40 text-[#A5C89E] rounded-lg hover:bg-[#A5C89E]/20 hover:border-[#A5C89E]/60 transition-all font-medium text-sm"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>

          <div className="space-y-8">
            {/* Bio */}
            {userData.bio && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-3">
                  Bio
                </label>
                <p className="text-gray-300 leading-relaxed">
                  {userData.bio}
                </p>
              </div>
            )}

            {/* Experience */}
            {userData.experience && (
              <div className="flex items-start">
                <div className="p-2 bg-[#A5C89E]/10 border border-[#A5C89E]/20 rounded-lg mr-4">
                  <Briefcase className="w-5 h-5 text-[#A5C89E]/70" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Experience
                  </label>
                  <p className="text-gray-300">
                    {userData.experience}
                  </p>
                </div>
              </div>
            )}

            {/* Qualification */}
            {userData.qualification && (
              <div className="flex items-start">
                <div className="p-2 bg-[#A5C89E]/10 border border-[#A5C89E]/20 rounded-lg mr-4">
                  <GraduationCap className="w-5 h-5 text-[#A5C89E]/70" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Qualification
                  </label>
                  <p className="text-gray-300">
                    {userData.qualification}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}