
import React, { useState } from 'react';
import { X, ScanLine, ArrowRight, Truck, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface TODetail {
  toNo: string;
  sourceLoc: string;
  destLoc: string;
  items: {
    materialCode: string;
    qty: number;
    batch: string;
    unit: string;
  }[];
}

interface MaterialReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_TO: TODetail = {
  toNo: 'TO20251212001',
  sourceLoc: 'W001 (原材料仓)',
  destLoc: 'L010 (线边仓-01)',
  items: [
    { materialCode: '06TVA819SX1CA1', qty: 100, batch: 'B20251101', unit: 'PCS' },
    { materialCode: 'FAN-00223-X', qty: 24, batch: 'B20251115', unit: 'SET' },
    { materialCode: 'BOLT-M8-304', qty: 1000, batch: 'LOT-9981', unit: 'PCS' },
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
    // 模拟解析二维码与调用接口
    setTimeout(() => {
      setLoading(false);
      setToDetail(MOCK_TO);
      setStep('CONFIRM');
    }, 1200);
  };

  const handleConfirmReceive = () => {
    setLoading(true);
    // 模拟调用 SAP 调拨确认接口
    setTimeout(() => {
      setLoading(false);
      setStep('SUCCESS');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center border border-green-100 shadow-sm">
              <Truck size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">物料接收确认</h2>
              <p className="text-xs text-slate-500 font-medium">SAP 原材料调拨流程 (TO &rarr; LineSide)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[300px] flex flex-col items-center justify-center">
          {step === 'SCAN' && (
            <div className="w-full max-w-md space-y-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 bg-slate-50 rounded-full border-2 border-dashed border-slate-200">
                   <ScanLine size={64} className="text-slate-300 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">请扫描送货单/TO单条码</h3>
                <p className="text-sm text-slate-400">系统将自动从 SAP 同步该调拨任务明细</p>
              </div>
              <form onSubmit={handleScan} className="relative">
                <input 
                  autoFocus
                  type="text" 
                  value={scanValue}
                  onChange={e => setScanValue(e.target.value)}
                  placeholder="等待扫码录入..."
                  className="w-full h-12 border-2 border-slate-200 rounded-xl px-4 font-mono font-bold text-blue-700 text-center focus:border-blue-500 outline-none transition-all shadow-sm"
                />
                <button type="submit" disabled={loading} className="mt-4 w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <ScanLine size={20} />} 手动模拟扫码
                </button>
              </form>
            </div>
          )}

          {step === 'CONFIRM' && toDetail && (
            <div className="w-full space-y-6 animate-in slide-in-from-right duration-300">
               <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-[10px] font-bold text-blue-500 block uppercase">起始仓库</span>
                      <span className="font-bold text-slate-800 text-sm">{toDetail.sourceLoc}</span>
                    </div>
                    <ArrowRight className="text-blue-300" />
                    <div>
                      <span className="text-[10px] font-bold text-blue-500 block uppercase">目的线边仓</span>
                      <span className="font-bold text-slate-800 text-sm">{toDetail.destLoc}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-blue-500 block uppercase">TO单据号</span>
                    <span className="font-mono font-bold text-slate-800">{toDetail.toNo}</span>
                  </div>
               </div>

               <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold">
                      <tr>
                        <th className="px-4 py-3 text-left">物料编码</th>
                        <th className="px-4 py-3 text-left">批次号</th>
                        <th className="px-4 py-3 text-center">数量</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {toDetail.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-bold text-slate-800">{item.materialCode}</td>
                          <td className="px-4 py-3 text-slate-500 font-mono text-xs">{item.batch}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-black text-blue-700">{item.qty}</span> <span className="text-xs text-slate-400">{item.unit}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>

               <div className="flex gap-4">
                  <button onClick={() => setStep('SCAN')} className="flex-1 h-12 border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50">重置扫码</button>
                  <button 
                    onClick={handleConfirmReceive}
                    disabled={loading}
                    className="flex-[2] h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />} 确认物料已接收 (回传SAP)
                  </button>
               </div>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-10 animate-in zoom-in duration-300">
               <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle2 size={48} />
               </div>
               <div className="text-center">
                  <h3 className="text-2xl font-black text-slate-800">库存接收成功!</h3>
                  <p className="text-slate-500 font-medium">SAP 调拨凭证已生成，线边仓位库存已更新。</p>
               </div>
               <button onClick={onClose} className="mt-4 px-10 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg">关闭窗口</button>
            </div>
          )}
        </div>
        
        {/* Footer Hint */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-widest">
           <AlertCircle size={12} />
           <span>注意：确认接收前请核实物料批次与实物标签一致</span>
        </div>
      </div>
    </div>
  );
};
