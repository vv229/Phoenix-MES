import React from 'react';
import { Task, InspectionStatus, InspectionResult } from '../types';
import { QrCode, ClipboardCheck, Clock, Box, ArrowRight, Factory, Layers, ScanBarcode } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
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
      className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 hover:-translate-y-0.5 transition-all cursor-pointer relative overflow-hidden group h-full flex flex-col"
    >
      {/* Left colored bar based on priority */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.priority === 'High' ? 'bg-red-500' : 'bg-primary-500'}`}></div>

      <div className="flex justify-between items-start mb-3 pl-2">
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 p-2 rounded-lg text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
             <QrCode size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm leading-tight mb-0.5">{task.id}</h3>
            <span className="text-xs text-slate-400 block">{task.createTime}</span>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getStatusColor(task.status)}`}>
          {getStatusLabel(task.status)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-2 gap-x-2 pl-3 text-xs text-slate-600 mb-4 flex-1">
        <div className="col-span-2 flex items-center gap-2">
          <Box size={14} className="text-slate-400 shrink-0"/>
          <span className="font-medium text-slate-800 truncate" title={task.productName}>{task.productName}</span>
        </div>
        
        {/* SN Display */}
        <div className="col-span-2 flex items-center gap-2">
            <ScanBarcode size={14} className="text-slate-400 shrink-0"/>
            <span className="font-mono bg-slate-50 px-1 rounded text-slate-700" title="SN 标签">{task.sn}</span>
        </div>

        <div className="col-span-2 flex items-center gap-2">
            <span className="text-slate-400 shrink-0 w-8">工单</span>
            <span className="font-mono bg-slate-50 px-1 rounded">{task.workOrder}</span>
        </div>
        
        {/* Line Body Display (Replaced Inspector) */}
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-slate-400 shrink-0"/>
          <span className="truncate">线体: {task.line}</span>
        </div>

        <div className="flex items-center gap-2">
           <Factory size={14} className="text-slate-400 shrink-0"/>
           <span className="truncate">{task.workshop}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pl-3 pt-3 border-t border-slate-50 mt-auto">
         <div className="flex items-center gap-2">
            {task.result === InspectionResult.PASS && (
                <span className="text-green-600 text-xs font-bold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md">
                    <ClipboardCheck size={14} /> 合格
                </span>
            )}
            {task.result === InspectionResult.FAIL && (
                <span className="text-red-600 text-xs font-bold flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-md">
                    <ClipboardCheck size={14} /> 不合格
                </span>
            )}
             {task.result === InspectionResult.NONE && (
                <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Clock size={14} /> 等待录入
                </span>
            )}
         </div>
         <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
            <ArrowRight size={16} />
         </div>
      </div>
    </div>
  );
};