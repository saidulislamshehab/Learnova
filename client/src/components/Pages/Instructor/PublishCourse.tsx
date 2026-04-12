import { useEffect, useState } from 'react';
import axios from 'axios';
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

interface ApiCourseContent {
  id?: number;
  title?: string;
  description?: string | null;
  youtube_url?: string | null;
  order?: number | null;
}

interface ApiCourse {
  CourseID?: number;
  Title?: string;
  Category?: string;
  category_id?: number | null;
  category_name?: string | null;
  Description?: string | null;
  Overview?: string | null;
  Total_Hours?: number | string | null;
  Price?: number | string | null;
  Old_Price?: number | string | null;
  Thumbnail?: string | null;
  Status?: string | null;
  contents?: ApiCourseContent[];
}

const API_BASE = `http://${window.location.hostname}:8000/api`;
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dp1li5tkd/image/upload';
const CLOUDINARY_COURSE_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_COURSE;

const courseCategories = [
  { id: 1, label: 'Web Development' },
  { id: 2, label: 'Mobile Development' },
  { id: 3, label: 'Data Science' },
  { id: 4, label: 'Machine Learning' },
  { id: 5, label: 'Artificial Intelligence' },
  { id: 6, label: 'Cloud Computing' },
  { id: 7, label: 'Cybersecurity' },
  { id: 8, label: 'DevOps' },
  { id: 9, label: 'Blockchain' },
  { id: 10, label: 'Game Development' },
  { id: 11, label: 'UI/UX Design' },
  { id: 12, label: 'Database Management' },
];

async function getValidAuthToken(): Promise<string | null> {
  const currentToken = localStorage.getItem('auth_token');
  if (!currentToken) {
    return null;
  }

  try {
    await axios.get(`${API_BASE}/me`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    });

    return currentToken;
  } catch (error: any) {
    if (error?.response?.status !== 401) {
      return currentToken;
    }

    try {
      const refreshResponse = await axios.post(
        `${API_BASE}/refresh`,
        {},
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      const refreshedToken = refreshResponse.data?.authorization?.token;
      if (refreshedToken) {
        localStorage.setItem('auth_token', refreshedToken);
        return refreshedToken;
      }
    } catch {
      return null;
    }

    return null;
  }
}

