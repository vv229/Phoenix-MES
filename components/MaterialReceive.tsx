import React, { useState } from 'react';
import { ChevronLeft, Home, ScanLine, PackageCheck, AlertCircle, FileCheck2, Box, Layers, ListTodo, Plus, X } from 'lucide-react';
import { CarrierLogo } from './CarrierLogo';

interface MaterialReceiveProps {
  onBack: () => void;
}

export const MaterialReceive: React.FC<MaterialReceiveProps> = ({ onBack }) => {
  const [receiveType, setReceiveType] = useState<'TRANSFER' | 'MRP' | 'JIT' | 'KANBAN'>('TRANSFER');
  const [asnNo, setAsnNo] = useState('');
  const [boxNo, setBoxNo] = useState('');
  const [jitCard, setJitCard] = useState('');
  const [scannedJitCards, setScannedJitCards] = useState<string[]>([]);
  const [warehouse, setWarehouse] = useState('606');
  const [isScanning, setIsScanning] = useState(false);
  const [resultMessage, setResultMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleJitCardAdd = () => {
    if (!jitCard.trim()) return;
    if (!scannedJitCards.includes(jitCard.trim())) {
      setScannedJitCards(prev => [jitCard.trim(), ...prev]);
    }
    setJitCard('');
    setTimeout(() => {
        document.getElementById('jitCardInput')?.focus();
    }, 10);
  };

  const removeJitCard = (card: string) => {
    setScannedJitCards(prev => prev.filter(c => c !== card));
  };

  const handleScanAndSubmit = () => {
    if (!warehouse.trim()) {
      setResultMessage({ type: 'error', text: '请先选择仓库' });
      return;
    }

    if (!asnNo.trim()) {
      setResultMessage({ type: 'error', text: '请先输入或扫描ASN单号' });
      return;
    }

    if (receiveType === 'KANBAN' && !boxNo.trim()) {
      setResultMessage({ type: 'error', text: '请先输入或扫描箱号' });
      return;
    }

    if (receiveType === 'JIT' && scannedJitCards.length === 0) {
      if (jitCard.trim()) {
        handleJitCardAdd();
        return;
      }
      setResultMessage({ type: 'error', text: '请先扫描至少一个JIT Card条码' });
      return;
    }
    
    setIsScanning(true);
    setResultMessage(null);
    
    // Mock SAP API call
    setTimeout(() => {
      setIsScanning(false);
      const typeLabel = receiveType === 'TRANSFER' ? '移库接收' : receiveType === 'MRP' ? 'MRP收货' : receiveType === 'JIT' ? 'JIT收货' : 'kanban收货';
      const detail = receiveType === 'KANBAN' ? `[${asnNo}] / 箱号 [${boxNo}]` : receiveType === 'JIT' ? `[${asnNo}] / JIT Cards [${scannedJitCards.length + (jitCard.trim() ? 1 : 0)}张]` : `[${asnNo}]`;
      setResultMessage({ type: 'success', text: `[${typeLabel}] 操作成功: 单据 ${detail} 入库到仓库 [${warehouse}] (SAP接口已同步)` });
      setAsnNo('');
      if (receiveType === 'KANBAN') {
        setBoxNo('');
      }
      if (receiveType === 'JIT') {
        setJitCard('');
        setScannedJitCards([]);
      }
    }, 1500);
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col font-sans overflow-hidden text-slate-800">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm shrink-0 z-10">
            <div className="flex items-center gap-3">
                 <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"><ChevronLeft size={26} strokeWidth={2.5} /></button>
                <span className="text-slate-800 font-bold text-2xl tracking-wide">物料接收</span>
            </div>
            <div className="flex items-center gap-4">
                <CarrierLogo className="h-7 w-auto" />
                <button onClick={onBack} className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"><Home size={24} /></button>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-start pt-16">
            <div className="bg-white max-w-3xl w-full rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50 relative flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                            <PackageCheck size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800">物料接收</h2>
                            <p className="text-sm text-slate-500 font-medium mt-0.5">请选择接收类型并扫描接收票据</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">收货仓库</label>
                        <select 
                            value={warehouse}
                            onChange={(e) => setWarehouse(e.target.value)}
                            className="h-10 w-36 bg-white border border-slate-200 px-3 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer shadow-sm"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em', paddingRight: '2.5rem' }}
                        >
                            <option value="606">606 - 原料仓</option>
                            <option value="607">607 - 半成品仓</option>
                            <option value="608">608 - 成品仓</option>
                        </select>
                    </div>
                </div>

                <div className="p-10 flex flex-col gap-6">
                    {/* Toggle */}
                    <div className="grid grid-cols-4 bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-full shadow-inner gap-1">
                        <button 
                            onClick={() => {
                                setReceiveType('TRANSFER');
                                setResultMessage(null);
                            }}
                            className={`py-3 rounded-lg font-bold text-sm transition-all flex justify-center items-center gap-2 ${receiveType === 'TRANSFER' ? 'bg-white text-teal-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <FileCheck2 size={18} />
                            移库接收
                        </button>
                        <button 
                            onClick={() => {
                                setReceiveType('MRP');
                                setResultMessage(null);
                            }}
                            className={`py-3 rounded-lg font-bold text-sm transition-all flex justify-center items-center gap-2 ${receiveType === 'MRP' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <Layers size={18} />
                            MRP收货
                        </button>
                        <button 
                            onClick={() => {
                                setReceiveType('JIT');
                                setResultMessage(null);
                            }}
                            className={`py-3 rounded-lg font-bold text-sm transition-all flex justify-center items-center gap-2 ${receiveType === 'JIT' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <ListTodo size={18} />
                            JIT收货
                        </button>
                        <button 
                            onClick={() => {
                                setReceiveType('KANBAN');
                                setResultMessage(null);
                            }}
                            className={`py-3 rounded-lg font-bold text-sm transition-all flex justify-center items-center gap-2 ${receiveType === 'KANBAN' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <Box size={18} />
                            kanban收货
                        </button>
                    </div>

                    {/* Input Area */}
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">ASN单据号</label>
                            <div className="flex items-stretch gap-3 h-14">
                                <div className="relative flex-1">
                                    <input 
                                        type="text" 
                                        value={asnNo}
                                        onChange={(e) => setAsnNo(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                if (receiveType === 'KANBAN' && !boxNo) {
                                                    document.getElementById('boxNoInput')?.focus();
                                                } else if (receiveType === 'JIT' && !jitCard) {
                                                    document.getElementById('jitCardInput')?.focus();
                                                } else {
                                                    handleScanAndSubmit();
                                                }
                                            }
                                        }}
                                        placeholder="输入或扫描ASN单据号..."
                                        className="w-full h-full bg-white border-2 border-slate-200 pl-4 pr-12 rounded-xl text-xl font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-slate-400"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        <ScanLine size={24} />
                                    </div>
                                </div>
                                {receiveType !== 'KANBAN' && receiveType !== 'JIT' && (
                                    <button 
                                        onClick={handleScanAndSubmit}
                                        disabled={isScanning}
                                        className="h-full px-8 flex items-center justify-center gap-2 rounded-xl text-white font-black shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap bg-[#0A2EF5] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isScanning && (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        )}
                                        <span>确认</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {receiveType === 'KANBAN' && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">箱号</label>
                                <div className="flex items-stretch gap-3 h-14">
                                    <div className="relative flex-1">
                                        <input 
                                            id="boxNoInput"
                                            type="text" 
                                            value={boxNo}
                                            onChange={(e) => setBoxNo(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleScanAndSubmit()}
                                            placeholder="输入或扫描箱号..."
                                            className="w-full h-full bg-white border-2 border-slate-200 pl-4 pr-12 rounded-xl text-xl font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-slate-400"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <ScanLine size={24} />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleScanAndSubmit}
                                        disabled={isScanning}
                                        className="h-full px-8 flex items-center justify-center gap-2 rounded-xl text-white font-black shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap bg-[#0A2EF5] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isScanning && (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        )}
                                        <span>确认</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {receiveType === 'JIT' && (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1 flex justify-between items-center">
                                        <span>JIT Card</span>
                                        {scannedJitCards.length > 0 && <span className="text-blue-600">已扫 {scannedJitCards.length} 张</span>}
                                    </label>
                                    <div className="flex items-stretch gap-3 h-14">
                                        <div className="relative flex-1">
                                            <input 
                                                id="jitCardInput"
                                                type="text" 
                                                value={jitCard}
                                                onChange={(e) => setJitCard(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        if (jitCard.trim()) {
                                                            handleJitCardAdd();
                                                        }
                                                    }
                                                }}
                                                placeholder="扫描JIT Card号添加..."
                                                className="w-full h-full bg-white border-2 border-blue-200 pl-4 pr-12 rounded-xl text-xl font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-slate-400"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none">
                                                <ScanLine size={24} />
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleJitCardAdd}
                                            className="h-full px-6 flex items-center justify-center gap-2 rounded-xl text-blue-600 bg-blue-50 border-2 border-blue-100 font-bold hover:bg-blue-100 hover:border-blue-200 transition-all active:scale-95 whitespace-nowrap"
                                        >
                                            <Plus size={20} />
                                            <span>添加</span>
                                        </button>
                                    </div>
                                </div>

                                {scannedJitCards.length > 0 ? (
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 min-h-[120px] max-h-[220px] overflow-y-auto">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">已扫描列表</span>
                                            <button onClick={() => setScannedJitCards([])} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors">清空全部</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {scannedJitCards.map((card, idx) => (
                                                <div key={idx} className="bg-white border border-slate-200 pl-3 pr-2 py-1.5 rounded-lg flex items-center gap-2 shadow-sm animate-in zoom-in-95 duration-200">
                                                    <span className="text-sm font-mono font-bold text-slate-700">{card}</span>
                                                    <button onClick={() => removeJitCard(card)} className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded p-0.5 transition-colors">
                                                        <X size={14} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-sm font-bold text-slate-400 min-h-[120px]">
                                        暂无扫描记录，请扫描上方JIT Card添加
                                    </div>
                                )}

                                <button 
                                    onClick={handleScanAndSubmit}
                                    disabled={isScanning || (scannedJitCards.length === 0 && !jitCard.trim())}
                                    className="h-14 mt-2 w-full flex items-center justify-center gap-2 rounded-xl text-white font-black shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap bg-[#0A2EF5] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isScanning && (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    )}
                                    <span>确认提交全部 {scannedJitCards.length + (jitCard.trim() && !scannedJitCards.includes(jitCard.trim()) ? 1 : 0)} 个JIT</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Feedback Message */}
                    {resultMessage && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 font-bold animate-in fade-in slide-in-from-top-2 ${resultMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {resultMessage.type === 'success' ? <PackageCheck size={20} /> : <AlertCircle size={20} />}
                            {resultMessage.text}
                        </div>
                    )}
                </div>
            </div>
        </main>
    </div>
  );
};

