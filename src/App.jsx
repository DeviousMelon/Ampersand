import { useState } from "react";
import Landing from "./Landing";
import Console from "./Console";

export default function App() {
  const [entered, setEntered] = useState(false);

  return (
    <>{!entered ? <Landing onEnter={() => setEntered(true)} /> : <Console />}</>
  );
}
