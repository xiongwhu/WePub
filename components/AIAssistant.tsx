
import React, { useState } from 'react';
import { AIStatus, GeneratedTitle } from '../types';

interface AIAssistantProps {
  content: string;
  onApplyTitle: (title: string) => void;
  onApplySummary: (summary: string) => void;
  onApplyContent: (content: string) => void;
  onApplyCover: (image: string) => void;
  generateTitles: () => Promise<GeneratedTitle[]>;
  generateSummary: () => Promise<string>;
  polishContent: () => Promise<string>;
  generateImagePrompt: () => Promise<string>;
  generateCover: (prompt: string) => Promise<string>;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  content,
  onApplyTitle,
  onApplySummary,
  onApplyContent,
  onApplyCover,
  generateTitles,
  generateSummary,
  polishContent,
  generateImagePrompt,
  generateCover
}) => {
  const [status, setStatus] = useState<AIStatus>(AIStatus.IDLE);
  const [promptStatus, setPromptStatus] = useState<AIStatus>(AIStatus.IDLE);
  const [titles, setTitles] = useState<GeneratedTitle[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [coverPrompt, setCoverPrompt] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  
  // 新增：用于在侧边栏预览生成的图片
  const [previewCover, setPreviewCover] = useState<string | null>(null);

  const handleGenerateTitles = async () => {
    if (!content) return;
    setStatus(AIStatus.LOADING);
    try {
      const results = await generateTitles();
      setTitles(results);
      setStatus(AIStatus.SUCCESS);
    } catch (e) {
      setStatus(AIStatus.ERROR);
    }
  };

  const handleGenerateSummary = async () => {
    if (!content) return;
    setStatus(AIStatus.LOADING);
    try {
      const res = await generateSummary();
      setSummary(res);
      setStatus(AIStatus.SUCCESS);
    } catch (e) {
      setStatus(AIStatus.ERROR);
    }
  };

  const handlePolish = async () => {
    if (!content) return;
    setStatus(AIStatus.LOADING);
    try {
      const res = await polishContent();
      onApplyContent(res);
      setStatus(AIStatus.SUCCESS);
    } catch (e) {
      setStatus(AIStatus.ERROR);
    }
  };

  const handleAutoGeneratePrompt = async () => {
    if (!content) return;
    setPromptStatus(AIStatus.LOADING);
    try {
      const prompt = await generateImagePrompt();
      setCoverPrompt(prompt);
      setPromptStatus(AIStatus.SUCCESS);
    } catch (e) {
      setPromptStatus(AIStatus.ERROR);
    }
  };

  const handleGenerateCover = async () => {
    if (!coverPrompt) return;
    setStatus(AIStatus.LOADING);
    setPreviewCover(null); // 清除旧图
    try {
      const res = await generateCover(coverPrompt);
      if (!res) throw new Error("生成图片为空");
      setPreviewCover(res); // 仅显示预览，不自动应用
      setStatus(AIStatus.SUCCESS);
    } catch (e) {
      console.error(e);
      setStatus(AIStatus.ERROR);
    }
  };

  const handleApplyCoverToArticle = () => {
    if (previewCover) {
      onApplyCover(previewCover);
      // 可选：应用后清除预览或保留均可，这里保留以便用户反悔
      // setPreviewCover(null); 
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 w-80 flex flex-col h-full shadow-lg">
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-wechat-light to-white">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-xl">✨</span> AI 智能助手
        </h2>
        <p className="text-xs text-gray-500 mt-1">Powered by Gemini 2.5</p>
      </div>

      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'text' ? 'text-wechat-primary border-b-2 border-wechat-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          文本优化
        </button>
        <button 
          onClick={() => setActiveTab('image')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'image' ? 'text-wechat-primary border-b-2 border-wechat-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          配图生成
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8">
        {activeTab === 'text' && (
          <>
            {/* Title Generation */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 text-sm flex items-center justify-between">
                1. 爆款标题生成
                <button 
                  onClick={handleGenerateTitles} 
                  disabled={status === AIStatus.LOADING}
                  className="text-xs bg-wechat-light text-wechat-dark px-2 py-1 rounded hover:bg-green-100 transition disabled:opacity-50"
                >
                  {status === AIStatus.LOADING ? '生成中...' : '生成'}
                </button>
              </h3>
              {titles.length > 0 && (
                <div className="space-y-2">
                  {titles.map((t, idx) => (
                    <div key={idx} onClick={() => onApplyTitle(t.title)} className="p-3 bg-gray-50 hover:bg-green-50 rounded-lg cursor-pointer border border-transparent hover:border-green-200 transition group">
                      <p className="text-sm font-medium text-gray-800">{t.title}</p>
                      <p className="text-xs text-gray-500 mt-1 group-hover:text-green-600">{t.rationale}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary Generation */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
               <h3 className="font-semibold text-gray-700 text-sm flex items-center justify-between">
                2. 摘要/导语生成
                <button 
                  onClick={handleGenerateSummary}
                  disabled={status === AIStatus.LOADING} 
                  className="text-xs bg-wechat-light text-wechat-dark px-2 py-1 rounded hover:bg-green-100 transition disabled:opacity-50"
                >
                  生成
                </button>
              </h3>
              {summary && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                   <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
                   <button onClick={() => onApplySummary(summary)} className="mt-2 text-xs text-wechat-primary font-medium hover:underline">
                     应用到文章
                   </button>
                </div>
              )}
            </div>

            {/* Polish Content */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
               <h3 className="font-semibold text-gray-700 text-sm flex items-center justify-between">
                3. 全文润色
                <button 
                  onClick={handlePolish}
                  disabled={status === AIStatus.LOADING}
                   className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 transition disabled:opacity-50"
                >
                  {status === AIStatus.LOADING ? '优化中...' : '一键润色'}
                </button>
              </h3>
              <p className="text-xs text-gray-400">
                AI 将检查错别字、优化语流，保持 Markdown 格式不变。
              </p>
            </div>
          </>
        )}

        {activeTab === 'image' && (
          <div className="space-y-4">
             <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">封面图描述</label>
                  <button 
                    onClick={handleAutoGeneratePrompt}
                    disabled={promptStatus === AIStatus.LOADING}
                    className="text-xs text-wechat-primary bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition flex items-center gap-1 disabled:opacity-50"
                  >
                    {promptStatus === AIStatus.LOADING ? (
                      <span className="flex items-center gap-1">分析中...</span>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        智能填充
                      </>
                    )}
                  </button>
                </div>
                <textarea 
                  className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-wechat-primary focus:border-wechat-primary outline-none resize-none h-24 transition-colors"
                  placeholder="描述你想要的封面图，例如：一张扁平化风格的插画..."
                  value={coverPrompt}
                  onChange={(e) => setCoverPrompt(e.target.value)}
                />
             </div>
             
             {!previewCover ? (
                <button 
                  onClick={handleGenerateCover}
                  disabled={status === AIStatus.LOADING || !coverPrompt}
                  className="w-full py-2 bg-gradient-to-r from-wechat-dark to-wechat-primary text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:shadow-none"
                >
                  {status === AIStatus.LOADING ? '正在绘图...' : '生成封面'}
                </button>
             ) : (
               <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm relative group">
                    <img src={previewCover} alt="AI Generated Cover" className="w-full aspect-video object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="text-white text-xs font-medium">预览模式</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={handleApplyCoverToArticle}
                      className="flex-1 py-2 bg-wechat-primary hover:bg-wechat-dark text-white rounded-lg text-sm font-medium transition shadow-sm"
                    >
                      插入文章
                    </button>
                    <button 
                      onClick={() => setPreviewCover(null)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-medium transition"
                    >
                      重做
                    </button>
                  </div>
               </div>
             )}
             
             {status === AIStatus.ERROR && !previewCover && (
               <p className="text-xs text-red-500 mt-2">生成失败，请检查描述或重试。</p>
             )}
          </div>
        )}
      </div>
      
      {/* Disclaimer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 text-[10px] text-gray-400 text-center">
        内容由 AI 生成，请发布前务必人工核对。
      </div>
    </div>
  );
};
