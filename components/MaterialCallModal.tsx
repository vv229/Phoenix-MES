
import React, { useState, useRef, useEffect } from 'react';
import { X, ShoppingCart, Package, Grid, List, Check, Plus, Minus, AlertCircle, Send, ClipboardList, MapPin, Clock, ScanLine, Barcode, Hash } from 'lucide-react';

interface MaterialCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWO: string;
  currentProcess?: string;
  currentStation?: string;
}

// 模拟当前工位/工序下的任务队列 (可能来自多个工单或销售单)
const STATION_QUEUE_DATA = [
    { 
        id: 'row-1', 
        soNo: '10165731', 
        soLine: '10', 
        woNo: '10907558', 
        model: '30RB202CPT254', 
        status: 'READY', // 已备料
        deliveryPoint: '线边仓 A区-02', 
        completeTime: '2025-12-12 10:04' 
    },
    { 
        id: 'row-2', 
        soNo: '10165731', 
        soLine: '20', 
        woNo: '10907559', 
        model: '30RB202CPT254', 
        status: 'KITTING', // 备料中
        deliveryPoint: '线边仓 A区-05', 
        completeTime: '-' 
    },
    { 
        id: 'row-3', 
        soNo: '20013945', 
        soLine: '10', 
        woNo: '10907560', 
        model: '30KAV0800A', 
        status: 'PENDING', // 待配料
        deliveryPoint: '线边仓 B区-01', 
        completeTime: '-' 
    },
    { 
        id: 'row-4', 
        soNo: '10165800', 
        soLine: '10', 
        woNo: '10908000', 
        model: '19DV-800-45', 
        status: 'READY', // 已备料
        deliveryPoint: '线边仓 A区-01', 
        completeTime: '2025-12-12 11:20' 
    },
];

// 模拟看板件主数据
const MOCK_MATERIAL_DB: Record<string, any> = {
    "M8-BOLT-304": { name: "M8*20 螺栓", spec: "不锈钢 304", stock: 200, unit: "PCS" },
    "M8-NUT-LOCK": { name: "M8 螺母", spec: "自锁", stock: 300, unit: "PCS" },
    "OIL-SHELL-46": { name: "润滑油", spec: "46# 壳牌", stock: 5, unit: "桶" },
    "TIE-200W": { name: "扎带", spec: "200mm 白色", stock: 1000, unit: "条" },
};

