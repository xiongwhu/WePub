import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PreviewProps {
  content: string;
  title: string;
  author: string;
  date: string;
  coverImage?: string;
}

export const Preview: React.FC<PreviewProps> = ({ content, title, author, date, coverImage }) => {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-gray-100 p-4 rounded-lg">
      {/* Phone Mockup */}
      <div className="relative w-[375px] h-[750px] bg-white rounded-[30px] border-[8px] border-gray-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Status Bar Mock */}
        <div className="h-6 bg-white flex justify-between items-center px-6 text-[10px] font-bold text-gray-800 select-none z-10">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-2.5 bg-gray-800 rounded-[1px]"></div>
            <div className="w-0.5 h-2.5 bg-gray-800"></div>
          </div>
        </div>

        {/* WeChat Header Mock */}
        <div className="h-12 bg-white flex items-center px-4 border-b border-gray-100 select-none z-10 shrink-0">
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="ml-2 font-medium text-lg">公众号预览</span>
          <div className="ml-auto">
             <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white">
          <div className="px-5 py-6">
            <h1 className="text-[22px] font-bold leading-snug text-[#333] mb-3">{title || "文章标题"}</h1>
            <div className="flex items-center text-sm text-gray-500 mb-6 gap-3">
              <span className="text-[#576b95] font-medium">{author || "作者名称"}</span>
              <span>{date}</span>
            </div>

            {coverImage && (
              <div className="mb-6 rounded-lg overflow-hidden shadow-sm">
                <img src={coverImage} alt="Cover" className="w-full h-auto object-cover" />
              </div>
            )}

            <div className="markdown-body text-[16px] text-[#333] leading-7 break-words">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
            
             <div className="mt-10 pt-6 border-t border-gray-100 text-gray-400 text-xs text-center pb-8">
               <p>阅读 10万+ &nbsp; &nbsp; 点赞 886 &nbsp; &nbsp; 在看 520</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};