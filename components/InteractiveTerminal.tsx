"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCMS } from "@/context/CMSContext";
import { useTheme } from "@/context/ThemeContext";

interface TerminalLine {
  text: string;
  type: "input" | "output" | "error" | "system";
  prompt?: string;
}

export default function InteractiveTerminal() {
  const { terminalConfig, terminalCommands } = useCMS();
  const { theme, setTheme } = useTheme();

  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const consoleRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const promptText = `${terminalConfig.promptUser || "guest"}@${terminalConfig.promptHost || "gibran"}:~$ `;

  // Helper to parse text and make links (URLs and emails) clickable
  const renderTextWithLinks = (text: string) => {
    const regex = /((?:https?:\/\/|www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}(?:\/[^\s]*)?)|([a-zA-Z0-9.-]+\.(?:com|org|net|dev|id|io|me)(?:\/[^\s]*)?)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/gi;

    const parts = [];
    let lastIndex = 0;
    let match;

    // Reset lastIndex for the regex
    regex.lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;
      
      // Add preceding plain text
      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }

      const matchedStr = match[0];
      const isEmail = matchedStr.includes("@") && !matchedStr.includes("/");

      if (isEmail) {
        parts.push(
          <a
            key={matchIndex}
            href={`mailto:${matchedStr}`}
            className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer hover:opacity-80 transition-all font-semibold"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} // Prevent triggering terminal focus click
          >
            {matchedStr}
          </a>
        );
      } else {
        // It's a web URL
        let url = matchedStr;
        if (!url.toLowerCase().startsWith("http://") && !url.toLowerCase().startsWith("https://")) {
          url = `https://${url}`;
        }
        parts.push(
          <a
            key={matchIndex}
            href={url}
            className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer hover:opacity-80 transition-all font-semibold"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} // Prevent triggering terminal focus click
          >
            {matchedStr}
          </a>
        );
      }

      lastIndex = regex.lastIndex;
    }

    // Add trailing plain text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? <>{parts}</> : text;
  };

  // Initialize with welcome message
  useEffect(() => {
    const welcomeLines = (terminalConfig.welcomeMessage || "")
      .split("\n")
      .map((line) => ({ text: line, type: "system" as const }));

    setTimeout(() => {
      setHistory(welcomeLines);
    }, 0);
  }, [terminalConfig.welcomeMessage]);

  // Autoscroll inside the terminal console container when history grows
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [history]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const command = inputValue.trim();
      const currentPrompt = promptText;
      
      // Add command to input history
      const newHistory = [...history, { text: inputValue, type: "input" as const, prompt: currentPrompt }];
      setHistory(newHistory);
      
      if (command) {
        setCommandHistory([...commandHistory, command]);
        setHistoryIndex(-1);
        processCommand(command, newHistory);
      } else {
        setHistory([...newHistory, { text: "", type: "output" as const }]);
      }
      
      setInputValue("");
    } else if (e.key === "ArrowUp") {
      // History traversal up
      e.preventDefault();
      if (commandHistory.length === 0) return;
      
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : historyIndex - 1;
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInputValue(commandHistory[nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      // History traversal down
      e.preventDefault();
      if (historyIndex === -1) return;
      
      const nextIndex = historyIndex + 1;
      if (nextIndex < commandHistory.length) {
        setHistoryIndex(nextIndex);
        setInputValue(commandHistory[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInputValue("");
      }
    }
  };

  const processCommand = (cmd: string, currentHistory: TerminalLine[]) => {
    const cleanCmd = cmd.toLowerCase().trim();
    
    // 1. Built-in: Clear
    if (cleanCmd === "clear") {
      setHistory([]);
      return;
    }

    // 2. Built-in: Help
    if (cleanCmd === "help") {
      const helpOutput: TerminalLine[] = [
        { text: "Daftar Perintah Shell yang Tersedia:", type: "system" },
        { text: "--------------------------------------------------", type: "system" },
        { text: "help        - Menampilkan instruksi menu bantuan ini", type: "output" },
        { text: "clear       - Membersihkan baris layar terminal", type: "output" },
        { text: "theme       - Mengubah tema situs (hitam <-> putih)", type: "output" },
      ];

      // Load custom commands from CMS
      terminalCommands.forEach((c) => {
        helpOutput.push({
          text: `${c.command.padEnd(11)} - ${c.description}`,
          type: "output",
        });
      });

      setHistory([...currentHistory, ...helpOutput]);
      return;
    }

    // 3. Built-in: Theme Switcher
    if (cleanCmd === "theme") {
      const nextTheme = theme === "light" ? "dark" : "light";
      setTheme(nextTheme);
      setHistory([
        ...currentHistory,
        { text: `Mengalihkan tema situs ke: ${nextTheme.toUpperCase()}`, type: "system" },
      ]);
      return;
    }

    // 4. Custom CMS Commands lookup
    const customMatch = terminalCommands.find((c) => c.command.toLowerCase().trim() === cleanCmd);
    if (customMatch) {
      const outputLines = customMatch.output
        .split("\n")
        .map((line) => ({ text: line, type: "output" as const }));
      
      setHistory([...currentHistory, ...outputLines]);
      return;
    }

    // 5. Unrecognized command
    setHistory([
      ...currentHistory,
      {
        text: `Command '${cmd}' not found. Ketik 'help' untuk daftar perintah.`,
        type: "error",
      },
    ]);
  };

  return (
    <div
      onClick={focusInput}
      className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-border-custom bg-black text-white font-mono shadow-xl cursor-text select-text"
    >
      {/* Window Titlebar */}
      <div className="flex items-center justify-between bg-zinc-900 border-b border-border-custom/30 px-4 py-3 shrink-0 select-none">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-zinc-700 hover:bg-red-500 transition-colors" />
          <div className="h-3 w-3 rounded-full bg-zinc-700 hover:bg-yellow-500 transition-colors" />
          <div className="h-3 w-3 rounded-full bg-zinc-700 hover:bg-green-500 transition-colors" />
        </div>
        <span className="text-xs text-zinc-400 font-semibold select-none">portfolio-shell.sh</span>
        <div className="w-12" /> {/* empty space spacer */}
      </div>

      {/* Terminal Screen Console */}
      <div ref={consoleRef} className="h-80 md:h-96 overflow-y-auto p-4 md:p-6 flex flex-col gap-2 bg-black/95">
        {history.map((line, idx) => (
          <div key={idx} className="leading-relaxed break-all whitespace-pre-wrap font-mono">
            {line.type === "input" && (
              <span className="text-green-400 font-bold select-none">{line.prompt}</span>
            )}
            <span
              className={
                line.type === "error"
                  ? "text-red-400"
                  : line.type === "system"
                  ? "text-blue-400"
                  : line.type === "input"
                  ? "text-white font-bold"
                  : "text-zinc-300"
              }
            >
              {renderTextWithLinks(line.text)}
            </span>
          </div>
        ))}

        {/* Console Input Line */}
        <div className="flex items-center leading-relaxed mt-1 font-mono">
          <span className="text-green-400 font-bold select-none shrink-0">{promptText}</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 p-0 text-sm font-bold caret-green-400 ml-1"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
