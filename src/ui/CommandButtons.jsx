import React from "react";
const PRIMARY_ACTIONS = [
    { label: "whoami", cmd: "run(whoami)" },
    { label: "projects", cmd: "render(Projects)" },
    { label: "contact", cmd: "contact()" },
    { label: "info", cmd: "info()" }
];
export default function CommandButtons({ onRun }) {
    return (
        <div className="nc-actions" role="group" aria-label="Command shortcuts">
            {PRIMARY_ACTIONS.map(a => (
                <button key={a.cmd} className="nc-chip" onClick={() => onRun?.(a.cmd)} aria-label={`Run ${a.label}`}>{a.label}</button>
            ))}
        </div>
    );
}
