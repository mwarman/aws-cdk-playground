import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import awsLogo from "./assets/aws-cdk.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://aws.amazon.com/cdk/" target="_blank">
          <img src={awsLogo} className="logo aws" alt="AWS CDK logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div>
        Deployed with the{" "}
        <a href="https://aws.amazon.com/cdk/" target="_blank">
          AWS Cloud Development Kit (CDK)
        </a>
        .
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the logos to learn more</p>
    </>
  );
}

export default App;
