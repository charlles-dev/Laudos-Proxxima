import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Option {
    value: string;
    label: string;
    icon?: React.ElementType; // Optional icon for the option
    color?: string; // Optional color for the text/icon
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string; // Class for the trigger button
    dropdownClassName?: string;
    portal?: boolean; // Whether to render dropdown in a portal (essential for tables)
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Selecione...",
    className = "",
    dropdownClassName = "",
    portal = true
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    const selectedOption = options.find(o => o.value === value);

    const updateCoords = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY + 8, // 8px gap
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    };

    const toggleOpen = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling
        console.log("CustomSelect: Toggle Open", { current: isOpen, new: !isOpen, coords });
        if (!isOpen) {
            updateCoords();
        }
        setIsOpen(!isOpen);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
                // If portal is active, we also need to check if click was inside the portal content
                // But since portal content is not child of triggerRef, simple check isn't enough IF we clicked the dropdown.
                // However, the dropdown items stop propagation usually or close on click.
                // Let's rely on a global listener that closes if strictly outside logic.
                // For now simple reliable way:
                // We'll add a specific class or check logic if needed, but the simple approach is:
                // If we clicked *anything* else, close. 
                // We will handle "click inside dropdown" by stopping propagation there? No, we want item click to close.
                setIsOpen(false);
            }
        };

        if (isOpen) {
            window.addEventListener('click', handleClickOutside);
            window.addEventListener('scroll', updateCoords, true); // Update on scroll too
            window.addEventListener('resize', updateCoords);
        }

        return () => {
            window.removeEventListener('click', handleClickOutside);
            window.removeEventListener('scroll', updateCoords, true);
            window.removeEventListener('resize', updateCoords);
        };
    }, [isOpen]);

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
    };

    const DropdownContent = (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`bg-paper border border-line rounded-xl shadow-2xl overflow-hidden z-[9999] py-1 ${dropdownClassName}`}
            style={portal ? {
                position: 'absolute',
                top: coords.top,
                left: coords.left,
                width: Math.max(coords.width, 180), // Min width
            } : {
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '0.5rem'
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking background of dropdown
        >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {options.map((option) => (
                    <div
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        className={`px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors
                            ${option.value === value ? 'bg-primary/5 text-primary font-medium' : 'text-text hover:bg-surface'}
                        `}
                    >
                        <div className="flex items-center gap-2">
                            {option.icon && <option.icon className={`w-4 h-4 ${option.color || ''}`} />}
                            <span className={option.color}>{option.label}</span>
                        </div>
                        {option.value === value && <Check className="w-4 h-4" />}
                    </div>
                ))}
            </div>
        </motion.div>
    );

    return (
        <div className={`relative ${className}`} ref={triggerRef}>
            <div
                onClick={toggleOpen}
                className={`
                    flex items-center justify-between w-full px-4 py-2.5 rounded-lg border border-line bg-surface cursor-pointer transition-all select-none
                    ${isOpen ? 'ring-2 ring-primary/20 border-primary' : 'hover:border-primary/50'}
                `}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {selectedOption?.icon && <selectedOption.icon className={`w-4 h-4 ${selectedOption.color || ''}`} />}
                    <span className={`truncate text-sm ${selectedOption ? 'text-txt' : 'text-gray-400'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    portal ? createPortal(DropdownContent, document.body) : DropdownContent
                )}
            </AnimatePresence>
        </div>
    );
};
