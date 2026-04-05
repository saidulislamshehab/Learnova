import { useState } from 'react';
import { Search, ChevronDown, BookOpen, ArrowRight, Clock } from 'lucide-react';

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

const allTutorials = [
    {
        id: 1,
        title: 'C Programming Basics',
        description: 'Introduction to C programming language, variables, loops, and functions.',
        category: 'C',
        articleCount: 15,
        serialNumber: '01',
    },
    {
        id: 2,
        title: 'Pointers in C',
        description: 'Mastering pointers and memory management in C.',
        category: 'C',
        articleCount: 8,
        serialNumber: '02',
    },
    {
        id: 3,
        title: 'C++ OOP Concepts',
        description: 'Object-Oriented Programming principles: Classes, Objects, Inheritance.',
        category: 'C++',
        articleCount: 12,
        serialNumber: '03',
    },
    {
        id: 4,
        title: 'STL in C++',
        description: 'Standard Template Library: Vectors, Maps, and Algorithms.',
        category: 'C++',
        articleCount: 10,
        serialNumber: '04',
    },
    {
        id: 5,
        title: 'Java Exception Handling',
        description: 'Robust error handling with try-catch blocks and custom exceptions.',
        category: 'Java',
        articleCount: 6,
        serialNumber: '05',
    },
    {
        id: 6,
        title: 'Java Multithreading',
        description: 'Creating high-performance concurrent applications in Java.',
        category: 'Java',
        articleCount: 9,
        serialNumber: '06',
    },
    {
        id: 7,
        title: 'Python for Data Science',
        description: 'Using Pandas, NumPy, and Matplotlib for data analysis.',
        category: 'Python',
        articleCount: 20,
        serialNumber: '07',
    },
    {
        id: 8,
        title: 'Sorting Algorithms',
        description: 'Bubble sort, Quick sort, Merge sort, and their time complexities.',
        category: 'Algorithms',
        articleCount: 7,
        serialNumber: '08',
    },
    {
        id: 9,
        title: 'Graph Traversal',
        description: 'BFS and DFS algorithms explained with visual examples.',
        category: 'Algorithms',
        articleCount: 5,
        serialNumber: '09',
    },
    {
        id: 10,
        title: 'Linked Lists',
        description: 'Singly, Doubly, and Circular Linked List implementation details.',
        category: 'DSA',
        articleCount: 6,
        serialNumber: '10',
    },
    {
        id: 11,
        title: 'Binary Search Trees',
        description: 'Insertion, Deletion, and Traversal operations on BST.',
        category: 'DSA',
        articleCount: 8,
        serialNumber: '11',
    },
    {
        id: 12,
        title: 'Introduction to Neural Networks',
        description: 'Basics of neural networks, perceptrons, and activation functions.',
        category: 'Machine Learning',
        articleCount: 14,
        serialNumber: '12',
    },
];

// Mock data for articles within a tutorial (This would ideally come from an API or separate file)
interface Article {
    id: number;
    title: string;
    description: string;
    readTime: string;
    author: string;
    date: string;
}

const tutorialArticles: Record<number, Article[]> = {
    1: [ // C Programming Basics
        { id: 101, title: 'Introduction to C', description: 'History and basic structure of C programs.', readTime: '5 min', author: 'Dr. C. Coder', date: '2023-01-10' },
        { id: 102, title: 'Variables and Data Types', description: 'Understanding int, float, char, and double.', readTime: '8 min', author: 'Dr. C. Coder', date: '2023-01-12' },
        { id: 103, title: 'Control Flow: If-Else', description: 'Conditional statements in C.', readTime: '6 min', author: 'Dr. C. Coder', date: '2023-01-15' },
    ],
    // ... data for other tutorials would follow
};


