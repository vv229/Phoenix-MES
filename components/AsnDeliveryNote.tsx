import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Home, Search, Layers, Box, CheckCircle2, UserCircle, MapPin, 
  Truck, ArrowRightLeft, ClipboardList, Printer, ShoppingCart, Clock, Calendar, X
} from 'lucide-react';
import { CarrierLogo } from './CarrierLogo';
import { MOCK_ASN_DELIVERY_TASKS } from '../constants';
import { AsnDeliveryTask, PickingItem } from '../types';

interface AsnDeliveryNoteProps {
  onBack: () => void;
}

export const AsnDeliveryNote: React.FC<AsnDeliveryNoteProps> = ({ onBack }) => {
  const [tasks, setTasks] = useState<AsnDeliveryTask[]>(MOCK_ASN_DELIVERY_TASKS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pickingDateFilter, setPickingDateFilter] = useState('');
  const [selectedTask, setSelectedTask] = useState<AsnDeliveryTask | null>(null);
  
  // Printing state
  const [printingId, setPrintingId] = useState<string | null>(null);

  const handlePrint = (taskId: string) => {
    setPrintingId(taskId);
    setTimeout(() => {
      setPrintingId(null);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'PRINTED' } : t));
    }, 3000);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesDate = pickingDateFilter ? task.pickingTime.startsWith(pickingDateFilter) : true;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'UNPRINTED': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'PRINTED': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'UNPRINTED': return '未打印';
      case 'PRINTED': return '已打印';
      default: return status;
    }
  };



  return (
    <div className="h-screen w-full bg-slate-100 flex flex-col font-sans overflow-hidden text-slate-800">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"><ChevronLeft size={26} strokeWidth={2.5} /></button>
            <span className="text-slate-800 font-bold text-2xl tracking-wide">ASN送货单</span>
        </div>
        <div className="flex items-center gap-4">
            <CarrierLogo className="h-7 w-auto" />
            <button onClick={onBack} className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"><Home size={24} /></button>
        </div>
      </header>

      <div className="px-6 py-4 flex flex-wrap items-center justify-between bg-white/50 border-b border-slate-200 gap-4">
           <div className="flex items-center gap-3 flex-wrap">
              <div className="relative w-64">
                 <input 
                    type="text" 
                    placeholder="搜索 ASN单号..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm h-10"
                 />
                 <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>

              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1 shadow-sm h-10">
                 <Printer size={16} className="text-slate-400" />
                 <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-sm font-bold text-slate-700 outline-none h-full min-w-[80px]"
                 >
                    <option value="">全部状态</option>
                    <option value="UNPRINTED">未打印</option>
                    <option value="PRINTED">已打印</option>
                 </select>
              </div>

              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 h-10">
                  <Calendar size={16} className="text-slate-400" />
                  <input 
                      type="date"
                      value={pickingDateFilter}
                      onChange={(e) => setPickingDateFilter(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400"
                  />
              </div>
           </div>

           <div className="flex gap-4">
               <div className="flex flex-col items-center">
                   <span className="text-[10px] font-black text-slate-400 uppercase">未打印</span>
                   <span className="text-lg font-black text-amber-600">{tasks.filter(t => t.status === 'UNPRINTED').length}</span>
               </div>
               <div className="w-px h-8 bg-slate-300"></div>
               <div className="flex flex-col items-center">
                   <span className="text-[10px] font-black text-slate-400 uppercase">已打印</span>
                   <span className="text-lg font-black text-green-600">{tasks.filter(t => t.status === 'PRINTED').length}</span>
               </div>
           </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="overflow-x-auto min-h-[500px]">
                 <table className="w-full text-left border-collapse whitespace-nowrap">
                     <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 sticky top-0 z-10">
                         <tr>
                             <th className="p-4">ASN单号</th>
                             <th className="p-4">拣配员</th>
                             <th className="p-4 text-center">状态</th>
                             <th className="p-4 text-center">物料件数</th>
                             <th className="p-4">管理员</th>
                             <th className="p-4">拣配任务号</th>
                             <th className="p-4">源库位</th>
                             <th className="p-4">目标库位</th>
                             <th className="p-4">拣配时间</th>
                             <th className="p-4 text-center">操作</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 text-sm">
                         {filteredTasks.length > 0 ? filteredTasks.map(task => (
                             <tr key={task.id} className="hover:bg-blue-50/50 transition-colors">
                                 <td className="p-4">
                                     <button 
                                        onClick={() => setSelectedTask(task)}
                                        className="font-mono font-black text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                     >
                                         <ClipboardList size={14} className="text-blue-400" />
                                         {task.id}
                                     </button>
                                 </td>
                                 <td className="p-4 font-bold text-slate-700">
                                     <div className="flex items-center gap-1.5">
                                         <UserCircle size={14} className="text-slate-400"/>
                                         {task.picker}
                                     </div>
                                 </td>
                                 <td className="p-4 text-center">
                                     <span className={`px-2 py-0.5 text-[10px] font-black rounded border inline-flex items-center gap-1 ${getStatusStyle(task.status)}`}>
                                         {task.status === 'PRINTED' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                         {getStatusLabel(task.status)}
                                     </span>
                                 </td>
                                 <td className="p-4 text-center font-black text-slate-700">{task.itemCount}</td>
                                 <td className="p-4 font-bold text-slate-600">{task.cart || '01'}</td>
                                 <td className="p-4 text-slate-600">{task.inventoryLoc}</td>
                                 <td className="p-4 font-bold text-slate-600 max-w-[120px] truncate" title={task.sourceLoc}>{task.sourceLoc}</td>
                                 <td className="p-4 font-bold text-teal-700 max-w-[120px] truncate" title={task.targetLoc}>{task.targetLoc}</td>
                                 <td className="p-4 font-mono text-slate-500 text-xs">{task.pickingTime}</td>
                                 <td className="p-4 text-center">
                                     <button
                                         onClick={() => handlePrint(task.id)}
                                         disabled={printingId === task.id}
                                         className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                                             printingId === task.id 
                                                 ? 'bg-slate-100 text-slate-400 cursor-wait' 
                                                 : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 active:bg-indigo-200'
                                         }`}
                                     >
                                         <span className="flex items-center gap-1 justify-center">
                                             <Printer size={12} />
                                             打印
                                         </span>
                                     </button>
                                 </td>
                             </tr>
                         )) : (
                             <tr>
                                 <td colSpan={10} className="py-16 text-center text-slate-400">
                                     <ClipboardList size={48} className="opacity-20 mx-auto mb-3" />
                                     <p className="font-bold">没有找到匹配的ASN单</p>
                                 </td>
                             </tr>
                         )}
                     </tbody>
                 </table>
             </div>
         </div>
      </div>

      {/* Printing Modal */}
      {printingId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-sm w-full mx-4 border border-slate-200 p-8 flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4 relative">
                 <Printer size={32} className="text-indigo-600 relative z-10" />
                 <div className="absolute inset-0 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
             </div>
             <h3 className="text-xl font-black text-slate-800 tracking-tight text-center">
               文档打印中
             </h3>
             <p className="text-sm font-bold text-slate-500 mt-2 text-center">
               正在处理单据 {printingId}...
             </p>
          </div>
        </div>
      )}

      {/* ASN Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
            <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0">
              <div className="flex-1 min-w-0">
                  <div className="flex flex-col">
                      <span className="text-xl font-black tracking-tight tracking-wide truncate">ASN明细 - {selectedTask.id}</span>
                      <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest hidden sm:block">ASN DETAILS</span>
                  </div>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors shrink-0 ml-4">
                  <X size={24} strokeWidth={2.5} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-wrap justify-between gap-y-4">
                    <div className="flex flex-col w-1/2 sm:w-auto">
                        <span className="text-[10px] uppercase font-black text-slate-400 mb-1">拣配员</span>
                        <span className="font-bold text-slate-700">{selectedTask.picker}</span>
                    </div>
                    <div className="flex flex-col w-1/2 sm:w-auto">
                        <span className="text-[10px] uppercase font-black text-slate-400 mb-1">管理员 / 拣配任务号</span>
                        <span className="font-bold text-slate-700">{selectedTask.cart || '01'} / {selectedTask.inventoryLoc}</span>
                    </div>
                    <div className="flex flex-col w-1/2 sm:w-auto mt-4 sm:mt-0">
                        <span className="text-[10px] uppercase font-black text-slate-400 mb-1">源库位 / 目标库位</span>
                        <span className="font-bold text-slate-700">{selectedTask.sourceLoc} → {selectedTask.targetLoc}</span>
                    </div>
                    <div className="flex flex-col w-1/2 sm:w-auto mt-4 sm:mt-0">
                        <span className="text-[10px] uppercase font-black text-slate-400 mb-1">拣配时间</span>
                        <span className="font-bold text-slate-700">{selectedTask.pickingTime}</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                        <h3 className="font-black text-slate-800 flex items-center gap-2">
                            <Box size={18} className="text-blue-600"/> 已拣配物料明细
                        </h3>
                    </div>
                    {(selectedTask.items && selectedTask.items.length > 0) ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500">
                                    <tr>
                                        <th className="p-4">物料编码</th>
                                        <th className="p-4">物料名称</th>
                                        <th className="p-4 text-right">已拣配数量</th>
                                        <th className="p-4">单位</th>
                                        <th className="p-4">来源库位</th>
                                        <th className="p-4">拣配时间</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {selectedTask.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-mono font-black text-blue-700">{item.materialCode}</td>
                                            <td className="p-4 font-bold text-slate-700 max-w-[200px] truncate" title={item.description}>{item.description}</td>
                                            <td className="p-4 text-right font-black text-green-600">{item.qty}</td>
                                            <td className="p-4 text-slate-500 font-bold">{item.unit}</td>
                                            <td className="p-4 text-slate-600 font-bold">{item.sourceLoc}</td>
                                            <td className="p-4 text-slate-500">{item.pickedTime}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                            <Box size={48} className="opacity-20 mb-4" />
                            <p className="text-lg font-bold">无明细数据</p>
                        </div>
                    )}
                </div>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0 rounded-b-xl">
               <button 
                  onClick={() => setSelectedTask(null)}
                  className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors active:scale-95"
               >
                  关闭
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
