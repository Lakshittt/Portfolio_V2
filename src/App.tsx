import React, { useState, useEffect, useRef } from "react";
import Card from "./components/Card";
import Terminal from "./components/Terminal";
import Loader from "./components/Loader";
import { commands } from "./commands";

interface CommandOutput {
  command: string;
  output: React.ReactNode;
  timestamp: Date;
}

function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [viewCounterImg, setViewCounterImg] = useState<string | null>(null);
  const [loaderLoading, setLoaderLoading] = useState(true);

  useEffect(() => {
    const welcomeOutput: CommandOutput = {
      command: "",
      output: (
        <div className="space-y-3">
          <div className="text-green-500 font-bold text-lg">
            Welcome to my Interactive Portfolio Terminal!
          </div>
          <div className="text-gray-300">
            <p>
              Type <span className="text-yellow-400">'help'</span> to see
              available commands.
            </p>
            <p>Use arrow keys to navigate command history.</p>
          </div>
          <div className="text-gray-500 text-sm">
            Last login: {new Date().toLocaleString()}
          </div>
        </div>
      ),
      timestamp: new Date(),
    };
    setHistory([welcomeOutput]);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }

    const img = new Image();
    img.src =
      "https://counter1.optistats.ovh/private/freecounterstat.php?c=4f851adnbs5l59scxty3d43jl8xat2kj";
    img.onload = () => {
      setViewCounterImg(img.src);
    };
  }, [history]);

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    if (trimmedCmd === "clear") {
      setHistory([]);
      return;
    }

    setIsLoading(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const output = commands[trimmedCmd as keyof typeof commands]?.() || (
      <div className="text-red-400">
        Command not found: {cmd}. Type 'help' for available commands.
      </div>
    );

    const newOutput: CommandOutput = {
      command: cmd,
      output,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, newOutput]);
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setCommandHistory((prev) => [...prev, input]);
      setHistoryIndex(-1);
      executeCommand(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const handleLoadingComplete = () => {
    setLoaderLoading(false);
  };

  const Clock = () => {
    const [time, setTime] = React.useState(new Date());

    React.useEffect(() => {
      const interval = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(interval);
    }, []);

    return (
      <span className="text-green-500 text-sm">
        {time.toLocaleTimeString()}
      </span>
    );
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="bg-black min-h-screen h-screen">
      {loaderLoading ? (
        <Loader onComplete={handleLoadingComplete} />
      ) : (
        <div className="min-h-screen h-screen font-mono flex text-green-500 relative overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="/bg.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />
          <div className="fixed top-0 left-0 w-full h-20 z-30 flex flex-row justify-between px-6 bg-black bg-opacity-30 backdrop-blur-md">
            <div className="flex flex-col justify-center">
              <p className="text-green-500 text-lg font-bold">Lakshit Jain</p>
              <p className="text-gray-300 text-sm">Software Developer</p>
            </div>

            {viewCounterImg && (
              <div className="hidden sm:flex items-center gap-2 pb-1">
                <span className="text-gray-300">Portfolio Views:</span>
                <img
                  width={50}
                  height={50}
                  className="pb-1"
                  src={viewCounterImg}
                  title="website counter"
                  alt="website counter"
                  style={{ display: "none" }}
                  onLoad={(e) => (e.currentTarget.style.display = "inline")}
                />
              </div>
            )}
          </div>
          <div className="relative z-20 flex w-full">
            <Card
              cardFlipped={cardFlipped}
              setCardFlipped={setCardFlipped}
              isCardHovered={isCardHovered}
              setIsCardHovered={setIsCardHovered}
              cardRef={cardRef}
            />
            <Terminal
              history={history}
              isLoading={isLoading}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              handleKeyDown={handleKeyDown}
              inputRef={inputRef}
              terminalRef={terminalRef}
              focusInput={focusInput}
            />
          </div>
          <footer className="fixed bottom-0 left-0 w-full z-30 flex justify-end items-center py-2 pr-4">
            <Clock />
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
