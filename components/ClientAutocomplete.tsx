import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { getClients } from '../services/supabaseService';

interface ClientAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    name: string;
}

export const ClientAutocomplete: React.FC<ClientAutocompleteProps> = ({
    value,
    onChange,
    placeholder,
    name
}) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fecha sugestões ao clicar fora
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        onChange(val);

        if (val.length > 2) {
            const results = await getClients(val);
            if (results.length > 0) {
                setSuggestions(results);
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
            }
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelect = (item: string) => {
        onChange(item);
        setShowSuggestions(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <Input
                type="text"
                name={name}
                value={value}
                onChange={handleInput}
                onFocus={() => value.length > 2 && setShowSuggestions(true)}
                className="w-full"
                placeholder={placeholder}
                autoComplete="off"
            />
            {showSuggestions && (
                <div className="absolute z-50 w-full bg-paper border border-line rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto animate-fade-in">
                    {suggestions.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(item)}
                            className="px-4 py-2 hover:bg-surface cursor-pointer text-sm text-txt flex items-center gap-2"
                        >
                            <Search className="w-3 h-3 text-secondary" />
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
