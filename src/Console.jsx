/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import WhoAmI from "./WhoAmI";
import Projects from "./Projects";
import Contact from "./Contact";
import Info from "./Info";
import "./Console.css";

const COMMANDS = [
  "run(whoami)",
  "render(Projects)",
  "contact()",
  "info()",
  "help()",
];

export default function Console() {
  const [log, setLog] = useState([]);
  const [command, setCommand] = useState("");
  const [currentCommand, setCurrentCommand] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [inputLocked, setInputLocked] = useState(false);
  const [glitchOut, setGlitchOut] = useState(false);

  const inputRef = useRef(null);
  const logRef = useRef(null);

  // Escape: unlock, glitch-out, clear log, refocus, auto-scroll
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setInputLocked(false);
        setGlitchOut(true);
        setTimeout(() => {
          setLog([]);
          setGlitchOut(false);
          if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
          }
          inputRef.current?.focus();
        }, 400);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleCommand = () => {
    const input = command.trim();
    if (!input) return;

    setCurrentCommand(input);
    setCommand("");
    setHistory((prev) => [...prev, input]);
    setHistoryIndex(null);
    setIsRunning(true);

    const newEntry = { id: log.length, input };
    setTimeout(() => {
      setLog((prevLog) => [...prevLog, newEntry]);
      setIsRunning(false);
      // scroll new entry into view
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }, 500);
  };

  const renderResponse = (input) => {
    switch (input) {
      case "run(whoami)":
        return <WhoAmI />;
      case "render(Projects)":
        return <Projects setInputLocked={setInputLocked} />;
      case "contact()":
        return <Contact setInputLocked={setInputLocked} />;
      case "info()":
        return <Info setInputLocked={setInputLocked} />;
      case "help()":
        return (
          <ul>
            {COMMANDS.map((cmd) => (
              <li key={cmd}>{cmd}</li>
            ))}
          </ul>
        );
      default:
        return <p>// unknown command: {input}</p>;
    }
  };

  return (
    <div className="console">
      <div
        className={`console-log${glitchOut ? " glitch-out" : ""}`}
        ref={logRef}
      >
        {log.map((entry) => (
          <div key={entry.id}>
            <p className="input-line">&gt; {entry.input}</p>
            <div className="response">{renderResponse(entry.input)}</div>
          </div>
        ))}
        {isRunning && <p className="loading-dots">running</p>}
      </div>

      <div className="console-input">
        <span>&gt; </span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => {
            const value = e.target.value;
            setCommand(value);
            const match = COMMANDS.find((cmd) => cmd.startsWith(value));
            setSuggestion(match && match !== value ? match : "");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleCommand();
            } else if (!inputLocked && e.key === "ArrowUp") {
              e.preventDefault();
              if (history.length === 0) return;
              const newIndex =
                historyIndex === null
                  ? history.length - 1
                  : Math.max(0, historyIndex - 1);
              setHistoryIndex(newIndex);
              setCommand(history[newIndex]);
            } else if (!inputLocked && e.key === "ArrowDown") {
              e.preventDefault();
              if (history.length === 0) return;
              const newIndex =
                historyIndex === null
                  ? null
                  : historyIndex + 1 >= history.length
                  ? null
                  : historyIndex + 1;
              setHistoryIndex(newIndex);
              setCommand(newIndex === null ? "" : history[newIndex]);
            } else if (e.key === "Tab") {
              e.preventDefault();
              if (suggestion) {
                setCommand(suggestion);
                setSuggestion("");
              }
            }
          }}
          autoFocus
          spellCheck={false}
        />
        {suggestion && <div className="suggestion">↪ {suggestion}</div>}
      </div>
    </div>
  );
}
