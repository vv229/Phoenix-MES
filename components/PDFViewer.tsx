import React from 'react';
import { X } from 'lucide-react';

interface PDFViewerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    pdfUrl: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ isOpen, onClose, title, pdfUrl }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col animate-in fade-in duration-200">
            {/* Header */}
            <div className="h-14 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0">
                <span className="font-bold text-lg">{title}</span>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>
            </div>
            
            {/* Content (Iframe) */}
            <div className="flex-1 bg-slate-200 p-4 relative">
                 <iframe 
                    src={pdfUrl}
                    className="w-full h-full rounded-lg shadow-lg bg-white"
                    title="PDF Viewer"
                 />
            </div>
        </div>
    );
};