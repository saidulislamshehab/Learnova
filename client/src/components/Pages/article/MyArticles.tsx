import { useState, useEffect } from 'react';
import { FileText, Plus, Clock, CheckCircle2, Edit3, Eye, AlertTriangle, X, Loader2 } from 'lucide-react';
import axios from 'axios';

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'pending' | 'rejected';
  lastUpdated: string;
  views?: number;
  category?: string;
  tags?: string;
  read_time?: string;
  reports?: Array<{
    R_ID: string;
    Report_Type: string;
    Description: string;
    created_at: string;
  }>;
}

interface MyArticlesProps {
  onWriteNew: () => void;
  onEditArticle: (article: Article) => void;
}

export function MyArticles({ onWriteNew, onEditArticle }: MyArticlesProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'draft' | 'published' | 'pending' | 'rejected'>('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyArticles();
  }, []);

  const fetchMyArticles = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      setError('You must be logged in to view your articles.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://${window.location.hostname}:8000/api/articles/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const mappedArticles = response.data.articles.map((art: any) => ({
        id: art.id || art.Article_ID,
        title: art.Title,
        content: art.Content,
        excerpt: art.Excerpt || (art.Content ? art.Content.replace(/<[^>]*>/g, ' ').substring(0, 100) + '...' : ''),
        status: art.Status,
        lastUpdated: art.updated_at ? new Date(art.updated_at).toLocaleDateString() : 'Recently',
        views: art.Views || 0,
        category: art.Category,
        tags: art.Tags,
        read_time: art.Read_Time,
        reports: art.reports || [],
      }));

      setArticles(mappedArticles);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else if (err.response?.status === 404) {
        setError('Article service not found.');
      } else if (err.response?.status === 500) {
        setError('Database error: Please ensure migrations are run (php artisan migrate).');
      } else {
        setError('Failed to load articles. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedArticleForReports, setSelectedArticleForReports] = useState<Article | null>(null);

  const handleCheckReports = (e: React.MouseEvent, article: Article) => {
    e.stopPropagation();
    setSelectedArticleForReports(article);
    setShowReportsModal(true);
  };

  const getReportCount = (article: Article) => {
    return article?.reports?.length || 0;
  };

  const getStatusBadge = (status: Article['status']) => {
    const statusConfig = {
      draft: {
        label: 'Draft',
        bgColor: 'bg-gray-500/20',
        textColor: 'text-gray-400',
        borderColor: 'border-gray-500/30',
      },
      published: {
        label: 'Published',
        bgColor: 'bg-[#A5C89E]/20',
        textColor: 'text-[#A5C89E]',
        borderColor: 'border-[#A5C89E]/30',
      },
      pending: {
        label: 'Pending Review',
        bgColor: 'bg-yellow-500/20',
        textColor: 'text-yellow-400',
        borderColor: 'border-yellow-500/30',
      },
      rejected: {
        label: 'Rejected',
        bgColor: 'bg-red-500/20',
        textColor: 'text-red-400',
        borderColor: 'border-red-500/30',
      },
    };

    const config = statusConfig[status];

    return (
      <span
        className={`inline-flex items-center px-3 py-1 ${config.bgColor} ${config.textColor} border ${config.borderColor} rounded-full text-xs font-medium`}
      >
        {status === 'draft' && <Edit3 className="w-3 h-3 mr-1.5" />}
        {status === 'published' && <CheckCircle2 className="w-3 h-3 mr-1.5" />}
        {status === 'pending' && <Clock className="w-3 h-3 mr-1.5" />}
        {config.label}
      </span>
    );
  };

  const getArticleCount = (filter: typeof activeFilter) => {
    if (filter === 'all') return articles.length;
    return articles.filter((a) => a.status === filter).length;
  };

  const filteredArticles = activeFilter === 'all' 
    ? articles 
    : articles.filter((a) => a.status === activeFilter);

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="relative max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-lg">
              <FileText className="w-6 h-6 text-[#A5C89E]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                My Articles
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage all your articles in one place
              </p>
            </div>
          </div>
          <button
            onClick={onWriteNew}
            className="inline-flex items-center px-6 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium hover:shadow-lg hover:shadow-[#A5C89E]/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Write New Article
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[#A5C89E]/20 text-[#A5C89E] border border-[#A5C89E]/40'
                : 'bg-[#121212]/60 text-gray-400 border border-[#A5C89E]/20 hover:border-[#A5C89E]/40 hover:text-gray-300'
            }`}
          >
            All <span className="ml-1.5 opacity-70">({getArticleCount('all')})</span>
          </button>
          <button
            onClick={() => setActiveFilter('published')}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
              activeFilter === 'published'
                ? 'bg-[#A5C89E]/20 text-[#A5C89E] border border-[#A5C89E]/40'
                : 'bg-[#121212]/60 text-gray-400 border border-[#A5C89E]/20 hover:border-[#A5C89E]/40 hover:text-gray-300'
            }`}
          >
            Published <span className="ml-1.5 opacity-70">({getArticleCount('published')})</span>
          </button>
          <button
            onClick={() => setActiveFilter('draft')}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
              activeFilter === 'draft'
                ? 'bg-[#A5C89E]/20 text-[#A5C89E] border border-[#A5C89E]/40'
                : 'bg-[#121212]/60 text-gray-400 border border-[#A5C89E]/20 hover:border-[#A5C89E]/40 hover:text-gray-300'
            }`}
          >
            Draft <span className="ml-1.5 opacity-70">({getArticleCount('draft')})</span>
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
              activeFilter === 'pending'
                ? 'bg-[#A5C89E]/20 text-[#A5C89E] border border-[#A5C89E]/40'
                : 'bg-[#121212]/60 text-gray-400 border border-[#A5C89E]/20 hover:border-[#A5C89E]/40 hover:text-gray-300'
            }`}
          >
            Pending <span className="ml-1.5 opacity-70">({getArticleCount('pending')})</span>
          </button>
        </div>

        {/* Articles List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-[#A5C89E]/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#A5C89E] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-[#A5C89E] font-medium animate-pulse">Fetching your articles...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-400 font-medium">{error}</p>
            <button 
              onClick={fetchMyArticles}
              className="mt-4 px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/40 rounded-lg hover:bg-red-500/30 transition-all font-medium"
            >
              Try Again
            </button>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => onEditArticle(article)}
                className="group relative bg-[#121212]/80 backdrop-blur-sm border border-[#A5C89E]/30 rounded-lg p-6 hover:border-[#A5C89E]/60 hover:shadow-lg hover:shadow-[#A5C89E]/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
              >
                {/* Status Badge & Meta Info */}
                <div className="flex items-center justify-between mb-4">
                  {getStatusBadge(article.status)}
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {article.lastUpdated}
                  </div>
                </div>

                {/* Article Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#A5C89E]/90 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>

                {/* Meta Info & Reports Button */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      Article
                    </div>
                    {article.status === 'published' && article.views && (
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {article.views.toLocaleString()} views
                      </div>
                    )}
                  </div>

                  {/* Check Reports Button */}
                  {article.status === 'published' && getReportCount(article) > 0 && (
                    <button
                      onClick={(e) => handleCheckReports(e, article)}
                      className="self-start flex items-center gap-2 px-3 py-1.5 bg-[#121212]/60 border border-gray-600 text-gray-300 rounded-lg hover:bg-[#121212]/80 hover:border-gray-500 hover:text-white transition-all font-medium text-xs"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Reports ({getReportCount(article)})
                    </button>
                  )}
                </div>

                {/* Hover Line - Edge to Edge */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A5C89E]/80 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#A5C89E]/30 rounded-2xl p-16 text-center">
            <div className="mb-6 flex justify-center">
              <div className="p-6 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-2xl">
                <FileText className="w-12 h-12 text-[#A5C89E]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white/90 mb-3">
              {activeFilter === 'all'
                ? "You haven't written any articles yet"
                : `No ${activeFilter} articles`}
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-md mx-auto">
              {activeFilter === 'all'
                ? 'Start sharing your knowledge with the Learnova community.'
                : `You don't have any ${activeFilter} articles at the moment.`}
            </p>
            <button
              onClick={onWriteNew}
              className="inline-flex items-center px-8 py-4 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium group hover:shadow-lg hover:shadow-[#A5C89E]/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span>Start Writing</span>
            </button>
          </div>
        )}

        {/* Stats Summary */}
        {filteredArticles.length > 0 && activeFilter === 'all' && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#121212]/60 border border-[#A5C89E]/20 rounded-lg p-5 text-center">
              <div className="text-2xl font-bold text-[#A5C89E] mb-1">
                {articles.filter((a) => a.status === 'published').length}
              </div>
              <div className="text-sm text-gray-500">Published Articles</div>
            </div>
            <div className="bg-[#121212]/60 border border-[#A5C89E]/20 rounded-lg p-5 text-center">
              <div className="text-2xl font-bold text-[#A5C89E] mb-1">
                {articles
                  .filter((a) => a.status === 'published')
                  .reduce((sum, a) => sum + (a.views || 0), 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total Views</div>
            </div>
            <div className="bg-[#121212]/60 border border-[#A5C89E]/20 rounded-lg p-5 text-center">
              <div className="text-2xl font-bold text-[#A5C89E] mb-1">
                {articles.filter((a) => a.status === 'draft').length}
              </div>
              <div className="text-sm text-gray-500">Drafts</div>
            </div>
          </div>
        )}

        {/* Reports Modal */}
        {showReportsModal && selectedArticleForReports && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowReportsModal(false)}
          >
            <div
              className="bg-[#121212]/95 backdrop-blur-xl border border-[#A5C89E]/30 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 pb-4 border-b border-[#A5C89E]/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#A5C89E]/10 border border-[#A5C89E]/30 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-[#A5C89E]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Article Reports</h3>
                    <p className="text-sm text-gray-400 mt-0.5">{selectedArticleForReports.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReportsModal(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Reports List */}
              <div className="flex-1 overflow-y-auto p-6">
                {(selectedArticleForReports.reports?.length || 0) > 0 ? (
                  <div className="space-y-4">
                    {selectedArticleForReports.reports?.map((report) => (
                      <div
                        key={report.R_ID}
                        className="bg-[#0b0b0b]/60 border border-gray-700 rounded-lg p-5 hover:border-gray-600 transition-all"
                      >
                        {/* Report Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-3 py-1 bg-gray-700/30 text-gray-300 border border-gray-600 rounded-full text-xs font-medium">
                              {report.Report_Type}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{new Date(report.created_at).toLocaleDateString()}</span>
                        </div>

                        {/* Report Description */}
                        <div>
                          <p className="text-sm font-medium text-gray-400 mb-1.5">Description:</p>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {report.Description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <AlertTriangle className="w-12 h-12 text-gray-700 mb-4" />
                    <p className="text-gray-400">No reports found for this article</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 pt-4 border-t border-[#A5C89E]/20">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Total Reports: {selectedArticleForReports.reports?.length || 0}
                  </p>
                  <button
                    onClick={() => setShowReportsModal(false)}
                    className="px-6 py-2.5 bg-[#121212]/80 border border-[#A5C89E]/30 text-gray-300 rounded-lg hover:border-[#A5C89E]/50 hover:text-[#A5C89E] transition-all font-medium text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}