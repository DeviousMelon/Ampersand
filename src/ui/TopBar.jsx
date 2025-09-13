import React from "react";
import Tooltip from "./Tooltip";
export default function TopBar({ onRun }) {
    return (
        <header className="nc-topbar" role="banner">
            <div className="nc-brand">
                <span className="nc-logo" aria-hidden="true">&amp;</span>
                <span className="nc-title">if(&)</span>
            </div>
            <nav className="nc-quick" aria-label="Quick actions">
                <Tooltip text="Show who I am">
                    <button className="nc-btn primary" onClick={() => onRun?.("run(whoami)")} aria-label="Run who am I">Try: whoami</button>
                </Tooltip>
                <Tooltip text="Browse projects">
                    <button className="nc-btn" onClick={() => onRun?.("render(Projects)")} aria-label="Render projects">See Projects</button>
                </Tooltip>
                <Tooltip text="Get in touch">
                    <button className="nc-btn" onClick={() => onRun?.("contact()")} aria-label="Open contact">Contact</button>
                </Tooltip>
                <Tooltip text="How this works">
                    <button className="nc-btn ghost" onClick={() => window.dispatchEvent(new CustomEvent("help:toggle"))} aria-label="Open help">Help</button>
                </Tooltip>
            </nav>
        </header>
    );
}
