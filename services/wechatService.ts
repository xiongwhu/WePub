
import { Article, WeChatAccount, WeChatDraftArticle, WeChatMediaResponse } from '../types';

// Utility to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 模拟获取 Access Token (真实环境需要在后端完成)
 */
const getAccessToken = async (): Promise<string> => {
  await delay(500);
  return "mock_access_token_" + Date.now();
};

/**
 * 模拟微信登录/授权流程
 * 真实流程：
 * 1. 请求后端获取 OAuth URL
 * 2. 展示二维码
 * 3. 轮询后端检查用户是否扫码
 */
export const checkLoginStatus = async (): Promise<WeChatAccount> => {
  await delay(2000); // 模拟网络轮询
  return {
    id: 'gh_tech_writer_001',
    name: '前端技术精选',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Tech&backgroundColor=07C160',
    type: 'subscription'
  };
};

/**
 * 第一步：上传封面图获取 media_id
 * API: POST https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=ACCESS_TOKEN&type=image
 */
export const uploadCoverImage = async (base64Image: string): Promise<WeChatMediaResponse> => {
  console.log('[WeChat API] Uploading image...');
  await delay(1500); // Simulate upload time

  if (!base64Image) {
    throw new Error("Cover image is missing");
  }

  // Return a mock media_id (in real app, this comes from WeChat server)
  return {
    media_id: `MEDIA_ID_${Date.now()}_COVER`,
    url: 'https://mmbiz.qpic.cn/mock_image_url'
  };
};

/**
 * 第二步：发布草稿
 * API: POST https://api.weixin.qq.com/cgi-bin/draft/add?access_token=ACCESS_TOKEN
 */
export const publishToDraft = async (account: WeChatAccount, article: Article): Promise<string> => {
  try {
    const token = await getAccessToken();
    console.log(`[WeChat API] Using Token: ${token}`);

    // 1. 如果有封面，先上传封面获取 Media ID
    let thumbMediaId = 'DEFAULT_THUMB_ID'; // 默认封面ID
    if (article.coverImage) {
      const mediaRes = await uploadCoverImage(article.coverImage);
      thumbMediaId = mediaRes.media_id;
      console.log(`[WeChat API] Cover uploaded. Media ID: ${thumbMediaId}`);
    }

    // 2. 构造微信草稿数据结构
    // 注意：真实环境中，content 需要将 markdown 转换为 html
    // 并且图片需要先上传到微信服务器替换 url
    const draftPayload: WeChatDraftArticle = {
      title: article.title,
      author: article.author,
      digest: article.summary,
      content: article.content, // HTML content in real app
      thumb_media_id: thumbMediaId,
      need_open_comment: 1,
    };

    console.log('[WeChat API] Sending draft payload:', draftPayload);
    await delay(1200);

    // 3. 返回草稿 ID
    return `DRAFT_ID_${Date.now()}`;

  } catch (error) {
    console.error("Publish failed", error);
    throw error;
  }
};
