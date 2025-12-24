import React from 'react';

export const SkeletonLoader: React.FC = () => {
    return (
        <div className="w-full space-y-4 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-4 bg-white/10 rounded w-5/6"></div>
            </div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
            <div className="pt-4">
                <div className="h-24 bg-white/5 rounded-lg border border-white/5"></div>
            </div>
        </div>
    );
};
