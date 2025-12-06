import React from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h2 className="font-semibold text-gray-700 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Markdown 编辑器
        </h2>
        <div className="text-xs text-gray-400">支持 Markdown 语法</div>
      </div>
      <textarea
        className="flex-1 w-full p-4 resize-none focus:outline-none focus:ring-0 font-mono text-sm leading-relaxed text-gray-800"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="# 开始写作...&#10;&#10;这里输入你的文章内容，支持 **加粗**、*斜体*、> 引用等语法。"
        spellCheck={false}
      />
    </div>
  );
};