
export interface InsightMetrics {
  id: string; // Unique identifier
  date: string; // ISO Date or formatted string
  videoTitle: string;
  views: number;
  reach: number;
  likes: number;
  shares: number;
  saves: number;
  comments: number;
  retentionRate?: number; // Percentage
  avgWatchTime?: string;
  source: 'Upload' | 'Manual';
}

export interface VideoAnalysisResult {
  hookScore: number; // 1-10
  pacingScore: number; // 1-10
  topicScore: number; // 1-10
  hookAnalysis: string;
  pacingAnalysis: string;
  topicAnalysis: string;
  viralPotential: 'Low' | 'Medium' | 'High';
  improvements: string[];
}

export interface VideoAnalysisSession {
  id: string;
  fileName: string;
  timestamp: number;
  result: VideoAnalysisResult;
}

export enum AppTab {
  DASHBOARD = 'DASHBOARD',
  VIDEO_LIST = 'VIDEO_LIST',
  UPLOAD_INSIGHTS = 'UPLOAD_INSIGHTS',
  VIDEO_ANALYSIS = 'VIDEO_ANALYSIS',
}
