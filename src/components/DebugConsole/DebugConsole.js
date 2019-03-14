import React from "react";
import "./DebugConsole.scss";

const DebugConsole = props => {
  return (
    <div className="Debug-Console">
      <div className="Console">
        <p>
          <samp>&gt; {props.message}</samp>
        </p>
      </div>
    </div>
  );
};

export default DebugConsole;
