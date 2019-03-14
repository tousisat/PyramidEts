import React, { Component } from "react";
import "react-bulma-components/dist/react-bulma-components.min.css";
import "./App.scss";
import SerialConnect from "./components/SerialConnect/SerialConnect";
import TabConfig from "./components/TabConfig/TabConfig";
import { TABS, BUTTONS_UNIQUE_CLASS } from "./utils/constant";
import { loadingButtonByClass } from "./utils/util";
import DebugConsole from "./components/DebugConsole/DebugConsole";

class App extends Component {
  state = {
    portsList: ["COM1", "COM2", "COM3"],
    activeTab: TABS.MIN,
    [TABS.MIN]: "min json config",
    [TABS.MAX]: "max json config",
    [TABS.POS1]: "1",
    [TABS.POS2]: "2",
    [TABS.POS3]: "3",
    message: "No error detected!"
  };

  componentDidMount() {
    //listen for electron calls. Update the states in consequence
  }

  //------------------------------------------------------------
  onConnectHandler = port => {
    //tell electron we want to connect to the port
    console.log(port);
    //loadingButtonByClass(BUTTONS_UNIQUE_CLASS.CONNECT, true);
  };

  onDisableServosHandler = () => {
    //send "disable_servos" cmd to electron
    console.log("Disable");
    //loadingButtonByClass(BUTTONS_UNIQUE_CLASS.DISABLE_SERVOS, true);
  };
  //------------------------------------------------------------

  onActiveTabHandler = (currentTab, textToSave) => {
    //get from electron the json config for the selected tab

    this.setState(prevState => {
      return {
        activeTab: currentTab,
        [prevState.activeTab]: textToSave //save before change tab
      };
    });
  };
  //------------------------------------------------------------

  onTestHandler = jsonText => {
    //tell the arduino to execute the json
    console.log(jsonText);
    //loadingButtonByClass(BUTTONS_UNIQUE_CLASS.TEST, true);
  };

  onGetPositionHandler = activeTab => {
    console.log(activeTab);
    //loadingButtonByClass(BUTTONS_UNIQUE_CLASS.GET, true);
  };

  onSendConfigHandler = (activeTab, jsonText) => {
    //send "config_${activeTab}" to electron
    console.log(activeTab, jsonText);
    //loadingButtonByClass(BUTTONS_UNIQUE_CLASS.SAVE, true);
  };

  render() {
    return (
      <div className="App">
        <div className="Left-Container">
          <div className="Title">
            <h1>Pyramid Configuration</h1>
          </div>
          <div className="Connect">
            <SerialConnect
              ports={this.state.portsList}
              onConnect={portName => this.onConnectHandler(portName)}
              onDisableServos={this.onDisableServosHandler}
            />
          </div>
          <div className="Configuration">
            <div className="Tab">
              <TabConfig
                defaultTab={this.state.activeTab}
                jsonConfig={this.state[this.state.activeTab]}
                onActiveTab={(tab, jsonText) =>
                  this.onActiveTabHandler(tab, jsonText)
                }
                onTest={jsonText => this.onTestHandler(jsonText)}
                onGetPosition={activeTab =>
                  this.onGetPositionHandler(activeTab)
                }
                onSendConfig={(activeTab, jsonText) =>
                  this.onSendConfigHandler(activeTab, jsonText)
                }
              />
            </div>
          </div>
          <DebugConsole message={this.state.message} />
        </div>
        <div className="Right-Container">
          <div className="Pyramid" />
          <div className="Legend" />
          <div className="Send-Config" />
        </div>
      </div>
    );
  }
}

export default App;
