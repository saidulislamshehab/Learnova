import { useState } from 'react';
import { Search, ChevronDown, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { Pagination } from './Pagination';

interface ArticlesProps {
  onArticleClick: (articleId: number) => void;
}

const allArticles = [
  {
    id: 1,
    title: 'Complete Guide to Binary Search Trees',
    description: 'Master the fundamentals of BST operations, traversals, and implementation strategies with practical examples.',
    category: 'DSA',
    readTime: '12 min read',
  },
  {
    id: 2,
    title: 'Advanced Dynamic Programming Patterns',
    description: 'Explore complex DP patterns including state machines, digit DP, and optimization techniques.',
    category: 'DSA',
    readTime: '18 min read',
  },
  {
    id: 3,
    title: 'Graph Algorithms: From Basics to Advanced',
    description: 'Comprehensive guide covering DFS, BFS, shortest paths, and minimum spanning trees.',
    category: 'DSA',
    readTime: '20 min read',
  },
  {
    id: 4,
    title: 'Mastering Python Decorators',
    description: 'Deep dive into Python decorators, closures, and advanced function manipulation techniques.',
    category: 'Programming Languages',
    readTime: '10 min read',
  },
  {
    id: 5,
    title: 'JavaScript ES2024: New Features',
    description: 'Explore the latest JavaScript features including pipeline operator, pattern matching, and more.',
    category: 'Programming Languages',
    readTime: '8 min read',
  },
  {
    id: 6,
    title: 'Rust Memory Safety Explained',
    description: 'Understanding ownership, borrowing, and lifetimes in Rust with practical examples.',
    category: 'Programming Languages',
    readTime: '15 min read',
  },
  {
    id: 7,
    title: 'Building Scalable React Applications',
    description: 'Best practices for component architecture, state management, and performance optimization.',
    category: 'Web Development',
    readTime: '14 min read',
  },
  {
    id: 8,
    title: 'Next.js 14: Server Components Deep Dive',
    description: 'Learn how to leverage React Server Components in Next.js 14 for optimal performance.',
    category: 'Web Development',
    readTime: '16 min read',
  },
  {
    id: 9,
    title: 'RESTful API Design Best Practices',
    description: 'Design principles, versioning strategies, and authentication patterns for modern APIs.',
    category: 'Web Development',
    readTime: '11 min read',
  },
  {
    id: 10,
    title: 'PostgreSQL Query Optimization',
    description: 'Advanced techniques for indexing, query planning, and performance tuning in PostgreSQL.',
    category: 'Databases',
    readTime: '13 min read',
  },
  {
    id: 11,
    title: 'MongoDB Aggregation Pipeline Guide',
    description: 'Master complex data transformations using MongoDB aggregation framework.',
    category: 'Databases',
    readTime: '10 min read',
  },
  {
    id: 12,
    title: 'Database Sharding Strategies',
    description: 'Horizontal scaling techniques and sharding patterns for distributed databases.',
    category: 'Databases',
    readTime: '17 min read',
  },
  {
    id: 13,
    title: 'Introduction to Transformer Architecture',
    description: 'Understanding attention mechanisms and transformer models in modern AI applications.',
    category: 'AI & ML',
    readTime: '22 min read',
  },
  {
    id: 14,
    title: 'Fine-tuning Large Language Models',
    description: 'Practical guide to fine-tuning LLMs using LoRA, QLoRA, and full fine-tuning approaches.',
    category: 'AI & ML',
    readTime: '19 min read',
  },
  {
    id: 15,
    title: 'Computer Vision with PyTorch',
    description: 'Build and train CNN models for image classification, object detection, and segmentation.',
    category: 'AI & ML',
    readTime: '16 min read',
  },
  {
    id: 16,
    title: 'Microservices Architecture Patterns',
    description: 'Design patterns for building resilient, scalable microservices systems.',
    category: 'System Design',
    readTime: '15 min read',
  },
  {
    id: 17,
    title: 'Designing Rate Limiters',
    description: 'Algorithms and strategies for implementing distributed rate limiting systems.',
    category: 'System Design',
    readTime: '12 min read',
  },
  {
    id: 18,
    title: 'Caching Strategies at Scale',
    description: 'Redis, Memcached, and CDN caching patterns for high-performance applications.',
    category: 'System Design',
    readTime: '14 min read',
  },
];

const categories = [
  'All Categories',
  'DSA',
  'Programming Languages',
  'Web Development',
  'Databases',
  'AI & ML',
  'System Design',
];

export function Articles({ onArticleClick }: ArticlesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 15;

  const filteredArticles = allArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All Categories' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  isCategoryOpen ? 'rotate-180' : ''
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
        {filteredArticles.length > 0 ? (
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