import React, { useState } from "react";
import { Button, Dropdown } from "react-bulma-components";
import "./SerialConnect.scss";
import { BUTTONS_UNIQUE_CLASS } from "../../utils/constant";

const SerialConnect = props => {
  const isPorts = props.ports && props.ports.length > 0;
  const [selection, setSelection] = useState(isPorts ? props.ports[0] : null);

  const items = isPorts
    ? props.ports.map((portName, index) => (
        <Dropdown.Item key={index} value={portName}>
          {portName}
        </Dropdown.Item>
      ))
    : null;

  return (
    <div className="Serial">
      <Dropdown
        className="Serial-DropDown"
        value={selection}
        onChange={selected => setSelection(selected)}
        color="white"
      >
        {items}
      </Dropdown>
      <Button
        className={"Connect-Button " + BUTTONS_UNIQUE_CLASS.CONNECT}
        disabled={!isPorts}
        onClick={() => props.onConnect(selection)}
      >
        Connect
      </Button>
      <Button
        onClick={props.onDisableServos}
        color={"warning"}
        className={
          "is-outlined Disable-Button " + BUTTONS_UNIQUE_CLASS.DISABLE_SERVOS
        }
      >
        Disable servos
      </Button>
    </div>
  );
};

export default SerialConnect;
