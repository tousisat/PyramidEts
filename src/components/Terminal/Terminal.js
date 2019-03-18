import React, { useState, useEffect } from "react";
import "./Terminal.scss";

const Terminal = props => {
  const [data, setData] = useState([]);

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
      <div className="Console" id="console">
        {data}
      </div>
    </div>
  );
};

export default Terminal;
