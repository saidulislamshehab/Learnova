import { useState, useRef } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, Flag, Clock, User, ChevronRight, BookOpen, ArrowRight, Send, X, CheckCircle, Sparkles } from 'lucide-react';

interface ArticleDetailProps {
  onBack: () => void;
  articleId: number;
}

// Sample article data (in a real app, this would come from an API)
const articleData: Record<number, {
  title: string;
  category: string;
  readTime: string;
  lastUpdated: string;
  author: string;
  authorRole: string;
  likes: number;
  comments: number;
  tags: string[];
  content: {
    type: 'heading' | 'paragraph' | 'code' | 'list';
    content: string | string[];
    language?: string;
  }[];
  relatedArticles: { id: number; title: string; excerpt: string; readTime: string }[];
}> = {
  1: {
    title: 'Complete Guide to Binary Search Trees',
    category: 'DSA',
    readTime: '12 min read',
    lastUpdated: 'January 15, 2026',
    author: 'Dr. Sarah Chen',
    authorRole: 'Algorithm Expert',
    likes: 342,
    comments: 28,
    tags: ['Data Structures', 'Trees', 'Algorithms', 'BST', 'Recursion'],
    content: [
      { type: 'paragraph', content: 'Binary Search Trees (BST) are fundamental data structures that combine the efficiency of binary search with the flexibility of a linked structure. Understanding BSTs is crucial for any software engineer working on performance-critical applications.' },
      { type: 'heading', content: 'What is a Binary Search Tree?' },
      { type: 'paragraph', content: 'A Binary Search Tree is a node-based binary tree data structure with the following properties:' },
      { type: 'list', content: ['The left subtree of a node contains only nodes with keys lesser than the node\'s key', 'The right subtree of a node contains only nodes with keys greater than the node\'s key', 'The left and right subtree each must also be a binary search tree', 'There must be no duplicate nodes'] },
      { type: 'heading', content: 'Basic Implementation' },
      { type: 'paragraph', content: 'Let\'s implement a basic BST node structure in Python:' },
      { type: 'code', content: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BinarySearchTree:
    def __init__(self):
        self.root = None
    
    def insert(self, val):
        if not self.root:
            self.root = TreeNode(val)
        else:
            self._insert_recursive(self.root, val)
    
    def _insert_recursive(self, node, val):
        if val < node.val:
            if node.left is None:
                node.left = TreeNode(val)
            else:
                self._insert_recursive(node.left, val)
        else:
            if node.right is None:
                node.right = TreeNode(val)
            else:
                self._insert_recursive(node.right, val)`, language: 'python' },
      { type: 'heading', content: 'Search Operations' },
      { type: 'paragraph', content: 'Searching in a BST is highly efficient. The time complexity is O(log n) for balanced trees, making it ideal for lookup-intensive operations.' },
      { type: 'code', content: `def search(self, val):
    return self._search_recursive(self.root, val)

def _search_recursive(self, node, val):
    if node is None or node.val == val:
        return node
    
    if val < node.val:
        return self._search_recursive(node.left, val)
    else:
        return self._search_recursive(node.right, val)`, language: 'python' },
      { type: 'heading', content: 'Tree Traversals' },
      { type: 'paragraph', content: 'There are three main types of depth-first traversals for binary trees: inorder, preorder, and postorder. For BSTs, inorder traversal is particularly useful as it visits nodes in ascending order.' },
      { type: 'code', content: `def inorder_traversal(self, node, result=[]):
    if node:
        self.inorder_traversal(node.left, result)
        result.append(node.val)
        self.inorder_traversal(node.right, result)
    return result`, language: 'python' },
      { type: 'heading', content: 'Deletion Operations' },
      { type: 'paragraph', content: 'Deletion is the most complex operation in BST. We need to handle three cases: deleting a leaf node, deleting a node with one child, and deleting a node with two children.' },
      { type: 'paragraph', content: 'When deleting a node with two children, we typically replace it with either its inorder predecessor (maximum value in left subtree) or inorder successor (minimum value in right subtree).' },
      { type: 'heading', content: 'Time Complexity Analysis' },
      { type: 'paragraph', content: 'The efficiency of BST operations depends on the tree\'s height:' },
      { type: 'list', content: ['Best case (balanced tree): O(log n) for search, insert, delete', 'Worst case (skewed tree): O(n) for all operations', 'Average case: O(log n) for all operations'] },
      { type: 'paragraph', content: 'To maintain optimal performance, self-balancing BSTs like AVL trees or Red-Black trees are often used in production systems.' },
      { type: 'heading', content: 'Practical Applications' },
      { type: 'paragraph', content: 'Binary Search Trees are widely used in real-world applications including database indexing, implementing sets and maps in programming languages, expression parsing, and file system organization.' },
      { type: 'paragraph', content: 'Understanding BSTs is essential for mastering more advanced data structures and algorithms, making them a cornerstone of computer science education.' },
    ],
    relatedArticles: [
      { id: 2, title: 'Advanced Dynamic Programming Patterns', excerpt: 'Explore complex DP patterns including state machines and optimization techniques.', readTime: '18 min read' },
      { id: 3, title: 'Graph Algorithms: From Basics to Advanced', excerpt: 'Comprehensive guide covering DFS, BFS, and shortest paths.', readTime: '20 min read' },
      { id: 16, title: 'Microservices Architecture Patterns', excerpt: 'Design patterns for building resilient, scalable microservices.', readTime: '15 min read' },
    ]
  },
  2: {
    title: 'Advanced Dynamic Programming Patterns',
    category: 'DSA',
    readTime: '18 min read',
    lastUpdated: 'January 18, 2026',
    author: 'Prof. Michael Rodriguez',
    authorRole: 'Competitive Programming Coach',
    likes: 521,
    comments: 47,
    tags: ['Dynamic Programming', 'Algorithms', 'Optimization', 'State Machine', 'DP Patterns'],
    content: [
      { type: 'paragraph', content: 'Dynamic Programming is one of the most powerful algorithmic paradigms. While basic DP is well-understood, advanced patterns can significantly expand your problem-solving toolkit.' },
      { type: 'heading', content: 'State Machine DP' },
      { type: 'paragraph', content: 'State machine DP is useful when the problem involves making decisions with dependencies on previous states. This pattern is commonly seen in stock trading problems and string matching scenarios.' },
      { type: 'code', content: `def max_profit_with_cooldown(prices):
    if not prices:
        return 0
    
    n = len(prices)
    # States: hold, sold, rest
    hold = [0] * n
    sold = [0] * n
    rest = [0] * n
    
    hold[0] = -prices[0]
    
    for i in range(1, n):
        hold[i] = max(hold[i-1], rest[i-1] - prices[i])
        sold[i] = hold[i-1] + prices[i]
        rest[i] = max(rest[i-1], sold[i-1])
    
    return max(sold[-1], rest[-1])`, language: 'python' },
      { type: 'heading', content: 'Digit DP' },
      { type: 'paragraph', content: 'Digit DP is used to solve problems involving counting numbers with specific digit properties within a range. This technique builds solutions digit by digit while maintaining constraints.' },
      { type: 'heading', content: 'Interval DP' },
      { type: 'paragraph', content: 'Interval DP solves problems on subarrays or substrings by building solutions from smaller intervals to larger ones. Classic examples include matrix chain multiplication and palindrome partitioning.' },
      { type: 'code', content: `def min_cost_tree_from_leaf_values(arr):
    n = len(arr)
    dp = [[0] * n for _ in range(n)]
    max_val = [[0] * n for _ in range(n)]
    
    # Precompute maximum values in each interval
    for i in range(n):
        max_val[i][i] = arr[i]
        for j in range(i + 1, n):
            max_val[i][j] = max(max_val[i][j-1], arr[j])
    
    # DP on intervals
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            for k in range(i, j):
                dp[i][j] = min(dp[i][j],
                    dp[i][k] + dp[k+1][j] + 
                    max_val[i][k] * max_val[k+1][j])
    
    return dp[0][n-1]`, language: 'python' },
      { type: 'heading', content: 'Bitmask DP' },
      { type: 'paragraph', content: 'When dealing with subsets or permutations, bitmask DP represents states as binary numbers. This is extremely powerful for NP-hard problems with small input sizes.' },
      { type: 'paragraph', content: 'The traveling salesman problem is a classic example where bitmask DP can find optimal solutions for up to 20 cities efficiently.' },
      { type: 'heading', content: 'DP on Trees' },
      { type: 'paragraph', content: 'Tree DP solves optimization problems on tree structures. Common applications include finding maximum independent sets, tree diameter, and subtree queries.' },
      { type: 'paragraph', content: 'Mastering these advanced DP patterns will dramatically improve your ability to tackle complex algorithmic challenges in interviews and competitive programming.' },
    ],
    relatedArticles: [
      { id: 1, title: 'Complete Guide to Binary Search Trees', excerpt: 'Master BST operations, traversals, and implementation strategies.', readTime: '12 min read' },
      { id: 3, title: 'Graph Algorithms: From Basics to Advanced', excerpt: 'Comprehensive guide covering DFS, BFS, and shortest paths.', readTime: '20 min read' },
      { id: 17, title: 'Designing Rate Limiters', excerpt: 'Algorithms for implementing distributed rate limiting systems.', readTime: '12 min read' },
    ]
  },
};

export function ArticleDetail({ onBack, articleId }: ArticleDetailProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const commentsRef = useRef<HTMLDivElement>(null);
  
  // Comments state
  const [isSignedIn, setIsSignedIn] = useState(true); // Toggle this to test both states
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      userName: 'Alex Johnson',
      userAvatar: '',
      timestamp: '2 hours ago',
      text: 'Great article! The explanation of BST operations is really clear and the code examples are super helpful.',
    },
    {
      id: 2,
      userName: 'Maria Garcia',
      userAvatar: '',
      timestamp: '5 hours ago',
      text: 'I was struggling with understanding tree rotations, but this article made it so much clearer. Thank you!',
    },
    {
      id: 3,
      userName: 'David Lee',
      userAvatar: '',
      timestamp: '1 day ago',
      text: 'The time complexity analysis section is excellent. Would love to see a follow-up article on self-balancing trees like AVL or Red-Black trees.',
    },
  ]);

  // Report popup state
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [reportStep, setReportStep] = useState<'select' | 'reason' | 'success'>('select');
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [reportReason, setReportReason] = useState('');

  const reportOptions = [
    'Hate Speech',
    'Harassment and Bullying',
    'Plagiarism (DMCA)',
    'Poorly Written',
    'Factually Incorrect',
  ];

  // AI Chat modal state
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai'; text: string; timestamp: string }[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiIsTyping, setAiIsTyping] = useState(false);
  const aiChatRef = useRef<HTMLDivElement>(null);

  const exampleQuestions = [
    'What are the key takeaways from this article?',
    'Can you explain the code examples?',
    'How can I apply this in practice?',
  ];

  const article = articleData[articleId] || articleData[1];
  
  // Initialize likes from article data
  useState(() => {
    setLikes(article.likes);
  });

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  const handleCommentScroll = () => {
    commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePostComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        userName: 'You',
        userAvatar: '',
        timestamp: 'Just now',
        text: newComment,
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleSignIn = () => {
    // Placeholder for sign in action
    alert('Redirecting to sign in page...');
  };

  const handleOpenReport = () => {
    setShowReportPopup(true);
    setReportStep('select');
    setSelectedReportType('');
    setReportReason('');
  };

  const handleCloseReport = () => {
    setShowReportPopup(false);
    setReportStep('select');
    setSelectedReportType('');
    setReportReason('');
  };

  const handleReportNext = () => {
    if (selectedReportType) {
      setReportStep('reason');
    }
  };

  const handleReportBack = () => {
    setReportStep('select');
  };

  const handleReportSubmit = () => {
    // Submit report logic here
    setReportStep('success');
    setTimeout(() => {
      handleCloseReport();
    }, 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: 'Check out this article on Learnova',
        url: window.location.href,
      }).catch(() => {
        // User cancelled share, do nothing
      });
    } else {
      // Fallback: Show a simple notification instead of clipboard
      const shareUrl = window.location.href;
      const tempInput = document.createElement('input');
      tempInput.value = shareUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      tempInput.setSelectionRange(0, 99999);
      
      try {
        document.execCommand('copy');
        // Show success message
        alert('Link copied to clipboard!');
      } catch (err) {
        // If that also fails, just show the URL
        alert(`Share this article: ${shareUrl}`);
      }
      
      document.body.removeChild(tempInput);
    }
  };

  const handleOpenAIChat = () => {
    setShowAIChat(true);
  };

  const handleCloseAIChat = () => {
    setShowAIChat(false);
  };

  const handleSendAIMessage = () => {
    if (!aiInput.trim() || aiIsTyping) return;

    const userMessage = {
      role: 'user' as const,
      text: aiInput,
      timestamp: 'Just now',
    };

    setAiMessages([...aiMessages, userMessage]);
    setAiInput('');
    setAiIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: 'ai' as const,
        text: `Great question! Based on the article "${article.title}", here's what I can help you with. This article covers important concepts that are fundamental to understanding the topic. Feel free to ask more specific questions about any section.`,
        timestamp: 'Just now',
      };
      setAiMessages((prev) => [...prev, aiResponse]);
      setAiIsTyping(false);
      
      // Auto scroll to bottom
      setTimeout(() => {
        if (aiChatRef.current) {
          aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
        }
      }, 100);
    }, 1500);
  };

  const handleExampleQuestion = (question: string) => {
    setAiInput(question);
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="relative max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center text-gray-400 hover:text-[#A5C89E] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Articles</span>
        </button>

        {/* Article Header */}
        <div className="mb-12">
          {/* Category Badge */}
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-xs font-mono text-[#A5C89E]/90 bg-[#A5C89E]/10 px-3 py-1 rounded-full">
              {article.category}
            </span>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {article.readTime}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#A5C89E]/20">
            <div className="flex items-center space-x-4">
              {/* Author */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#A5C89E]/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#A5C89E]/90" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{article.author}</div>
                  <div className="text-xs text-gray-500">{article.authorRole}</div>
                </div>
              </div>
              {/* Date */}
              <div className="text-sm text-gray-500">
                Updated {article.lastUpdated}
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleOpenAIChat}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#121212]/80 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Ask AI</span>
              </button>

              <button
                onClick={handleLike}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all ${
                  isLiked
                    ? 'bg-[#A5C89E]/20 text-[#A5C89E]'
                    : 'bg-[#121212]/80 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{likes}</span>
              </button>

              <button
                onClick={handleCommentScroll}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#121212]/80 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{article.comments}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#121212]/80 text-gray-400 hover:text-[#A5C89E] hover:bg-[#A5C89E]/10 transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleOpenReport}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#121212]/80 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-invert max-w-none mb-16">
          {article.content.map((block, index) => {
            if (block.type === 'heading') {
              return (
                <h2 key={index} className="text-2xl font-bold text-white mt-12 mb-4 flex items-center">
                  <ChevronRight className="w-5 h-5 text-[#A5C89E]/80 mr-2" />
                  {block.content as string}
                </h2>
              );
            }

            if (block.type === 'paragraph') {
              return (
                <p key={index} className="text-gray-300 leading-relaxed mb-6 text-base">
                  {block.content as string}
                </p>
              );
            }

            if (block.type === 'code') {
              return (
                <div key={index} className="my-6 bg-[#0b0b0b]/80 border border-[#A5C89E]/20 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#121212]/60 border-b border-[#A5C89E]/10">
                    <span className="text-xs font-mono text-gray-500 uppercase">{block.language || 'code'}</span>
                  </div>
                  <pre className="p-4 overflow-x-auto">
                    <code className="text-sm font-mono text-gray-300 leading-relaxed">
                      {block.content as string}
                    </code>
                  </pre>
                </div>
              );
            }

            if (block.type === 'list') {
              return (
                <ul key={index} className="space-y-3 mb-6 ml-4">
                  {(block.content as string[]).map((item, i) => (
                    <li key={i} className="text-gray-300 flex items-start">
                      <span className="text-[#A5C89E]/80 mr-3 mt-1.5">•</span>
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              );
            }

            return null;
          })}
        </div>

        {/* Tags Section */}
        <div className="mb-16 pb-16 border-b border-[#A5C89E]/20">
          <h3 className="text-sm font-mono text-gray-500 mb-4 tracking-wider">TAGS</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 bg-[#121212]/80 border border-[#A5C89E]/30 rounded-full text-sm text-gray-400 hover:text-[#A5C89E] hover:border-[#A5C89E]/60 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-2 h-2 bg-[#A5C89E]/80 rounded-full animate-pulse"></div>
            <h2 className="text-2xl font-bold text-white">Related Articles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {article.relatedArticles.map((related) => (
              <div
                key={related.id}
                className="group bg-[#121212]/80 backdrop-blur-sm border border-[#A5C89E]/30 rounded-lg p-6 hover:border-[#A5C89E]/60 hover:shadow-lg hover:shadow-[#A5C89E]/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#A5C89E]/90 transition-colors line-clamp-2">
                  {related.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{related.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {related.readTime}
                  </div>
                  <button className="flex items-center text-sm font-medium text-[#A5C89E]/90 hover:text-[#A5C89E] transition-colors group/btn">
                    <span>Read</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div ref={commentsRef} className="mb-8">
          <div className="flex items-center space-x-2 mb-8">
            <h2 className="text-2xl font-bold text-white">Comments</h2>
            {comments.length > 0 && (
              <span className="text-gray-500 text-sm">({comments.length})</span>
            )}
          </div>
          
          {/* Comment Input Area */}
          {isSignedIn ? (
            <div className="mb-10 pb-6 border-b border-[#A5C89E]/20">
              <div className="flex gap-4 items-start">
                {/* User Avatar */}
                <div className="flex-shrink-0 mt-1">
                  <div className="w-9 h-9 bg-[#A5C89E]/20 rounded-full flex items-center justify-center">
                    <User className="w-4.5 h-4.5 text-[#A5C89E]/90" />
                  </div>
                </div>
                
                {/* Input Area */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment…"
                      className="w-full py-3 bg-transparent border-b-2 border-gray-700 text-white text-base placeholder-gray-500 focus:outline-none focus:border-[#A5C89E]/60 transition-all"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handlePostComment();
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-gray-600">
                      Press Enter to post
                    </p>
                    <button
                      onClick={handlePostComment}
                      disabled={!newComment.trim()}
                      className="px-5 py-2 bg-[#A5C89E]/80 text-black text-sm rounded-lg hover:bg-[#A5C89E] transition-all font-medium disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#A5C89E]/80"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-10 pb-8 border-b border-[#A5C89E]/20 text-center">
              <p className="text-gray-400 text-sm mb-4">
                Sign in to join the discussion
              </p>
              <button
                onClick={handleSignIn}
                className="px-8 py-2.5 bg-[#A5C89E]/80 text-black text-sm rounded-lg hover:bg-[#A5C89E] transition-all font-medium"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 py-1">
                  {/* User Avatar */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-9 h-9 bg-[#A5C89E]/20 rounded-full flex items-center justify-center">
                      <User className="w-4.5 h-4.5 text-[#A5C89E]/90" />
                    </div>
                  </div>
                  
                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="font-semibold text-white text-sm">
                        {comment.userName}
                      </h4>
                      <span className="text-xs text-gray-600">
                        •
                      </span>
                      <span className="text-xs text-gray-500">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <MessageCircle className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                No comments yet. Be the first to comment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Report Popup */}
      {showReportPopup && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseReport}
        >
          <div 
            className="bg-[#121212]/95 backdrop-blur-xl border border-[#A5C89E]/30 rounded-xl shadow-2xl w-full max-w-md"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {reportStep === 'select' && (
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">Report Content</h3>
                  <button
                    onClick={handleCloseReport}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-400 mb-6">Why are you reporting this content?</p>
                
                {/* Report Options */}
                <div className="space-y-2 mb-6">
                  {reportOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedReportType(option)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                        selectedReportType === option
                          ? 'bg-[#A5C89E]/10 border-[#A5C89E]/50 text-[#A5C89E]'
                          : 'bg-[#0b0b0b]/60 border-transparent text-gray-400 hover:bg-[#0b0b0b]/80 hover:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                          selectedReportType === option
                            ? 'border-[#A5C89E]'
                            : 'border-gray-600'
                        }`}>
                          {selectedReportType === option && (
                            <div className="w-2 h-2 rounded-full bg-[#A5C89E]"></div>
                          )}
                        </div>
                        <span className="text-sm font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Buttons */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={handleCloseReport}
                    className="px-5 py-2.5 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReportNext}
                    disabled={!selectedReportType}
                    className="px-6 py-2.5 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#A5C89E]/80"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {reportStep === 'reason' && (
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">Add Reason</h3>
                  <button
                    onClick={handleCloseReport}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-400 mb-6">Please provide more details (optional).</p>
                
                {/* Textarea */}
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Explain why you are reporting this content…"
                  rows={5}
                  className="w-full px-4 py-3 bg-[#0b0b0b]/60 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#A5C89E]/60 transition-all resize-none mb-6"
                />
                
                {/* Buttons */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleReportBack}
                    className="px-5 py-2.5 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleReportSubmit}
                    className="px-6 py-2.5 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all text-sm font-medium"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            )}
            
            {reportStep === 'success' && (
              <div className="p-8 text-center">
                {/* Success Icon */}
                <div className="w-16 h-16 bg-[#A5C89E]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-[#A5C89E]" />
                </div>
                
                {/* Success Message */}
                <h3 className="text-xl font-bold text-white mb-2">Thank you for your report.</h3>
                <p className="text-sm text-gray-400 mb-6">
                  We'll review this content and take appropriate action if necessary.
                </p>
                
                {/* Close Button */}
                <button
                  onClick={handleCloseReport}
                  className="px-8 py-2.5 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all text-sm font-medium"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Chat Modal */}
      {showAIChat && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseAIChat}
        >
          <div
            className="bg-[#121212]/95 backdrop-blur-xl border border-[#A5C89E]/30 rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-[#A5C89E]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#A5C89E]/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#A5C89E]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Ask AI about this article</h3>
                  <p className="text-xs text-gray-400">Ask questions based on this article</p>
                </div>
              </div>
              <button
                onClick={handleCloseAIChat}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div
              ref={aiChatRef}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              {aiMessages.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-[#A5C89E]/10 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-[#A5C89E]/70" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Ask anything about this article</h4>
                  <p className="text-sm text-gray-400 mb-6 max-w-sm">
                    Get instant answers and deeper insights from the AI assistant
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 mb-3">Try asking:</p>
                    {exampleQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleExampleQuestion(question)}
                        className="block w-full px-4 py-2.5 bg-[#0b0b0b]/60 border border-[#A5C89E]/20 rounded-lg text-sm text-gray-300 hover:text-[#A5C89E] hover:border-[#A5C89E]/40 hover:bg-[#0b0b0b]/80 transition-all text-left"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Messages */
                <>
                  {aiMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'ai' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-[#A5C89E]/20 rounded-full flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-[#A5C89E]" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-[#A5C89E]/10 border border-[#A5C89E]/30 text-white'
                            : 'bg-[#0b0b0b]/60 border border-[#A5C89E]/20 text-gray-300'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                      </div>
                      {message.role === 'user' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-[#A5C89E]/20 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-[#A5C89E]" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Typing Indicator */}
                  {aiIsTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-[#A5C89E]/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-[#A5C89E]" />
                        </div>
                      </div>
                      <div className="max-w-[80%] px-4 py-3 rounded-lg bg-[#0b0b0b]/60 border border-[#A5C89E]/20">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-[#A5C89E]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-[#A5C89E]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-[#A5C89E]/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 pt-4 border-t border-[#A5C89E]/20">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask a question about this article…"
                  disabled={aiIsTyping}
                  className="flex-1 px-4 py-3 bg-[#0b0b0b]/60 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#A5C89E]/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !aiIsTyping) {
                      handleSendAIMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendAIMessage}
                  disabled={!aiInput.trim() || aiIsTyping}
                  className="px-5 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#A5C89E]/80 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Press Enter to send • AI responses are generated based on article content
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}