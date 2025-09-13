import React from "react";
export default function Tooltip({ text, children }) {
    return (
        <span className="nc-tip">
            {children}
            <span className="nc-tiptext" role="tooltip">{text}</span>
        </span>
    );
}
