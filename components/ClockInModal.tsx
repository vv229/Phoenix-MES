import React from 'react';
import { X, User, QrCode, CreditCard, UserX } from 'lucide-react';
import { CarrierLogo } from './CarrierLogo';

interface ClockInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ClockInModal: React.FC<ClockInModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-200/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white w-full max-w-2xl shadow-2xl rounded border border-slate-300 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-2 border-b border-slate-200 bg-white">
                    <div className="bg-slate-100 p-1 rounded border border-slate-200">
                        <CarrierLogo className="h-6 w-auto text-blue-900" />
                    </div>
                    <div className="font-bold text-lg text-slate-800">上岗</div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* 3 Icons Row */}
                    <div className="flex justify-around mb-8">
                        <div className="flex flex-col items-center gap-2 cursor-pointer group">
                            <div className="w-24 h-20 bg-[#1d4ed8] rounded flex items-center justify-center shadow-md group-hover:bg-blue-800 transition-colors text-white">
                                <CreditCard size={48} />
                            </div>
                            <span className="font-bold text-slate-800 text-lg">刷卡上岗</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 cursor-pointer group">
                             <div className="w-24 h-20 bg-blue-50 border-2 border-[#3b82f6] rounded flex items-center justify-center shadow-md group-hover:bg-blue-100 transition-colors text-[#3b82f6]">
                                <QrCode size={48} />
                            </div>
                            <span className="font-bold text-slate-800 text-lg">扫码上岗</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 cursor-pointer group">
                             <div className="w-24 h-20 bg-blue-50 border-2 border-[#3b82f6] rounded flex items-center justify-center shadow-md group-hover:bg-blue-100 transition-colors text-[#3b82f6]">
                                <User size={48} />
                            </div>
                            <span className="font-bold text-slate-800 text-lg">人脸识别上岗</span>
                        </div>
                    </div>

                    {/* Records List Box */}
                    <div className="relative">
                        <div className="font-bold text-slate-800 text-lg mb-1 ml-1">上/下岗记录:</div>
                        <div className="border border-slate-300 rounded h-40 p-4 overflow-y-auto bg-white shadow-inner">
                            <div className="flex items-center gap-3 mb-2">
                                <UserX className="text-slate-400" size={24} />
                                <span className="font-medium text-slate-700">张三</span>
                                <span className="text-slate-600">2025/12/4 08:00:00</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <UserX className="text-slate-400" size={24} />
                                <span className="font-medium text-slate-700">李四</span>
                                <span className="text-slate-600">2025/12/4 08:00:00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 flex justify-end bg-white">
                    <button 
                        onClick={onConfirm}
                        className="px-6 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded font-medium shadow-sm"
                    >
                        生产采集
                    </button>
                </div>
             </div>
        </div>
    );
};