import { useState } from "react";
import Warning from "./components/Warning";
import Messenger from "./components/Messenger";

export default function App() {
  const [accepted, setAccepted] = useState(false);
  return accepted ? <Messenger /> : <Warning onContinue={() => setAccepted(true)} />;
}
