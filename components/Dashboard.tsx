
import React from 'react';
import { InsightMetrics } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

interface DashboardProps {
  data: InsightMetrics[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  // Sort data by date
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate Aggregates
  const totalViews = data.reduce((acc, curr) => acc + curr.views, 0);
  const totalReach = data.reduce((acc, curr) => acc + curr.reach, 0);
  const totalEngagement = data.reduce((acc, curr) => acc + (curr.likes + curr.comments + curr.shares + curr.saves), 0);
  const avgRetention = data.length > 0 
    ? (data.reduce((acc, curr) => acc + (curr.retentionRate || 0), 0) / data.length).toFixed(1) 
    : 0;

  const Card = ({ title, value, subColor }: { title: string, value: string, subColor: string }) => (
    <div className="relative group overflow-hidden bg-[#0f172a]/60 backdrop-blur-md p-6 rounded-xl border border-slate-800 transition-all hover:border-slate-600">
      <div className={`absolute top-0 left-0 w-1 h-full ${subColor}`}></div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-tech mb-2">{title}</p>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10 blur-xl ${subColor.replace('bg-', 'bg-')}`}></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="TOTAL VIEWS" value={totalViews.toLocaleString()} subColor="bg-blue-500" />
        <Card title="TOTAL REACH" value={totalReach.toLocaleString()} subColor="bg-cyan-500" />
        <Card title="ENGAGEMENT" value={totalEngagement.toLocaleString()} subColor="bg-fuchsia-500" />
        <Card title="AVG RETENTION" value={`${avgRetention}%`} subColor="bg-emerald-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reach Growth */}
        <div className="bg-[#0f172a]/60 backdrop-blur-md p-6 rounded-xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-300 mb-6 font-tech tracking-wider flex items-center">
            <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
            REACH_GROWTH_TREND
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sortedData}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => new Date(val).toLocaleDateString('zh-TW', {month:'short', day:'numeric'})} 
                  stroke="#475569"
                  tick={{fontSize: 11, fill: '#64748b'}}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#475569" 
                  tick={{fontSize: 11, fill: '#64748b'}} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid #334155', 
                    borderRadius: '8px', 
                    color: '#f1f5f9',
                    backdropFilter: 'blur(4px)'
                  }}
                  itemStyle={{ color: '#22d3ee' }}
                  labelFormatter={(val) => new Date(val).toLocaleDateString('zh-TW')}
                  formatter={(value: number) => [value, '觸及人數']}
                />
                <Area 
                  type="monotone" 
                  dataKey="reach" 
                  stroke="#22d3ee" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorReach)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Mix */}
        <div className="bg-[#0f172a]/60 backdrop-blur-md p-6 rounded-xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-300 mb-6 font-tech tracking-wider flex items-center">
            <span className="w-2 h-2 bg-fuchsia-500 rounded-full mr-2"></span>
            ENGAGEMENT_MIX
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => new Date(val).toLocaleDateString('zh-TW', {month:'short', day:'numeric'})} 
                  stroke="#475569"
                  tick={{fontSize: 11, fill: '#64748b'}}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#475569" 
                  tick={{fontSize: 11, fill: '#64748b'}} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                   contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid #334155', 
                    borderRadius: '8px', 
                    color: '#f1f5f9',
                    backdropFilter: 'blur(4px)'
                  }}
                  labelFormatter={(val) => new Date(val).toLocaleDateString('zh-TW')}
                  cursor={{fill: '#1e293b', opacity: 0.4}}
                />
                <Legend formatter={(value) => {
                    const map: Record<string, string> = { likes: '按讚', shares: '分享', saves: '珍藏' };
                    return <span className="text-slate-400 text-xs">{map[value] || value}</span>;
                }}/>
                <Bar dataKey="likes" stackId="a" fill="#e879f9" radius={[0,0,0,0]} />
                <Bar dataKey="shares" stackId="a" fill="#818cf8" radius={[0,0,0,0]} />
                <Bar dataKey="saves" stackId="a" fill="#2dd4bf" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Retention vs Shares (Correlation) */}
        <div className="bg-[#0f172a]/60 backdrop-blur-md p-6 rounded-xl border border-slate-800 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-300 mb-6 font-tech tracking-wider flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
            VIRAL_FACTORS: RETENTION_VS_SHARES
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis 
                  dataKey="videoTitle" 
                  tick={false} 
                  stroke="#475569"
                  axisLine={{stroke: '#334155'}}
                />
                <YAxis yAxisId="left" stroke="#34d399" tick={{fill: '#34d399', fontSize: 11}} axisLine={false} tickLine={false} label={{ value: '續看率 %', angle: -90, position: 'insideLeft', fill: '#34d399', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#a78bfa" tick={{fill: '#a78bfa', fontSize: 11}} axisLine={false} tickLine={false} label={{ value: '分享數', angle: 90, position: 'insideRight', fill: '#a78bfa', fontSize: 10 }} />
                <Tooltip 
                   contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid #334155', 
                    borderRadius: '8px', 
                    color: '#f1f5f9'
                  }}
                />
                <Legend formatter={(value) => <span className="text-slate-400 text-xs">{value}</span>} />
                <Line yAxisId="left" type="monotone" dataKey="retentionRate" stroke="#34d399" strokeWidth={3} name="續看率 (%)" dot={{r: 4, fill: '#0f172a', strokeWidth: 2}} activeDot={{r: 6, fill: '#34d399'}} />
                <Line yAxisId="right" type="monotone" dataKey="shares" stroke="#a78bfa" strokeWidth={3} name="分享數" dot={{r: 4, fill: '#0f172a', strokeWidth: 2}} activeDot={{r: 6, fill: '#a78bfa'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