export function PublishCourse({ onBack, onMyCourses, editMode = false, editCourseId }: PublishCourseProps) {
  const [courseTitle, setCourseTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [overview, setOverview] = useState('');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoadingCourse, setIsLoadingCourse] = useState(false);
  const [courseStatus, setCourseStatus] = useState<string>('draft');

  useEffect(() => {
    if (!editMode || !editCourseId) {
      return;
    }

    const loadCourse = async () => {
      const token = await getValidAuthToken();
      if (!token) {
        alert('Your session expired. Please sign in again.');
        return;
      }

      try {
        setIsLoadingCourse(true);
        const response = await axios.get<{ course: ApiCourse }>(`${API_BASE}/courses/${editCourseId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const course = response.data.course;
        const resolvedCourseId = String(course.CourseID ?? '');

        setCourseTitle(course.Title ?? '');
        setCourseStatus(course.Status ?? 'draft');
        setCategoryId(course.category_id ? String(course.category_id) : '');
        setShortDescription(course.Description ?? '');
        setOverview(course.Overview ?? '');
        setTotalHours(course.Total_Hours !== null && course.Total_Hours !== undefined ? String(course.Total_Hours) : '');
        setPrice(course.Price !== null && course.Price !== undefined ? String(course.Price) : '');
        setOldPrice(course.Old_Price !== null && course.Old_Price !== undefined ? String(course.Old_Price) : '');
        setThumbnailPreview(course.Thumbnail ?? null);
        setThumbnailFile(null);
        setContentItems((course.contents ?? []).map((item, index) => ({
          id: `${resolvedCourseId || editCourseId}-content-${item.id ?? index}`,
          title: item.title ?? '',
          description: item.description ?? '',
          youtubeUrl: item.youtube_url ?? '',
        })));
      } catch {
        alert('Failed to load the selected course.');
      } finally {
        setIsLoadingCourse(false);
      }
    };

    void loadCourse();
  }, [editMode, editCourseId]);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
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

  const buildCoursePayload = (status: 'draft' | 'pending', uploadedThumbnailUrl?: string | null) => {
    const categoryName = courseCategories.find((item) => String(item.id) === categoryId)?.label ?? '';
    const cleanedContentItems = contentItems
      .map((item) => ({
        title: item.title.trim(),
        description: item.description.trim(),
        youtube_url: item.youtubeUrl.trim(),
      }))
      .filter((item) => item.title || item.description || item.youtube_url);

    const hasInvalidContent = cleanedContentItems.some((item) => !item.title);

    if (!courseTitle.trim()) {
      throw new Error('Please enter a course title.');
    }

    if (!categoryId) {
      throw new Error('Please select a category.');
    }

    if (!price.trim()) {
      throw new Error('Please enter a price.');
    }

    if (hasInvalidContent) {
      throw new Error('Each course content item must have a title.');
    }

    const formData = new FormData();
    formData.append('title', courseTitle.trim());
    formData.append('category_id', categoryId);
    formData.append('category_name', categoryName);
    formData.append('short_description', shortDescription.trim());
    formData.append('overview', overview.trim());
    formData.append('duration', totalHours.trim());
    formData.append('price', price.trim());
    formData.append('old_price', oldPrice.trim());
    formData.append('status', status);
    formData.append(
      'course_contents',
      JSON.stringify(
        cleanedContentItems.map((item, index) => ({
          title: item.title,
          description: item.description,
          youtube_url: item.youtube_url,
          order: index + 1,
        }))
      )
    );

    if (uploadedThumbnailUrl) {
      formData.append('thumbnail', uploadedThumbnailUrl);
    } else if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }

    if (editMode && editCourseId) {
      formData.append('_method', 'PUT');
    }

    return formData;
  };

  const submitCourse = async (status: 'draft' | 'published') => {
    const token = await getValidAuthToken();
    if (!token) {
      alert('Your session expired. Please sign in again.');
      return;
    }

    try {
      if (status === 'draft') {
        setIsSaving(true);
      } else {
        setIsPublishing(true);
      }

      // Handle Cloudinary upload if preset exists and we have a new file
      let uploadedUrl: string | null = null;
      if (thumbnailFile && CLOUDINARY_COURSE_PRESET) {
        try {
          const cloudinaryFormData = new FormData();
          cloudinaryFormData.append('file', thumbnailFile);
          cloudinaryFormData.append('upload_preset', CLOUDINARY_COURSE_PRESET);

          const response = await fetch(CLOUDINARY_UPLOAD_URL, {
            method: 'POST',
            body: cloudinaryFormData,
          });

          if (!response.ok) {
            throw new Error('Thumbnail upload failed.');
          }

          const data = await response.json();
          uploadedUrl = data.secure_url;
        } catch (err) {
          throw new Error('Failed to upload thumbnail to Cloudinary.');
        }
      }

      const backendStatus = status === 'published' ? 'pending' : 'draft';
      const formData = buildCoursePayload(backendStatus, uploadedUrl);
      const method = editMode && editCourseId ? 'post' : 'post';
      const endpoint = editMode && editCourseId ? `${API_BASE}/courses/${editCourseId}` : `${API_BASE}/courses`;

      await axios.request({
        url: endpoint,
        method,
        data: formData,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      alert(editMode ? 'Course submitted for review.' : 'Course saved successfully.');
      onMyCourses?.();
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message;
      alert(apiMessage || error.message || 'Failed to save course.');
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
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
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 bg-[#0d0d0d]/80 border border-[#A5C89E]/30 rounded-lg text-white focus:outline-none focus:border-[#A5C89E]/60 transition-all"
            >
              <option value="" disabled>
                Select a category
              </option>
              {courseCategories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.label}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Old Price */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Old Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  placeholder="99.99"
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

          {!thumbnailPreview ? (
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
                  src={thumbnailPreview}
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
          {editMode && courseStatus === 'published' ? (
            <button
              onClick={() => {
                void submitCourse('published');
              }}
              disabled={isPublishing}
              className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-bold hover:shadow-lg hover:shadow-[#A5C89E]/20 disabled:opacity-50 disabled:cursor-not-allowed group uppercase tracking-widest text-xs"
            >
              <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              {isPublishing ? 'UPDATING...' : 'SAVE_CHANGES'}
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  void submitCourse('draft');
                }}
                disabled={isSaving}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#121212]/80 border border-[#A5C89E]/30 text-gray-300 rounded-lg hover:border-[#A5C89E]/50 hover:text-[#A5C89E] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                onClick={() => {
                  void submitCourse('published');
                }}
                disabled={isPublishing}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium hover:shadow-lg hover:shadow-[#A5C89E]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 mr-2" />
                {isPublishing ? 'Publishing...' : 'Publish Course'}
              </button>
            </>
          )}
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