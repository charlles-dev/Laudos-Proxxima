import { useEffect } from 'react';

interface ShortcutConfig {
    key: string;
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    action: () => void;
    preventDefault?: boolean;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            shortcuts.forEach(({ key, ctrl, alt, shift, action, preventDefault = true }) => {
                const matchesKey = event.key.toLowerCase() === key.toLowerCase();
                const matchesCtrl = ctrl ? (event.ctrlKey || event.metaKey) : true; // Meta for Mac support
                const matchesAlt = alt ? event.altKey : true;
                const matchesShift = shift ? event.shiftKey : true;

                if (matchesKey && matchesCtrl && matchesAlt && matchesShift) {
                    if (preventDefault) {
                        event.preventDefault();
                    }
                    action();
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
};
