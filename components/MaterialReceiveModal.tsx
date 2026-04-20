
import React, { useState } from 'react';
import { X, ScanLine, ArrowRight, Truck, CheckCircle2, Loader2, AlertCircle, Barcode, ClipboardList, MapPin, Calendar, Package } from 'lucide-react';

interface TOItem {
  lineNo: number;
  materialCode: string;
  description: string;
  productModel: string;
  soNo: string;
  qty: number;
  unit: string;
  sourceLoc: string;
  destLoc: string;
}

interface TODetail {
  toNo: string;
  line: string;
  printDate: string;
  warehouse: string;
  items: TOItem[];
}

interface MaterialReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 基于用户提供的实物图片数据进行模拟
const MOCK_TO_DATA: TODetail = {
  toNo: '6000586771',
  line: '生产线: 02',
  printDate: '2025.02.03 13:21:51',
  warehouse: '仓库号: 801',
  items: [
    { 
      lineNo: 1, 
      materialCode: '06DPA403844', 
      description: '单通道阀组件(EC39DZ066)', 
      productModel: '19DV-G24G244325B9', 
      soNo: '10973821 / 01',
      qty: 1, 
      unit: 'EA', 
      sourceLoc: 'A09-100101', 
      destLoc: '01 (目标仓位)' 
    },
    { 
      lineNo: 2, 
      materialCode: '06DPA403844', 
      description: '单通道阀组件(EC39DZ066)', 
      productModel: '19DV-G24G244325B9', 
      soNo: '10973821 / 01',
      qty: 2, 
      unit: 'EA', 
      sourceLoc: 'A09-100101', 
      destLoc: '01 (目标仓位)' 
    },
    { 
      lineNo: 3, 
      materialCode: '09DVG4006601LS', 
      description: '支架组件', 
      productModel: '19DV-G24G244325B9', 
      soNo: '10973821 / 01',
      qty: 2, 
      unit: 'EA', 
      sourceLoc: 'C01-10', 
      destLoc: '01 (目标仓位)' 
    },
    { 
      lineNo: 4, 
      materialCode: '09DVG5001801LS', 
      description: '支架', 
      productModel: '19DV-G24G244325B9', 
      soNo: '10973821 / 01',
      qty: 1, 
      unit: 'EA', 
      sourceLoc: 'C01-10', 
      destLoc: '01 (目标仓位)' 
    },
    { 
      lineNo: 5, 
      materialCode: '19DV45023701LS', 
      description: '安全阀', 
      productModel: '19DV-G24G244325B9', 
      soNo: '10973821 / 01',
      qty: 1, 
      unit: 'EA', 
      sourceLoc: 'C31-010402', 
      destLoc: '01 (目标仓位)' 
    }
  ]
};

