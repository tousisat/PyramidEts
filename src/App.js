import React, { Component } from "react";
import "react-bulma-components/dist/react-bulma-components.min.css";
import "./App.scss";
import SerialConnect from "./components/SerialConnect/SerialConnect";
import TabConfig from "./components/TabConfig/TabConfig";
import { TABS, BUTTONS_UNIQUE_CLASS } from "./utils/constant";
import { loadingButtonByClass, tabToID } from "./utils/util";
import DebugConsole from "./components/DebugConsole/DebugConsole";
import Terminal from "./components/Terminal/Terminal";
const { ipcRenderer } = window.require("electron");

class App extends Component {
  state = {
    portsList: [],
    activeTab: TABS.MIN,
    [TABS.MIN]: "{}", //id=1 in ARDUINO
    [TABS.MAX]: "{}", //id=2
    [TABS.POS1]: "{}", //id=3
    [TABS.POS2]: "{}", //id=4
    [TABS.POS3]: "{}", //id=5
    message: "",
    console: "Console for arduino",
    isConnected: false
  };

  componentDidMount() {
    // setInterval(() => {
    //   this.setState({
    //     console: Math.random().toString()
    //   });
    // }, 100);

    //listen for electron calls. Update the states in consequence
    ipcRenderer.send("react:port"); //hey electon, what is my available ports?
    ipcRenderer.once("electron:port", (event, { ports, error }) => {
      this.setState({ portsList: ports, message: error });
    });

    ipcRenderer.on("electron:connected", (event, { message, error }) => {
      if (error) {
        this.setState({ message: error });
      } else {
        this.setState({ message: message, isConnected: true });
      }
      loadingButtonByClass(BUTTONS_UNIQUE_CLASS.CONNECT, false);
    });

    ipcRenderer.on("electron:disconnected", (event, { message, error }) => {
      if (error) {
        this.setState({ message: error });
      } else {
        this.setState({ message: message, isConnected: false });
      }
      loadingButtonByClass(BUTTONS_UNIQUE_CLASS.CONNECT, false);
      loadingButtonByClass(BUTTONS_UNIQUE_CLASS.GET, false);
    });

    ipcRenderer.on("electron:data", (event, data) => {
      console.log("RECEIVED DATA", data);
      loadingButtonByClass(BUTTONS_UNIQUE_CLASS.GET, false);

      //output the data to the main console
      this.setState({
        console: data
      });

      try {
        let jsonData = JSON.stringify(data); // Convert to JSON
        jsonData = JSON.parse(data); //Then parse it
        //forward the correct data to the active tab text area
        const configId = jsonData["id"]; //ex: 1,2,3,4 or 5
        if (!configId && (configId < 1 || configId > 5)) return; //wrong or no value
        this.setState({ [this.state.activeTab]: data });
      } catch (err) {}
    });
  }

  //------------------------------------------------------------
  onConnectHandler = port => {
    loadingButtonByClass(BUTTONS_UNIQUE_CLASS.CONNECT, true);
    if (!this.state.isConnected) {
      //tell electron we want to connect to the port
      ipcRenderer.send("react:connect", port); //hey electon, I want to connect with serial
    } else {
      ipcRenderer.send("react:disconnect");
    }
  };

  onDisableServosHandler = () => {
    //send "disable_servos" cmd to electron
    ipcRenderer.send("react:disable"); //hey electon, I want to disable the servos
    this.setState({ message: "Disable command sent to arduino" });
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

  onJsonConfigChangeHandler = (currentTab, textToUpdate) => {
    this.setState({
      [currentTab]: textToUpdate
    });
  };

  //------------------------------------------------------------

  onTestHandler = jsonText => {
    //tell the arduino to execute the json
    try {
      const json = JSON.parse(jsonText);
      ipcRenderer.send("react:test", json); //hey electon, I want to test the actual servos position
      this.setState({ message: "Test command sent to arduino" });
    } catch (e) {
      this.setState({ message: "Not a valid Json format" });
    }
    //loadingButtonByClass(BUTTONS_UNIQUE_CLASS.TEST, true);
  };

  onGetPositionHandler = activeTab => {
    ipcRenderer.send("react:position", tabToID(activeTab)); //hey electon, I want to get the actual servos position
    loadingButtonByClass(BUTTONS_UNIQUE_CLASS.GET, true);
  };

  onSendConfigHandler = (activeTab, jsonText) => {
    //send "config_${activeTab}" to electron
    try {
      let json = JSON.parse(jsonText);
      json.id = tabToID(activeTab);
      ipcRenderer.send("react:save", json); //hey electon, I want to test the actual servos position
      this.setState({ message: activeTab + " Save command sent to arduino" });
    } catch (e) {
      this.setState({ message: "Not a valid Json format" });
    }
    //loadingButtonByClass(BUTTONS_UNIQUE_CLASS.SAVE, true);
  };

  onDebugSendHandler = data => {
    ipcRenderer.send("react:debug", data); //hey electon, I want to test the actual servos position
  };

  render() {
    const jsonConfig = this.state[this.state.activeTab];
    return (
      <div className="App">
        <div className="Left-Container">
          <div className="Title">
            <h1>Pyramid Configuration</h1>
          </div>
          <div className="Connect">
            <SerialConnect
              isConnected={this.state.isConnected}
              ports={this.state.portsList}
              onConnect={portName => this.onConnectHandler(portName)}
              onDisableServos={this.onDisableServosHandler}
            />
          </div>
          <div className="Configuration">
            <div className="Tab">
              <TabConfig
                isConnected={this.state.isConnected}
                defaultTab={this.state.activeTab}
                jsonConfig={jsonConfig}
                onJsonConfigChange={(activeTab, jsonText) =>
                  this.onJsonConfigChangeHandler(activeTab, jsonText)
                }
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
          <div className="App-Terminal">
            <Terminal
              isConnected={this.state.isConnected}
              onDebugSend={data => this.onDebugSendHandler(data)}
              data={this.state.console}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
