import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Task, InspectionStatus } from '../types';

interface StatsDashboardProps {
  tasks: Task[];
}

const COLORS = ['#3b82f6', '#f59e0b', '#10b981']; // Blue (Pending), Amber (In Progress), Green (Done)

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ tasks }) => {
  const pendingCount = tasks.filter(t => t.status === InspectionStatus.PENDING).length;
  const progressCount = tasks.filter(t => t.status === InspectionStatus.IN_PROGRESS).length;
  const completedCount = tasks.filter(t => t.status === InspectionStatus.COMPLETED).length;

  const data = [
    { name: '待检', value: pendingCount },
    { name: '检验中', value: progressCount },
    { name: '已完成', value: completedCount },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Overview Card */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-5 rounded-xl shadow-md text-white">
        <h3 className="text-xs font-medium text-primary-100 mb-1 uppercase tracking-wider">今日任务总量</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{tasks.length}</span>
          <span className="text-sm text-primary-200">单</span>
        </div>
        <div className="mt-4 flex justify-between text-xs font-medium border-t border-white/10 pt-3">
             <div className="text-center">
                <div className="text-primary-200 mb-0.5">待检</div>
                <div className="text-lg">{pendingCount}</div>
             </div>
             <div className="text-center">
                <div className="text-primary-200 mb-0.5">进行中</div>
                <div className="text-lg">{progressCount}</div>
             </div>
             <div className="text-center">
                <div className="text-primary-200 mb-0.5">已完成</div>
                <div className="text-lg">{completedCount}</div>
             </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
         <h4 className="text-xs font-semibold text-slate-500 mb-2 w-full text-left">状态分布</h4>
         <div className="h-40 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
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
                <span className="text-2xl font-bold text-slate-700">{Math.round((completedCount / (tasks.length || 1)) * 100)}%</span>
                <span className="text-[10px] text-slate-400">完成率</span>
            </div>
         </div>
         
         {/* Legend */}
         <div className="flex flex-wrap justify-center gap-3 mt-2">
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs text-slate-500">待检</span>
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-xs text-slate-500">检验中</span>
            </div>
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-slate-500">已完成</span>
            </div>
         </div>
      </div>
    </div>
  );
};