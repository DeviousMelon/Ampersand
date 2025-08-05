/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import WhoAmI from "./WhoAmI";
import Projects from "./Projects";
import Contact from "./Contact";
import Info from "./Info";

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

  const [ampersands, setAmpersands] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [inputLocked, setInputLocked] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setInputLocked(false);
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

    // if (input === "loop(&)" || input === "summon(&)") {
    //   const newAmps = Array.from({ length: 8 }, (_, i) => ({
    //     id: i,
    //     top: Math.random() * 100 + "vh",
    //     left: Math.random() * 100 + "vw",
    //     rotation: Math.random() * 360,
    //   }));
    //setAmpersands(newAmps);
    const newEntry = { id: log.length, input };
    setTimeout(() => {
      setLog((prevLog) => [...prevLog, newEntry]);
      setIsRunning(false);
    }, 500);
  };

  // const playSound = (file) => {
  //   const audio = new Audio(file);
  //   audio.volume = 0.3;
  //   audio.play().catch(() => {});
  // };

  //   playSound(input === "loop(&)" ? "/glitch.mp3" : "/blip.mp3");

  //   const newEntry = { id: log.length, input };

  //   const delay = 800 + Math.random() * 1000;
  //   setTimeout(() => {
  //     setLog((prevLog) => [...prevLog, newEntry]);
  //     setIsRunning(false);
  //   }, delay);
  // };

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
      // case "loop(&)":
      //   return (
      //     <p className="glitch">
      //       // recursive overflow detected. cancel? too late.
      //     </p>
      //   );
      // case "feed(layers)":
      //   return (
      //     <p className="lore">// you fed the layers to &. they won’t forget.</p>
      //   );
      // case "summon(&)":
      //   return (
      //     <p className="lore">
      //       // & appears briefly in the corner of your eye…
      //     </p>
      //   );
      // case "undo(everything)":
      //   return (
      //     <p className="command-error">
      //       // nothing can be undone. not anymore.
      //     </p>
      //   );
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
      <h1 className="title">if(&)</h1>

      <div className="console-log">
        {log.map((entry) => (
          <div key={entry.id}>
            <p className="input-line">&gt; {entry.input}</p>
            <div className="response">{renderResponse(entry.input)}</div>
          </div>
        ))}
        {isRunning && (
          <>
            {currentCommand === "loop(&)" ? (
              <p className="glitch-loader">executing loop(&)...</p>
            ) : (
              <p className="loading-dots">running</p>
            )}
          </>
        )}
      </div>

      <div className="console-input">
        <span>&gt; </span>
        <input
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
              const newIndex =
                historyIndex === null
                  ? history.length - 1
                  : Math.max(0, historyIndex - 1);
              setHistoryIndex(newIndex);
              setCommand(history[newIndex]);
            } else if (!inputLocked && e.key === "ArrowDown") {
              e.preventDefault();
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

      {ampersands.map((amp) => (
        <div
          key={amp.id}
          style={{
            position: "absolute",
            top: amp.top,
            left: amp.left,
            transform: `rotate(${amp.rotation}deg)`,
            fontSize: "2rem",
            opacity: 0.2,
            color: "#0ff",
            pointerEvents: "none",
            animation: "floatAmp 5s ease-in-out infinite alternate",
          }}
        >
          &
        </div>
      ))}
    </div>
  );
}
