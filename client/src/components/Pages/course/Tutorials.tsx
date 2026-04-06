import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronDown, BookOpen, ArrowRight, Clock, FileText } from 'lucide-react';

const categories = [
    'All Tutorials',
    'C',
    'C++',
    'Machine Learning',
    'Java',
    'Python',
    'Algorithms',
    'DSA',
];

const API_BASE = `http://${window.location.hostname}:8000/api`;

export function Tutorials() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Tutorials');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedTutorialId, setSelectedTutorialId] = useState<number | null>(null);
    const [allTutorials, setAllTutorials] = useState<any[]>([]);
    const [tutorialDetails, setTutorialDetails] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTutorial, setIsLoadingTutorial] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch all published tutorials on mount
    useEffect(() => {
        void fetchAllTutorials();
    }, []);

    // Fetch specific tutorial details when selectedTutorialId changes
    useEffect(() => {
        if (selectedTutorialId) {
            void fetchTutorialDetails(selectedTutorialId);
        } else {
            setTutorialDetails(null);
        }
    }, [selectedTutorialId]);

    const fetchAllTutorials = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE}/tutorials`, {
                headers: { Accept: 'application/json' }
            });
            setAllTutorials(response.data.tutorials || []);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch tutorials');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTutorialDetails = async (id: number) => {
        setIsLoadingTutorial(true);
        try {
            const response = await axios.get(`${API_BASE}/tutorials/${id}`, {
                headers: { Accept: 'application/json' }
            });
            setTutorialDetails(response.data.tutorial || null);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to load tutorial details');
            setSelectedTutorialId(null);
        } finally {
            setIsLoadingTutorial(false);
        }
    };

    const filteredTutorials = allTutorials.filter((t) => {
        const matchesSearch =
            t.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.Description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === 'All Tutorials' || t.Category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setIsCategoryOpen(false);
    };

    // --- Sub-view: Single Tutorial Details ---
    if (selectedTutorialId) {
        if (isLoadingTutorial) {
            return (
                <div className="min-h-screen pt-32 flex items-center justify-center text-gray-400">
                    <div className="animate-pulse">Loading tutorial content...</div>
                </div>
            );
        }

        if (!tutorialDetails) return null;

        const articles = tutorialDetails.articles || [];

        return (
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
                <div
                    className="fixed inset-0 pointer-events-none z-0"
                    style={{
                        backgroundImage: `
                        linear-gradient(rgba(128, 128, 128, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(128, 128, 128, 0.05) 1px, transparent 1px)
                      `,
                        backgroundSize: '80px 80px',
                    }}
                />
                <div className="relative max-w-7xl mx-auto">
                    <button
                        onClick={() => setSelectedTutorialId(null)}
                        className="mb-8 flex items-center text-gray-400 hover:text-[#A5C89E] transition-colors"
                    >
                        <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                        Back to Tutorials
                    </button>

                    <div className="mb-12">
                        <span className="text-[#A5C89E]/90 text-xs font-mono tracking-widest bg-[#A5C89E]/10 px-3 py-1 rounded-full mb-4 inline-block">
                            {tutorialDetails.Category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            {tutorialDetails.Title}
                        </h1>
                        <p className="text-lg text-gray-400 max-w-3xl">
                            {tutorialDetails.Description} This series contains {articles.length} detailed articles to help you master the topic.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article: any, index: number) => (
                            <div
                                key={article.Article_ID || article.id}
                                className="group relative bg-[#121212]/80 backdrop-blur-sm border border-[#A5C89E]/30 rounded-lg p-6 hover:border-[#A5C89E]/60 hover:shadow-lg hover:shadow-[#A5C89E]/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-6xl font-bold text-[#A5C89E] font-mono">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
                                        <div className="flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {article.ReadTime || '10 min'}
                                        </div>
                                        <span>•</span>
                                        <span>{article.created_at ? new Date(article.created_at).toLocaleDateString() : 'N/A'}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#A5C89E]/90 transition-colors line-clamp-2 text-left">
                                        {article.Title}
                                    </h3>
                                    <p className="text-sm text-gray-400 mb-6 leading-relaxed line-clamp-3 text-left">
                                        {article.Description || (article.Content ? article.Content.substring(0, 100).replace(/<[^>]*>/g, '') + '...' : 'No description available.')}
                                    </p>

                                    <button className="flex items-center text-sm font-medium text-[#A5C89E]/90 hover:text-[#A5C89E] transition-colors group/btn">
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        <span>Read Article</span>
                                        <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A5C89E]/80 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // --- Main Tutorials Grid View ---
    return (
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: `
                    linear-gradient(rgba(128, 128, 128, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(128, 128, 128, 0.05) 1px, transparent 1px)
                  `,
                    backgroundSize: '80px 80px',
                }}
            />

            <div className="relative max-w-7xl mx-auto">
                <div className="mb-12 text-left">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-2 h-2 bg-[#A5C89E]/80 rounded-full animate-pulse"></div>
                        <span className="text-[#A5C89E]/90 text-xs font-mono tracking-widest">
                             // TUTORIALS
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#A5C89E]/40 to-transparent"></div>
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight uppercase">
                        TUTORIALS
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl">
                        Master new technologies with our step-by-step guides and comprehensive learning resources.
                    </p>
                </div>

                <div className="mb-12 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search tutorials..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#121212]/80 backdrop-blur-sm border border-[#A5C89E]/30 rounded-lg pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#A5C89E]/60 transition-all"
                        />
                    </div>

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
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#121212]/95 backdrop-blur-xl border border-[#A5C89E]/30 rounded-lg shadow-2xl z-50 py-2 overflow-y-auto max-h-60">
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

                <div className="mb-8 flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-[#A5C89E]/80 rounded-full"></div>
                    <span className="text-sm text-gray-400 font-mono">
                        {filteredTutorials.length} {filteredTutorials.length === 1 ? 'tutorial' : 'tutorials'} found
                    </span>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-[#121212]/50 border border-gray-800 rounded-lg p-6 h-64 animate-pulse"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-400">
                        <p>{error}</p>
                        <button onClick={() => void fetchAllTutorials()} className="mt-4 text-[#A5C89E] hover:underline">Try Again</button>
                    </div>
                ) : filteredTutorials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTutorials.map((t, index) => (
                            <div
                                key={t.T_ID || t.id}
                                className="group relative bg-[#121212]/80 backdrop-blur-sm border border-[#A5C89E]/30 rounded-lg p-6 hover:border-[#A5C89E]/60 hover:shadow-lg hover:shadow-[#A5C89E]/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-mono text-[#A5C89E]/90 bg-[#A5C89E]/10 px-3 py-1 rounded-full">
                                        {t.Category}
                                    </span>
                                    <span className="text-xs text-gray-500 font-mono flex items-center">
                                        <BookOpen className="w-3 h-3 mr-1" />
                                        {t.articles_count ?? 0} Articles
                                    </span>
                                </div>

                                <div className="absolute top-10 right-6 text-6xl font-bold text-[#A5C89E]/5 font-mono pointer-events-none group-hover:text-[#A5C89E]/10 transition-colors">
                                    {String(index + 1).padStart(2, '0')}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#A5C89E]/90 transition-colors relative z-10 text-left">
                                    {t.Title}
                                </h3>
                                <p className="text-sm text-gray-400 mb-6 leading-relaxed relative z-10 text-left line-clamp-3">
                                    {t.Description}
                                </p>

                                <button
                                    onClick={() => setSelectedTutorialId(t.T_ID || t.id)}
                                    className="flex items-center text-sm font-medium text-[#A5C89E]/90 hover:text-[#A5C89E] transition-colors group/btn relative z-10"
                                >
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    <span>Read Tutorial</span>
                                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                </button>

                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A5C89E]/80 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-400 mb-2">No tutorials found</h3>
                        <p className="text-gray-500">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
