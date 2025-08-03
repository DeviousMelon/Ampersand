import { useState } from 'react';

export default function AmpersandAteMyLayers() {
  const [state, setState] = useState('idle');

  const handleClick = () => {
    setState('collapsing');
    setTimeout(() => setState('collapsed'), 2500);
  };

  return (
    <div className="ampersand">
      <h1>if(&)</h1>
      <p className="subtitle">Conditionally creative.</p>

      <button className="run-button" onClick={handleClick}>
        run(TheAmpersandAteMyLayers)
      </button>

      {state === 'collapsing' && <p className="log">Layers collapsing...</p>}
      {state === 'collapsed' && (
        <p className="log">
          & devoured the layers. <br /> Ctrl+Z won’t save you now.
        </p>
      )}
    </div>
  );
}
