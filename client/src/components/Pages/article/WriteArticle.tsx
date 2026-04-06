import { useState } from 'react';
import { PenTool, CheckCircle2, Clock } from 'lucide-react';
import { ArticleEditor } from './ArticleEditor';
import { MyArticles, Article } from './MyArticles';

interface WriteArticleProps {
  onBack: () => void;
  onMyArticles?: () => void;
  initialView?: 'editor' | 'list';
}

export function WriteArticle({ onBack, onMyArticles, initialView = 'editor' }: WriteArticleProps) {
  const [view, setView] = useState<'editor' | 'list'>(initialView);
  const [selectedArticle, setSelectedArticle] = useState<Article | undefined>(undefined);

  const handleMyArticles = () => {
    setView('list');
    setSelectedArticle(undefined);
  };

  const handleWriteNew = () => {
    setView('editor');
    setSelectedArticle(undefined);
  };

  const handleEditArticle = (article: Article) => {
    setView('editor');
    setSelectedArticle(article);
  };

  if (view === 'list') {
    return <MyArticles onWriteNew={handleWriteNew} onEditArticle={handleEditArticle} />;
  }

  return <ArticleEditor onMyArticles={handleMyArticles} existingArticle={selectedArticle} />;
}