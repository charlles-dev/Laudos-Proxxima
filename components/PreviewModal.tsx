import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { ReportPreview } from './ReportPreview';
import { ReportData } from '../types';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ReportData;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, data }) => {
    const [zoom, setZoom] = useState(1);

    if (!isOpen) return null;

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Spotlight Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all duration-500"
                onClick={onClose}
            ></div>

            {/* Spotlight Beam Effect */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-white/10 via-transparent to-transparent opacity-50"></div>

            <div className="relative z-[101] w-full max-w-5xl h-[90vh] flex flex-col pointer-events-none">
                {/* Controls Bar */}
                <div className="flex justify-between items-center mb-4 px-4 pointer-events-auto animate-fade-in-up">
                    <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                        <button onClick={handleZoomOut} className="p-1 hover:bg-white/20 rounded-full text-white transition"><ZoomOut className="w-5 h-5" /></button>
                        <span className="text-white text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
                        <button onClick={handleZoomIn} className="p-1 hover:bg-white/20 rounded-full text-white transition"><ZoomIn className="w-5 h-5" /></button>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-red-500 hover:text-white rounded-full text-white transition border border-white/10 backdrop-blur-md"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Preview Area */}
                <div className="flex-1 overflow-auto rounded-xl scrollbar-hide pointer-events-auto flex justify-center items-start p-8">
                    <div
                        className="bg-white shadow-2xl transition-transform duration-200 origin-top"
                        style={{ transform: `scale(${zoom})` }}
                    >
                        <ReportPreview data={data} isGenerating={false} />
                    </div>
                </div>
            </div>
        </div>
    );
};
