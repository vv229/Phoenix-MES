
import React, { useState } from 'react';
import { X, ShoppingCart, Package, Grid, List, Check, Plus, Minus, AlertCircle, Send } from 'lucide-react';
import { MOCK_BOM } from '../constants';

interface MaterialCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWO: string;
}

// 模拟工序备料状态 (参考配料看板)
const PROCESS_KITTING_STATUS = [
    { id: 'p1', name: '启动 (大件装配)', status: 'COMPLETED', time: '2025-12-10 15:00', code: 'OP10' },
    { id: 'p2', name: '配管', status: 'COMPLETED', time: '2025-12-10 10:04', code: 'OP20' },
    { id: 'p3', name: 'V盘安装', status: 'PENDING', time: '-', code: 'OP30' },
    { id: 'p4', name: '电工', status: 'COMPLETED', time: '2025-12-10 08:06', code: 'OP40' },
    { id: 'p5', name: '整改', status: 'PENDING', time: '-', code: 'OP50' },
];

const KANBAN_MATERIALS = [
  { id: 'K001', name: 'M8*20 螺栓', spec: '不锈钢 304', stock: '200', unit: 'PCS' },
  { id: 'K002', name: 'M8 垫圈', spec: '平垫', stock: '500', unit: 'PCS' },
  { id: 'K003', name: 'M8 螺母', spec: '自锁', stock: '300', unit: 'PCS' },
  { id: 'K004', name: '扎带', spec: '200mm 白色', stock: '1000', unit: '条' },
  { id: 'K005', name: '润滑油', spec: '46# 壳牌', stock: '5', unit: '桶' },
];

export const MaterialCallModal: React.FC<MaterialCallModalProps> = ({ isOpen, onClose, currentWO }) => {
  const [activeTab, setActiveTab] = useState<'WO' | 'KANBAN'>('WO');
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleProcess = (id: string, status: string) => {
    if (status !== 'COMPLETED') return; // 只有完成配料才允许点击
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
      <div className="bg-white w-full max-w-6xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100 shadow-sm">
              <ShoppingCart size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">生产叫料</h2>
              <p className="text-xs text-slate-500 font-medium tracking-wide">工单号: <span className="text-slate-900 font-bold">{currentWO}</span> | 叫料模式: 现场拉动式</p>
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
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'WO' ? 'bg-white text-blue-700 border-b-4 border-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <List size={18} /> 工单工序叫料 (配料状态校验)
          </button>
          <button 
            onClick={() => setActiveTab('KANBAN')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'KANBAN' ? 'bg-white text-blue-700 border-b-4 border-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Grid size={18} /> 看板件叫料 (螺丝/辅材)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden flex bg-slate-50">
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            
            {activeTab === 'WO' ? (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="text-blue-500 shrink-0" size={20} />
                    <p className="text-xs text-blue-700 leading-relaxed font-medium">
                        提示：根据仓库备料看板，仅显示 <span className="font-bold text-green-700">“完成配料”</span> 的工序可发起叫料申请。若工序状态非完成配料，点击将无法选中。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PROCESS_KITTING_STATUS.map(proc => {
                        const isSelected = selectedProcesses.includes(proc.id);
                        const isCompleted = proc.status === 'COMPLETED';
                        
                        return (
                            <div 
                                key={proc.id}
                                onClick={() => toggleProcess(proc.id, proc.status)}
                                className={`
                                    bg-white border-2 rounded-xl p-5 transition-all flex flex-col justify-between min-h-[120px] relative overflow-hidden
                                    ${isCompleted ? 'cursor-pointer hover:shadow-lg hover:border-blue-200' : 'opacity-60 grayscale cursor-not-allowed bg-slate-50/50'}
                                    ${isSelected ? 'border-blue-600 ring-4 ring-blue-50 shadow-md' : 'border-slate-100'}
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{proc.code}</div>
                                            <div className={`text-lg font-black ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{proc.name}</div>
                                        </div>
                                    </div>
                                    
                                    {isCompleted ? (
                                        <div className="text-right">
                                            <div className="bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm inline-block uppercase">完成配料</div>
                                            <div className="text-[9px] text-slate-400 mt-1 font-mono">{proc.time}</div>
                                        </div>
                                    ) : (
                                        <div className="text-right">
                                            <div className="bg-slate-200 text-slate-500 text-[10px] font-black px-2 py-1 rounded inline-block">等待配料...</div>
                                        </div>
                                    )}
                                </div>

                                {isSelected && (
                                    <div className="absolute top-2 right-2">
                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm animate-in zoom-in duration-200">
                                            <Check size={14} strokeWidth={4} />
                                        </div>
                                    </div>
                                )}
                                
                                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold">
                                    <span className="text-slate-400">配送点: 线边仓 A区-02</span>
                                    <span className={isCompleted ? 'text-green-600' : 'text-slate-400'}>
                                        {isCompleted ? '备料就绪' : '备料中'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {KANBAN_MATERIALS.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`bg-white border p-4 rounded-xl relative transition-all cursor-pointer hover:shadow-lg flex flex-col gap-2 ${selectedItems[item.id] ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <Package size={24} className={selectedItems[item.id] ? 'text-blue-600' : 'text-slate-400'} />
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded-full text-slate-500">库存: {item.stock}</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                      <div className="text-[11px] text-slate-500">{item.spec}</div>
                    </div>
                    {selectedItems[item.id] && (
                      <div className="mt-2 flex items-center justify-between bg-blue-50 rounded-lg px-2 py-1.5" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                           <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded border border-blue-200"><Minus size={12}/></button>
                           <span className="font-black text-blue-700 text-xs">{selectedItems[item.id]}</span>
                           <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded border border-blue-200"><Plus size={12}/></button>
                        </div>
                        <span className="text-[10px] font-bold text-blue-600">{item.unit}</span>
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
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 italic">
                        <Package size={48} className="opacity-10 mb-2" />
                        <span className="text-sm">尚未选入项目</span>
                    </div>
                )}
                
                {/* 选中的工序 */}
                {selectedProcesses.map(id => {
                   const p = PROCESS_KITTING_STATUS.find(x => x.id === id);
                   return (
                    <div key={id} className="flex justify-between items-center bg-blue-50 border border-blue-100 p-3 rounded-lg group animate-in slide-in-from-right duration-200">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-blue-500 uppercase">工序申请</span>
                        <span className="font-bold text-blue-900 text-sm truncate w-40">{p?.name}</span>
                      </div>
                      <button onClick={() => toggleProcess(id, 'COMPLETED')} className="p-1 hover:bg-white rounded text-blue-400 hover:text-red-500">
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
                        <span className="text-[10px] font-bold text-slate-400">辅材/看板件</span>
                        <span className="font-bold text-slate-700 text-sm truncate w-40">{m?.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="font-black text-blue-600 text-sm">x{qty}</span>
                         <button onClick={() => toggleItem(id)} className="p-1 hover:bg-white rounded text-slate-300 hover:text-red-500">
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
                  className={`w-full py-4 rounded-xl font-black shadow-xl transition-all flex items-center justify-center gap-2 text-base active:scale-95 ${totalCount > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
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
