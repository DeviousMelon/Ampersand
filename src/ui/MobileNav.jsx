import React from "react";
export default function MobileNav({ onRun, onPrev, onNext }) {
    return (
        <nav className="nc-mobilenav" aria-label="Mobile navigation">
            <button className="nc-mbtn" onClick={onPrev} aria-label="Previous">←</button>
            <button className="nc-mbtn primary" onClick={() => onRun?.("render(Projects)")} aria-label="See projects">Projects</button>
            <button className="nc-mbtn" onClick={onNext} aria-label="Next">→</button>
            <button className="nc-mbtn ghost" onClick={() => window.dispatchEvent(new CustomEvent("help:toggle"))} aria-label="Help">?</button>
        </nav>
    );
}
