
import React, { useState } from 'react';
import { analyzeVideoContent } from '../services/geminiService';
import { VideoAnalysisResult } from '../types';
import { Film, Zap, Clock, MessageSquare, Loader2, PlayCircle, Star, Sparkles } from 'lucide-react';

const VideoAnalyzer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VideoAnalysisResult | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResult(null);
    setError(null);
    setLoading(true);

    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    try {
      const analysis = await analyzeVideoContent(file);
      setResult(analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "分析影片失敗。注意：在此瀏覽器演示中，過大的檔案可能會失敗。");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(52,211,153,0.3)]';
    if (score >= 5) return 'text-amber-400 border-amber-500/50 shadow-[0_0_10px_rgba(251,191,36,0.3)]';
    return 'text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(248,113,113,0.3)]';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      {/* Left Column: Upload & Preview */}
      <div className="space-y-6">
        <div className="bg-[#0f172a]/60 backdrop-blur-md p-6 rounded-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
          
          <h2 className="text-xl font-bold text-white mb-4 flex items-center font-tech">
            <Film className="w-6 h-6 mr-2 text-cyan-400" />
            VIRAL_ANALYZER_
          </h2>
          <p className="text-slate-400 mb-6 text-sm">
            AI 將深度掃描您的影片，分析「鉤子 (Hook)」、「節奏」和「題材」的傳播潛力。
          </p>

          <div className="border-2 border-dashed border-slate-700 bg-slate-900/50 rounded-lg p-8 text-center hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300 group">
            {!videoUrl ? (
              <>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                  disabled={loading}
                />
                <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="relative mb-4">
                     <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full"></div>
                     <PlayCircle className="w-12 h-12 text-slate-500 group-hover:text-cyan-400 transition-colors relative z-10" />
                  </div>
                  <span className="text-slate-300 font-medium group-hover:text-white transition-colors font-tech tracking-wide">CLICK_TO_UPLOAD</span>
                  <span className="text-xs text-slate-500 mt-2 font-mono">MP4, MOV (MAX 20MB)</span>
                </label>
              </>
            ) : (
              <div className="relative">
                <video src={videoUrl} controls className="w-full rounded-lg max-h-[400px] border border-slate-700 shadow-2xl" />
                <button 
                  onClick={() => { setVideoUrl(null); setResult(null); }}
                  className="mt-4 text-xs font-mono text-red-400 hover:text-red-300 underline decoration-red-400/30"
                >
                  [REMOVE_VIDEO]
                </button>
              </div>
            )}
          </div>

          {loading && (
            <div className="mt-6 flex flex-col items-center justify-center py-8">
              <Loader2 className="w-10 h-10 text-fuchsia-500 animate-spin mb-3" />
              <p className="text-slate-200 font-medium font-tech tracking-wider animate-pulse">PROCESSING_VIDEO_DATA...</p>
              <p className="text-slate-500 text-xs font-mono mt-1">Analyzing frames for hook retention...</p>
            </div>
          )}
           {error && (
            <div className="mt-6 p-4 bg-red-950/30 border border-red-900/50 text-red-400 rounded-lg text-sm font-mono flex items-center">
              <span className="mr-2">!</span> {error}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Analysis Results */}
      <div className="space-y-6">
        {result ? (
          <>
            {/* Overall Badge */}
            <div className="relative overflow-hidden bg-gradient-to-r from-violet-900 to-indigo-900 text-white p-6 rounded-xl border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-indigo-300 text-xs uppercase tracking-[0.2em] font-bold font-tech">VIRAL POTENTIAL</p>
                  <h3 className="text-3xl font-bold mt-1 font-tech tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                    {result.viralPotential === 'High' && 'HIGH_TIER'}
                    {result.viralPotential === 'Medium' && 'MID_TIER'}
                    {result.viralPotential === 'Low' && 'LOW_TIER'}
                  </h3>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
                  <Star className={`w-8 h-8 ${result.viralPotential === 'High' ? 'text-yellow-400 fill-yellow-400 animate-pulse' : 'text-slate-400'}`} />
                </div>
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="grid grid-cols-1 gap-4">
              {/* Hook */}
              <div className="bg-[#0f172a]/80 p-5 rounded-xl border border-slate-800 hover:border-amber-500/30 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-slate-200 flex items-center font-tech">
                    <Zap className="w-4 h-4 mr-2 text-amber-500" /> HOOK_SCORE
                  </h4>
                  <span className={`px-3 py-1 rounded-md text-sm font-bold font-mono border ${getScoreColor(result.hookScore)}`}>
                    {result.hookScore}/10
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{result.hookAnalysis}</p>
              </div>

              {/* Pacing */}
              <div className="bg-[#0f172a]/80 p-5 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-slate-200 flex items-center font-tech">
                    <Clock className="w-4 h-4 mr-2 text-cyan-500" /> PACING_SCORE
                  </h4>
                  <span className={`px-3 py-1 rounded-md text-sm font-bold font-mono border ${getScoreColor(result.pacingScore)}`}>
                    {result.pacingScore}/10
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{result.pacingAnalysis}</p>
              </div>

               {/* Topic */}
               <div className="bg-[#0f172a]/80 p-5 rounded-xl border border-slate-800 hover:border-fuchsia-500/30 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-slate-200 flex items-center font-tech">
                    <MessageSquare className="w-4 h-4 mr-2 text-fuchsia-500" /> TOPIC_RELEVANCE
                  </h4>
                  <span className={`px-3 py-1 rounded-md text-sm font-bold font-mono border ${getScoreColor(result.topicScore)}`}>
                    {result.topicScore}/10
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{result.topicAnalysis}</p>
              </div>
            </div>

            {/* Improvements */}
            <div className="bg-emerald-950/20 border border-emerald-500/20 p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-emerald-500" />
              </div>
              <h4 className="font-bold text-emerald-400 mb-4 font-tech tracking-wide flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                OPTIMIZATION_SUGGESTIONS
              </h4>
              <ul className="space-y-3 relative z-10">
                {result.improvements.map((imp, idx) => (
                  <li key={idx} className="flex items-start text-emerald-100/80 text-sm">
                    <span className="mr-3 font-mono text-emerald-500">0{idx + 1}.</span>
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          !loading && (
            <div className="h-full flex flex-col items-center justify-center bg-[#0f172a]/40 border-2 border-dashed border-slate-800 rounded-xl text-slate-600 p-10 font-mono text-sm">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
                 <Film className="w-8 h-8 opacity-30" />
              </div>
              <p>[WAITING_FOR_INPUT]</p>
              <p className="opacity-50 mt-2">請上傳影片以啟動分析模組</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default VideoAnalyzer;
