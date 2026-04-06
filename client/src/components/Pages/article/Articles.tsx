import { useEffect, useMemo, useState } from 'react';
import { Search, ChevronDown, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { Pagination } from '../Common/Pagination';
import axios from 'axios';
interface ArticlesProps {
  onArticleClick: (articleId: number) => void;
}

const categories = [
  'All Categories',
  'DSA',
  'Programming Languages',
  'Web Development',
  'Databases',
  'AI & ML',
  'System Design',
];

/**
 * Articles Component
 * Displays a paginated list of articles with search and category filtering capabilities.
 */
export function Articles({ onArticleClick }: ArticlesProps) {
  const API_BASE = `http://${window.location.hostname}:8000/api`;

  const [allArticles, setAllArticles] = useState<
    Array<{ id: number; title: string; description: string; category: string; readTime: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for selected category filter
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 15;

  useEffect(() => {
    const fetchPublishedArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE}/articles`, {
          headers: { Accept: 'application/json' },
        });

        const raw = response.data?.articles ?? [];
        const list = (Array.isArray(raw) ? raw : []).map((art: any) => {
          const id = Number(art.id ?? art.Article_ID);
          const title = String(art.Title ?? art.title ?? 'Untitled Article');
          const content = String(art.Content ?? art.content ?? '');
          const category = String(art.Category ?? art.category ?? 'General');
          const readTime = String(art.Read_Time ?? art.read_time ?? '0 min read');
          const excerpt =
            String(art.Excerpt ?? '').trim() ||
            (content
              ? content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120) +
                (content.length > 120 ? '...' : '')
              : 'No description available.');

          return { id, title, description: excerpt, category, readTime };
        });

        setAllArticles(list.filter((a) => Number.isFinite(a.id)));
      } catch (err: any) {
        console.error(err);
        setAllArticles([]);
        setError('Failed to load published articles.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPublishedArticles();
  }, [API_BASE]);

  // Filter articles based on search query and selected category
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All Categories' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allArticles, searchQuery, selectedCategory]);

  // Reset to page 1 when search or category changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setIsCategoryOpen(false);
  };

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="relative max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-2 h-2 bg-[#A5C89E]/80 rounded-full animate-pulse"></div>
            <span className="text-[#A5C89E]/90 text-xs font-mono tracking-widest">
              KNOWLEDGE BASE
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#A5C89E]/40 to-transparent"></div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
            Articles
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Explore technical articles written by experts. Deep dives into algorithms, languages, frameworks, and system design.
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="mb-12 flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search articles…"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-[#121212]/80 backdrop-blur-sm border border-[#A5C89E]/30 rounded-lg pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#A5C89E]/60 transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative sm:w-64">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full bg-[#121212]/80 backdrop-blur-sm border border-[#A5C89E]/30 rounded-lg px-4 py-4 text-white flex items-center justify-between hover:border-[#A5C89E]/60 transition-all"
            >
              <span className="text-sm font-medium">{selectedCategory}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {isCategoryOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#121212]/95 backdrop-blur-xl border border-[#A5C89E]/30 rounded-lg shadow-2xl z-50 py-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className="w-full text-left px-4 py-2 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/5 transition-all text-sm font-medium"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Article Count */}
        <div className="mb-8 flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-[#A5C89E]/80 rounded-full"></div>
          <span className="text-sm text-gray-400 font-mono">
            {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} found
          </span>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-[#A5C89E]/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#A5C89E] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-[#A5C89E] font-medium animate-pulse">Fetching published articles...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-12 text-center">
            <BookOpen className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-400 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/40 rounded-lg hover:bg-red-500/30 transition-all font-medium"
            >
              Try Again
            </button>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentArticles.map((article) => (
              <div
                key={article.id}
                className="group relative bg-[#121212]/80 backdrop-blur-sm border border-[#A5C89E]/30 rounded-lg p-6 hover:border-[#A5C89E]/60 hover:shadow-lg hover:shadow-[#A5C89E]/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-[#A5C89E]/90 bg-[#A5C89E]/10 px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {article.readTime}
                  </div>
                </div>

                {/* Article Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#A5C89E]/90 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  {article.description}
                </p>

                {/* Read Article Button */}
                <button
                  className="flex items-center text-sm font-medium text-[#A5C89E]/90 hover:text-[#A5C89E] transition-colors group/btn"
                  onClick={() => onArticleClick(article.id)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                {/* Hover Line - Edge to Edge */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A5C89E]/80 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No articles found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredArticles.length > articlesPerPage && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </section>
  );
}