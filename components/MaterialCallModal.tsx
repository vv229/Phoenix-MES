
import React, { useState } from 'react';
import { X, ShoppingCart, Package, Grid, List, Check, Plus, Minus, AlertCircle, Send, ClipboardList, MapPin, Clock } from 'lucide-react';

interface MaterialCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWO: string;
  currentProcess?: string;
  currentStation?: string;
}

// 扩展模拟数据，包含销售单、型号等字段
const WO_PROCESS_DATA = [
    { 
        id: 'p1', 
        soNo: '10165731', 
        soLine: '10', 
        woNo: '10907558', 
        model: '30RB202CPT254', 
        processName: '大件装配', 
        status: 'READY', // 已备料
        deliveryPoint: '线边仓 A区-02', 
        completeTime: '2025-12-12 10:04' 
    },
    { 
        id: 'p2', 
        soNo: '10165731', 
        soLine: '10', 
        woNo: '10907558', 
        model: '30RB202CPT254', 
        processName: '管配', 
        status: 'KITTING', // 备料中
        deliveryPoint: '线边仓 A区-05', 
        completeTime: '-' 
    },
    { 
        id: 'p3', 
        soNo: '10165731', 
        soLine: '10', 
        woNo: '10907558', 
        model: '30RB202CPT254', 
        processName: '钎焊', 
        status: 'PENDING', // 待配料
        deliveryPoint: '线边仓 B区-01', 
        completeTime: '-' 
    },
    { 
        id: 'p4', 
        soNo: '10165731', 
        soLine: '10', 
        woNo: '10907558', 
        model: '30RB202CPT254', 
        processName: '电工', 
        status: 'DELIVERING', // 配送中
        deliveryPoint: '线边仓 A区-02', 
        completeTime: '2025-12-12 09:15' 
    },
];

const KANBAN_MATERIALS = [
  { id: 'K001', name: 'M8*20 螺栓', spec: '不锈钢 304', stock: '200', unit: 'PCS' },
  { id: 'K002', name: 'M8 垫圈', spec: '平垫', stock: '500', unit: 'PCS' },
  { id: 'K003', name: 'M8 螺母', spec: '自锁', stock: '300', unit: 'PCS' },
  { id: 'K004', name: '扎带', spec: '200mm 白色', stock: '1000', unit: '条' },
  { id: 'K005', name: '润滑油', spec: '46# 壳牌', stock: '5', unit: '桶' },
];

