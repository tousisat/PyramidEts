import React, { useState, useEffect } from "react";
import { Tabs, Form, Button } from "react-bulma-components";
import "./TabConfig.scss";
import { TABS } from "../../utils/constant";
import { BUTTONS_UNIQUE_CLASS } from "../../utils/constant";

const TabConfig = props => {
  const [activeTab, setActiveTab] = useState(props.defaultTab);
  const [text, setText] = useState(props.jsonConfig);
  const [isFormat, setIsFormat] = useState(false);

  //watch for props change
  useEffect(() => {
    let jsontext = props.jsonConfig;
    if (isFormat) {
      const jsonPretty = JsonPretty(jsontext);
      if (jsonPretty) {
        setText(jsonPretty);
      } else {
        setText(jsontext);
      }
      setIsFormat(false);
    } else {
      setText(jsontext);
    }
  }, [props.jsonConfig]);

  const JsonPretty = json => {
    //try to make the json pretty
    try {
      var obj = JSON.parse(json);
      return JSON.stringify(obj, undefined, 2);
    } catch (err) {
      return null;
    }
  };

  const updateActiveTab = event => {
    const selected = event.target.text;
    if (selected === undefined) return;
    setIsFormat(true);
    setActiveTab(selected);
    props.onActiveTab(selected, props.jsonConfig);
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
        <textarea
          id="myTextArea"
          onChange={event => {
            props.onJsonConfigChange(activeTab, event.target.value);
            setText(event.target.value);
          }}
          value={text}
          className="textarea TabContainer-textarea"
          placeholder={activeTab + " configuration..."}
        />

        <div className="TabButtons">
          <Button
            disabled={!props.isConnected}
            className={"is-small " + BUTTONS_UNIQUE_CLASS.TEST}
            onClick={() => props.onTest(props.jsonConfig)}
            text
          >
            test
          </Button>
          <Button
            disabled={!props.isConnected}
            className={"is-small " + BUTTONS_UNIQUE_CLASS.GET}
            onClick={() => {
              props.onGetPosition(activeTab);
              setIsFormat(true);
            }}
          >
            {`Read ${activeTab} From Servos`}
          </Button>
          <Button
            disabled={!props.isConnected}
            color={"info"}
            className={"is-small " + BUTTONS_UNIQUE_CLASS.SAVE}
            onClick={() => props.onSendConfig(activeTab, props.jsonConfig)}
          >
            Save {activeTab} To Arduino
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TabConfig;
