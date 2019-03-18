import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bulma-components";
import "./Terminal.scss";

const Terminal = props => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const objDiv = document.getElementById("console");
    objDiv.scrollTop = objDiv.scrollHeight;
    setData(prevData => {
      if (prevData.length > 100) {
        return [<samp key={prevData.length}>&gt; {props.data}</samp>];
      } else {
        return [
          ...prevData,
          <samp key={prevData.length}>&gt; {props.data}</samp>
        ];
      }
    });
  }, [props.data]);

  return (
    <div className="Terminal">
      <div className="toolbox">
        <Form.Input
          className={"is-small"}
          value={input}
          onChange={event => setInput(event.target.value)}
          placeholder="Data to send..."
        />
        <Button
          disabled={!props.isConnected}
          className={"is-small"}
          onClick={() => props.onDebugSend(input)}
        >
          Send
        </Button>
      </div>
      <div className="Console" id="console">
        {data}
      </div>
    </div>
  );
};

export default Terminal;
