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
                    className={`px-4 py-2 border-b border-slate-100 cursor-pointer text-sm ${selected === item ? 'bg-slate-200 text-slate-900 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                    {item}
                </div>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-slate-200/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl shadow-2xl rounded border border-slate-300 flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-2 border-b border-slate-200 bg-white">
                    <div className="bg-slate-100 p-1 rounded border border-slate-200">
                        <CarrierLogo className="h-6 w-auto text-blue-900" />
                    </div>
                    <div className="font-bold text-lg text-slate-800">选择工位</div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                {/* Body - 3 Columns */}
                <div className="flex-1 overflow-hidden p-4 grid grid-cols-3 gap-2">
                    {/* Column 1 */}
                    <div className="flex flex-col border border-slate-400">
                        <div className="bg-[#9ca3af] text-white font-bold text-center py-2">生产线</div>
                        {renderList(lines, selectedLine, setSelectedLine)}
                    </div>
                    {/* Column 2 */}
                    <div className="flex flex-col border border-slate-400">
                        <div className="bg-[#9ca3af] text-white font-bold text-center py-2">工序</div>
                        {renderList(processes, selectedProcess, setSelectedProcess)}
                    </div>
                    {/* Column 3 */}
                    <div className="flex flex-col border border-slate-400">
                        <div className="bg-[#9ca3af] text-white font-bold text-center py-2">工位</div>
                        {renderList(stations, selectedStation, setSelectedStation)}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 flex justify-end gap-3 bg-white">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-medium bg-white shadow-sm"
                    >
                        取消
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-6 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded font-medium shadow-sm"
                    >
                        确定
                    </button>
                </div>
            </div>
        </div>
    );
};