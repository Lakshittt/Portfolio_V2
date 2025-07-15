import { useState, useEffect } from "react";

interface TerminalLoaderProps {
  onComplete: () => void;
}

const Loader = ({ onComplete }: TerminalLoaderProps) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  const bootSequence = [
    // "Initializing portfolio systems...",
    "Loading profile: Lakshit Jain",
    "Establishing terminal connection...",
    "Rendering UI components...",
    "[███████████████████] 100% Complete",
    // "lakshit@portfolio:~$ Portfolio loaded successfully",
  ];

  useEffect(() => {
    const typewriter = () => {
      if (currentLine < bootSequence.length) {
        const currentText = bootSequence[currentLine];
        if (currentChar < currentText.length) {
          setTimeout(() => {
            setCurrentChar(currentChar + 1);
          }, Math.random() * 50 + 30); // Random typing speed
        } else {
          setTimeout(() => {
            setCurrentLine(currentLine + 1);
            setCurrentChar(0);
          }, 100); // Pause between lines
        }
      } else {
        setTimeout(() => {
          setIsCompleting(true);
          setTimeout(() => {
            onComplete();
          }, 300); // Wait for curtain animation to complete
        }, 400);
      }
    };

    typewriter();
  }, [currentLine, currentChar, onComplete]);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center overflow-hidden transition-transform duration-700 ease-in-out ${
        isCompleting ? "transform -translate-y-full" : ""
      }`}
    >
      {/* CRT Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-pulse opacity-20" />

      {/* Scan Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scan-lines h-full w-full opacity-10" />
      </div>

      {/* Terminal Content */}
      <div className="relative z-10 font-mono text-green-400 p-8 max-w-2xl w-full">
        <div className="space-y-2">
          {bootSequence.slice(0, currentLine).map((line, index) => (
            <div key={index} className="flex items-center">
              <span className="text-green-400 glitch-text">{line}</span>
            </div>
          ))}

          {/* Current typing line */}
          {currentLine < bootSequence.length && (
            <div className="flex items-center">
              <span className="text-green-400">
                {bootSequence[currentLine].slice(0, currentChar)}
              </span>
              {showCursor && <span className="bg-green-400 text-black">█</span>}
            </div>
          )}
        </div>

        {/* Terminal prompt indicator */}
        <div className="mt-8 text-green-600/60 text-sm">
          System Status: Initializing...
        </div>
      </div>
    </div>
  );
};
export default Loader;
