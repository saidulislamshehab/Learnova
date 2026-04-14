import { API_URL } from '@/utils/constants';
import axios from 'axios';
import { Send, Sparkles, User, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type ChatRole = 'user' | 'ai';

interface ChatMessage {
  role: ChatRole;
  text: string;
  timestamp: string;
}

interface ArticleAskAIChatProps {
  articleId: number;
  articleTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const EXAMPLE_QUESTIONS = [
  'What are the key takeaways from this article?',
  'Can you summarize the main sections?',
  'Can you explain this in simpler terms?',
];

function currentTimeLabel(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ArticleAskAIChat({ articleId, articleTitle, isOpen, onClose }: ArticleAskAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const apiBase = useMemo(() => API_URL, []);

  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 50);
  }, [isOpen, messages, isTyping]);

  const handleExampleQuestion = (question: string) => {
    setInput(question);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const updatedMessages = [
      ...messages,
      { role: 'user' as const, text: userText, timestamp: currentTimeLabel() },
    ];

    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);
    setError(null);

    const history = updatedMessages
      .slice(-5)
      .map((msg) => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.text,
      }));

    try {
      const response = await axios.post(
        `${apiBase}/articles/${articleId}/ask-ai`,
        {
          message: userText,
          history,
        },
        { headers: { Accept: 'application/json' } }
      );

      const aiText = String(response.data?.answer ?? 'This is not mentioned in the article.');
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: aiText, timestamp: currentTimeLabel() },
      ]);
    } catch (err: any) {
      const apiError = err?.response?.data?.message || 'Unable to get AI response right now.';
      setError(apiError);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'This is not mentioned in the article.', timestamp: currentTimeLabel() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#121212]/95 backdrop-blur-xl border border-[#A5C89E]/30 rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col"
        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#A5C89E]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#A5C89E]/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#A5C89E]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Ask AI about this article</h3>
              <p className="text-xs text-gray-400 truncate max-w-[260px] sm:max-w-[420px]">{articleTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 bg-[#A5C89E]/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-[#A5C89E]/70" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Ask anything about this article</h4>
              <p className="text-sm text-gray-400 mb-6 max-w-sm">
                Answers are restricted to this article only.
              </p>
              <div className="space-y-2 w-full max-w-md">
                {EXAMPLE_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleExampleQuestion(question)}
                    className="block w-full px-4 py-2.5 bg-[#0b0b0b]/60 border border-[#A5C89E]/20 rounded-lg text-sm text-gray-300 hover:text-[#A5C89E] hover:border-[#A5C89E]/40 hover:bg-[#0b0b0b]/80 transition-all text-left"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
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

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-[#A5C89E]/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#A5C89E]" />
                    </div>
                  </div>
                  <div className="max-w-[80%] px-4 py-3 rounded-lg bg-[#0b0b0b]/60 border border-[#A5C89E]/20">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-[#A5C89E]/60 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#A5C89E]/60 rounded-full animate-bounce [animation-delay:150ms]" />
                      <div className="w-2 h-2 bg-[#A5C89E]/60 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-6 pt-4 border-t border-[#A5C89E]/20">
          {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about this article..."
              disabled={isTyping}
              className="flex-1 px-4 py-3 bg-[#0b0b0b]/60 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#A5C89E]/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isTyping) {
                  void handleSend();
                }
              }}
            />
            <button
              onClick={() => void handleSend()}
              disabled={!input.trim() || isTyping}
              className="px-5 py-3 bg-[#A5C89E]/80 text-black rounded-lg hover:bg-[#A5C89E] transition-all font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#A5C89E]/80 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
