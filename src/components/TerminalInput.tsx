import { forwardRef, KeyboardEvent } from "react";

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ value, onChange, onKeyDown }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <span className="text-secondary shrink-0">guest@portfolio:~$</span>
        <div className="flex-1 relative">
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="w-full bg-transparent border-none outline-none text-foreground font-mono caret-transparent"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
          {/* Custom cursor */}
          <span 
            className="absolute top-0 text-foreground animate-blink pointer-events-none"
            style={{ left: `${value.length}ch` }}
          >
            █
          </span>
        </div>
      </div>
    );
  }
);

TerminalInput.displayName = "TerminalInput";
