import React, { useState } from 'react';
import { User, Lock, Globe, ChevronDown } from 'lucide-react';
import { CarrierLogo } from './CarrierLogo';

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-900 overflow-hidden font-sans">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/CarrierFile/Picture1.png" 
          alt="Factory Background" 
          className="w-full h-full object-cover"
        />
        {/* Blue Tint Overlay */}
        <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-blue-900/20"></div>
        
        {/* Tech Grid Effect */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ 
                 backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', 
                 backgroundSize: '30px 30px' 
             }}>
        </div>
      </div>

      {/* Top Left Logo Area */}
      <div className="absolute top-8 left-8 z-10 p-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded">
         <CarrierLogo className="h-10 w-auto text-white brightness-0 invert" />
      </div>
      
      {/* Background Text Decoration */}
      <div className="absolute top-1/3 left-10 z-0 text-white/10 font-bold text-9xl pointer-events-none select-none tracking-tighter hidden lg:block">
        MES
      </div>

      {/* Main Content Grid (7:3 Ratio) */}
      <div className="relative z-20 w-full h-screen grid grid-cols-1 lg:grid-cols-10">
         {/* Left Spacer (70%) */}
         <div className="hidden lg:block lg:col-span-6"></div>

         {/* Right Login Area (30%) */}
         <div className="col-span-1 lg:col-span-3 flex items-center justify-center p-4 lg:pr-12">
            {/* Login Card */}
            <div className="bg-white w-full max-w-[400px] shadow-2xl border-2 border-blue-500 rounded-sm">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 font-serif tracking-wide">Log On</h2>
                    <div className="w-10 h-10 bg-[#1e3a8a] rounded-sm flex items-center justify-center text-white font-serif italic font-bold text-xl shadow-sm border border-blue-800">
                        Cx
                    </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                    
                    {/* Username Input */}
                    <div className="group">
                        <div className="flex items-stretch border border-slate-300 rounded overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                                <div className="bg-[#eeeeee] w-10 flex items-center justify-center border-r border-slate-300 text-slate-500">
                                    <User size={18} fill="currentColor" className="text-slate-500" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="enter one user name" 
                                    className="flex-1 h-10 px-3 text-sm text-slate-700 focus:outline-none placeholder:text-slate-400"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="group">
                        <div className="flex items-stretch border border-slate-300 rounded overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                                <div className="bg-[#eeeeee] w-10 flex items-center justify-center border-r border-slate-300 text-slate-500">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type="password" 
                                    placeholder="Please input a password" 
                                    className="flex-1 h-10 px-3 text-sm text-slate-700 focus:outline-none placeholder:text-slate-400"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                        </div>
                    </div>

                    {/* Language Selector */}
                    <div className="group">
                        <div className="flex items-stretch border border-slate-300 rounded overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all relative">
                                <div className="bg-[#eeeeee] w-10 flex items-center justify-center border-r border-slate-300 text-slate-500">
                                    <Globe size={18} />
                                </div>
                                <select className="flex-1 h-10 px-3 text-sm text-slate-700 focus:outline-none bg-white appearance-none cursor-pointer">
                                    <option>English</option>
                                    <option>中文</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Login Button */}
                    <button 
                        type="submit"
                        className="w-full bg-[#a91e2c] hover:bg-[#8f1925] text-white font-medium py-2.5 rounded shadow-sm hover:shadow transition-all active:scale-[0.99] text-base mt-4"
                    >
                        Log On
                    </button>
                    </form>
                </div>
            </div>
         </div>
      </div>
      
      {/* Footer Copyright */}
      <div className="absolute bottom-4 w-full text-center text-white/40 text-xs z-20">
         © 2025 Carrier Corporation. All Rights Reserved.
      </div>
    </div>
  );
};