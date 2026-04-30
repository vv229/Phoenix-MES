import React, { useState } from 'react';
import { ChevronLeft, Home, ScanLine, PackageCheck, AlertCircle, FileCheck2, Box, Layers, ListTodo } from 'lucide-react';
import { CarrierLogo } from './CarrierLogo';

interface MaterialReceiveProps {
  onBack: () => void;
}

export const MaterialReceive: React.FC<MaterialReceiveProps> = ({ onBack }) => {
  const [receiveType, setReceiveType] = useState<'TRANSFER' | 'MRP' | 'JIT' | 'KANBAN'>('TRANSFER');
  const [asnNo, setAsnNo] = useState('');
  const [boxNo, setBoxNo] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [resultMessage, setResultMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleScanAndSubmit = () => {
    if (!asnNo.trim()) {
      setResultMessage({ type: 'error', text: '请先输入或扫描ASN单号' });
      return;
    }

    if (receiveType === 'KANBAN' && !boxNo.trim()) {
      setResultMessage({ type: 'error', text: '请先输入或扫描箱号' });
      return;
    }
    
    setIsScanning(true);
    setResultMessage(null);
    
    // Mock SAP API call
    setTimeout(() => {
      setIsScanning(false);
      const typeLabel = receiveType === 'TRANSFER' ? '移库接收' : receiveType === 'MRP' ? 'MRP收货' : receiveType === 'JIT' ? 'JIT收货' : 'kanban收货';
      const detail = receiveType === 'KANBAN' ? `[${asnNo}] / 箱号 [${boxNo}]` : `[${asnNo}]`;
      setResultMessage({ type: 'success', text: `[${typeLabel}] 操作成功: 单据 ${detail} (SAP接口已同步)` });
      setAsnNo('');
      if (receiveType === 'KANBAN') {
        setBoxNo('');
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

        <main className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-start pt-20">
            <div className="bg-white max-w-3xl w-full rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-8 pb-6 border-b border-slate-100 bg-slate-50">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                            <PackageCheck size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800">物料接收</h2>
                        <p className="text-slate-500 font-medium">请选择接收类型并扫描接收票据</p>
                    </div>
                </div>

                <div className="p-10 flex flex-col gap-8">
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
                    <div className="flex flex-col gap-4">
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
                                                } else {
                                                    handleScanAndSubmit();
                                                }
                                            }
                                        }}
                                        placeholder="输入或扫描ASN单据号..."
                                        className="w-full h-full bg-white border-2 border-slate-200 pl-4 pr-4 rounded-xl text-xl font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-slate-400"
                                    />
                                </div>
                                {receiveType !== 'KANBAN' && (
                                    <button 
                                        onClick={handleScanAndSubmit}
                                        disabled={isScanning}
                                        className="h-full px-8 flex items-center justify-center gap-2 rounded-xl text-white font-black shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap bg-[#0A2EF5] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isScanning ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <ScanLine size={24} />
                                        )}
                                        <span>扫描&确认</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {receiveType === 'KANBAN' && (
                            <div className="flex flex-col gap-2 mt-2">
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
                                            className="w-full h-full bg-white border-2 border-slate-200 pl-4 pr-4 rounded-xl text-xl font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-slate-400"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleScanAndSubmit}
                                        disabled={isScanning}
                                        className="h-full px-8 flex items-center justify-center gap-2 rounded-xl text-white font-black shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap bg-[#0A2EF5] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isScanning ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <ScanLine size={24} />
                                        )}
                                        <span>扫描&确认</span>
                                    </button>
                                </div>
                            </div>
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
