import React from "react";
export default function ToggleSwitch({ checked, onChange }) {
    return (
        <div className="nc-toggle">
            <span className="nc-toggle-label">{checked ? "Guided" : "Console"}</span>
            <button type="button" className={`nc-switch ${checked ? "checked" : ""}`} onClick={() => onChange(!checked)} aria-pressed={checked} aria-label="Toggle guided mode">
                <span className="nc-knob" />
            </button>
        </div>
    );
}
