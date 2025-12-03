
import React, { useState } from 'react';
import { analyzeInsightScreenshot } from '../services/geminiService';
import { InsightMetrics } from '../types';
import { UploadCloud, CheckCircle, AlertCircle, Loader2, ScanLine } from 'lucide-react';

interface InsightUploaderProps {
  onDataAdded: (data: InsightMetrics) => void;
}

const InsightUploader: React.FC<InsightUploaderProps> = ({ onDataAdded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await analyzeInsightScreenshot(file);
      onDataAdded(result);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "分析圖片失敗");
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-[#0f172a]/60 backdrop-blur-md p-10 rounded-xl border border-slate-800 text-center relative overflow-hidden group">
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        
        <div className="flex justify-center mb-6">
          <div className="bg-slate-900 p-6 rounded-full border border-slate-700 shadow-[0_0_20px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-shadow duration-500">
            <UploadCloud className="w-10 h-10 text-cyan-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3 font-tech tracking-wide">UPLOAD_INSIGHTS</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
          啟動 OCR 掃描模組。請上傳 Instagram Reel 洞察報告截圖，系統將自動擷取關鍵指標數據。
        </p>

        <div className="relative inline-block group/btn">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg blur opacity-30 group-hover/btn:opacity-75 transition duration-200"></div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
            id="insight-upload"
          />
          <label
            htmlFor="insight-upload"
            className={`
              relative flex items-center justify-center px-8 py-4 bg-slate-900 rounded-lg leading-none 
              text-cyan-100 font-bold tracking-wider font-tech
              border border-slate-700 cursor-pointer transition-all duration-200
              hover:bg-slate-800
              ${loading ? 'opacity-80 cursor-not-allowed' : ''}
            `}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin text-cyan-400" />
                SCANNING_IMAGE...
              </>
            ) : (
              <>
                <ScanLine className="w-5 h-5 mr-3 text-cyan-400" />
                SELECT_IMAGE_FILE
              </>
            )}
          </label>
        </div>

        {error && (
          <div className="mt-8 p-4 bg-red-950/30 border border-red-900/50 text-red-400 rounded-lg flex items-center justify-center font-mono text-sm">
            <AlertCircle className="w-5 h-5 mr-2" />
            ERROR: {error}
          </div>
        )}

        {success && (
          <div className="mt-8 p-4 bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 rounded-lg flex items-center justify-center animate-bounce-short font-mono text-sm">
            <CheckCircle className="w-5 h-5 mr-2" />
            DATA_EXTRACTION_COMPLETE
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 font-tech pl-2">PROTOCOLS & TIPS</h3>
        <ul className="space-y-3 text-sm text-slate-400 bg-[#0f172a]/40 p-6 rounded-lg border border-slate-800/50">
          <li className="flex items-start">
            <span className="mr-3 text-cyan-500 font-bold">::</span>
            確保截圖清晰，無眩光或遮擋。
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-cyan-500 font-bold">::</span>
            請針對「Overview (總覽)」區塊進行截圖以獲取最佳效果。
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-cyan-500 font-bold">::</span>
            建議每週固定時間上傳，以建立精確的趨勢模型。
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InsightUploader;
