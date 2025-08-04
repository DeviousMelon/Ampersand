/* eslint-disable no-unused-vars */
import { useState } from "react";

export default function Landing({ onEnter }) {
  return (
    <div className="landing-screen">
      <h1 className="glitch-title">if(&)</h1>
      <p className="subtitle">// an interactive portfolio</p>
      <button onClick={onEnter} className="enter-button">
        enter ↵
      </button>
    </div>
  );
}
