import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Tag, ChevronLeft, ChevronRight, X, ExternalLink, Home, ArrowUp, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  download_url: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
  url: string;
}

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const GITHUB_USERNAME = 'liohunter1';
  const REPO_NAME = 'MyArticles-Blogs';

  useEffect(() => {
    fetchArticles();
  }, []);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (selectedArticle) {
        const target = e.target as HTMLElement;
        const scrollHeight = target.scrollHeight - target.clientHeight;
        const scrolled = (target.scrollTop / scrollHeight) * 100;
        setScrollProgress(scrolled);
        setShowBackToTop(target.scrollTop > 300);
      }
    };

    const modalContent = document.getElementById('article-modal-content');
    if (modalContent) {
      modalContent.addEventListener('scroll', handleScroll);
      return () => modalContent.removeEventListener('scroll', handleScroll);
    }
  }, [selectedArticle]);

  const fetchArticles = async () => {
    try {
      // Fetch list of markdown files from the posts folder
      const headers: HeadersInit = {};
      if (import.meta.env.VITE_GITHUB_TOKEN) {
        headers['Authorization'] = `token ${import.meta.env.VITE_GITHUB_TOKEN}`;
      }

      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/posts`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const files: GitHubFile[] = await response.json();
      
      // Filter for markdown files
      const mdFiles = files.filter(
        file => file.name.endsWith('.md') && file.name !== 'README.md'
      );

      // Fetch content of each markdown file
      const articlePromises = mdFiles.map(async (file) => {
        const contentResponse = await fetch(file.download_url);
        const content = await contentResponse.text();
        
        return parseMarkdownArticle(file, content);
      });

      const parsedArticles = await Promise.all(articlePromises);
      
      // Sort by date (newest first)
      parsedArticles.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setArticles(parsedArticles);
      setLoading(false);
    } catch (err) {
      setError('Unable to load articles from GitHub');
      setLoading(false);
      console.error('Error fetching articles:', err);
    }
  };

  const parseMarkdownArticle = (file: GitHubFile, content: string): Article => {
    // Extract title from filename or first heading
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch 
      ? titleMatch[1] 
      : file.name.replace('.md', '').replace(/-/g, ' ');

    // Extract date from frontmatter or filename or use file date
    const dateMatch = content.match(/date:\s*(\d{4}-\d{2}-\d{2})/i);
    const fileNameDateMatch = file.name.match(/(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch 
      ? dateMatch[1] 
      : fileNameDateMatch 
      ? fileNameDateMatch[1] 
      : new Date().toISOString().split('T')[0];

    // Extract category from frontmatter
    const categoryMatch = content.match(/category:\s*(.+)$/im);
    const category = categoryMatch ? categoryMatch[1].trim() : 'Security';

    // Create excerpt from first paragraph
    const contentWithoutTitle = content.replace(/^#\s+.+$/m, '').trim();
    const firstParagraph = contentWithoutTitle.split('\n\n')[0];
    const excerpt = firstParagraph
      .replace(/[#*`]/g, '')
      .substring(0, 200)
      .trim() + (firstParagraph.length > 200 ? '...' : '');

    // Calculate read time (average 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      id: file.sha,
      title,
      excerpt: excerpt || 'Click to read more...',
      date,
      readTime: `${readTime} min read`,
      category,
      content,
      url: `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/blob/main/posts/${file.name}`,
    };
  };

  const handleArticleClick = (article: Article, index: number) => {
    setSelectedArticle(article);
    setSelectedIndex(index);
    setScrollProgress(0);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
    setSelectedIndex(-1);
    document.body.style.overflow = 'unset';
  };

  const handlePreviousArticle = () => {
    if (selectedIndex > 0) {
      handleArticleClick(articles[selectedIndex - 1], selectedIndex - 1);
      const modal = document.getElementById('article-modal-content');
      if (modal) modal.scrollTop = 0;
    }
  };

  const handleNextArticle = () => {
    if (selectedIndex < articles.length - 1) {
      handleArticleClick(articles[selectedIndex + 1], selectedIndex + 1);
      const modal = document.getElementById('article-modal-content');
      if (modal) modal.scrollTop = 0;
    }
  };

  const scrollToTop = () => {
    const modal = document.getElementById('article-modal-content');
    if (modal) {
      modal.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  };

  // Simple LinkedIn share: copy full article content and open LinkedIn
  const shareToLinkedIn = () => {
    if (!selectedArticle) return;

    const shareContent = `📚 Just read: "${selectedArticle.title}"\n\nFull article content (markdown):\n\n${selectedArticle.content}\n\nSource: ${selectedArticle.url}\n\n#Cybersecurity #Security`;

    navigator.clipboard.writeText(shareContent);
    triggerToast('✅ Copied your LinkedIn post draft for Emilio Ogega. LinkedIn is opening—paste, tweak if needed, and publish.');
    window.open('https://www.linkedin.com/feed/', '_blank');
  };

  const ArticleModal = ({ article }: { article: Article }) => (
    <div 
      className="fixed inset-0 bg-white z-50 flex flex-col"
      onClick={handleCloseArticle}
    >
      {/* Progress Bar */}
      <div className="h-1 bg-gray-300 relative">
        <div
          className="h-full bg-blue-600 transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 shadow-md z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-2">
          <button
            onClick={handleCloseArticle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close article"
          >
            <Home className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex-1 min-w-0 text-center px-2">
            <h2 className="text-lg font-bold text-gray-900 truncate line-clamp-2">{article.title}</h2>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={shareToLinkedIn}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
              aria-label="Share to LinkedIn"
              title="Share to LinkedIn"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="View on GitHub"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <button
              onClick={handleCloseArticle}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div 
        id="article-modal-content"
        className="flex-1 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Metadata */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span className="px-2 py-1 bg-gray-100 rounded">{article.category}</span>
              </div>
            </div>
          </div>

          {/* Markdown Content */}
          <article className="prose prose-lg max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b pb-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-2xl font-bold mt-6 mb-3 text-gray-900" {...props} />,
                h4: ({node, ...props}) => <h4 className="text-xl font-bold mt-4 mb-2 text-gray-900" {...props} />,
                p: ({node, ...props}) => <p className="mb-6 text-gray-700 leading-relaxed text-lg" {...props} />,
                code: ({node, inline, ...props}: any) => 
                  inline 
                    ? <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800" {...props} />
                    : <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 font-mono text-sm" {...props} />,
                pre: ({node, ...props}) => <pre className="bg-gray-900 rounded-lg overflow-hidden my-6" {...props} />,
                a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700" {...props} />,
                li: ({node, ...props}) => <li className="ml-4 text-gray-700 leading-relaxed" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-6 bg-gray-50 py-3 pr-4" {...props} />,
                img: ({node, ...props}) => <img className="rounded-lg my-6 max-w-full shadow-lg" {...props} />,
                table: ({node, ...props}) => <table className="w-full border-collapse my-6" {...props} />,
                thead: ({node, ...props}) => <thead className="bg-gray-200" {...props} />,
                tbody: ({node, ...props}) => <tbody {...props} />,
                tr: ({node, ...props}) => <tr className="border-b border-gray-300" {...props} />,
                td: ({node, ...props}) => <td className="border border-gray-300 px-4 py-2 text-gray-700" {...props} />,
                th: ({node, ...props}) => <th className="border border-gray-300 px-4 py-2 text-gray-900 font-bold text-left" {...props} />,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </article>

          {/* Article Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePreviousArticle}
                disabled={selectedIndex === 0}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              <div className="text-center text-sm text-gray-600">
                Article {selectedIndex + 1} of {articles.length}
              </div>

              <button
                onClick={handleNextArticle}
                disabled={selectedIndex === articles.length - 1}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Spacing */}
          <div className="h-20" />
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <section id="blog" className="min-h-screen px-6 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Blog</h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              Loading articles from GitHub...
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="blog" className="min-h-screen px-6 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Blog</h2>
            <p className="text-lg text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="blog" className="min-h-screen px-6 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Blog</h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              Technical articles on security research, best practices, and industry insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {articles.map((article, index) => (
              <article
                key={article.id}
                onClick={() => handleArticleClick(article, index)}
                className="bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-lg rounded-lg p-8 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" aria-label="Publication Date" />
                    <time dateTime={article.date}>
                      {new Date(article.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" aria-label="Read Time" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{article.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{article.excerpt}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-gray-500" aria-label="Category" />
                    <span className="text-sm text-gray-600 font-mono">{article.category}</span>
                  </div>
                  <span className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Read more →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {selectedArticle && <ArticleModal article={selectedArticle} />}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-4 py-3 bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 animate-fadeIn">
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </>
  );
}
