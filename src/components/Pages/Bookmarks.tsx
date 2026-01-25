import { useState } from 'react';
import { Bookmark, BookmarkCheck, Clock, BookOpen, ArrowRight } from 'lucide-react';

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

// Mock bookmarked articles data
const initialBookmarks: Article[] = [
  {
    id: 1,
    title: 'Complete Guide to Binary Search Trees',
    description: 'Master the fundamentals of BST operations, traversals, and implementation strategies with practical examples.',
    category: 'DSA',
    readTime: '12 min read',
  },
  {
    id: 7,
    title: 'Building Scalable React Applications',
    description: 'Best practices for component architecture, state management, and performance optimization.',
    category: 'Web Development',
    readTime: '14 min read',
  },
  {
    id: 13,
    title: 'Introduction to Transformer Architecture',
    description: 'Understanding attention mechanisms and transformer models in modern AI applications.',
    category: 'AI & ML',
    readTime: '22 min read',
  },
  {
    id: 10,
    title: 'PostgreSQL Query Optimization',
    description: 'Advanced techniques for indexing, query planning, and performance tuning in PostgreSQL.',
    category: 'Databases',
    readTime: '13 min read',
  },
  {
    id: 16,
    title: 'Microservices Architecture Patterns',
    description: 'Design patterns for building resilient, scalable microservices systems.',
    category: 'System Design',
    readTime: '15 min read',
  },
];

export function Bookmarks({ onArticleClick }: BookmarksProps) {
  const [bookmarks, setBookmarks] = useState<Article[]>(initialBookmarks);

  const removeBookmark = (articleId: number) => {
    setBookmarks(bookmarks.filter(article => article.id !== articleId));
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
                  className="absolute top-4 right-4 p-2 text-[#A5C89E] hover:text-[#A5C89E]/70 transition-colors z-10"
                  title="Remove bookmark"
                >
                  <BookmarkCheck className="w-5 h-5 fill-current" />
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
              onClick={() => window.location.href = '#articles'}
              className="inline-flex items-center px-6 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium group"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              <span>Explore Articles</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
