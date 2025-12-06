
export interface Article {
  title: string;
  author: string;
  content: string; // Markdown
  summary: string;
  coverImage?: string; // Base64 or URL
}

export enum AIStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export enum Tab {
  EDITOR = 'EDITOR',
  PREVIEW = 'PREVIEW'
}

export interface GeneratedTitle {
  title: string;
  rationale: string;
}

export interface AIResponse<T> {
  data?: T;
  error?: string;
}

export interface WeChatAccount {
  id: string;
  name: string;
  avatar: string;
  type: 'subscription' | 'service'; // 订阅号 | 服务号
}

// WeChat API Specific Types
export interface WeChatMediaResponse {
  media_id: string;
  url: string;
}

export interface WeChatDraftArticle {
  title: string;
  author: string;
  digest: string;
  content: string;
  content_source_url?: string;
  thumb_media_id: string; // The cover image ID from WeChat
  need_open_comment?: 0 | 1;
  only_fans_can_comment?: 0 | 1;
}

export interface WeChatDraftResponse {
  media_id: string; // The draft ID
  item: unknown[];
}
