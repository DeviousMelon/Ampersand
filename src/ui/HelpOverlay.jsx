import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
const HelpOverlay = forwardRef(function HelpOverlay(_, ref) {
    const [open, setOpen] = useState(false);
    const dialogRef = useRef(null);
    useImperativeHandle(ref, () => ({ open: () => setOpen(true), close: () => setOpen(false) }), []);
    useEffect(() => {
        const toggle = () => setOpen(o => !o);
        const onEsc = e => { if (e.key === "Escape") setOpen(false); };
        window.addEventListener("help:toggle", toggle);
        window.addEventListener("keydown", onEsc);
        return () => { window.removeEventListener("help:toggle", toggle); window.removeEventListener("keydown", onEsc); };
    }, []);
    useEffect(() => {
        if (!open) return;
        const first = dialogRef.current?.querySelector("button, a, input, [tabindex]");
        first?.focus();
    }, [open]);
    if (!open) return null;
    return (
        <div className="nc-help-backdrop" onClick={() => setOpen(false)} role="presentation">
            <section className="nc-help" role="dialog" aria-modal="true" aria-labelledby="nc-help-title" onClick={e => e.stopPropagation()} ref={dialogRef}>
                <h2 id="nc-help-title">How to use this site</h2>
                <p>Type commands or press the buttons.</p>
                <ul className="nc-help-list">
                    <li><code>run(whoami)</code></li>
                    <li><code>render(Projects)</code></li>
                    <li><code>contact()</code></li>
                    <li><code>info()</code></li>
                </ul>
                <p>Press Ctrl or Cmd and / for help.</p>
                <div className="nc-help-actions">
                    <button className="nc-btn" onClick={() => setOpen(false)}>Close</button>
                </div>
            </section>
        </div>
    );
});
export default HelpOverlay;
