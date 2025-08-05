import React, { useState, useEffect, useRef } from "react";
import WhoAmI from "./WhoAmI";
import Projects from "./Projects";
import Contact from "./Contact";
import Info from "./Info";
import "./index.css";

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
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [inputLocked, setInputLocked] = useState(false);
  const [glitchOut, setGlitchOut] = useState(false);

  const inputRef = useRef(null);
  const logRef = useRef(null);

  // HANDLE ESCAPE: unlock, glitch-out, clear log, refocus, auto-scroll
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

  function handleCommand() {
    const input = command.trim();
    if (!input) return;

    setCommand("");
    setHistory((h) => [...h, input]);
    setHistoryIndex(null);
    setIsRunning(true);

    // add entry after brief delay
    setTimeout(() => {
      setLog((l) => [...l, { id: l.length, input }]);
      setIsRunning(false);
      // scroll new entry into view
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }, 500);
  }

  function renderResponse(input) {
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
  }

  return (
    <div className="console">
      {/* TITLE */}
      <h1 className="title">if(&)</h1>

      {/* LOG */}
      <div
        ref={logRef}
        className={`console-log${glitchOut ? " glitch-out" : ""}`}
      >
        {log.map(({ id, input }) => (
          <div key={id}>
            <p className="input-line">&gt; {input}</p>
            <div className="response">{renderResponse(input)}</div>
          </div>
        ))}
        {isRunning && <p className="loading-dots">running</p>}
      </div>

      {/* INPUT */}
      <div className="console-input">
        <span>&gt; </span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => {
            const v = e.target.value;
            setCommand(v);
            const m = COMMANDS.find((c) => c.startsWith(v));
            setSuggestion(m && m !== v ? m : "");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleCommand();
            } else if (!inputLocked && e.key === "ArrowUp") {
              e.preventDefault();
              if (!history.length) return;
              const idx =
                historyIndex === null
                  ? history.length - 1
                  : Math.max(0, historyIndex - 1);
              setHistoryIndex(idx);
              setCommand(history[idx]);
            } else if (!inputLocked && e.key === "ArrowDown") {
              e.preventDefault();
              if (!history.length) return;
              const idx =
                historyIndex === null
                  ? null
                  : historyIndex + 1 >= history.length
                  ? null
                  : historyIndex + 1;
              setHistoryIndex(idx);
              setCommand(idx === null ? "" : history[idx]);
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
