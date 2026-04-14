import { API_URL } from '@/utils/constants';
import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Clock, BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = `${API_URL}`;

interface Article {
  id: number;
  title: string;
  description: string;
  category: string;
  readTime: string;
}

interface BookmarksProps {
  onArticleClick: (articleId: number) => void;
}

export function Bookmarks({ onArticleClick }: BookmarksProps) {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const fetchBookmarks = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setBookmarks([]);
      setError('Please sign in to view your bookmarks.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE}/bookmarks`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const raw = response.data?.bookmarks ?? [];
      const list = (Array.isArray(raw) ? raw : [])
        .filter((b: any) => b.article) // filter out bookmarks with deleted articles
        .map((b: any) => {
          const a = b.article;
          const content = String(a.Content ?? a.content ?? '');
          const description =
            content
              .replace(/<[^>]*>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 120) + (content.length > 120 ? '...' : '');

          return {
            id: Number(a.Article_ID ?? a.id),
            title: String(a.Title ?? a.title ?? 'Untitled Article'),
            description,
            category: String(a.Category ?? a.category ?? 'General'),
            readTime: String(a.Read_Time ?? a.read_time ?? '0 min read'),
          };
        });

      setBookmarks(list);
    } catch (err: any) {
      setBookmarks([]);
      if (err?.response?.status === 401) {
        setError('Session expired. Please sign in again.');
      } else {
        setError(err?.response?.data?.message || 'Failed to load bookmarks.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchBookmarks();
  }, []);

  const removeBookmark = async (articleId: number) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    setRemovingId(articleId);
    try {
      await axios.post(
        `${API_BASE}/bookmarks/${articleId}`,
        {},
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookmarks((prev) => prev.filter((a) => a.id !== articleId));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to remove bookmark.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="relative max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-2 h-2 bg-[#A5C89E]/80 rounded-full animate-pulse"></div>
            <span className="text-[#A5C89E]/90 text-xs font-mono tracking-widest">
              SAVED FOR LATER
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#A5C89E]/40 to-transparent"></div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
            My Bookmarks
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Articles you've saved to read later. Keep your learning organized and accessible.
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-[#A5C89E]/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#A5C89E] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-[#A5C89E] font-medium animate-pulse">Loading bookmarks...</p>
          </div>
        ) : error ? (
          <div className="text-center py-32">
            <div className="mb-6 flex justify-center">
              <div className="p-6 bg-[#121212]/80 backdrop-blur-sm border border-red-500/20 rounded-2xl">
                <Bookmark className="w-16 h-16 text-red-400 mx-auto" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-3">{error}</h3>
          </div>
        ) : (
          <>
            {/* Bookmark Count */}
            {bookmarks.length > 0 && (
              <div className="mb-8 flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-[#A5C89E]/80 rounded-full"></div>
                <span className="text-sm text-gray-400 font-mono">
                  {bookmarks.length} {bookmarks.length === 1 ? 'article' : 'articles'} bookmarked
                </span>
              </div>
            )}

            {/* Bookmarked Articles Grid */}
            {bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map((article) => (
                  <div
                    key={article.id}
                    className="group bg-[#121212]/80 backdrop-blur-sm border border-[#A5C89E]/30 rounded-lg p-6 hover:border-[#A5C89E]/60 hover:shadow-lg hover:shadow-[#A5C89E]/10 transition-all duration-300 hover:-translate-y-1 relative"
                  >
                    {/* Bookmark Icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBookmark(article.id);
                      }}
                      disabled={removingId === article.id}
                      className="absolute top-4 right-4 p-2 text-[#A5C89E] hover:text-[#A5C89E]/70 transition-colors z-10 disabled:opacity-50"
                      title="Remove bookmark"
                    >
                      {removingId === article.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <BookmarkCheck className="w-5 h-5 fill-current" />
                      )}
                    </button>

                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-4 pr-8">
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
                  </div>
                ))}
              </div>
            ) : (
              // Empty State
              <div className="text-center py-32">
                <div className="mb-6 flex justify-center">
                  <div className="p-6 bg-[#121212]/80 backdrop-blur-sm border border-[#A5C89E]/20 rounded-2xl">
                    <Bookmark className="w-16 h-16 text-gray-600 mx-auto" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-3">
                  No bookmarks yet
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  You haven't bookmarked any articles yet. Start exploring and save articles to read later.
                </p>
                <button
                  onClick={() => (window.location.href = '#articles')}
                  className="inline-flex items-center px-6 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium group"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>Explore Articles</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
