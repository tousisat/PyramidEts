import React, { Component } from "react";
import "react-bulma-components/dist/react-bulma-components.min.css";
import "./App.scss";
import SerialConnect from "./components/SerialConnect/SerialConnect";
import TabConfig from "./components/TabConfig/TabConfig";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="Left-Container">
          <div className="Title">
            <h1>Pyramid Configuration</h1>
          </div>
          <div className="Connect">
            <SerialConnect
              ports={["COM1", "COM2", "COM3"]}
              onConnect={portName => console.log(portName)}
            />
          </div>
          <div className="Configuration">
            <div className="Tab">
              <TabConfig onActiveTab={tab => console.log(tab)} />
            </div>
          </div>
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
