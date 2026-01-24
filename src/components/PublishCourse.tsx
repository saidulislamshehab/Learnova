import { useState } from 'react';
import {
  BookOpen,
  Upload,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  Send,
  GripVertical,
} from 'lucide-react';

interface PublishCourseProps {
  onBack: () => void;
  onMyCourses?: () => void;
  editMode?: boolean;
  editCourseId?: string;
}

interface ContentItem {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
}

export function PublishCourse({ onBack, onMyCourses, editMode = false, editCourseId }: PublishCourseProps) {
  const [courseTitle, setCourseTitle] = useState('');
  const [category, setCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [overview, setOverview] = useState('');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'Cloud Computing',
    'Cybersecurity',
    'DevOps',
    'Blockchain',
    'Game Development',
    'UI/UX Design',
    'Database Management',
  ];

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addContentItem = () => {
    const newContentItem: ContentItem = {
      id: `contentItem-${Date.now()}`,
      title: '',
      description: '',
      youtubeUrl: '',
    };
    setContentItems([...contentItems, newContentItem]);
  };

  const updateContentItem = (
    contentItemId: string,
    field: 'title' | 'description' | 'youtubeUrl',
    value: string
  ) => {
    setContentItems(
      contentItems.map((contentItem) =>
        contentItem.id === contentItemId ? { ...contentItem, [field]: value } : contentItem
      )
    );
  };

  const deleteContentItem = (contentItemId: string) => {
    setContentItems(contentItems.filter((contentItem) => contentItem.id !== contentItemId));
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Course saved as draft!');
    }, 1000);
  };

  const handlePublish = () => {
    if (!courseTitle.trim()) {
      alert('Please enter a course title');
      return;
    }
    if (!category) {
      alert('Please select a category');
      return;
    }
    if (!price) {
      alert('Please enter a price');
      return;
    }

    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      alert('Course published successfully!');
    }, 1500);
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="relative max-w-6xl mx-auto">
        {/* Top Action Bar */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-[#A5C89E]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {editMode ? 'Update Course' : 'Create & Publish Course'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {editMode 
                  ? 'Update your course information and content'
                  : 'Build and share your knowledge with students worldwide'}
              </p>
            </div>
          </div>
          <button
            onClick={onMyCourses}
            className="px-6 py-2.5 bg-[#121212]/80 border border-[#A5C89E]/30 text-gray-300 rounded-lg hover:border-[#A5C89E]/50 hover:text-[#A5C89E] transition-all text-sm font-medium"
          >
            My Courses
          </button>
        </div>

        {/* Course Basic Information Section */}
        <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>

          {/* Course Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Course Title <span className="text-[#A5C89E]">*</span>
            </label>
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="e.g., Complete Python Programming Bootcamp"
              className="w-full px-4 py-3 bg-[#0d0d0d]/80 border border-[#A5C89E]/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#A5C89E]/60 transition-all"
            />
          </div>

          {/* Course Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Category <span className="text-[#A5C89E]">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-[#0d0d0d]/80 border border-[#A5C89E]/30 rounded-lg text-white focus:outline-none focus:border-[#A5C89E]/60 transition-all"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Short Description
            </label>
            <textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="A brief description of your course (1-2 sentences)"
              rows={3}
              className="w-full px-4 py-3 bg-[#0d0d0d]/80 border border-[#A5C89E]/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#A5C89E]/60 transition-all resize-none"
            />
          </div>
        </div>

        {/* Course Details Section */}
        <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Course Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Course Time */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Total Course Duration (Hours)
              </label>
              <input
                type="number"
                value={totalHours}
                onChange={(e) => setTotalHours(e.target.value)}
                placeholder="e.g., 10.5"
                min="0"
                step="0.5"
                className="w-full px-4 py-3 bg-[#0d0d0d]/80 border border-[#A5C89E]/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#A5C89E]/60 transition-all"
              />
            </div>

            {/* Course Price */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Course Price <span className="text-[#A5C89E]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="49.99"
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 bg-[#0d0d0d]/80 border border-[#A5C89E]/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#A5C89E]/60 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Course Thumbnail Section */}
        <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Course Thumbnail</h2>

          {!thumbnail ? (
            // Upload Area - Only shown when no thumbnail
            <div className="w-full">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-[#A5C89E]/30 rounded-lg p-8 text-center hover:border-[#A5C89E]/50 transition-all cursor-pointer bg-[#0d0d0d]/40">
                  <Upload className="w-10 h-10 text-[#A5C89E] mx-auto mb-3" />
                  <p className="text-gray-400 text-sm mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-gray-600 text-xs">
                    PNG, JPG or JPEG (recommended: 1280x720px)
                  </p>
                </div>
              </label>
            </div>
          ) : (
            // Thumbnail Preview - Only shown when thumbnail exists
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-400">Preview</p>
                <label className="inline-flex items-center px-4 py-2 bg-[#A5C89E]/20 border border-[#A5C89E]/40 text-[#A5C89E] rounded-lg hover:bg-[#A5C89E]/30 transition-all text-sm font-medium cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  <Upload className="w-4 h-4 mr-2" />
                  Change Image
                </label>
              </div>
              <div className="relative rounded-lg overflow-hidden border border-[#A5C89E]/30">
                <img
                  src={thumbnail}
                  alt="Course thumbnail preview"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Course Overview Section */}
        <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Course Overview</h2>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              What will students learn in this course?
            </label>
            <textarea
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Describe the key topics, learning outcomes, and skills students will gain from this course..."
              rows={8}
              className="w-full px-4 py-3 bg-[#0d0d0d]/80 border border-[#A5C89E]/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#A5C89E]/60 transition-all resize-none"
            />
          </div>
        </div>

        {/* Course Content Section */}
        <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Course Content</h2>
            <button
              onClick={addContentItem}
              className="inline-flex items-center px-4 py-2 bg-[#A5C89E]/20 border border-[#A5C89E]/40 text-[#A5C89E] rounded-lg hover:bg-[#A5C89E]/30 transition-all text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Title
            </button>
          </div>

          {/* Content Items List */}
          {contentItems.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-[#A5C89E]/20 rounded-lg">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No content added yet</p>
              <button
                onClick={addContentItem}
                className="inline-flex items-center px-6 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Title
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {contentItems.map((item, index) => (
                <div
                  key={item.id}
                  className="relative bg-[#0d0d0d]/60 border border-[#A5C89E]/30 rounded-lg p-4"
                >
                  {/* Delete Button - Top Right */}
                  <button
                    onClick={() => deleteContentItem(item.id)}
                    className="absolute top-3 right-3 inline-flex items-center px-2 py-1 text-white text-xs hover:bg-white/10 rounded transition-all"
                  >
                    Delete
                  </button>

                  {/* Content Fields - Horizontal Layout */}
                  <div className="flex flex-col sm:flex-row gap-3 pr-16 sm:pr-20">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          updateContentItem(item.id, 'title', e.target.value)
                        }
                        placeholder="Title"
                        className="w-full px-3 py-2 bg-[#0d0d0d]/80 border border-[#A5C89E]/30 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#A5C89E]/60 transition-all"
                      />
                    </div>

                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateContentItem(item.id, 'description', e.target.value)
                        }
                        placeholder="Description"
                        className="w-full px-3 py-2 bg-[#0d0d0d]/80 border border-[#A5C89E]/30 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#A5C89E]/60 transition-all"
                      />
                    </div>

                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.youtubeUrl}
                        onChange={(e) =>
                          updateContentItem(item.id, 'youtubeUrl', e.target.value)
                        }
                        placeholder="YouTube URL"
                        className="w-full px-3 py-2 bg-[#0d0d0d]/80 border border-[#A5C89E]/30 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#A5C89E]/60 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#121212]/80 border border-[#A5C89E]/30 text-gray-300 rounded-lg hover:border-[#A5C89E]/50 hover:text-[#A5C89E] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : editMode ? 'Save Changes' : 'Save as Draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium hover:shadow-lg hover:shadow-[#A5C89E]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 mr-2" />
            {isPublishing ? (editMode ? 'Updating...' : 'Publishing...') : editMode ? 'Update Course' : 'Publish Course'}
          </button>
        </div>

        {/* Helper Tips */}
        <div className="mt-8 p-4 bg-[#121212]/60 border border-[#A5C89E]/20 rounded-lg">
          <p className="text-sm text-gray-500">
            <span className="text-[#A5C89E] font-medium">💡 Tip:</span> Add
            clear module titles and organize your lessons logically. Students
            learn best when content is structured and easy to follow.
          </p>
        </div>
      </div>
    </section>
  );
}