export const MaterialReceiveModal: React.FC<MaterialReceiveModalProps> = ({ isOpen, onClose }) => {
  const [scanValue, setScanValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [toDetail, setToDetail] = useState<TODetail | null>(null);
  const [step, setStep] = useState<'SCAN' | 'CONFIRM' | 'SUCCESS'>('SCAN');

  if (!isOpen) return null;

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanValue) return;
    setLoading(true);
    // 模拟数据交互
    setTimeout(() => {
      setLoading(false);
      // 允许模拟输入单号或直接确认
      if (scanValue === '6000586771' || scanValue.length > 5) {
          setToDetail(MOCK_TO_DATA);
          setStep('CONFIRM');
      } else {
          alert("未匹配到拣配单据信息，请尝试输入: 6000586771");
      }
      setScanValue('');
    }, 1000);
  };

  const handleConfirmReceive = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('SUCCESS');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100 shadow-sm">
              <Truck size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">物料接收确认</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">拣配单库存过账 (Warehouse &rarr; LineSide)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {step === 'SCAN' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
              <div className="flex flex-col items-center gap-6">
                <div className="p-8 bg-slate-50 rounded-full border-2 border-dashed border-slate-200 shadow-inner">
                   <Barcode size={84} className="text-slate-300 animate-pulse" />
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-black text-slate-800">请扫描拣配单据条码</h3>
                    <p className="text-slate-400 mt-2 font-medium">系统将自动同步物料需求清单及源仓位信息</p>
                </div>
              </div>
              
              <form onSubmit={handleScan} className="w-full max-w-md relative">
                <input 
                  autoFocus
                  type="text" 
                  value={scanValue}
                  onChange={e => setScanValue(e.target.value)}
                  placeholder="输入或扫描 拣配单号..."
                  className="w-full h-14 border-2 border-slate-200 rounded-xl px-4 font-mono font-bold text-blue-700 text-center text-xl focus:border-blue-500 outline-none transition-all shadow-md placeholder:text-slate-200"
                />
                <button type="submit" disabled={loading} className="mt-6 w-full h-14 bg-[#0A2EF5] hover:bg-blue-700 text-white font-black rounded-xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <ScanLine size={24} />} 扫码识别
                </button>
                <p className="text-center text-[10px] text-slate-300 mt-4 font-bold uppercase tracking-widest">Tip: 可尝试手动输入单号 6000586771</p>
              </form>
            </div>
          )}

          {step === 'CONFIRM' && toDetail && (
            <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
               {/* TO Header Summary */}
               <div className="bg-slate-50 border-b border-slate-200 p-5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-8">
                      <div className="flex flex-col">
                          <span className="text-[10px] font-black text-blue-500 uppercase">拣配单号</span>
                          <span className="font-mono font-black text-xl text-slate-900">{toDetail.toNo}</span>
                      </div>
                      <div className="h-8 w-px bg-slate-200"></div>
                      <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                              <MapPin size={12} className="text-blue-500" /> {toDetail.warehouse}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                              <ClipboardList size={12} className="text-blue-500" /> {toDetail.line}
                          </div>
                      </div>
                  </div>
                  <div className="text-right">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                          <Calendar size={12} /> 打印日期: {toDetail.printDate}
                      </div>
                      <div className="mt-1 font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs inline-block">
                          待接收明细: {toDetail.items.length} 项
                      </div>
                  </div>
               </div>

               {/* Items Table */}
               <div className="flex-1 overflow-auto bg-slate-100/30 p-4">
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                      <table className="w-full text-sm border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-widest border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-4 text-center w-12">行号</th>
                            <th className="px-4 py-4 text-left">物料信息</th>
                            <th className="px-4 py-4 text-left">产品型号 / 销售单号</th>
                            <th className="px-4 py-4 text-left">仓位路径 (源 &rarr; 目标)</th>
                            <th className="px-4 py-4 text-center w-24">数量</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {toDetail.items.map((item) => (
                            <tr key={item.lineNo} className="hover:bg-blue-50/30 transition-colors group">
                              <td className="px-4 py-4 text-center font-mono font-bold text-slate-400 group-hover:text-blue-500">{item.lineNo}</td>
                              <td className="px-4 py-4">
                                <div className="font-mono font-black text-slate-800 text-sm">{item.materialCode}</div>
                                <div className="text-xs text-slate-400 font-bold mt-0.5">{item.description}</div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="font-bold text-slate-700 text-xs">{item.productModel}</div>
                                <div className="text-[10px] text-blue-400 font-mono font-bold mt-1">{item.soNo}</div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase">From</span>
                                        <span className="font-mono font-bold text-slate-700 text-xs bg-slate-100 px-1.5 py-0.5 rounded">{item.sourceLoc}</span>
                                    </div>
                                    <ArrowRight className="text-slate-200 group-hover:text-blue-300" size={14} />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-blue-400 uppercase">To</span>
                                        <span className="font-mono font-bold text-blue-700 text-xs bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{item.destLoc}</span>
                                    </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-center">
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="font-black text-lg text-slate-800">{item.qty}</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase">{item.unit}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                  </div>
               </div>

               {/* Footer Actions */}
               <div className="px-6 py-6 bg-white border-t border-slate-200 flex gap-4 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                  <button onClick={() => setStep('SCAN')} className="flex-1 h-14 border-2 border-slate-200 text-slate-500 font-black rounded-xl hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2">
                      <RefreshCw size={20} /> 重置扫码
                  </button>
                  <button 
                    onClick={handleConfirmReceive}
                    disabled={loading}
                    className="flex-[2] h-14 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl shadow-xl shadow-green-100 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />} 确认物料已接收 (过账到线边仓)
                  </button>
               </div>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-10 animate-in zoom-in duration-300">
               <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner relative">
                  <CheckCircle2 size={56} />
                  <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-20"></div>
               </div>
               <div className="text-center">
                  <h3 className="text-3xl font-black text-slate-800">物料接收成功!</h3>
                  <p className="text-slate-500 font-bold mt-2">SAP 调拨凭证已自动生成，线边库库存已即时更新。</p>
               </div>
               <div className="flex flex-col items-center gap-4 pt-4">
                  <button onClick={onClose} className="px-16 py-4 bg-slate-900 text-white font-black rounded-xl shadow-xl hover:shadow-2xl transition-all active:scale-95">返回任务列表</button>
                  <button onClick={() => setStep('SCAN')} className="text-blue-600 font-black text-sm hover:underline">继续接收下一单</button>
               </div>
            </div>
          )}
        </div>
        
        {/* Quality Hint */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
              <AlertCircle size={14} className="text-amber-500" />
              <span>质量提醒：接收前请确认包装箱号与实物一致，严禁跨工序接收</span>
           </div>
           <div className="text-[10px] text-slate-300 font-mono">Carrier Quality System (v2.5)</div>
        </div>
      </div>
    </div>
  );
};

// 辅助图标
const RefreshCw = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path></svg>
);
