import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CarrierLogo } from './CarrierLogo';

interface SelectStationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const SelectStationModal: React.FC<SelectStationModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [selectedLine, setSelectedLine] = useState('Air-cool line 1');
    const [selectedProcess, setSelectedProcess] = useState('钎焊');
    const [selectedStation, setSelectedStation] = useState('钎焊');

    if (!isOpen) return null;

    const lines = [
        'Air-cool line 1', 'Air-cool line 2', 'Screw Chiller line 1', 'Screw Chiller line 2',
        'Screw Chiller line 3', 'Centri chiller line 1 -R6/R7', 'Centri chiller line 2 -32T',
        'Centri chiller line 3 -33T'
    ];
    const processes = ['大件装配', '管配', '钎焊', 'V盘安装', '泵压及检漏', '真空/接线/加注', '试车', '最后整理'];
    const stations = ['大件装配', '管配', '钎焊', 'V盘安装', '泵压及检漏', '真空/接线/加注', '试车', '最后整理'];

    const renderList = (items: string[], selected: string, onSelect: (val: string) => void) => (
        <div className="flex-1 overflow-y-auto bg-white border-t border-slate-300">
            {items.map(item => (
                <div 
                    key={item}
                    onClick={() => onSelect(item)}
                    className={`px-6 py-4 border-b border-slate-100 cursor-pointer text-lg transition-colors ${selected === item ? 'bg-blue-50 text-[#142C73] font-bold border-l-4 border-l-[#142C73]' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                    {item}
                </div>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            {/* Enlarged Modal Container */}
            <div className="bg-white w-full max-w-7xl h-[85vh] shadow-2xl rounded-lg border border-slate-300 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white shrink-0">
                    <div className="flex items-center gap-4">
                         <div className="bg-slate-100 p-2 rounded border border-slate-200">
                            <CarrierLogo className="h-8 w-auto text-blue-900" />
                        </div>
                        <div className="font-bold text-2xl text-slate-800">选择工位</div>
                    </div>
                   
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={32} className="text-slate-500" />
                    </button>
                </div>

                {/* Body - 3 Columns */}
                <div className="flex-1 overflow-hidden p-6 grid grid-cols-3 gap-4">
                    {/* Column 1 */}
                    <div className="flex flex-col border border-slate-300 rounded-md overflow-hidden shadow-sm">
                        <div className="bg-[#142C73] text-white font-extrabold text-xl text-center py-4 tracking-wider">生产线</div>
                        {renderList(lines, selectedLine, setSelectedLine)}
                    </div>
                    {/* Column 2 */}
                    <div className="flex flex-col border border-slate-300 rounded-md overflow-hidden shadow-sm">
                        <div className="bg-[#142C73] text-white font-extrabold text-xl text-center py-4 tracking-wider">工序</div>
                        {renderList(processes, selectedProcess, setSelectedProcess)}
                    </div>
                    {/* Column 3 */}
                    <div className="flex flex-col border border-slate-300 rounded-md overflow-hidden shadow-sm">
                        <div className="bg-[#142C73] text-white font-extrabold text-xl text-center py-4 tracking-wider">工位</div>
                        {renderList(stations, selectedStation, setSelectedStation)}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 flex justify-end gap-4 bg-white shrink-0">
                    <button 
                        onClick={onClose}
                        className="px-10 py-3 border border-slate-300 rounded text-lg text-slate-700 hover:bg-slate-50 font-bold bg-white shadow-sm transition-all active:scale-95"
                    >
                        取消
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-10 py-3 bg-[#142C73] hover:bg-[#0f2259] text-white rounded text-lg font-bold shadow-md transition-all active:scale-95"
                    >
                        确定
                    </button>
                </div>
            </div>
        </div>
    );
};