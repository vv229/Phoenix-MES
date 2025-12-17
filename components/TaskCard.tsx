import React from 'react';
import { Task, InspectionStatus, InspectionResult } from '../types';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  showProcess?: boolean; // Control visibility of process field
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, showProcess = false }) => {
  const getStatusColor = (status: InspectionStatus) => {
    switch (status) {
      case InspectionStatus.PENDING: return 'bg-blue-50 text-blue-700 border-blue-200';
      case InspectionStatus.IN_PROGRESS: return 'bg-amber-50 text-amber-700 border-amber-200';
      case InspectionStatus.COMPLETED: return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusLabel = (status: InspectionStatus) => {
    switch (status) {
      case InspectionStatus.PENDING: return '待检';
      case InspectionStatus.IN_PROGRESS: return '检验中';
      case InspectionStatus.COMPLETED: return '已完成';
      default: return status;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all cursor-pointer relative overflow-hidden group h-full flex flex-col"
    >
      {/* Left colored bar based on priority */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.priority === 'High' ? 'bg-red-500' : 'bg-blue-500'}`}></div>

      {/* Header: Product Name & Status Badge */}
      <div className="flex justify-between items-start mb-4 pl-2">
        <h3 className="font-bold text-slate-800 text-sm leading-tight pr-2 line-clamp-2 min-h-[2.5rem] flex items-center">
            {task.productName}
        </h3>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border shrink-0 ${getStatusColor(task.status)}`}>
          {getStatusLabel(task.status)}
        </span>
      </div>

      {/* Details Grid: Key-Value Pairs */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 pl-3 text-xs mb-2 flex-1">
        
        {/* Work Order */}
        <div className="flex flex-col gap-0.5">
            <span className="text-slate-400 font-medium">工单号</span>
            <span className="font-bold text-slate-700 font-mono tracking-tight">{task.workOrder}</span>
        </div>

        {/* Serial Number */}
        <div className="flex flex-col gap-0.5">
            <span className="text-slate-400 font-medium">序列号</span>
            <span className="font-bold text-slate-700 font-mono tracking-tight truncate" title={task.sn}>{task.sn}</span>
        </div>

        {/* SO/NO */}
        <div className="flex flex-col gap-0.5">
            <span className="text-slate-400 font-medium">SO/NO</span>
            <span className="font-bold text-slate-700 font-mono tracking-tight truncate">{task.salesOrder}/{task.lineNo}</span>
        </div>

        {/* Line */}
        <div className="flex flex-col gap-0.5">
            <span className="text-slate-400 font-medium">线体</span>
            <span className="font-bold text-slate-700 truncate">{task.line}</span>
        </div>

        {/* Process (Conditional Field) */}
        {showProcess && task.processName && (
             <div className="flex flex-col gap-0.5">
                <span className="text-slate-400 font-medium">工序</span>
                <span className="font-bold text-slate-700 truncate">{task.processName}</span>
            </div>
        )}

      </div>
    </div>
  );
};