export const MaterialCallModal: React.FC<MaterialCallModalProps> = ({ 
    isOpen, 
    onClose, 
    currentWO,
    currentProcess = "大件装配",
    currentStation = "工位-大件装配"
}) => {
  const [activeTab, setActiveTab] = useState<'WO' | 'KANBAN'>('WO');
  
  // Tab 1 状态
  const [selectedQueueIds, setSelectedQueueIds] = useState<string[]>([]);
  
  // Tab 2 状态
  const [barcode, setBarcode] = useState('');
  const [scannedMaterial, setScannedMaterial] = useState<any>(null);
  const [callQty, setCallQty] = useState(1);
  const [callStation, setCallStation] = useState(currentStation);

  // 总清单
  const [callList, setCallList] = useState<any[]>([]);

  const scanInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === 'KANBAN') {
        setTimeout(() => scanInputRef.current?.focus(), 100);
    }
  }, [activeTab]);

  if (!isOpen) return null;

  // --- 业务逻辑 ---

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    const material = MOCK_MATERIAL_DB[barcode.toUpperCase()];
    if (material) {
        setScannedMaterial(material);
        setCallQty(1);
    } else {
        alert("未找到该物料，请尝试输入: M8-BOLT-304 或 OIL-SHELL-46");
    }
    setBarcode('');
  };

  const addToCallList = () => {
    if (!scannedMaterial) return;
    const newItem = {
        type: 'KANBAN',
        id: Date.now().toString(),
        name: scannedMaterial.name,
        qty: callQty,
        unit: scannedMaterial.unit,
        station: callStation,
        code: scannedMaterial.spec
    };
    setCallList([...callList, newItem]);
    setScannedMaterial(null);
  };

  const toggleQueueItem = (row: any) => {
    if (row.status !== 'READY') return;
    const isSelected = selectedQueueIds.includes(row.id);
    if (isSelected) {
        setSelectedQueueIds(prev => prev.filter(id => id !== row.id));
        setCallList(prev => prev.filter(item => item.id !== row.id));
    } else {
        setSelectedQueueIds(prev => [...prev, row.id]);
        setCallList(prev => [...prev, {
            type: 'WO',
            id: row.id,
            name: row.model,
            sub: row.woNo,
            qty: 1,
            unit: 'SET'
        }]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
        case 'READY': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">已备料</span>;
        case 'KITTING': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">备料中</span>;
        case 'DELIVERING': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">配送中</span>;
        case 'PENDING': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">待配料</span>;
        default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-7xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header - 保持当前环境上下文 */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg">
              <ShoppingCart size={22} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">生产拉动叫料</h2>
              <div className="flex items-center gap-3 mt-0.5">
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
            <List size={18} /> 工单工序叫料 (当前工位队列)
          </button>
          <button 
            onClick={() => setActiveTab('KANBAN')}
            className={`flex-1 py-4 text-sm font-black flex items-center justify-center gap-2 transition-all ${activeTab === 'KANBAN' ? 'bg-white text-blue-700 border-b-4 border-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ScanLine size={18} /> 看板件/辅材叫料 (扫码录入)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden flex bg-slate-100/50">
          <div className="flex-1 overflow-hidden flex flex-col p-4">
            
            {activeTab === 'WO' ? (
              <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-blue-50/50 p-3 flex items-center gap-3 border-b border-slate-100 shrink-0">
                    <AlertCircle size={16} className="text-blue-500" />
                    <p className="text-[11px] font-bold text-blue-700 italic">
                        注意：此处仅列出本工序相关的任务。请根据实物备料状态勾选发起拉动配送。
                    </p>
                </div>
                
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="sticky top-0 bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-wider border-b border-slate-200 z-10">
                            <tr>
                                <th className="px-4 py-3 text-center w-12">选择</th>
                                <th className="px-4 py-3">销售单号 / 行号</th>
                                <th className="px-4 py-3">工单号</th>
                                <th className="px-4 py-3">产品型号</th>
                                <th className="px-4 py-3 text-center">状态</th>
                                <th className="px-4 py-3">配送点</th>
                                <th className="px-4 py-3">完成配料时间</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {STATION_QUEUE_DATA.map(row => {
                                const isSelected = selectedQueueIds.includes(row.id);
                                const isReady = row.status === 'READY';
                                
                                return (
                                    <tr 
                                        key={row.id} 
                                        onClick={() => toggleQueueItem(row)}
                                        className={`group transition-colors ${isReady ? 'cursor-pointer hover:bg-blue-50/30' : 'opacity-40 grayscale bg-slate-50/50'}`}
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
                                        <td className="px-4 py-4 font-black text-slate-800 text-xs">{row.model}</td>
                                        <td className="px-4 py-4 text-center">{getStatusBadge(row.status)}</td>
                                        <td className="px-4 py-4 text-xs font-bold text-slate-600">{row.deliveryPoint}</td>
                                        <td className="px-4 py-4 text-[11px] font-mono text-slate-500 font-bold italic">{row.completeTime}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 items-center pt-8">
                  {/* 扫码区域 */}
                  <form onSubmit={handleScan} className="w-full max-w-2xl">
                      <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-slate-300 shadow-sm flex flex-col items-center gap-6">
                          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center animate-pulse">
                              <Barcode size={32} />
                          </div>
                          <div className="text-center">
                              <h3 className="text-lg font-black text-slate-800">扫描看板物料条码</h3>
                              <p className="text-sm text-slate-400 mt-1">系统将自动识别物料批次与规格</p>
                          </div>
                          <div className="relative w-full">
                              <input 
                                ref={scanInputRef}
                                type="text" 
                                value={barcode}
                                onChange={e => setBarcode(e.target.value)}
                                placeholder="等待扫描录入..."
                                className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-xl px-12 text-center font-mono text-xl font-bold text-blue-700 focus:bg-white focus:border-blue-600 outline-none transition-all"
                              />
                              <ScanLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                          </div>
                          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">支持物料批次码/KANBAN ID</p>
                      </div>
                  </form>

                  {/* 录入详情 (仅在扫码后显示) */}
                  {scannedMaterial && (
                      <div className="w-full max-w-2xl bg-white rounded-2xl border border-blue-200 shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300">
                          <div className="flex justify-between items-start">
                              <div className="flex gap-4">
                                  <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                                      <Package size={24} />
                                  </div>
                                  <div>
                                      <h4 className="text-xl font-black text-slate-800">{scannedMaterial.name}</h4>
                                      <p className="text-sm font-bold text-slate-500">{scannedMaterial.spec}</p>
                                  </div>
                              </div>
                              <span className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded font-black">最低叫料数量: {scannedMaterial.stock}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-400 uppercase flex items-center gap-1"><MapPin size={12}/> 配送至工位</label>
                                  <select 
                                    value={callStation}
                                    onChange={e => setCallStation(e.target.value)}
                                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-lg px-3 font-bold text-slate-800 focus:outline-none"
                                  >
                                      <option>{currentStation}</option>
                                      <option>工位-辅件区01</option>
                                      <option>工位-装配区A</option>
                                  </select>
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-400 uppercase flex items-center gap-1"><Hash size={12}/> 叫料数量 ({scannedMaterial.unit})</label>
                                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg h-12 px-2">
                                      <button onClick={() => setCallQty(q => Math.max(1, q - 1))} className="w-10 h-8 bg-white border border-slate-200 rounded flex items-center justify-center active:bg-slate-100 transition-colors"><Minus size={16}/></button>
                                      <input 
                                        type="number" 
                                        value={callQty}
                                        onChange={e => setCallQty(parseInt(e.target.value) || 1)}
                                        className="flex-1 bg-transparent text-center font-black text-lg focus:outline-none" 
                                      />
                                      <button onClick={() => setCallQty(q => q + 1)} className="w-10 h-8 bg-white border border-slate-200 rounded flex items-center justify-center active:bg-slate-100 transition-colors"><Plus size={16}/></button>
                                  </div>
                              </div>
                          </div>

                          <div className="flex gap-3">
                              <button onClick={() => setScannedMaterial(null)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">取消</button>
                              <button onClick={addToCallList} className="flex-[2] py-3 bg-[#0A2EF5] text-white font-black rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all">加入叫料清单</button>
                          </div>
                      </div>
                  )}
              </div>
            )}
          </div>

          {/* Right Panel Summary */}
          <div className="w-80 border-l border-slate-200 bg-white p-5 flex flex-col shrink-0">
             <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 text-base uppercase tracking-tight">
                <ShoppingCart size={20} className="text-blue-600"/> 叫料确认 ({callList.length})
             </h3>
             
             <div className="flex-1 overflow-y-auto space-y-3 mb-6 no-scrollbar">
                {callList.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 italic opacity-40">
                        <Package size={48} className="mb-2" />
                        <span className="text-sm font-bold uppercase tracking-widest text-center">暂无待叫料项目<br/><span className="text-[10px]">请从左侧勾选或扫码</span></span>
                    </div>
                )}
                
                {callList.map((item) => (
                    <div key={item.id} className={`flex justify-between items-center border p-3 rounded-lg group animate-in slide-in-from-right duration-200 ${item.type === 'WO' ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex flex-col min-w-0">
                        <span className={`text-[10px] font-black uppercase ${item.type === 'WO' ? 'text-blue-500' : 'text-slate-400'}`}>
                            {item.type === 'WO' ? '工序拉动' : '辅材配送'}
                        </span>
                        <span className="font-bold text-slate-800 text-sm truncate">{item.name}</span>
                        {item.sub && <span className="text-[9px] text-slate-400 font-mono">{item.sub}</span>}
                        {item.station && <span className="text-[9px] text-indigo-500 font-bold">{item.station}</span>}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                         <span className="font-black text-blue-600 text-sm">x{item.qty}</span>
                         <button 
                            onClick={() => {
                                if (item.type === 'WO') setSelectedQueueIds(prev => prev.filter(id => id !== item.id));
                                setCallList(prev => prev.filter(i => i.id !== item.id));
                            }} 
                            className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-300 hover:text-red-500 hover:border-red-100 shadow-sm transition-all"
                         >
                            <X size={14} />
                         </button>
                      </div>
                    </div>
                ))}
             </div>

             <div className="space-y-3 pt-4 border-t border-slate-100">
                 <button 
                  disabled={callList.length === 0}
                  className={`w-full py-4 rounded-xl font-black shadow-xl transition-all flex items-center justify-center gap-3 text-base active:scale-95 ${callList.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                 >
                   <Send size={20}/> 确认发起拉动配送
                 </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
