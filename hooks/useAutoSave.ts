import { useEffect, useCallback } from 'react';
import { ReportData } from '../types';

const STORAGE_KEY = 'proxxima_report_draft';

export const useAutoSave = (data: ReportData, setData: (data: ReportData) => void) => {
    // Save to LocalStorage (Debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            // Optional: Log saved time or set 'saving' state if passed
        }, 1000);

        return () => clearTimeout(timer);
    }, [data]);

    // Check for saved draft on mount
    const checkDraft = useCallback(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Simple check if it's not empty/default
                if (parsed.fullDescription || parsed.model || parsed.serialNumber) {
                    return parsed;
                }
            } catch (e) {
                console.error("Failed to parse draft", e);
            }
        }
        return null;
    }, []);

    const clearDraft = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return { checkDraft, clearDraft };
};
