import React, { useEffect, useRef, useState } from "react";
import CommandButtons from "./ui/CommandButtons";
import HelpOverlay from "./ui/HelpOverlay";
import MobileNav from "./ui/MobileNav";
import ToggleSwitch from "./ui/ToggleSwitch.jsx";
import "./friendly.css";

export default function Console() {
  const [guided, setGuided] = useState(() => {
    try { return JSON.parse(localStorage.getItem("guided") || "false"); } catch { return false; }
  });
  const [log, setLog] = useState([]);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const inputRef = useRef(null);
  const logRef = useRef(null);

  useEffect(() => { localStorage.setItem("guided", JSON.stringify(guided)); }, [guided]);
  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { logRef.current?.scrollTo(0, logRef.current.scrollHeight); }, [log]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        window.dispatchEvent(new CustomEvent("help:toggle"));
      }
      if (e.key === "Escape") {
        setLog([]);
        setCommand("");
        setHistoryIndex(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const runCommand = (cmd) => {
    if (!cmd) return;
    const trimmed = cmd.trim();
    setLog(prev => [...prev, { type: "input", text: trimmed }]);
    if (trimmed === "help()" || trimmed === "help") {
      window.dispatchEvent(new CustomEvent("help:toggle"));
      setLog(prev => [...prev, { type: "output", text: "Opened help." }]);
    } else if (trimmed === "run(whoami)" || trimmed === "whoami") {
      setLog(prev => [...prev, { type: "output", text: "Rendering whoami." }]);
    } else if (trimmed === "render(Projects)" || trimmed.toLowerCase() === "projects") {
      setLog(prev => [...prev, { type: "output", text: "Rendering Projects." }]);
    } else if (trimmed === "contact()" || trimmed.toLowerCase() === "contact") {
      setLog(prev => [...prev, { type: "output", text: "Opening contact." }]);
    } else if (trimmed === "info()" || trimmed.toLowerCase() === "info") {
      setLog(prev => [...prev, { type: "output", text: "Opening info." }]);
    } else if (trimmed === "clear" || trimmed === "cls") {
      setLog([]);
    } else {
      setLog(prev => [...prev, { type: "error", text: "Unknown command." }]);
    }
    setHistory(prev => [trimmed, ...prev]);
    setHistoryIndex(null);
    setCommand("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    runCommand(command);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIndex = historyIndex === null ? 0 : Math.min(historyIndex + 1, history.length - 1);
      const value = history[nextIndex] || "";
      setHistoryIndex(nextIndex);
      setCommand(value);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex - 1;
      if (nextIndex < 0) {
        setHistoryIndex(null);
        setCommand("");
      } else {
        setHistoryIndex(nextIndex);
        setCommand(history[nextIndex] || "");
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(command);
    } else if (e.key === "Escape") {
      setLog([]);
      setCommand("");
      setHistoryIndex(null);
    }
  };

  const prev = () => setLog(prev => [...prev, { type: "output", text: "Previous item." }]);
  const next = () => setLog(prev => [...prev, { type: "output", text: "Next item." }]);

  return (
    <div className="console">
      <ToggleSwitch checked={guided} onChange={setGuided} />
      <h1 className="title">if(&)</h1>
      {guided && <CommandButtons onRun={runCommand} />}
      <div className="console-log" ref={logRef}>
        {log.map((line, i) => (
          <div key={i} className={line.type === "input" ? "input-line" : line.type === "error" ? "command-error" : "response"}>
            {line.type === "input" ? "> " : ""}
            {line.text}
          </div>
        ))}
      </div>
      <form className="console-input" onSubmit={onSubmit}>
        <span className="input-line">{">"}</span>
        <input
          ref={inputRef}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command or use the buttons"
          aria-label="Console input"
        />
        <button className="hist-btn" type="button" onClick={prev} aria-label="History up">↑</button>
        <button className="hist-btn" type="button" onClick={next} aria-label="History down">↓</button>
      </form>
      {guided && <HelpOverlay />}
      {guided && <MobileNav onRun={runCommand} onPrev={prev} onNext={next} />}
    </div>
  );
}
