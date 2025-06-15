
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

interface SmartInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  className?: string;
  onSuggestionSelect?: (suggestion: string) => void;
}

export default function SmartInput({
  value,
  onChange,
  placeholder,
  suggestions = [],
  className,
  onSuggestionSelect,
}: SmartInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && suggestions.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setIsOpen(filtered.length > 0 && value.length > 0);
    } else {
      setFilteredSuggestions([]);
      setIsOpen(false);
    }
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSuggestionSelect?.(suggestion);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn("pr-8", className)}
          onFocus={() => {
            if (filteredSuggestions.length > 0) {
              setIsOpen(true);
            }
          }}
        />
        {suggestions.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
          </Button>
        )}
      </div>

      {isOpen && filteredSuggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between group"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="text-sm">{suggestion}</span>
              <Check className="w-3 h-3 opacity-0 group-hover:opacity-100 text-primary" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
