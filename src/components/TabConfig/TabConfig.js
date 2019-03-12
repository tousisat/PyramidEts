import React, { useState } from "react";
import { Tabs } from "react-bulma-components";
import "./TabConfig.scss";

const TabConfig = props => {
  return (
    <div className="TabConfig">
      <Tabs type={"boxed"}>
        <Tabs.Tab active>Min</Tabs.Tab>
        <Tabs.Tab>Max</Tabs.Tab>
        <Tabs.Tab>Pos1</Tabs.Tab>
        <Tabs.Tab>Pos2</Tabs.Tab>
        <Tabs.Tab>Pos3</Tabs.Tab>
      </Tabs>
      <div className="TabContainer" />
    </div>
  );
};

export default TabConfig;
