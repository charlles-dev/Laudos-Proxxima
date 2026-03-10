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
                const matchesCtrl = ctrl ? (event.ctrlKey || event.metaKey) : !(event.ctrlKey || event.metaKey);
                const matchesAlt = alt ? event.altKey : !event.altKey;
                const matchesShift = shift ? event.shiftKey : !event.shiftKey;

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