export const MaterialCallModal: React.FC<MaterialCallModalProps> = ({ 
    isOpen, 
    onClose, 
    currentWO,
    currentProcess = "大件装配",
    currentStation = "工位-大件装配"
}) => {
  const [activeTab, setActiveTab] = useState<'WO' | 'KANBAN'>('WO');
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);

  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
        case 'READY': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 uppercase">已备料</span>;
        case 'KITTING': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase">备料中</span>;
        case 'DELIVERING': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 uppercase">配送中</span>;
        case 'PENDING': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 uppercase">待配料</span>;
        default: return null;
    }
  };

  const toggleProcess = (id: string, status: string) => {
    if (status !== 'READY') return; 
    setSelectedProcesses(prev => 
        prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleItem = (id: string) => {
    setSelectedItems(prev => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = 1;
      return next;
    });
  };

  const updateQty = (id: string, delta: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 0) + delta)
    }));
  };

  const totalCount = Object.keys(selectedItems).length + selectedProcesses.length;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-7xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header - 包含当前工序工位 */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg">
              <ShoppingCart size={22} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">生产拉动叫料</h2>
              <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold border border-slate-200">工单: {currentWO}</span>
                  <div className="w-px h-3 bg-slate-300"></div>
                  <div className="flex items-center gap-1.5 text-blue-700">
                      <ClipboardList size={12} strokeWidth={3} />
                      <span className="text-xs font-black">当前工序: {currentProcess}</span>
                  </div>
                  <div className="w-px h-3 bg-slate-300"></div>
                  <div className="flex items-center gap-1.5 text-indigo-600">
                      <MapPin size={12} strokeWidth={3} />
                      <span className="text-xs font-black">当前工位: {currentStation}</span>
                  </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-50 border-b border-slate-200 shrink-0">
          <button 
            onClick={() => setActiveTab('WO')}
            className={`flex-1 py-4 text-sm font-black flex items-center justify-center gap-2 transition-all ${activeTab === 'WO' ? 'bg-white text-blue-700 border-b-4 border-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <List size={18} /> 工单工序叫料
          </button>
          <button 
            onClick={() => setActiveTab('KANBAN')}
            className={`flex-1 py-4 text-sm font-black flex items-center justify-center gap-2 transition-all ${activeTab === 'KANBAN' ? 'bg-white text-blue-700 border-b-4 border-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Grid size={18} /> 看板件/辅材叫料
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden flex bg-slate-100/50">
          <div className="flex-1 overflow-hidden flex flex-col p-4">
            
            {activeTab === 'WO' ? (
              <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-blue-50/50 p-3 flex items-center gap-3 border-b border-slate-100 shrink-0">
                    <AlertCircle size={16} className="text-blue-500" />
                    <p className="text-[11px] font-bold text-blue-700">仅支持状态为 <span className="underline">“已备料”</span> 的记录发起叫料。若仓库尚未完成备料，请通过安灯系统催料。</p>
                </div>
                
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="sticky top-0 bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-wider border-b border-slate-200 z-10">
                            <tr>
                                <th className="px-4 py-3 text-center w-12">选择</th>
                                <th className="px-4 py-3">销售单号 / 行号</th>
                                <th className="px-4 py-3">工单号</th>
                                <th className="px-4 py-3">产品型号</th>
                                <th className="px-4 py-3">状态</th>
                                <th className="px-4 py-3">配送点</th>
                                <th className="px-4 py-3">完成配料时间</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {WO_PROCESS_DATA.map(row => {
                                const isSelected = selectedProcesses.includes(row.id);
                                const isReady = row.status === 'READY';
                                
                                return (
                                    <tr 
                                        key={row.id} 
                                        onClick={() => toggleProcess(row.id, row.status)}
                                        className={`group transition-colors ${isReady ? 'cursor-pointer hover:bg-blue-50/30' : 'opacity-50 grayscale bg-slate-50/50'}`}
                                    >
                                        <td className="px-4 py-4 text-center">
                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all mx-auto ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 group-hover:border-blue-400'}`}>
                                                {isSelected && <Check size={14} strokeWidth={4} />}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="font-mono font-bold text-slate-800 text-xs">{row.soNo} <span className="text-slate-400">/</span> {row.soLine}</div>
                                        </td>
                                        <td className="px-4 py-4 font-mono text-slate-600 text-xs font-bold">{row.woNo}</td>
                                        <td className="px-4 py-4">
                                            <div className="font-black text-slate-800 text-xs">{row.model}</div>
                                            <div className="text-[10px] text-slate-400 font-bold">{row.processName}</div>
                                        </td>
                                        <td className="px-4 py-4">{getStatusBadge(row.status)}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                                <MapPin size={12} className="text-slate-300" />
                                                {row.deliveryPoint}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 font-bold">
                                                <Clock size={12} className="text-slate-300" />
                                                {row.completeTime}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                {KANBAN_MATERIALS.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`bg-white border-2 p-4 rounded-xl relative transition-all cursor-pointer hover:shadow-lg flex flex-col gap-2 ${selectedItems[item.id] ? 'border-blue-500 ring-4 ring-blue-50 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className={`p-2 rounded-lg ${selectedItems[item.id] ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Package size={20} />
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 bg-slate-900 text-white rounded shadow-sm">库存: {item.stock}</span>
                    </div>
                    <div>
                      <div className="font-black text-slate-800 text-sm tracking-tight">{item.name}</div>
                      <div className="text-[11px] text-slate-500 font-bold">{item.spec}</div>
                    </div>
                    {selectedItems[item.id] && (
                      <div className="mt-2 flex items-center justify-between bg-blue-50 rounded-lg px-2 py-1.5 animate-in slide-in-from-bottom-1 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                           <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-md border border-blue-200 shadow-sm active:scale-95"><Minus size={14}/></button>
                           <span className="font-black text-blue-700 text-sm px-1 min-w-[20px] text-center">{selectedItems[item.id]}</span>
                           <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-md border border-blue-200 shadow-sm active:scale-95"><Plus size={14}/></button>
                        </div>
                        <span className="text-[10px] font-black text-blue-600 uppercase">{item.unit}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel Summary */}
          <div className="w-80 border-l border-slate-200 bg-white p-5 flex flex-col shrink-0">
             <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 text-base uppercase tracking-tight">
                <ShoppingCart size={20} className="text-blue-600"/> 叫料明细 ({totalCount})
             </h3>
             
             <div className="flex-1 overflow-y-auto space-y-3 mb-6 no-scrollbar">
                {totalCount === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 italic opacity-40">
                        <Package size={48} className="mb-2" />
                        <span className="text-sm font-bold uppercase tracking-widest">请选择项目</span>
                    </div>
                )}
                
                {/* 选中的工序 */}
                {selectedProcesses.map(id => {
                   const p = WO_PROCESS_DATA.find(x => x.id === id);
                   return (
                    <div key={id} className="flex justify-between items-center bg-blue-50 border border-blue-100 p-3 rounded-lg group animate-in slide-in-from-right duration-200">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-blue-500 uppercase">工序拉动</span>
                        <span className="font-bold text-blue-900 text-sm truncate w-40">{p?.processName}</span>
                        <span className="text-[9px] text-blue-400 font-mono">{p?.woNo}</span>
                      </div>
                      <button onClick={() => toggleProcess(id, 'READY')} className="p-1.5 bg-white border border-blue-100 rounded-md text-blue-400 hover:text-red-500 hover:border-red-100 shadow-sm transition-all">
                        <X size={16} />
                      </button>
                    </div>
                   );
                })}

                {/* 选中的物料 */}
                {Object.entries(selectedItems).map(([id, qty]) => {
                  const m = KANBAN_MATERIALS.find(x => x.id === id);
                  return (
                    <div key={id} className="flex justify-between items-center bg-slate-50 border border-slate-100 p-3 rounded-lg animate-in slide-in-from-right duration-200">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">物料补充</span>
                        <span className="font-bold text-slate-700 text-sm truncate w-40">{m?.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">{m?.unit}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="font-black text-blue-600 text-sm">x{qty}</span>
                         <button onClick={() => toggleItem(id)} className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-300 hover:text-red-500 hover:border-red-100 shadow-sm transition-all">
                            <X size={16} />
                         </button>
                      </div>
                    </div>
                  );
                })}
             </div>

             <div className="space-y-3 pt-4 border-t border-slate-100">
                 <button 
                  disabled={totalCount === 0}
                  className={`w-full py-4 rounded-xl font-black shadow-xl transition-all flex items-center justify-center gap-3 text-base active:scale-95 ${totalCount > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                 >
                   <Send size={20}/> 发起配送拉动
                 </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