export function Tutorials() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Tutorials');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedTutorialId, setSelectedTutorialId] = useState<number | null>(null);

    // If a tutorial is selected, show its articles view
    if (selectedTutorialId) {
        const tutorial = allTutorials.find(t => t.id === selectedTutorialId);
        // Fallback articles if none mock-defined for the specific tutorial ID
        const articles = tutorialArticles[selectedTutorialId] || [
            { id: 991, title: `${tutorial?.title} - Part 1`, description: `First part of the comprehensive ${tutorial?.title} tutorial series.`, readTime: '10 min', author: 'Learnova Team', date: '2023-10-01' },
            { id: 992, title: `${tutorial?.title} - Part 2`, description: 'Continuing deepest dive into core concepts and practical examples.', readTime: '12 min', author: 'Learnova Team', date: '2023-10-05' },
            { id: 993, title: `${tutorial?.title} - Part 3`, description: 'Advanced topics and implementation details.', readTime: '15 min', author: 'Learnova Team', date: '2023-10-10' },
            { id: 994, title: `${tutorial?.title} - Part 4`, description: 'Summary and Final Project.', readTime: '20 min', author: 'Learnova Team', date: '2023-10-15' },
        ];

        return (
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
                {/* Background Grid Effect */}
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
                    {/* Back Button */}
                    <button
                        onClick={() => setSelectedTutorialId(null)}
                        className="mb-8 flex items-center text-gray-400 hover:text-[#A5C89E] transition-colors"
                    >
                        <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                        Back to Tutorials
                    </button>

                    {/* Tutorial Header */}
                    <div className="mb-12">
                        <span className="text-[#A5C89E]/90 text-xs font-mono tracking-widest bg-[#A5C89E]/10 px-3 py-1 rounded-full mb-4 inline-block">
                            {tutorial?.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            {tutorial?.title}
                        </h1>
                        <p className="text-lg text-gray-400 max-w-3xl">
                            {tutorial?.description} This series contains {articles.length} detailed articles to help you master the topic.
                        </p>
                    </div>

                    {/* Articles List for this Tutorial */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article, index) => (
                            <div
                                key={article.id}
                                className="group relative bg-[#121212]/80 backdrop-blur-sm border border-[#A5C89E]/30 rounded-lg p-6 hover:border-[#A5C89E]/60 hover:shadow-lg hover:shadow-[#A5C89E]/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
                            >
                                {/* Serial Number Badge */}
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-6xl font-bold text-[#A5C89E] font-mono">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
                                        <div className="flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {article.readTime}
                                        </div>
                                        <span>•</span>
                                        <span>{article.date}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#A5C89E]/90 transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 mb-6 leading-relaxed line-clamp-3">
                                        {article.description}
                                    </p>

                                    <button className="flex items-center text-sm font-medium text-[#A5C89E]/90 hover:text-[#A5C89E] transition-colors group/btn">
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        <span>Read Article</span>
                                        <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>

                                {/* Hover Line */}
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A5C89E]/80 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Default Main Tutorials View
    const filteredTutorials = allTutorials.filter((tutorial) => {
        const matchesSearch =
            tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === 'All Tutorials' || tutorial.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setIsCategoryOpen(false);
    };

    return (
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
            {/* Background Grid Effect */}
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
                {/* Page Header */}
                <div className="mb-12">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-2 h-2 bg-[#A5C89E]/80 rounded-full animate-pulse"></div>
                        <span className="text-[#A5C89E]/90 text-xs font-mono tracking-widest">
                             // TUTORIALS
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#A5C89E]/40 to-transparent"></div>
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
                        TUTORIALS
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl">
                        Master new technologies with our step-by-step guides and comprehensive learning resources.
                    </p>
                </div>

                {/* Search & Filter Section */}
                <div className="mb-12 flex flex-col sm:flex-row gap-4">
                    {/* Search Bar */}
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

                {/* Tutorial Count */}
                <div className="mb-8 flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-[#A5C89E]/80 rounded-full"></div>
                    <span className="text-sm text-gray-400 font-mono">
                        {filteredTutorials.length} {filteredTutorials.length === 1 ? 'tutorial' : 'tutorials'} found
                    </span>
                </div>

                {/* Tutorials Grid */}
                {filteredTutorials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTutorials.map((tutorial) => (
                            <div
                                key={tutorial.id}
                                className="group relative bg-[#121212]/80 backdrop-blur-sm border border-[#A5C89E]/30 rounded-lg p-6 hover:border-[#A5C89E]/60 hover:shadow-lg hover:shadow-[#A5C89E]/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                            >
                                {/* Category Badge and Article Count */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-mono text-[#A5C89E]/90 bg-[#A5C89E]/10 px-3 py-1 rounded-full">
                                        {tutorial.category}
                                    </span>
                                    <span className="text-xs text-gray-500 font-mono flex items-center">
                                        <BookOpen className="w-3 h-3 mr-1" />
                                        {tutorial.articleCount} Articles
                                    </span>
                                </div>

                                {/* Serial Number Watermark */}
                                <div className="absolute top-10 right-6 text-6xl font-bold text-[#A5C89E]/5 font-mono pointer-events-none group-hover:text-[#A5C89E]/10 transition-colors">
                                    {tutorial.serialNumber}
                                </div>

                                {/* Tutorial Content */}
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#A5C89E]/90 transition-colors relative z-10">
                                    {tutorial.title}
                                </h3>
                                <p className="text-sm text-gray-400 mb-6 leading-relaxed relative z-10">
                                    {tutorial.description}
                                </p>

                                {/* Read Tutorial Button */}
                                <button
                                    onClick={() => setSelectedTutorialId(tutorial.id)}
                                    className="flex items-center text-sm font-medium text-[#A5C89E]/90 hover:text-[#A5C89E] transition-colors group/btn relative z-10"
                                >
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    <span>Read Tutorial</span>
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
