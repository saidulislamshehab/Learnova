import { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Code,
  Code2,
  Link,
  Image,
  Quote,
  FileText,
  Save,
  Send,
  CheckCircle2,
  Clock,
  Edit3,
  X,
  Plus,
  Tag,
  Undo,
  Redo,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { Article } from './MyArticles';
import axios from 'axios';

interface ArticleEditorProps {
  onMyArticles?: () => void;
  existingArticle?: Article;
}

export function ArticleEditor({ onMyArticles, existingArticle }: ArticleEditorProps) {
  const [title, setTitle] = useState(existingArticle?.title || '');
  const [content, setContent] = useState(existingArticle?.content || '');
  const [status, setStatus] = useState<'draft' | 'published' | 'pending' | 'rejected'>(
    existingArticle?.status || 'draft'
  );
  const parseCategoriesFromString = (value: string | undefined): string[] => {
    if (!value?.trim()) return [];
    return value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const [categoryValue, setCategoryValue] = useState<string>(() => {
    if (!existingArticle?.category) return '';
    const parsed = parseCategoriesFromString(existingArticle.category);
    return parsed[0] ?? '';
  });
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [categoryFeedback, setCategoryFeedback] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [activeCategorySuggestionIndex, setActiveCategorySuggestionIndex] = useState(-1);
  const editorRef = useRef<HTMLDivElement>(null);

  const predefinedCategories = [
    'Web Development',
    'Data Structures',
    'Algorithms',
    'Machine Learning',
    'Cloud Computing',
    'DevOps',
    'Cybersecurity',
    'Mobile Development',
    'Database',
    'Programming Languages',
    'AI/ML',
    'Software Engineering',
  ];
  const [availableCategories, setAvailableCategories] = useState<string[]>(predefinedCategories);

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setCustomTag('');
    setShowTagDropdown(false);
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const addCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag.trim());
    }
  };

  const setCategory = (raw: string) => {
    const normalized = raw.trim();
    if (!normalized) return;
    if (categoryValue.toLowerCase() === normalized.toLowerCase()) {
      return;
    }

    if (!availableCategories.some((c) => c.toLowerCase() === normalized.toLowerCase())) {
      setAvailableCategories((prev) => [...prev, normalized]);
      setCategoryFeedback(`Category "${normalized}" added`);
      window.setTimeout(() => setCategoryFeedback(''), 2500);
    }

    setCategoryValue(normalized);
  };

  const categoryPayload = categoryValue.trim();

  // Load existing article content into editor
  useEffect(() => {
    if (existingArticle) {
      if (editorRef.current) {
        editorRef.current.innerHTML = existingArticle.content;
      }
      setContent(existingArticle.content);
      if (existingArticle.tags) {
        setSelectedTags(existingArticle.tags.split(','));
      }
      if (existingArticle.category) {
        const parsed = parseCategoriesFromString(existingArticle.category);
        if (parsed.length > 0) {
          setCategoryValue(parsed[0]);
        }
        parsed.forEach((articleCategory) => {
          if (!predefinedCategories.includes(articleCategory)) {
            setAvailableCategories((prev) =>
              prev.includes(articleCategory) ? prev : [...prev, articleCategory]
            );
          }
        });
      }
    }
  }, [existingArticle]);

  const calculateReadTime = (htmlContent: string) => {
    const text = htmlContent.replace(/<[^>]*>/g, ' '); // Strip HTML tags
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const wpm = 200; // Words per minute
    const minutes = Math.ceil(wordCount / wpm);
    return `${minutes} min read`;
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!categoryPayload) {
      alert('Please add at least one category');
      return;
    }

    setIsSaving(true);
    const token = localStorage.getItem('auth_token');
    const readTime = calculateReadTime(content);
    
    try {
      const payload = {
        title,
        content,
        category: categoryPayload,
        tags: selectedTags.join(','),
        status: 'draft',
        read_time: readTime,
      };

      if (existingArticle) {
        await axios.put(`http://${window.location.hostname}:8000/api/articles/${existingArticle.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://${window.location.hostname}:8000/api/articles`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setStatus('draft');
      alert('Article saved as draft!');
      onMyArticles?.();
    } catch (err) {
      console.error(err);
      alert('Failed to save article.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your article');
      return;
    }
    if (!content.trim()) {
      alert('Please write some content for your article');
      return;
    }
    if (!categoryPayload) {
      alert('Please add at least one category');
      return;
    }

    setIsPublishing(true);
    const token = localStorage.getItem('auth_token');
    const readTime = calculateReadTime(content);

    try {
      const payload = {
        title,
        content,
        category: categoryPayload,
        tags: selectedTags.join(','),
        status: 'pending',
        read_time: readTime,
      };

      if (existingArticle) {
        await axios.put(`http://${window.location.hostname}:8000/api/articles/${existingArticle.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://${window.location.hostname}:8000/api/articles`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setStatus('pending');
      alert('Article submitted for review!');
      onMyArticles?.();
    } catch (err) {
      console.error(err);
      alert('Failed to publish article.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUpdate = async () => {
    if (!categoryPayload) {
      alert('Please add at least one category');
      return;
    }
    setIsSaving(true);
    const token = localStorage.getItem('auth_token');
    const readTime = calculateReadTime(content);

    try {
      const payload = {
        title,
        content,
        category: categoryPayload,
        tags: selectedTags.join(','),
        status: status, // Keep current status
        read_time: readTime,
      };

      await axios.put(`http://${window.location.hostname}:8000/api/articles/${existingArticle!.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Article updated successfully!');
      onMyArticles?.();
    } catch (err) {
      console.error(err);
      alert('Failed to update article.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      draft: {
        label: 'Draft',
        icon: Edit3,
        bgColor: 'bg-gray-500/20',
        textColor: 'text-gray-400',
        borderColor: 'border-gray-500/30',
      },
      published: {
        label: 'Published',
        icon: CheckCircle2,
        bgColor: 'bg-[#A5C89E]/20',
        textColor: 'text-[#A5C89E]',
        borderColor: 'border-[#A5C89E]/30',
      },
      pending: {
        label: 'Pending Review',
        icon: Clock,
        bgColor: 'bg-yellow-500/20',
        textColor: 'text-yellow-400',
        borderColor: 'border-yellow-500/30',
      },
      rejected: {
        label: 'Rejected',
        icon: X,
        bgColor: 'bg-red-500/20',
        textColor: 'text-red-400',
        borderColor: 'border-red-500/30',
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 ${config.bgColor} ${config.textColor} border ${config.borderColor} rounded-full text-xs font-medium`}
      >
        <Icon className="w-3.5 h-3.5 mr-1.5" />
        {config.label}
      </span>
    );
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      applyFormat('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      applyFormat('insertImage', url);
    }
  };

  const insertCodeBlock = () => {
    const code = prompt('Enter code:');
    if (code) {
      applyFormat('insertHTML', `<pre class="code-block"><code>${code}</code></pre>`);
    }
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="relative max-w-5xl mx-auto">
        {/* Top Action Bar */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-lg">
              <FileText className="w-6 h-6 text-[#A5C89E]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Write Article
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Share your knowledge with the community
              </p>
            </div>
          </div>
          <button
            onClick={onMyArticles}
            className="px-6 py-2.5 bg-[#121212]/80 border border-[#A5C89E]/30 text-gray-300 rounded-lg hover:border-[#A5C89E]/50 hover:text-[#A5C89E] transition-all text-sm font-medium"
          >
            My Articles
          </button>
        </div>

        {/* Article Title Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-400">
              Article Title <span className="text-[#A5C89E]">*</span>
            </label>
            {existingArticle && getStatusBadge()}
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your desired title"
            className="w-full px-4 py-3 bg-[#121212]/80 border border-[#A5C89E]/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#A5C89E]/60 transition-all text-lg"
          />
        </div>

        {/* Rich Text Editor Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Content
          </label>
          <div className="bg-[#121212]/80 border border-[#A5C89E]/30 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-3 border-b border-[#A5C89E]/20 bg-[#0d0d0d]/50 overflow-x-auto">
              {/* Undo/Redo */}
              <div className="flex items-center gap-1 pr-2 border-r border-[#A5C89E]/20">
                <button
                  onClick={() => applyFormat('undo')}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Undo"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyFormat('redo')}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Redo"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>

              {/* Text Formatting */}
              <div className="flex items-center gap-1 pr-2 border-r border-[#A5C89E]/20">
                <button
                  onClick={() => applyFormat('bold')}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyFormat('italic')}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyFormat('underline')}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Underline"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyFormat('strikethrough')}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Strikethrough"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>
              </div>

              {/* Headings */}
              <div className="flex items-center gap-1 pr-2 border-r border-[#A5C89E]/20">
                <button
                  onClick={() => applyFormat('formatBlock', 'h1')}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Heading 1"
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyFormat('formatBlock', 'h2')}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
              </div>

              {/* Lists */}
              <div className="flex items-center gap-1 pr-2 border-r border-[#A5C89E]/20">
                <button
                  onClick={() => applyFormat('insertUnorderedList')}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyFormat('insertOrderedList')}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyFormat('formatBlock', 'blockquote')}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Quote"
                >
                  <Quote className="w-4 h-4" />
                </button>
              </div>

              {/* Code */}
              <div className="flex items-center gap-1 pr-2 border-r border-[#A5C89E]/20">
                <button
                  onClick={() => {
                    const selection = window.getSelection();
                    const selectedText = selection?.toString();
                    if (selectedText) {
                      applyFormat('insertHTML', `<code style="background: rgba(165, 200, 158, 0.1); padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #A5C89E;">${selectedText}</code>`);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Inline Code"
                >
                  <Code2 className="w-4 h-4" />
                </button>
                <button
                  onClick={insertCodeBlock}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Code Block"
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>

              {/* Alignment */}
              <div className="flex items-center gap-1 pr-2 border-r border-[#A5C89E]/20">
                <button
                  onClick={() => applyFormat('justifyLeft')}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyFormat('justifyCenter')}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyFormat('justifyRight')}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Align Right"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>

              {/* Insert Elements */}
              <div className="flex items-center gap-1">
                <button
                  onClick={insertLink}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Insert Link"
                >
                  <Link className="w-4 h-4" />
                </button>
                <button
                  onClick={insertImage}
                  className="p-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all"
                  title="Insert Image"
                >
                  <Image className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Editor Area */}
            <div
              ref={editorRef}
              contentEditable
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              className="min-h-[500px] p-6 text-white focus:outline-none prose prose-invert max-w-none editor-content"
              data-placeholder="Start writing your article here…"
              style={{
                caretColor: '#A5C89E',
              }}
              suppressContentEditableWarning
            />
          </div>
        </div>

        {/* Category Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Article Category <span className="text-[#A5C89E]">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={categoryValue}
              onChange={(e) => setCategoryValue(e.target.value)}
              onFocus={() => setShowCategorySuggestions(true)}
              onBlur={() => window.setTimeout(() => setShowCategorySuggestions(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setCategory(categoryValue);
                }
              }}
              placeholder="Type a category"
              className="w-full px-4 py-3 bg-[#121212]/80 border border-[#A5C89E]/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#A5C89E]/60 transition-all"
            />

            {showCategorySuggestions && (
              <div className="absolute z-10 mt-2 w-full bg-[#121212]/95 backdrop-blur-xl border border-[#A5C89E]/30 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                <div className="p-2">
                  <p className="text-xs font-mono text-gray-500 px-2 py-1.5 tracking-wider">SUGGESTIONS</p>
                  {availableCategories
                    .filter((cat) => cat.toLowerCase().includes(categoryValue.toLowerCase()))
                    .slice(0, 12)
                    .map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className="w-full text-left px-3 py-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all text-sm font-medium flex items-center"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setCategory(cat);
                          setShowCategorySuggestions(false);
                        }}
                      >
                        <Tag className="w-4 h-4 mr-2 opacity-60 shrink-0" />
                        {cat}
                      </button>
                    ))}
                  {categoryValue.trim() &&
                    !availableCategories.some((c) => c.toLowerCase() === categoryValue.trim().toLowerCase()) && (
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 text-[#A5C89E] hover:bg-[#A5C89E]/10 rounded transition-all text-sm font-medium flex items-center border-t border-[#A5C89E]/20 mt-1 pt-2"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setCategory(categoryValue);
                          setShowCategorySuggestions(false);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2 shrink-0" />
                        Use &quot;{categoryValue.trim()}&quot;
                      </button>
                    )}
                </div>
              </div>
            )}
          </div>
          {categoryFeedback ? (
            <p className="text-xs text-[#A5C89E] mt-2">{categoryFeedback}</p>
          ) : null}
        </div>

        {/* Tags Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Tags
          </label>
          
          {/* Selected Tags Display */}
          {selectedTags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1.5 bg-[#A5C89E]/20 text-[#A5C89E] border border-[#A5C89E]/30 rounded-full text-sm font-medium"
                >
                  <Tag className="w-3.5 h-3.5 mr-1.5" />
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tag Input Section */}
          <div className="relative">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => {
                    setCustomTag(e.target.value);
                    setShowTagDropdown(true);
                  }}
                  onKeyDown={(e) => {
                    if (!showTagDropdown) {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomTag();
                      }
                      return;
                    }

                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      if (tagSuggestions.length > 0) {
                        setActiveTagSuggestionIndex((prev) => (prev + 1) % tagSuggestions.length);
                      }
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      if (tagSuggestions.length > 0) {
                        setActiveTagSuggestionIndex((prev) =>
                          prev <= 0 ? tagSuggestions.length - 1 : prev - 1
                        );
                      }
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      if (activeTagSuggestionIndex >= 0 && activeTagSuggestionIndex < tagSuggestions.length) {
                        addTag(tagSuggestions[activeTagSuggestionIndex]);
                      } else {
                        addCustomTag();
                      }
                    } else if (e.key === 'Escape') {
                      setShowTagDropdown(false);
                    }
                  }}
                  placeholder="Type to add custom tag or select from dropdown"
                  className="w-full px-4 py-3 bg-[#121212]/80 border border-[#A5C89E]/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#A5C89E]/60 transition-all"
                  onFocus={() => {
                    setShowTagDropdown(true);
                    setActiveTagSuggestionIndex(-1);
                  }}
                  onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
                />
                
                {/* Dropdown Menu */}
                {showTagDropdown && (
                  <div className="absolute z-10 mt-2 w-full bg-[#121212]/95 backdrop-blur-xl border border-[#A5C89E]/30 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                    <div className="p-2">
                      <p className="text-xs font-mono text-gray-500 px-2 py-1.5 tracking-wider">
                        PREDEFINED CATEGORIES
                      </p>
                      {tagSuggestions.map((category, index) => (
                          <button
                            key={category}
                            className={`w-full text-left px-3 py-2 rounded transition-all text-sm font-medium flex items-center ${
                              activeTagSuggestionIndex === index
                                ? 'text-[#A5C89E] bg-[#A5C89E]/10'
                                : 'text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10'
                            }`}
                            onClick={() => addTag(category)}
                          >
                            <Tag className="w-4 h-4 mr-2 opacity-60" />
                            {category}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Add Custom Tag Button */}
              <button
                onClick={addCustomTag}
                disabled={!customTag.trim()}
                className="px-5 py-3 bg-[#A5C89E]/20 border border-[#A5C89E]/40 text-[#A5C89E] rounded-lg hover:bg-[#A5C89E]/30 transition-all font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
                title="Add custom tag"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Select from predefined categories or create your own. Press Enter or click + to add.
            </p>
          </div>
        </div>

        {/* Bottom Action Section */}
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-6 py-3 bg-[#121212]/80 border border-[#A5C89E]/30 text-gray-300 rounded-lg hover:border-[#A5C89E]/50 hover:text-[#A5C89E] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          {status === 'published' ? (
            <button
              onClick={handleUpdate}
              disabled={isSaving}
              className="inline-flex items-center px-8 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium hover:shadow-lg hover:shadow-[#A5C89E]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {isSaving ? 'Updating...' : 'Update Article'}
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="inline-flex items-center px-8 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium hover:shadow-lg hover:shadow-[#A5C89E]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-2" />
              {isPublishing ? 'Publishing...' : 'Publish Article'}
            </button>
          )}
        </div>

        {/* Helper Tips */}
        <div className="mt-8 p-4 bg-[#121212]/60 border border-[#A5C89E]/20 rounded-lg">
          <p className="text-sm text-gray-500">
            <span className="text-[#A5C89E] font-medium">💡 Tip:</span> Use the toolbar to format your text, add code blocks, and insert links or images. Your article will be saved automatically as you write.
          </p>
        </div>
      </div>

      <style>{`
        .editor-content:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          pointer-events: none;
          position: absolute;
        }

        .code-block {
          background: #0d0d0d;
          border: 1px solid rgba(165, 200, 158, 0.2);
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
          overflow-x: auto;
        }
        
        .code-block code {
          font-family: 'Courier New', monospace;
          color: #A5C89E;
          font-size: 14px;
        }

        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
          color: white;
        }

        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
          color: white;
        }

        [contenteditable] blockquote {
          border-left: 4px solid rgba(165, 200, 158, 0.5);
          padding-left: 16px;
          margin: 16px 0;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }

        [contenteditable] ul,
        [contenteditable] ol {
          padding-left: 24px;
          margin: 12px 0;
        }

        [contenteditable] li {
          margin: 8px 0;
        }

        [contenteditable] a {
          color: #A5C89E;
          text-decoration: underline;
        }

        [contenteditable] img {
          max-width: 100%;
          border-radius: 8px;
          margin: 16px 0;
        }

        [contenteditable] pre {
          background: #0d0d0d;
          border: 1px solid rgba(165, 200, 158, 0.2);
          border-radius: 8px;
          padding: 16px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          color: #A5C89E;
        }
      `}</style>
    </section>
  );
}