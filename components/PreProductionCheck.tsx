import React from 'react';
import { X, Check, ArrowLeft, ArrowRight, Save, ChevronLeft, Home, MoreHorizontal } from 'lucide-react';
import { MOCK_EQUIPMENT } from '../constants';
import { EquipmentItem } from '../types';
import { CarrierLogo } from './CarrierLogo';

interface PreProductionCheckProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PreProductionCheck: React.FC<PreProductionCheckProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-200 z-40 flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header - Unified Style */}
            <header className="bg-slate-900 h-14 flex items-center justify-between px-4 shrink-0 shadow-md">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                        <ChevronLeft size={28} />
                    </button>
                    <span className="text-white font-bold text-lg tracking-wide">产前准备</span>
                </div>
                <div className="flex items-center gap-4">
                    <CarrierLogo className="h-6 w-auto" />
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                        <Home size={22} />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                        <MoreHorizontal size={22} />
                    </button>
                </div>
            </header>

            {/* Toolbar */}
            <div className="h-12 border-b border-slate-200 bg-white flex items-center px-4 shrink-0 shadow-sm">
                 <input 
                    type="text" 
                    placeholder="请输入设备/工治具编码或设备/工治具名称"
                    className="border border-slate-300 rounded px-3 py-1.5 w-96 text-sm focus:outline-none focus:border-blue-500"
                 />
                 <button className="ml-2 p-2 rounded hover:bg-slate-100 text-red-500">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3h18v18H3zM9 9l6 6M15 9l-6 6" />
                    </svg>
                 </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                {/* Equipment List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
                    {MOCK_EQUIPMENT.map(eq => (
                        <div key={eq.id} className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden flex flex-col h-40">
                            <div className="flex items-center justify-between p-2 border-b border-slate-100">
                                <span className="font-bold text-slate-700 truncate text-sm" title={eq.name}>{eq.code}</span>
                                <span className={`text-xs px-2 py-0.5 rounded text-white ${
                                    eq.status === 'NOT_STARTED' ? 'bg-red-600' : 
                                    eq.status === 'IN_PROGRESS' ? 'bg-amber-500' : 'bg-green-600'
                                }`}>
                                    {eq.status === 'NOT_STARTED' ? '未执行' : eq.status === 'IN_PROGRESS' ? '执行中' : '已执行'}
                                </span>
                            </div>
                            <div className="p-3 text-xs text-slate-600 space-y-1 flex-1">
                                <div className="flex justify-between"><span>编码:</span> <span className="text-slate-800">{eq.code}</span></div>
                                <div className="flex justify-between"><span>名称:</span> <span className="text-slate-800 truncate w-32 text-right" title={eq.name}>{eq.name}</span></div>
                                <div className="flex justify-between"><span>责任部门:</span> <span>{eq.dept}</span></div>
                                <div className="flex justify-between"><span>执行结果:</span> <span></span></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Check Items Panel */}
                <div className="bg-white border border-slate-200 rounded shadow-sm">
                    <div className="px-4 py-2 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                        <span>点检项目</span>
                        <div className="text-xs text-slate-400">第 1 页 共 1 页</div>
                    </div>
                    
                    <div className="p-2 space-y-2">
                        {/* Toolbar for Actions */}
                        <div className="flex gap-2 mb-2">
                            <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-sm">
                                <Save size={14}/> 保存
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-sm">
                                <ArrowRight size={14}/> 提交
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-sm bg-blue-50 text-blue-600 border-blue-200">
                                <Check size={14}/> 一键点检
                            </button>
                             <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-sm">
                                查看维护指导
                            </button>
                             <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-sm ml-auto">
                                <ArrowLeft size={14}/> 上一页
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-sm">
                                下一页 <ArrowRight size={14}/>
                            </button>
                        </div>

                        {/* Checklist items (Mocking the view from screenshot) */}
                        {MOCK_EQUIPMENT.flatMap(e => e.checkItems).length > 0 ? (
                            MOCK_EQUIPMENT.slice(0, 1).flatMap(e => e.checkItems).map((item, idx) => (
                                <div key={idx} className="border border-slate-200 rounded p-3 text-sm">
                                    <div className="bg-slate-100 px-2 py-1 mb-2 font-bold text-slate-700">
                                        检查内容: {item.content}
                                        <div className="float-right">
                                            <span className={`px-2 py-0.5 text-white text-xs rounded ${item.result === 'OK' ? 'bg-green-600' : item.result === 'NG' ? 'bg-red-600' : 'bg-slate-400'}`}>
                                                {item.result === 'OK' ? '合格' : item.result === 'NG' ? '不合格' : '未判定'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 items-center">
                                        <div>标准值: {item.standard}</div>
                                        <div>最大值: {item.standard}</div>
                                        <div>最小值: {item.standard}</div>
                                        <div>周期: {item.cycle}</div>
                                        <div className="flex items-center gap-2">
                                            实际值: <input className="border border-slate-300 rounded px-2 py-0.5 w-24" />
                                        </div>
                                        <div className="col-span-3 flex items-center gap-4">
                                            <label className="flex items-center gap-1"><input type="radio" name={`check_${idx}`} /> 合格</label>
                                            <label className="flex items-center gap-1"><input type="radio" name={`check_${idx}`} /> 不合格</label>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                             <div className="p-4 text-center text-slate-400">请选择左侧设备以查看点检项目</div>
                        )}
                         {/* Additional Mock Items to fill space as per screenshot */}
                        <div className="border border-slate-200 rounded p-3 text-sm">
                            <div className="bg-slate-100 px-2 py-1 mb-2 font-bold text-slate-700">
                                检查内容: 检查吊钩的保险扣，要求无磨损安全可靠;
                                <div className="float-right"><span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded">不合格</span></div>
                            </div>
                            <div className="grid grid-cols-4 gap-4 items-center">
                                <div>标准值: 文本标签</div>
                                <div>周期: 每天</div>
                                <div className="col-span-2 flex items-center gap-4">
                                     实际值: <input className="border border-slate-300 rounded px-2 py-0.5 w-24" />
                                     <label className="flex items-center gap-1"><input type="radio" /> 合格</label>
                                     <label className="flex items-center gap-1"><input type="radio" defaultChecked /> 不合格</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Pagination / Status Bar (Optional, keeping consistent with content) */}
            <div className="h-8 bg-slate-100 border-t border-slate-200 flex items-center justify-end px-4 text-xs text-slate-500">
                第 1 页 共 2 页
            </div>

             {/* Footer - Unified Style */}
            <footer className="h-6 bg-slate-800 text-slate-400 text-[10px] flex items-center justify-between px-4 shrink-0">
                <span>2025/12/12 星期二 14:00:12</span>
                <span>广东赛意信息科技股份有限公司</span>
            </footer>
        </div>
    );
};