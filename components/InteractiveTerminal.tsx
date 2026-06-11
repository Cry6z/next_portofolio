"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Trophy } from "lucide-react";
import { useCMS } from "@/context/CMSContext";
import { useTheme } from "@/context/ThemeContext";

interface TerminalLine {
  text: string;
  type: "input" | "output" | "error" | "system";
  prompt?: string;
}

interface InteractiveTerminalProps {
  onClose?: () => void;
}

export default function InteractiveTerminal({ onClose }: InteractiveTerminalProps) {
  const { terminalConfig, terminalCommands } = useCMS();
  const { theme, setTheme } = useTheme();

  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Terminal Minigames states
  const [terminalMode, setTerminalMode] = useState<"shell" | "minigames_menu" | "snake" | "tictactoe">("shell");
  
  // Snake states
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 7, y: 7 },
    { x: 7, y: 8 },
    { x: 7, y: 9 },
  ]);
  const [dir, setDir] = useState<{ x: number; y: number }>({ x: 0, y: -1 });
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 3, y: 3 });
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeHighScore, setSnakeHighScore] = useState(0);
  const [snakeGameOver, setSnakeGameOver] = useState(false);
  const [snakeIsRunning, setSnakeIsRunning] = useState(false);

  // Tic-Tac-Toe states
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [tttWinner, setTttWinner] = useState<string | null>(null);
  const [tttDifficulty, setTttDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  const consoleRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const promptText = terminalMode === "minigames_menu"
    ? "arcade@minigames:~$ "
    : `${terminalConfig.promptUser || "guest"}@${terminalConfig.promptHost || "gibran"}:~$ `;

  // Helper to parse text and make links (URLs and emails) clickable
  const renderTextWithLinks = useCallback((text: string) => {
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
            className="text-white underline hover:text-zinc-300 transition-all font-semibold cursor-pointer"
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
            className="text-white underline hover:text-zinc-300 transition-all font-semibold cursor-pointer"
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
  }, []);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeLines = (terminalConfig.welcomeMessage || "")
      .split("\n")
      .map((line) => ({ text: line, type: "system" as const }));

    setTimeout(() => {
      setHistory(welcomeLines);
    }, 0);
  }, [terminalConfig.welcomeMessage]);

  // Autoscroll inside the terminal console container when history grows or mode changes
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [history, terminalMode]);

  // Scroll page down to focus the terminal on minigames launcher or game entry
  useEffect(() => {
    if (terminalMode === "minigames_menu" || terminalMode === "snake" || terminalMode === "tictactoe") {
      setTimeout(() => {
        terminalRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [terminalMode]);

  // Load Snake high score
  useEffect(() => {
    const saved = localStorage.getItem("snake-highscore");
    if (saved) {
      setSnakeHighScore(Number(saved));
    }
  }, []);

  // Snake keyboard controls listener
  useEffect(() => {
    if (terminalMode !== "snake" || !snakeIsRunning || snakeGameOver) return;

    const handleSnakeKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["arrowup", "w"].includes(key) && dir.y !== 1) {
        e.preventDefault();
        setDir({ x: 0, y: -1 });
      } else if (["arrowdown", "s"].includes(key) && dir.y !== -1) {
        e.preventDefault();
        setDir({ x: 0, y: 1 });
      } else if (["arrowleft", "a"].includes(key) && dir.x !== 1) {
        e.preventDefault();
        setDir({ x: -1, y: 0 });
      } else if (["arrowright", "d"].includes(key) && dir.x !== -1) {
        e.preventDefault();
        setDir({ x: 1, y: 0 });
      }
    };

    window.addEventListener("keydown", handleSnakeKeys);
    return () => window.removeEventListener("keydown", handleSnakeKeys);
  }, [terminalMode, dir, snakeIsRunning, snakeGameOver]);

  // Snake game loop interval
  useEffect(() => {
    if (terminalMode !== "snake" || !snakeIsRunning || snakeGameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        if (prevSnake.length === 0) return prevSnake;
        const head = { x: prevSnake[0].x + dir.x, y: prevSnake[0].y + dir.y };

        // 1. Collision detection (Walls)
        if (head.x < 0 || head.x >= 15 || head.y < 0 || head.y >= 15) {
          setSnakeGameOver(true);
          setSnakeIsRunning(false);
          return prevSnake;
        }

        // 2. Collision detection (Self)
        for (const segment of prevSnake) {
          if (segment.x === head.x && segment.y === head.y) {
            setSnakeGameOver(true);
            setSnakeIsRunning(false);
            return prevSnake;
          }
        }

        const nextSnake = [head, ...prevSnake];

        // 3. Food collision detection
        if (head.x === food.x && head.y === food.y) {
          setSnakeScore((s) => {
            const nextScore = s + 10;
            if (nextScore > snakeHighScore) {
              setSnakeHighScore(nextScore);
              localStorage.setItem("snake-highscore", String(nextScore));
            }
            return nextScore;
          });
          
          // Generate new food
          let newFood = { x: 3, y: 3 };
          while (true) {
            newFood = {
              x: Math.floor(Math.random() * 15),
              y: Math.floor(Math.random() * 15),
            };
            // Ensure food is not inside snake body
            let insideSnake = false;
            for (const segment of nextSnake) {
              if (segment.x === newFood.x && segment.y === newFood.y) {
                insideSnake = true;
                break;
              }
            }
            if (!insideSnake) break;
          }
          setFood(newFood);
        } else {
          // Remove tail if didn't eat
          nextSnake.pop();
        }

        return nextSnake;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [terminalMode, dir, food, snakeIsRunning, snakeGameOver, snakeHighScore]);

  // Tic-Tac-Toe win check helper
  const checkWin = (b: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diag
    ];
    for (const [a, c, d] of lines) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) {
        return b[a];
      }
    }
    if (b.every((cell) => cell !== null)) return "draw";
    return null;
  };

  // Tic-Tac-Toe Player Move
  const handleTttClick = (idx: number) => {
    if (board[idx] || tttWinner || !isPlayerTurn || terminalMode !== "tictactoe") return;

    const newBoard = [...board];
    newBoard[idx] = "X";
    setBoard(newBoard);

    const winner = checkWin(newBoard);
    if (winner) {
      setTttWinner(winner);
      return;
    }

    setIsPlayerTurn(false);

    // AI move simulation
    setTimeout(() => {
      makeAiMove(newBoard);
    }, 450);
  };

  // Tic-Tac-Toe AI Intelligent Move with Easy, Medium, and Hard (Impossible) modes
  const makeAiMove = (currentBoard: (string | null)[]) => {
    const available = currentBoard.map((c, i) => c === null ? i : -1).filter((i) => i !== -1);
    if (available.length === 0) return;

    const nextBoard = [...currentBoard];
    let selectedSpot = -1;

    // --- EASY MODE ---
    if (tttDifficulty === "easy") {
      selectedSpot = available[Math.floor(Math.random() * available.length)];
    } 
    // --- MEDIUM MODE ---
    else if (tttDifficulty === "medium") {
      // 60% chance to block or win, 40% chance to play random
      const playSmart = Math.random() < 0.6;
      if (playSmart) {
        // Can AI win?
        for (const spot of available) {
          const testBoard = [...currentBoard];
          testBoard[spot] = "O";
          if (checkWin(testBoard) === "O") {
            selectedSpot = spot;
            break;
          }
        }
        
        // Can Player win? Block!
        if (selectedSpot === -1) {
          for (const spot of available) {
            const testBoard = [...currentBoard];
            testBoard[spot] = "X";
            if (checkWin(testBoard) === "X") {
              selectedSpot = spot;
              break;
            }
          }
        }
      }
      
      if (selectedSpot === -1) {
        selectedSpot = available[Math.floor(Math.random() * available.length)];
      }
    } 
    // --- HARD (IMPOSSIBLE) MODE ---
    else {
      // 1. Can AI win in 1 move?
      for (const spot of available) {
        const testBoard = [...currentBoard];
        testBoard[spot] = "O";
        if (checkWin(testBoard) === "O") {
          selectedSpot = spot;
          break;
        }
      }

      // 2. Can Player win in 1 move? Block it!
      if (selectedSpot === -1) {
        for (const spot of available) {
          const testBoard = [...currentBoard];
          testBoard[spot] = "X";
          if (checkWin(testBoard) === "X") {
            selectedSpot = spot;
            break;
          }
        }
      }

      // 3. Take center if available
      if (selectedSpot === -1) {
        if (available.includes(4)) {
          selectedSpot = 4;
        }
      }

      // 4. Trap blocking specific corner traps
      if (selectedSpot === -1) {
        const playsX = currentBoard.map((c, i) => c === "X" ? i : -1).filter((i) => i !== -1);
        if (playsX.length === 2 && currentBoard[4] === "O") {
          if ((currentBoard[0] === "X" && currentBoard[8] === "X") || (currentBoard[2] === "X" && currentBoard[6] === "X")) {
            const sides = [1, 3, 5, 7].filter(s => available.includes(s));
            if (sides.length > 0) {
              selectedSpot = sides[Math.floor(Math.random() * sides.length)];
            }
          }
        }
      }

      // 5. Take corners if available
      if (selectedSpot === -1) {
        const corners = [0, 2, 6, 8].filter(c => available.includes(c));
        if (corners.length > 0) {
          selectedSpot = corners[Math.floor(Math.random() * corners.length)];
        }
      }

      // 6. Take sides
      if (selectedSpot === -1) {
        selectedSpot = available[Math.floor(Math.random() * available.length)];
      }
    }

    if (selectedSpot !== -1) {
      nextBoard[selectedSpot] = "O";
    }

    setBoard(nextBoard);
    setTttWinner(checkWin(nextBoard));
    setIsPlayerTurn(true);
  };

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

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
        
        if (terminalMode === "minigames_menu") {
          const cleanCmd = command.toLowerCase().trim();
          if (cleanCmd === "1") {
            setTerminalMode("snake");
            // Reset Snake State
            setSnake([{ x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }]);
            setDir({ x: 0, y: -1 });
            setSnakeScore(0);
            setSnakeGameOver(false);
            setSnakeIsRunning(true);
          } else if (cleanCmd === "2") {
            setTerminalMode("tictactoe");
            // Reset tic-tac-toe state
            setBoard(Array(9).fill(null));
            setTttWinner(null);
            setIsPlayerTurn(true);
          } else if (cleanCmd === "exit" || cleanCmd === "quit") {
            setTerminalMode("shell");
            setHistory([...newHistory, { text: "keluar dari retro arcade. kembali ke shell.", type: "system" }]);
          } else if (cleanCmd === "clear" || cleanCmd === "cls") {
            setHistory([]);
          } else {
            setHistory([...newHistory, { text: "input salah. ketik '1' untuk snake, '2' untuk tic-tac-toe, atau 'exit' untuk keluar.", type: "error" }]);
          }
        } else {
          processCommand(command, newHistory);
        }
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
    if (cleanCmd === "clear" || cleanCmd === "cls") {
      setHistory([]);
      return;
    }

    // 2. Built-in: Help
    if (cleanCmd === "help") {
      const helpOutput: TerminalLine[] = [
        { text: "daftar perintah shell yang tersedia:", type: "system" },
        { text: "--------------------------------------------------", type: "system" },
        { text: "help        - menampilkan instruksi menu bantuan ini", type: "output" },
        { text: "clear / cls - membersihkan baris layar terminal", type: "output" },
        { text: "theme       - mengubah tema situs (hitam <-> putih)", type: "output" },
        { text: "minigames   - membuka menu retro arcade game di terminal", type: "output" },
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
        { text: `mengalihkan tema situs ke: ${nextTheme.toLowerCase()}`, type: "system" },
      ]);
      return;
    }

    // Built-in: Minigames Launcher
    if (cleanCmd === "minigames") {
      setTerminalMode("minigames_menu");
      setHistory([
        ...currentHistory,
        { text: "==================================================", type: "system" },
        { text: "retro terminal arcade v1.0.0", type: "system" },
        { text: "ketik '1' untuk bermain game snake", type: "output" },
        { text: "ketik '2' untuk bermain game tic-tac-toe", type: "output" },
        { text: "ketik 'exit' untuk kembali ke shell standar.", type: "output" },
        { text: "==================================================", type: "system" },
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
        text: `command '${cmd}' not found. ketik 'help' untuk daftar perintah.`,
        type: "error",
      },
    ]);
  };

  return (
    <div
      ref={terminalRef}
      onClick={focusInput}
      className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-border-custom bg-black text-white font-mono shadow-xl cursor-text select-text"
    >
      {/* Window Titlebar */}
      <div className="flex items-center justify-between bg-zinc-900 border-b border-border-custom/30 px-4 py-3 shrink-0 select-none">
        <div className="flex gap-2">
          <button 
            type="button" 
            onClick={(e) => {
              e.stopPropagation();
              if (onClose) onClose();
            }}
            className={`h-3 w-3 rounded-full ${onClose ? 'bg-red-500 hover:bg-red-650' : 'bg-zinc-700 hover:bg-red-500'} transition-colors cursor-pointer border-none outline-none`}
            aria-label="Close terminal"
          />
          <div className="h-3 w-3 rounded-full bg-zinc-700 hover:bg-yellow-500 transition-colors" />
          <div className="h-3 w-3 rounded-full bg-zinc-700 hover:bg-green-500 transition-colors" />
        </div>
        <span className="text-xs text-zinc-400 font-semibold select-none">portfolio-shell.sh</span>
        {onClose ? (
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onClose) onClose();
            }}
            className="text-xs text-zinc-500 hover:text-zinc-300 font-mono transition-colors cursor-pointer mr-1"
          >
            [close]
          </button>
        ) : (
          <div className="w-12" />
        )}
      </div>

      {/* Terminal Screen Console */}
      <div ref={consoleRef} className="h-80 md:h-96 overflow-y-auto p-4 md:p-6 flex flex-col gap-2 bg-black/95 relative justify-start">
        {terminalMode === "snake" && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-300 select-none my-auto">
            <div className="flex justify-between w-full max-w-xs text-[10px] font-mono border-b border-zinc-800 pb-1 shrink-0">
              <span className="flex items-center gap-1 font-bold text-zinc-400"><Trophy className="h-3.5 w-3.5" /> high: {snakeHighScore}</span>
              <span className="font-bold">score: {snakeScore}</span>
            </div>
            
            {/* The 15x15 pixel grid */}
            <div 
              className="bg-zinc-950 border border-zinc-800 p-1 rounded shadow-inner shrink-0"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(15, 1fr)",
                gridTemplateRows: "repeat(15, 1fr)",
                gap: "1px",
                width: "210px",
                height: "210px"
              }}
            >
              {Array.from({ length: 15 * 15 }).map((_, idx) => {
                const x = idx % 15;
                const y = Math.floor(idx / 15);
                const isHead = snake[0] && snake[0].x === x && snake[0].y === y;
                const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
                const isFood = food.x === x && food.y === y;
                
                return (
                  <div 
                    key={idx}
                    className={`w-full h-full rounded-sm transition-all duration-75 ${
                      isHead 
                        ? "bg-white shadow-[0_0_3px_rgba(255,255,255,0.5)]" 
                        : isBody 
                        ? "bg-zinc-500" 
                        : isFood 
                        ? "bg-zinc-300 animate-pulse" 
                        : "bg-zinc-900/30"
                    }`}
                  />
                );
              })}
            </div>

            <div className="flex items-center gap-4 text-xs font-mono mt-2 shrink-0">
              {snakeGameOver ? (
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-zinc-400 font-bold animate-bounce text-sm">game over!</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setSnake([{ x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }]);
                        setDir({ x: 0, y: -1 });
                        setSnakeScore(0);
                        setSnakeGameOver(false);
                        setSnakeIsRunning(true);
                      }}
                      className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 rounded text-white font-bold cursor-pointer text-[10px]"
                    >
                      main lagi
                    </button>
                    <button 
                      onClick={() => setTerminalMode("minigames_menu")}
                      className="px-3 py-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded text-zinc-400 cursor-pointer text-[10px]"
                    >
                      keluar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-[9px] text-zinc-500">
                  <span className="hidden md:inline">kontrol: <b>w/a/s/d</b> atau <b>arrow keys</b></span>
                  <span className="md:hidden">kontrol: gunakan <b>gamepad</b> di bawah</span>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => setSnakeIsRunning(!snakeIsRunning)}
                      className="px-2 py-0.5 border border-zinc-850 hover:border-zinc-650 rounded bg-zinc-900 text-zinc-350 font-mono font-bold cursor-pointer"
                    >
                      {snakeIsRunning ? "pause" : "resume"}
                    </button>
                    <button
                      onClick={() => setTerminalMode("minigames_menu")}
                      className="px-2 py-0.5 border border-zinc-850 hover:border-zinc-650 rounded bg-zinc-950 text-zinc-400 font-mono cursor-pointer"
                    >
                      exit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {terminalMode === "tictactoe" && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-300 select-none my-auto">
            <div className="text-[10px] font-mono tracking-wider border-b border-zinc-800 pb-1 w-full max-w-xs text-center font-bold">
              tic-tac-toe (melawan ai)
            </div>

            {/* Difficulty Mode Selector */}
            <div className="flex gap-2 text-[9px] font-mono mb-1">
              {(["easy", "medium", "hard"] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => {
                    setTttDifficulty(diff);
                    setBoard(Array(9).fill(null));
                    setTttWinner(null);
                    setIsPlayerTurn(true);
                  }}
                  className={`px-2 py-0.5 border rounded lowercase transition-all cursor-pointer ${
                    tttDifficulty === diff
                      ? "bg-zinc-900 text-white border-zinc-700 font-bold"
                      : "bg-zinc-950 text-zinc-500 border-zinc-900 hover:text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {diff === "hard" ? "hard (impossible)" : diff}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-2 bg-zinc-950 border border-zinc-800 p-2.5 rounded shadow-inner" style={{ width: "180px", height: "180px" }}>
              {board.map((cell, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTttClick(idx)}
                  disabled={cell !== null || tttWinner !== null || !isPlayerTurn}
                  className={`w-full h-full border border-zinc-900 rounded flex items-center justify-center text-lg font-bold font-mono transition-all ${
                    cell === "X"
                      ? "text-white bg-zinc-900"
                      : cell === "O"
                      ? "text-zinc-400 bg-zinc-950"
                      : "bg-zinc-900/25 hover:bg-zinc-850/40 text-transparent hover:text-zinc-750/40"
                  } ${cell === null && !tttWinner && isPlayerTurn ? "cursor-pointer" : "cursor-not-allowed"}`}
                  style={{ minWidth: "50px", minHeight: "50px" }}
                >
                  {cell || "\u00A0"}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center gap-2 text-xs font-mono mt-1">
              {tttWinner ? (
                <div className="flex flex-col items-center gap-1.5">
                  <span className="font-bold text-center text-[11px]">
                    {tttWinner === "X" && <span className="text-white animate-pulse">anda menang!</span>}
                    {tttWinner === "O" && <span className="text-zinc-400 font-bold">ai komputer menang!</span>}
                    {tttWinner === "draw" && <span className="text-zinc-300">game seri (draw)!</span>}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setBoard(Array(9).fill(null));
                        setTttWinner(null);
                        setIsPlayerTurn(true);
                      }}
                      className="px-3 py-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-750 rounded text-white font-bold cursor-pointer text-[10px]"
                    >
                      main lagi
                    </button>
                    <button
                      onClick={() => setTerminalMode("minigames_menu")}
                      className="px-3 py-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded text-zinc-400 cursor-pointer text-[10px]"
                    >
                      keluar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 text-[10px]">
                  <span className={isPlayerTurn ? "text-white font-bold" : "text-zinc-500 animate-pulse"}>
                    {isPlayerTurn ? "giliran anda (x)" : "ai sedang berpikir (o)..."}
                  </span>
                  <button
                    onClick={() => setTerminalMode("minigames_menu")}
                    className="px-2 py-0.5 border border-zinc-800 hover:border-zinc-500 rounded bg-zinc-950 text-zinc-500 hover:text-zinc-300 font-mono cursor-pointer"
                  >
                    exit
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {(terminalMode === "shell" || terminalMode === "minigames_menu") && (
          <div className="flex-1 w-full flex flex-col gap-2">
            {history.map((line, idx) => (
              <div key={idx} className="leading-relaxed break-all whitespace-pre-wrap font-mono">
                {line.type === "input" && (
                  <span className="text-zinc-400 font-bold select-none">{line.prompt}</span>
                )}
                <span
                  className={
                    line.type === "error"
                      ? "text-zinc-400"
                      : line.type === "system"
                      ? "text-zinc-400"
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
              <span className="text-zinc-400 font-bold select-none shrink-0">{promptText}</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 p-0 text-sm font-bold caret-white ml-1"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />
            </div>
          </div>
        )}
      </div>
      {/* Touch D-pad Touchscreen Gamepad Panel - Rendered outside the console screen to prevent vertical compression */}
      {terminalMode === "snake" && (
        <div className={`bg-zinc-950 border-t border-border-custom/30 py-6 flex flex-col items-center justify-center select-none md:hidden transition-all duration-300 ${(!snakeIsRunning || snakeGameOver) ? "opacity-40 pointer-events-none animate-pulse" : "opacity-100"}`}>
          <div className="flex flex-col items-center gap-1.5">
            {/* UP */}
            <button
              type="button"
              onTouchStart={(e) => { e.preventDefault(); if (dir.y !== 1) setDir({ x: 0, y: -1 }); }}
              onClick={(e) => { e.preventDefault(); if (dir.y !== 1) setDir({ x: 0, y: -1 }); }}
              className="w-14 h-11 bg-zinc-900 border border-zinc-700 text-zinc-300 active:bg-white active:text-black rounded-lg flex items-center justify-center font-bold text-lg select-none cursor-pointer transition-colors shadow-md"
              aria-label="Snake Up"
            >
              ▲
            </button>
            {/* LEFT, D-PAD CENTER, RIGHT */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onTouchStart={(e) => { e.preventDefault(); if (dir.x !== 1) setDir({ x: -1, y: 0 }); }}
                onClick={(e) => { e.preventDefault(); if (dir.x !== 1) setDir({ x: -1, y: 0 }); }}
                className="w-14 h-11 bg-zinc-900 border border-zinc-700 text-zinc-300 active:bg-white active:text-black rounded-lg flex items-center justify-center font-bold text-lg select-none cursor-pointer transition-colors shadow-md"
                aria-label="Snake Left"
              >
                ◀
              </button>
              <div className="w-10 h-10 rounded-full border border-zinc-800 bg-black flex items-center justify-center text-xs text-zinc-500/50 select-none">
                🕹️
              </div>
              <button
                type="button"
                onTouchStart={(e) => { e.preventDefault(); if (dir.x !== -1) setDir({ x: 1, y: 0 }); }}
                onClick={(e) => { e.preventDefault(); if (dir.x !== -1) setDir({ x: 1, y: 0 }); }}
                className="w-14 h-11 bg-zinc-900 border border-zinc-700 text-zinc-300 active:bg-white active:text-black rounded-lg flex items-center justify-center font-bold text-lg select-none cursor-pointer transition-colors shadow-md"
                aria-label="Snake Right"
              >
                ▶
              </button>
            </div>
            {/* DOWN */}
            <button
              type="button"
              onTouchStart={(e) => { e.preventDefault(); if (dir.y !== -1) setDir({ x: 0, y: 1 }); }}
              onClick={(e) => { e.preventDefault(); if (dir.y !== -1) setDir({ x: 0, y: 1 }); }}
              className="w-14 h-11 bg-zinc-900 border border-zinc-700 text-zinc-300 active:bg-white active:text-black rounded-lg flex items-center justify-center font-bold text-lg select-none cursor-pointer transition-colors shadow-md"
              aria-label="Snake Down"
            >
              ▼
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
