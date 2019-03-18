import React, { useState, useEffect } from "react";
import { Tabs, Form, Button } from "react-bulma-components";
import "./TabConfig.scss";
import { TABS } from "../../utils/constant";
import { BUTTONS_UNIQUE_CLASS } from "../../utils/constant";

const TabConfig = props => {
  const [activeTab, setActiveTab] = useState(props.defaultTab);
  const [text, setText] = useState(props.jsonConfig);

  //watch for props change
  useEffect(() => {
    setText(props.jsonConfig);
  }, [props.jsonConfig]);

  const updateActiveTab = event => {
    const selected = event.target.text;
    if (selected === undefined) return;
    setActiveTab(selected);
    props.onActiveTab(selected, text);
    setText(props.jsonConfig); //dont know why I need it. Don't work without it
  };

  return (
    <div className="TabConfig">
      <Tabs type={"boxed"} onClick={event => updateActiveTab(event)}>
        <Tabs.Tab active={activeTab === TABS.MIN}>{TABS.MIN}</Tabs.Tab>
        <Tabs.Tab active={activeTab === TABS.MAX}>{TABS.MAX}</Tabs.Tab>
        <Tabs.Tab active={activeTab === TABS.POS1}>{TABS.POS1}</Tabs.Tab>
        <Tabs.Tab active={activeTab === TABS.POS2}>{TABS.POS2}</Tabs.Tab>
        <Tabs.Tab active={activeTab === TABS.POS3}>{TABS.POS3}</Tabs.Tab>
      </Tabs>
      <div className="TabContainer">
        <Form.Textarea
          onChange={event => setText(event.target.value)}
          value={text}
          className="TabContainer-textarea"
          placeholder={activeTab + " configuration..."}
        />

        <div className="TabButtons">
          <Button
            disabled={!props.isConnected}
            className={"is-small " + BUTTONS_UNIQUE_CLASS.TEST}
            onClick={() => props.onTest(text)}
            text
          >
            test
          </Button>
          <Button
            disabled={!props.isConnected}
            className={"is-small " + BUTTONS_UNIQUE_CLASS.GET}
            onClick={() => props.onGetPosition(activeTab)}
          >
            {`Read ${activeTab} From Servos`}
          </Button>
          <Button
            disabled={!props.isConnected}
            color={"info"}
            className={"is-small " + BUTTONS_UNIQUE_CLASS.SAVE}
            onClick={() => props.onSendConfig(activeTab, text)}
          >
            Save {activeTab} To Arduino
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TabConfig;
