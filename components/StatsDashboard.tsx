import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Task, InspectionStatus } from '../types';

interface StatsDashboardProps {
  tasks: Task[];
}

const COLORS = ['#3b82f6', '#f59e0b', '#10b981']; // Blue (Pending), Amber (In Progress), Green (Done)
const BRAND_BLUE = '#0A2EF5';

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ tasks }) => {
  const pendingCount = tasks.filter(t => t.status === InspectionStatus.PENDING).length;
  const progressCount = tasks.filter(t => t.status === InspectionStatus.IN_PROGRESS).length;
  const completedCount = tasks.filter(t => t.status === InspectionStatus.COMPLETED).length;

  const data = [
    { name: '待检', value: pendingCount },
    { name: '检验中', value: progressCount },
    { name: '已完成', value: completedCount },
  ];

  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Overview Card */}
      <div className="rounded-xl shadow-md text-white p-5 relative overflow-hidden" style={{ backgroundColor: BRAND_BLUE }}>
         {/* Decorative circle */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        
        <h3 className="text-xs font-bold text-blue-100 mb-2 uppercase tracking-wider relative z-10">今日任务总量</h3>
        
        <div className="flex items-baseline gap-2 relative z-10 mb-4">
          <span className="text-5xl font-extrabold">{tasks.length}</span>
          <span className="text-sm font-medium text-blue-100">单</span>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-white/20 pt-3 relative z-10">
             <div className="text-center">
                <div className="text-xs text-blue-100 mb-0.5">待检</div>
                <div className="text-lg font-bold">{pendingCount}</div>
             </div>
             <div className="text-center border-l border-white/10">
                <div className="text-xs text-blue-100 mb-0.5">进行中</div>
                <div className="text-lg font-bold">{progressCount}</div>
             </div>
             <div className="text-center border-l border-white/10">
                <div className="text-xs text-blue-100 mb-0.5">已完成</div>
                <div className="text-lg font-bold">{completedCount}</div>
             </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
         <div className="w-full flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold text-slate-500">状态分布</h4>
         </div>
         
         <div className="h-40 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                />
                </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold text-slate-800">{completionRate}<span className="text-sm">%</span></span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">完成率</span>
            </div>
         </div>
         
         {/* Legend */}
         <div className="flex flex-wrap justify-center gap-3 mt-2 w-full">
            <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span className="text-xs font-medium text-slate-600">待检</span>
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <span className="text-xs font-medium text-slate-600">检验中</span>
            </div>
             <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium text-slate-600">已完成</span>
            </div>
         </div>
      </div>
    </div>
  );
};