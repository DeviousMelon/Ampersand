import React, { useEffect, useRef, useState } from "react";
import TopBar from "./ui/TopBar.jsx";
import CommandButtons from "./ui/CommandButtons.jsx";
import HelpOverlay from "./ui/HelpOverlay.jsx";
import MobileNav from "./ui/MobileNav.jsx";
import ToggleSwitch from "./ui/ToggleSwitch.jsx";
import WhoAmI from "./WhoAmI";
import Projects from "./Projects";
import Contact from "./Contact";
import Info from "./Info";
import "./friendly.css";

export default function Console() {
  const [guided, setGuided] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [command, setCommand] = useState("");
  const [log, setLog] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [view, setView] = useState(null);
  const inputRef = useRef(null);
  const logRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        window.dispatchEvent(new CustomEvent("help:toggle"));
      }
      if (e.key === "Escape") {
        try {
          const input = document.querySelector('input.console-input');
          if (input) input.blur();
        } catch { }
        setLog([]);
        setView(null);
        setCommand("");
        setShowLanding(true);
        setGuided(false);
        try { localStorage.removeItem("guided"); } catch { }
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { inputRef.current?.focus(); }, [view, guided, showLanding]);

  const appendLog = (items) => {
    setLog((prev) => {
      const next = Array.isArray(items) ? [...prev, ...items] : [...prev, items];
      return next;
    });
  };

  const clearAll = () => {
    setLog([]);
    setView(null);
    setCommand("");
    setShowLanding(true);
  };

  const runCommand = (raw) => {
    const value = (raw ?? command).trim();
    if (!value) return;
    setHistory((h) => [value, ...h.slice(0, 49)]);
    setHistoryIndex(null);
    appendLog({ type: "input", text: `> ${value}` });
    const [cmd, ...rest] = value.split(/\s+/);
    const arg = rest.join(" ");
    if (cmd.toLowerCase() === "clear") {
      clearAll();
      return;
    }
    if (cmd.toLowerCase() === "guided") {
      if (arg.toLowerCase() === "on") {
        setGuided(true);
        try { localStorage.setItem("guided", "true"); } catch { }
        appendLog({ type: "response", text: "guided on" });
        return;
      }
      if (arg.toLowerCase() === "off") {
        setGuided(false);
        try { localStorage.setItem("guided", "false"); } catch { }
        appendLog({ type: "response", text: "guided off" });
        return;
      }
    }
    if (["whoami", "who", "me"].includes(cmd.toLowerCase())) {
      setView("whoami");
      setShowLanding(false);
      appendLog({ type: "response", text: "loading whoami" });
      setCommand("");
      return;
    }
    if (["projects", "proj"].includes(cmd.toLowerCase())) {
      setView("projects");
      setShowLanding(false);
      appendLog({ type: "response", text: "loading projects" });
      setCommand("");
      return;
    }
    if (["contact", "email"].includes(cmd.toLowerCase())) {
      setView("contact");
      setShowLanding(false);
      appendLog({ type: "response", text: "loading contact" });
      setCommand("");
      return;
    }
    if (["info", "about", "help"].includes(cmd.toLowerCase())) {
      setView("info");
      setShowLanding(false);
      appendLog({ type: "response", text: "loading info" });
      setCommand("");
      return;
    }
    if (["next", "prev"].includes(cmd.toLowerCase())) {
      window.dispatchEvent(new CustomEvent(cmd.toLowerCase() === "next" ? "guided:next" : "guided:prev"));
      setCommand("");
      return;
    }
    appendLog({ type: "response", text: `unknown command: ${value}` });
    setCommand("");
  };

  const prev = () => window.dispatchEvent(new CustomEvent("guided:prev"));
  const next = () => window.dispatchEvent(new CustomEvent("guided:next"));

  const handleSubmit = (e) => {
    e.preventDefault();
    runCommand();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setLog([]);
      setView(null);
      setCommand("");
      setShowLanding(true);
      setGuided(false);
      try { localStorage.removeItem("guided"); } catch { }
      return;
    }
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
      runCommand();
    }
  };

  return (
    <div className="console">
      <ToggleSwitch checked={guided} onChange={setGuided} />
      <TopBar />
      {!view && (
        <>
          <div className="console-log" ref={logRef} role="log" aria-live="polite">
            {showLanding && (
              <div className="landing">
                <div className="title">if(&)</div>
                <div className="subtitle">type a command or use the buttons</div>
              </div>
            )}
            {log.map((item, i) => (
              <div key={i} className={item.type === "input" ? "input-line" : "response"}>{item.text}</div>
            ))}
          </div>
          <CommandButtons
            onWhoAmI={() => runCommand("whoami")}
            onProjects={() => runCommand("projects")}
            onContact={() => runCommand("contact")}
            onInfo={() => runCommand("info")}
            onClear={() => runCommand("clear")}
          />
          <form className="console-input-row" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="console-input"
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command or use the buttons"
              aria-label="Console input"
            />
            <button className="hist-btn" type="button" onClick={() => history.length > 0 && setCommand(history[0])} aria-label="History up">↑</button>
            <button className="hist-btn" type="button" onClick={() => history.length > 1 && setCommand(history[1])} aria-label="History down">↓</button>
          </form>
          {guided && <HelpOverlay />}
          {guided && <MobileNav onRun={runCommand} onPrev={prev} onNext={next} />}
        </>
      )}
      {view === "whoami" && <WhoAmI onBack={() => setView(null)} />}
      {view === "projects" && <Projects onBack={() => setView(null)} />}
      {view === "contact" && <Contact onBack={() => setView(null)} />}
      {view === "info" && <Info onBack={() => setView(null)} />}
    </div>
  );
}
