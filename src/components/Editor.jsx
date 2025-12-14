import { useState } from "react";

const Editor = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const runCode = () => {
    try {
      const fn = new Function(code);
      const result = fn();
      setOutput(String(result));
    } catch (err) {
      setOutput("Error in code");
    }
  };

  return (
    <div>
      <h2>Code Editor</h2>
      <textarea
        rows="10"
        cols="60"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write JavaScript code here"
      />
      <br />
      <button onClick={runCode}>Run Code</button>
      <p>Output: {output}</p>
    </div>
  );
};

export default Editor;
