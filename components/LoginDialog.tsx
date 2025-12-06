
import React, { useEffect, useState } from 'react';
import { WeChatAccount } from '../types';
import * as WeChatService from '../services/wechatService';

interface LoginDialogProps {
  onClose: () => void;
  onLoginSuccess: (account: WeChatAccount) => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ onClose, onLoginSuccess }) => {
  const [status, setStatus] = useState<'loading' | 'scanned' | 'success'>('loading');

  useEffect(() => {
    // Simulate the polling process
    const timer = setTimeout(async () => {
      setStatus('scanned');
      // Simulate user confirming on phone
      setTimeout(async () => {
        try {
          const account = await WeChatService.checkLoginStatus();
          setStatus('success');
          setTimeout(() => {
            onLoginSuccess(account);
            onClose();
          }, 1000);
        } catch (e) {
          console.error(e);
        }
      }, 1500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLoginSuccess, onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden text-center relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">微信扫码授权</h3>
          
          <div className="flex flex-col items-center justify-center mb-6">
            <div className={`w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden transition-all ${status === 'success' ? 'border-4 border-[#07C160]' : ''}`}>
               {/* QR Code Placeholder */}
               {status === 'loading' && (
                 <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://mp.weixin.qq.com" alt="QR Code" className="opacity-90" />
               )}
               
               {status === 'scanned' && (
                  <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-[#07C160] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <p className="text-sm font-bold text-gray-800">扫描成功</p>
                    <p className="text-xs text-gray-500">请在手机上确认登录</p>
                  </div>
               )}

               {status === 'success' && (
                  <div className="absolute inset-0 bg-white flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-[#07C160] rounded-full flex items-center justify-center text-white mb-2">
                       <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-sm font-bold text-gray-800">授权完成</p>
                  </div>
               )}
            </div>
            
            <p className="text-sm text-gray-500">
              {status === 'loading' && '请使用微信“扫一扫”'}
              {status === 'scanned' && '等待确认...'}
              {status === 'success' && '即将跳转...'}
            </p>
          </div>

          <div className="text-xs text-gray-400">
             授权后 WePub 将获得您的公众号草稿箱发布权限
          </div>
        </div>
      </div>
    </div>
  );
};
