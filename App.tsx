
import React, { useState } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { AIAssistant } from './components/AIAssistant';
import { PublishDialog } from './components/PublishDialog';
import { LoginDialog } from './components/LoginDialog';
import * as GeminiService from './services/geminiService';
import * as WeChatService from './services/wechatService';
import { Article, WeChatAccount } from './types';

const INITIAL_MARKDOWN = `# 欢迎使用 WePub AI

这是一个专为公众号作者打造的 **AI 辅助写作工具**。

## 主要功能

1. **Markdown 编辑**：左侧写作，右侧实时预览公众号样式。
2. **AI 标题生成**：让 Gemini 为你构思 10W+ 爆款标题。
3. **AI 摘要优化**：自动生成吸引人的文章导语。
4. **AI 配图**：描述画面，直接生成封面图。
5. **一键发布**：绑定公众号，直接同步到后台草稿箱。

## 快速开始

在左侧编辑器输入内容，点击右侧侧边栏的 AI 功能按钮即可体验。

> 提示：发布前，请先点击右上角的“绑定公众号”。
`;

function App() {
  const [article, setArticle] = useState<Article>({
    title: "",
    author: "WePub User",
    content: INITIAL_MARKDOWN,
    summary: "",
    coverImage: ""
  });

  const [showAI, setShowAI] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [wechatAccount, setWechatAccount] = useState<WeChatAccount | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  const handleCopyForWeChat = () => {
    const clipboardItem = new ClipboardItem({
      "text/plain": new Blob([article.content], { type: "text/plain" }),
    });
    
    navigator.clipboard.writeText(article.content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100 text-gray-900">
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-wechat-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">W</div>
          <h1 className="font-bold text-lg tracking-tight text-gray-800 hidden md:block">WePub <span className="text-wechat-primary font-light">AI</span></h1>
        </div>
        
        <div className="flex items-center gap-4 flex-1 justify-center max-w-2xl mx-auto">
          <input 
            type="text" 
            placeholder="文章标题" 
            className="border-none bg-gray-50 rounded px-3 py-1.5 w-40 md:w-64 text-sm focus:ring-1 focus:ring-wechat-primary outline-none transition-all"
            value={article.title}
            onChange={(e) => setArticle({...article, title: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="作者" 
            className="border-none bg-gray-50 rounded px-3 py-1.5 w-24 md:w-32 text-sm focus:ring-1 focus:ring-wechat-primary outline-none transition-all"
            value={article.author}
            onChange={(e) => setArticle({...article, author: e.target.value})}
          />
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAI(!showAI)}
            className={`p-2 rounded-full transition-colors ${showAI ? 'bg-green-50 text-wechat-primary' : 'text-gray-400 hover:bg-gray-100'}`}
            title="AI 助手"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </button>
          
          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          {/* WeChat Actions */}
          {!wechatAccount ? (
            <button 
              onClick={() => setShowLoginDialog(true)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-50"
            >
              <svg className="w-5 h-5 text-[#07C160]" fill="currentColor" viewBox="0 0 24 24"><path d="M8.5,13.5A2.5,2.5 0 0,0 11,11A2.5,2.5 0 0,0 8.5,8.5A2.5,2.5 0 0,0 6,11A2.5,2.5 0 0,0 8.5,13.5M15.5,13.5A2.5,2.5 0 0,0 18,11A2.5,2.5 0 0,0 15.5,8.5A2.5,2.5 0 0,0 13,11A2.5,2.5 0 0,0 15.5,13.5M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,14.61 5.25,16.94 7.23,18.39L6.5,20.5L9.19,19.38C10.07,19.78 11.03,20 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"/></svg>
              绑定公众号
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                 onClick={() => setShowPublishDialog(true)}
                 className="flex items-center gap-2 bg-gradient-to-r from-[#07C160] to-[#06AD56] hover:from-[#06AD56] hover:to-[#059B4D] text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                发布
              </button>
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-white shadow-sm cursor-pointer group relative">
                 <img src={wechatAccount.avatar} alt="Account" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center" onClick={() => setWechatAccount(null)}>
                   <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </div>
              </div>
            </div>
          )}
          
          <button 
            onClick={handleCopyForWeChat}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all border ${isCopied ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {isCopied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                已复制
              </>
            ) : (
               <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Editor Area */}
        <div className="flex-1 p-4 lg:p-6 min-w-0 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 h-full min-h-[500px]">
             <Editor 
                value={article.content} 
                onChange={(content) => setArticle({...article, content})} 
             />
          </div>
          
          <div className="hidden lg:block w-[420px] shrink-0 h-full">
            <Preview 
              content={article.content}
              title={article.title}
              author={article.author}
              date={new Date().toLocaleDateString()}
              coverImage={article.coverImage}
            />
          </div>
        </div>

        {/* Right Sidebar: AI Assistant */}
        <div className={`transition-all duration-300 transform ${showAI ? 'translate-x-0 w-80' : 'translate-x-full w-0 opacity-0'} overflow-hidden shrink-0 h-full border-l border-gray-200`}>
          <div className="w-80 h-full">
             <AIAssistant 
                content={article.content}
                generateTitles={() => GeminiService.generateTitles(article.content)}
                generateSummary={() => GeminiService.generateSummary(article.content)}
                polishContent={() => GeminiService.polishContent(article.content)}
                generateImagePrompt={() => GeminiService.generateImagePrompt(article.content)}
                generateCover={GeminiService.generateCoverImage}
                onApplyTitle={(t) => setArticle(prev => ({...prev, title: t}))}
                onApplySummary={(s) => setArticle(prev => ({...prev, summary: s, content: `> ${s}\n\n` + prev.content}))}
                onApplyContent={(c) => setArticle(prev => ({...prev, content: c}))}
                onApplyCover={(img) => setArticle(prev => ({...prev, coverImage: img}))}
             />
          </div>
        </div>

      </div>

      {/* Login Dialog Overlay */}
      {showLoginDialog && (
        <LoginDialog 
          onClose={() => setShowLoginDialog(false)}
          onLoginSuccess={(account) => {
            setWechatAccount(account);
            setShowLoginDialog(false);
          }}
        />
      )}

      {/* Publish Dialog Overlay */}
      {showPublishDialog && wechatAccount && (
        <PublishDialog 
          account={wechatAccount}
          article={article}
          onClose={() => setShowPublishDialog(false)}
          onSuccess={() => {
            setTimeout(() => setShowPublishDialog(false), 3000);
          }}
        />
      )}
    </div>
  );
}

export default App;
