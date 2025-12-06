
import React, { useState } from 'react';
import { Article, WeChatAccount } from '../types';
import * as WeChatService from '../services/wechatService';

interface PublishDialogProps {
  account: WeChatAccount;
  article: Article;
  onClose: () => void;
  onSuccess: () => void;
}

export const PublishDialog: React.FC<PublishDialogProps> = ({ account, article, onClose, onSuccess }) => {
  const [step, setStep] = useState<'confirm' | 'uploading' | 'success'>('confirm');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const handlePublish = async () => {
    setStep('uploading');
    setLogs([]);
    
    try {
      addLog('正在获取 Access Token...');
      await new Promise(r => setTimeout(r, 600));
      
      if (article.coverImage) {
        addLog('正在上传封面到微信素材库 (Media API)...');
      } else {
        addLog('未设置封面，使用默认图...');
      }
      
      addLog('正在构建草稿结构 (Draft API)...');
      await new Promise(r => setTimeout(r, 800));
      
      addLog('正在推送数据到微信服务器...');
      const draftId = await WeChatService.publishToDraft(account, article);
      
      addLog(`发布成功! 草稿 ID: ${draftId}`);
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (e) {
      console.error(e);
      addLog('发布中断: 网络连接超时或 API 报错');
      setStep('confirm');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">发布到公众号</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'confirm' && (
            <div className="space-y-5">
              {/* Account Info */}
              <div className="flex items-center gap-3 p-3 bg-[#F2FAF5] rounded-lg border border-[#E0F2E9]">
                <img src={account.avatar} alt={account.name} className="w-10 h-10 rounded-full border border-white shadow-sm" />
                <div>
                  <p className="font-semibold text-gray-900">{account.name}</p>
                  <p className="text-xs text-[#07C160]">已授权 • {account.type === 'subscription' ? '订阅号' : '服务号'}</p>
                </div>
              </div>
              
              {/* Article Summary */}
              <div className="space-y-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="text-gray-400 shrink-0 mr-4">标题</span> 
                  <span className="font-medium text-right text-gray-800 break-words">{article.title || '（未设置标题）'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 shrink-0">作者</span> 
                  <span className="font-medium text-gray-800">{article.author || '（未设置作者）'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 shrink-0">摘要</span> 
                  <span className="font-medium text-gray-800">{article.summary ? '已生成' : '自动截取'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 shrink-0">封面</span> 
                  <span className="font-medium text-gray-800">{article.coverImage ? '已设置' : '无封面'}</span>
                </div>
              </div>

              <div className="mt-6">
                <button 
                  onClick={handlePublish}
                  className="w-full py-3 bg-[#07C160] hover:bg-[#06AD56] text-white rounded-lg font-medium shadow-lg shadow-green-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  确认同步到草稿箱
                </button>
              </div>
            </div>
          )}

          {step === 'uploading' && (
            <div className="py-8 flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-green-100 border-t-[#07C160] rounded-full animate-spin mb-6"></div>
              <p className="text-gray-800 font-medium mb-4 text-lg">正在发布...</p>
              <div className="w-full space-y-2 max-h-32 overflow-y-auto px-4">
                 {logs.map((l, i) => (
                   <p key={i} className="text-sm text-center text-gray-500">{l}</p>
                 ))}
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-5 animate-bounce-short">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">发布成功</h4>
              <p className="text-gray-500 mb-6 px-4">文章已成功同步至公众号后台草稿箱。<br/>请前往微信公众平台进行最终预览和群发。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
