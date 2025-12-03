
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { InsightMetrics, VideoAnalysisResult } from "../types";

// Helper to safely get the AI client
// We initialize it lazily (inside the function) instead of globally.
// This prevents the entire app from crashing with a "Blank Screen" on load 
// if process.env.API_KEY is missing or undefined in the deployment environment.
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("系統警告: 未偵測到 API_KEY。請確保環境變數已設定。");
  }
  // Allow initialization even if empty to let the error happen during the call, not load.
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

// --- Helper: Generate ID ---
const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

// --- Helper: File to Base64 ---
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// --- Service: Analyze Insight Screenshot ---
export const analyzeInsightScreenshot = async (file: File): Promise<InsightMetrics> => {
  const base64Data = await fileToGenerativePart(file);
  const ai = getAiClient();

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      videoTitle: { type: Type.STRING, description: "從內容推斷的簡短標題，或是 '未命名 Reels'" },
      views: { type: Type.NUMBER, description: "總播放次數或瀏覽次數" },
      reach: { type: Type.NUMBER, description: "觸及帳號數量" },
      likes: { type: Type.NUMBER, description: "按讚/愛心數" },
      shares: { type: Type.NUMBER, description: "分享數" },
      saves: { type: Type.NUMBER, description: "珍藏/儲存數" },
      comments: { type: Type.NUMBER, description: "留言數" },
      retentionRate: { type: Type.NUMBER, description: "平均觀看比例或續看率 (百分比數字)。如果沒找到填 0。" },
      avgWatchTime: { type: Type.STRING, description: "平均觀看時間 (例如 '8秒', '1分 2秒'). 沒找到填 '0s'。" },
    },
    required: ["views", "reach", "likes", "shares", "saves", "comments"],
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: file.type,
            data: base64Data
          }
        },
        {
          text: "分析這張 Instagram/社群媒體的洞察報告截圖。擷取效能指標數據。如果截圖是繁體中文，請正確辨識。如果特定指標未顯示，請估算為 0 或從上下文推斷。請回傳 JSON 格式。"
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.1, // Low temperature for factual extraction
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  const data = JSON.parse(text);
  
  return {
    ...data,
    id: generateId(),
    date: new Date().toISOString(),
    source: 'Upload'
  };
};

// --- Service: Analyze Video File ---
export const analyzeVideoContent = async (file: File): Promise<VideoAnalysisResult> => {
  const base64Data = await fileToGenerativePart(file);
  const ai = getAiClient();

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      hookScore: { type: Type.NUMBER, description: "針對前 3 秒的評分 (1-10)" },
      pacingScore: { type: Type.NUMBER, description: "針對節奏和剪輯速度的評分 (1-10)" },
      topicScore: { type: Type.NUMBER, description: "針對題材相關性和趣味性的評分 (1-10)" },
      hookAnalysis: { type: Type.STRING, description: "針對開頭鉤子的詳細評論 (繁體中文)" },
      pacingAnalysis: { type: Type.STRING, description: "針對流暢度和節奏的詳細評論 (繁體中文)" },
      topicAnalysis: { type: Type.STRING, description: "針對主題內容的分析 (繁體中文)" },
      viralPotential: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
      improvements: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "3 個具體的改進建議，供下次創作參考 (繁體中文)"
      }
    },
    required: ["hookScore", "pacingScore", "topicScore", "hookAnalysis", "pacingAnalysis", "viralPotential", "improvements"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", // 2.5 flash is multimodal capable
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: file.type, // e.g., video/mp4
            data: base64Data
          }
        },
        {
          text: "擔任一位爆款社群媒體顧問。分析這段 Reels 短影音。專注於「鉤子 Hook」（前 3 秒）、「節奏/步調」和「題材」吸引力。提供批判性分析和爆款潛力評分。請務必使用**繁體中文 (Traditional Chinese)** 回答。內容要誠實且具建設性。"
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.4, 
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  return JSON.parse(text);
};
