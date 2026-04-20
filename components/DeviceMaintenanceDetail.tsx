import React, { useState } from 'react';
import { ChevronLeft, Camera, Plus, Save, Send, FileText, Cpu, Settings, MapPin, Users, User, Clock, Home } from 'lucide-react';
import { Task, MaintenanceItem } from '../types';
import { CarrierLogo } from './CarrierLogo';

interface DeviceMaintenanceDetailProps {
  task: Task;
  onBack: () => void;
}

const MOCK_MAINTENANCE_ITEMS: MaintenanceItem[] = [
  {
    id: '1',
    name: '清洁',
    position: '机械臂',
    consumables: '酒精',
    method: '外观',
    type: 'QUALITATIVE',
    result: null,
    photos: []
  },
  {
    id: '2',
    name: '清洁',
    position: '机械臂',
    consumables: '酒精',
    method: '外观',
    type: 'QUANTITATIVE',
    minValue: 2,
    maxValue: 8,
    actualValue: 11,
    result: 'NG',
    description: 'XXXX',
    photos: []
  },
  {
    id: '3',
    name: '安全',
    position: '急停按钮',
    consumables: '无',
    method: '功能测试',
    type: 'QUALITATIVE',
    result: null,
    photos: []
  }
];

export const DeviceMaintenanceDetail: React.FC<DeviceMaintenanceDetailProps> = ({ task, onBack }) => {
  const [activeTab, setActiveTab] = useState<'ROUTINE' | 'SPARE_PARTS' | 'APPLY' | 'SCORE'>('ROUTINE');
  const [items, setItems] = useState<MaintenanceItem[]>(MOCK_MAINTENANCE_ITEMS);

  const handleResultChange = (id: string, result: 'OK' | 'NG' | 'NA') => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, result } : item));
  };

  const handleValueChange = (id: string, value: string) => {
    const numValue = parseFloat(value);
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        let result: 'OK' | 'NG' | null = null;
        if (!isNaN(numValue) && item.minValue !== undefined && item.maxValue !== undefined) {
          result = (numValue >= item.minValue && numValue <= item.maxValue) ? 'OK' : 'NG';
        }
        return { ...item, actualValue: isNaN(numValue) ? undefined : numValue, result };
      }
      return item;
    }));
  };

  const completedCount = items.filter(i => i.result !== null).length;
  const progress = Math.round((completedCount / items.length) * 100);

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">设备保养 - {task.id}</h1>
        </div>
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
            <Home size={24} />
        </button>
      </header>

      <div className="flex-1 overflow-hidden flex p-6 gap-6">
        {/* Left Sidebar */}
        <div className="w-80 flex flex-col gap-4 shrink-0">
            {/* Logo Header */}
            <div className="h-16 flex items-center px-4 shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 w-full">
                    <span className="font-bold text-xl tracking-tight whitespace-nowrap" style={{ color: '#0A2EF5' }}>YLC-MES</span>
                    <div className="flex-1"></div>
                    <CarrierLogo className="h-7 w-auto" />
                </div>
            </div>

            {/* Maintenance Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div className="flex items-center gap-2 mb-4 border-l-4 border-slate-800 pl-3">
                    <h2 className="font-bold text-lg text-slate-800">保养信息</h2>
                </div>
                <div className="space-y-4">
                    <InfoItem icon={<FileText size={18} />} label="保养单号" value={task.id} />
                    <InfoItem icon={<Cpu size={18} />} label="设备编码" value={task.deviceCode} />
                    <InfoItem icon={<Settings size={18} />} label="设备名称" value={task.deviceName} />
                    <InfoItem icon={<MapPin size={18} />} label="车间产线" value={task.line} />
                    <InfoItem icon={<Users size={18} />} label="确认部门" value={task.department} />
                    <InfoItem icon={<User size={18} />} label="保养人" value={task.maintenancePerson} />
                    <InfoItem icon={<Clock size={18} />} label="保养时间" value={task.maintenanceTime} />
                </div>
            </div>

            {/* Last Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex-1">
                <div className="flex items-center gap-2 mb-4 border-l-4 border-slate-800 pl-3">
                    <h2 className="font-bold text-lg text-slate-800">上次保养小结</h2>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 h-full">
                    {task.lastMaintenanceSummary || '无上次保养记录'}
                </p>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Tabs & Progress */}
            <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
                <div className="flex gap-8 h-full">
                    {[
                    { id: 'ROUTINE', label: '常规详情' },
                    { id: 'SPARE_PARTS', label: '备件更换' },
                    { id: 'APPLY', label: '备件申请' },
                    { id: 'SCORE', label: '保养评分' }
                    ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`h-full text-sm font-bold border-b-2 transition-colors px-1 ${
                        activeTab === tab.id 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {tab.label}
                    </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <span>保养完成度: {progress}%</span>
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                    <Save size={18} /> 保存
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">
                    <Send size={18} /> 提交保养结果
                </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                {items.map((item, index) => (
                    <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-1">{item.name}</h3>
                                    <div className="text-sm text-slate-500 flex gap-4">
                                        <span>部位: <span className="text-slate-700 font-medium">{item.position}</span></span>
                                        <span>耗材: <span className="text-slate-700 font-medium">{item.consumables}</span></span>
                                        <span>方法: <span className="text-slate-700 font-medium">{item.method}</span></span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                    <Camera size={20} />
                                </button>
                                <div className="flex rounded-lg overflow-hidden border border-slate-200">
                                    <button 
                                        onClick={() => handleResultChange(item.id, 'OK')}
                                        className={`px-4 py-2 text-sm font-bold transition-colors ${item.result === 'OK' ? 'bg-green-500 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        合格
                                    </button>
                                    <div className="w-px bg-slate-200"></div>
                                    <button 
                                        onClick={() => handleResultChange(item.id, 'NG')}
                                        className={`px-4 py-2 text-sm font-bold transition-colors ${item.result === 'NG' ? 'bg-red-500 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        不合格
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Technical Requirement */}
                        <div className="mb-4 pl-12">
                            <span className="font-bold text-slate-800 text-sm">技术要求: </span>
                            <span className="text-slate-600 text-sm">确认{item.position}{item.method}无异常，使用{item.consumables}进行处理。</span>
                        </div>

                        {/* Quantitative Input Area */}
                        {item.type === 'QUANTITATIVE' && (
                            <div className="ml-12 bg-slate-50 rounded-lg border border-slate-100 p-4 flex items-center gap-4">
                                <span className="text-sm font-medium text-slate-600">实测值:</span>
                                <input 
                                    type="number" 
                                    value={item.actualValue || ''} 
                                    onChange={(e) => handleValueChange(item.id, e.target.value)}
                                    className="w-32 border border-slate-300 rounded-md px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                    placeholder="输入数值"
                                />
                                <span className="text-xs text-slate-400 ml-auto">范围: {item.minValue} ~ {item.maxValue}</span>
                            </div>
                        )}

                        {/* NG Description */}
                        {item.result === 'NG' && (
                            <div className="ml-12 mt-4">
                                <textarea 
                                    className="w-full border border-red-200 rounded-lg p-3 text-sm focus:outline-none focus:border-red-400 bg-red-50/30 placeholder-red-300" 
                                    placeholder="请输入缺陷描述..."
                                    rows={2}
                                    defaultValue={item.description}
                                ></textarea>
                                <div className="mt-2 flex gap-2">
                                    <button className="w-16 h-16 border border-dashed border-red-300 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors">
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Overall Summary */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm mt-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-4">本次保养总结</h3>
                    <textarea 
                        className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-h-[100px]" 
                        placeholder="请输入保养小结..."
                    ></textarea>
                    <div className="mt-4">
                        <label className="text-xs font-bold text-slate-500 mb-2 block">图片上传</label>
                        <div className="flex gap-2">
                            <button className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors bg-slate-50">
                                <Plus size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value?: string }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="text-slate-400 mt-0.5">{icon}</div>
        <div>
            <div className="text-xs text-slate-400 font-medium mb-0.5">{label}</div>
            <div className="text-sm font-bold text-slate-700 break-words">{value || '-'}</div>
        </div>
    </div>
);

