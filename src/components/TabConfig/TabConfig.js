import React, { useState, useEffect } from "react";
import { Tabs, Form, Button } from "react-bulma-components";
import "./TabConfig.scss";

const TabConfig = props => {
  const tabs = {
    MIN: "Min",
    MAX: "Max",
    POS1: "Pos1",
    POS2: "Pos2",
    POS3: "Pos3"
  };

  const [activeTab, setActiveTab] = useState(tabs.MIN);
  const [text, setText] = useState("");

  //watch for activeTab change
  useEffect(() => {
    props.onActiveTab(activeTab);
  }, [activeTab]);

  const updateActiveTab = event => {
    const selected = event.target.text;
    if (selected === undefined) return;
    setActiveTab(selected);
  };

  return (
    <div className="TabConfig">
      <Tabs type={"boxed"} onClick={event => updateActiveTab(event)}>
        <Tabs.Tab active={activeTab === tabs.MIN}>{tabs.MIN}</Tabs.Tab>
        <Tabs.Tab active={activeTab === tabs.MAX}>{tabs.MAX}</Tabs.Tab>
        <Tabs.Tab active={activeTab === tabs.POS1}>{tabs.POS1}</Tabs.Tab>
        <Tabs.Tab active={activeTab === tabs.POS2}>{tabs.POS2}</Tabs.Tab>
        <Tabs.Tab active={activeTab === tabs.POS3}>{tabs.POS3}</Tabs.Tab>
      </Tabs>
      <div className="TabContainer">
        <Form.Textarea
          onChange={event => setText(event.target.value)}
          value={text}
          className="TabContainer-textarea"
          placeholder={activeTab + " configuration..."}
        />

        <div className="TabButtons">
          <Button className="is-small" onClick={props.onTest} text>
            test
          </Button>
          <Button
            className="is-small"
            onClick={props.onGetPosition}
            color={"info"}
          >
            {`Get ${activeTab} From Arduino`}
          </Button>
        </div>
      </div>
      <div className="TabButtons">
        <Button
          onClick={props.onDisableServos}
          color={"warning"}
          className="is-outlined"
        >
          Disable servos
        </Button>
        <Button onClick={props.onConfig}>Send Configs To Arduino</Button>
      </div>
    </div>
  );
};

export default TabConfig;
