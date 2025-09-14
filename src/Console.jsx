import React, { useState, useEffect, useRef } from "react";
import WhoAmI from "./WhoAmI";
import Projects from "./Projects";
import Contact from "./Contact";
import Info from "./Info";
import CommandButtons from "./ui/CommandButtons";
import "./index.css";

const COMMANDS = ["run(whoami)", "render(Projects)", "contact()", "info()", "help()"];

export default function Console() {
  const [guided, setGuided] = useState(() => {
    try { return JSON.parse(localStorage.getItem("guided") || "false"); } catch { return false; }
  });
  const [log, setLog] = useState([]);
  const [command, setCommand] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [inputLocked, setInputLocked] = useState(false);
  const [glitchOut, setGlitchOut] = useState(false);
  const [landing, setLanding] = useState(true);

  const inputRef = useRef(null);
  const logRef = useRef(null);

  useEffect(() => { localStorage.setItem("guided", JSON.stringify(guided)); }, [guided]);
  useEffect(() => { inputRef.current?.focus(); }, [landing]);
  useEffect(() => { logRef.current?.scrollTo(0, logRef.current.scrollHeight); }, [log]);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") {
        setInputLocked(false);
        setGlitchOut(true);
        setCommand("");
        setHistoryIndex(null);
        setTimeout(() => {
          setLog([]);
          setGlitchOut(false);
          setLanding(true);
          logRef.current?.scrollTo(0, logRef.current.scrollHeight);
          inputRef.current?.focus();
        }, 400);
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const normalizeCmd = (c) => {
    const s = (c || "").trim().toLowerCase();
    if (s === "whoami") return "run(whoami)";
    if (s === "projects") return "render(Projects)";
    if (s === "contact") return "contact()";
    if (s === "info") return "info()";
    return c;
  };

  const execute = (raw) => {
    const input = (raw || "").trim();
    if (!input) return;
    if (input === "clear" || input === "cls") {
      setLog([]);
      setHistory((h) => [...h, input]);
      setHistoryIndex(null);
      setCommand("");
      return;
    }
    setLanding(false);
    setCommand("");
    setHistory((h) => [...h, input]);
    setHistoryIndex(null);
    setIsRunning(true);
    setTimeout(() => {
      setLog((l) => [...l, { id: l.length, input }]);
      setIsRunning(false);
      logRef.current?.scrollTo(0, logRef.current.scrollHeight);
    }, 400);
  };

  const handleCommand = () => execute(command);

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
            {COMMANDS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        );
      default:
        return <p>unknown command: {input}</p>;
    }
  };

  const prevHistory = () => {
    if (!history.length) return;
    const idx = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
    setHistoryIndex(idx);
    setCommand(history[idx]);
  };

  const nextHistory = () => {
    if (!history.length) return;
    const idx = historyIndex === null ? null : historyIndex + 1 >= history.length ? null : historyIndex + 1;
    setHistoryIndex(idx);
    setCommand(idx === null ? "" : history[idx]);
  };

  if (landing) {
    return (
      <div className="landing">
        <h1>if(&)</h1>
        <p>// an interactive portfolio</p>
        <button className="enter-btn" onClick={() => setLanding(false)}>enter ↵</button>
      </div>
    );
  }

  return (
    <div className="console">
      <div className="header">
        <div className="toggle">
          <label className="switch">
            <input
              type="checkbox"
              checked={guided}
              onChange={() => setGuided(!guided)}
            />
            <span className="slider"></span>
          </label>
          <span className="mode-label">{guided ? "Guided" : "Console"}</span>
        </div>
      </div>

      <h1 className="title">if(&)</h1>

      {guided && (
        <div className="command-bar">
          <CommandButtons onRun={(c) => execute(normalizeCmd(c))} />
        </div>
      )}

      <div ref={logRef} className={`console-log${glitchOut ? " glitch-out" : ""}`}>
        {log.map(({ id, input }) => (
          <div key={id}>
            <p className="input-line">&gt; {input}</p>
            <div className="response">{renderResponse(input)}</div>
          </div>
        ))}
        {isRunning && <p className="loading-dots">running</p>}
      </div>

      <div className="console-input">
        <span>&gt;</span>
        <button className="hist-btn" onClick={prevHistory}>▲</button>
        <button className="hist-btn" onClick={nextHistory}>▼</button>
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
