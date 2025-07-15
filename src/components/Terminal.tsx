import React from "react";
import { Terminal as TerminalIcon } from "lucide-react";

interface CommandOutput {
  command: string;
  output: React.ReactNode;
  timestamp: Date;
}

interface TerminalProps {
  history: CommandOutput[];
  isLoading: boolean;
  input: string;
  setInput: (v: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  terminalRef: React.RefObject<HTMLDivElement>;
  focusInput: () => void;
}

const Terminal: React.FC<TerminalProps> = ({
  history,
  isLoading,
  input,
  setInput,
  handleSubmit,
  handleKeyDown,
  inputRef,
  terminalRef,
  focusInput,
}) => (
  <div className="w-full lg:w-2/3 lg:border-l border-gray-800 pt-16">
    <div
      ref={terminalRef}
      className="h-screen p-4 lg:p-4 px-2 overflow-y-auto cursor-text"
      onClick={focusInput}
    >
      <div className="max-w-6xl mx-auto px-2">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm lg:text-base">
          <TerminalIcon size={16} />
          <span className="hidden sm:inline">Portfolio Terminal v1.0.0</span>
          <span className="sm:hidden">Terminal v1.0.0</span>
        </div>
        {/* Command History */}
        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={index}>
              {item.command && (
                <div className="flex items-center gap-2 text-green-500">
                  <span className="text-yellow-400">
                    lakshitJain@portfolio:~$
                  </span>
                  <span>{item.command}</span>
                </div>
              )}
              <div className="mt-2">{item.output}</div>
            </div>
          ))}
        </div>
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 mt-4 text-yellow-400">
            <span>Processing</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
              <div
                className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}
        {/* Command Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4">
          <span className="text-yellow-400">lakshitJain@portfolio:~$</span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent outline-none text-green-500 pr-4"
              autoFocus
              spellCheck={false}
              style={{ caretColor: "transparent" }} // Hide native caret
            />
            {/* Custom Pulsating Caret */}
            <span
              className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2"
              style={{
                transform: `translateY(-50%) translateX(calc(${input.length}ch + 0.25rem))`,
              }}
            >
              <span className="block w-[1ch] h-6 bg-green-500 animate-blink" />
            </span>
          </div>
        </form>
        {/* Footer Padding */}
        <div className="h-20"></div>
      </div>
    </div>
  </div>
);

export default Terminal;
