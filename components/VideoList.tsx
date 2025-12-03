
import React from 'react';
import { InsightMetrics } from '../types';
import { Trash2, Heart, Share2, Bookmark, AlertOctagon } from 'lucide-react';

interface VideoListProps {
  data: InsightMetrics[];
  onDelete: (id: string) => void;
}

const VideoList: React.FC<VideoListProps> = ({ data, onDelete }) => {
  const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Confirm Modal State
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  if (sortedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[#0f172a]/60 backdrop-blur-md rounded-xl border border-slate-800 text-center">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
           <AlertOctagon className="w-8 h-8 text-slate-500" />
        </div>
        <p className="text-slate-300 mb-2 font-medium">NO_DATA_FOUND</p>
        <p className="text-sm text-slate-500">請前往「更新洞察數據」上傳截圖。</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#0f172a]/60 backdrop-blur-md rounded-xl border border-slate-800 overflow-hidden animate-fade-in shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-cyan-400 text-xs uppercase tracking-widest border-b border-slate-700 font-tech">
                <th className="p-4 font-semibold">DATE</th>
                <th className="p-4 font-semibold">TITLE</th>
                <th className="p-4 font-semibold text-right">VIEWS</th>
                <th className="p-4 font-semibold text-right">REACH</th>
                <th className="p-4 font-semibold text-center">ENGAGEMENT</th>
                <th className="p-4 font-semibold text-center">RETENTION</th>
                <th className="p-4 font-semibold text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sortedData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="p-4 text-slate-400 whitespace-nowrap text-sm font-mono">
                    {new Date(item.date).toLocaleDateString('zh-TW')}
                  </td>
                  <td className="p-4 text-slate-200 font-medium max-w-xs truncate" title={item.videoTitle}>
                    {item.videoTitle || 'UNTITLED_VIDEO'}
                  </td>
                  <td className="p-4 text-slate-300 text-right font-mono tracking-tight">
                    {item.views.toLocaleString()}
                  </td>
                  <td className="p-4 text-cyan-400 text-right font-mono tracking-tight font-bold" style={{textShadow: '0 0 10px rgba(34,211,238,0.3)'}}>
                    {item.reach.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center space-x-4 text-xs text-slate-400">
                      <span className="flex items-center" title="Likes"><Heart className="w-3 h-3 mr-1 text-fuchsia-500" />{item.likes}</span>
                      <span className="flex items-center" title="Shares"><Share2 className="w-3 h-3 mr-1 text-blue-500" />{item.shares}</span>
                      <span className="flex items-center" title="Saves"><Bookmark className="w-3 h-3 mr-1 text-emerald-500" />{item.saves}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {item.retentionRate ? (
                      <span className={`
                        inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono border
                        ${item.retentionRate >= 50 
                          ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30' 
                          : 'bg-amber-950/50 text-amber-400 border-amber-500/30'}
                      `}>
                        {item.retentionRate}%
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="group/btn relative inline-flex items-center justify-center px-3 py-1.5 overflow-hidden font-medium text-red-500 transition-all duration-300 border border-red-900/50 rounded hover:bg-red-950/30 hover:border-red-500/50 hover:text-red-400 focus:outline-none"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-600/10 via-transparent to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      <span className="text-xs">刪除</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Dark Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl p-6 max-w-sm w-full shadow-2xl shadow-red-900/20">
            <h3 className="text-lg font-bold text-white mb-2 font-tech">CONFIRM_DELETE</h3>
            <p className="text-slate-400 text-sm mb-6">
              您確定要永久刪除此影片數據嗎？<br/>此操作<span className="text-red-400">無法復原</span>。
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-slate-300 hover:text-white text-sm transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  onDelete(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded shadow-[0_0_10px_rgba(220,38,38,0.5)] transition-all"
              >
                確認刪除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoList;
