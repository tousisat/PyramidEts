const electron = require("electron");
const MainWindow = require("./app/MainWindow");
const SerialPort = require("./app/SerialPort");
const path = require('path')

const { app, ipcMain } = electron;

let mainWindow;
let serialPort;

app.on("ready", () => {
  mainWindow = new MainWindow(`file://${path.join(__dirname, '..','build','index.html')}`);

  //wait for react to ask for the port list
  ipcMain.on("react:port", () => {
    SerialPort.giveSerialPortList(mainWindow); //give to React the port list
  });

  //wait for the client to choose the port he want to connect
  ipcMain.on("react:connect", (event, portName) => {
    serialPort = new SerialPort(mainWindow, portName, 9600);

    //listen for incoming json data from the arduino
    serialPort.listenToPort(function(jsonConfig) {
      mainWindow.webContents.send("electron:data", jsonConfig);
    });
  });

  //wait for the client to disconnect from current port
  ipcMain.on("react:disconnect", event => {
    if (serialPort) {
      serialPort.disconnectFromPort();
    } else {
      mainWindow.webContents.send("electron:disconnected", {
        message: null,
        error: "you are not connected to any serial port"
      });
    }
  });

  //-------------------------------------ARDUINO COMMANDS START-----------------------------------

  ipcMain.on("react:disable", event => {
    let jsonText = {};
    jsonText.request = 1; //detach servos
    serialPort.sendToArduino(jsonText);
  });

  ipcMain.on("react:test", (event, jsonText) => {
    serialPort.sendToArduino({ request: 2, ...jsonText });
  });

  ipcMain.on("react:position", (event, configId) => {
    let jsonText = {};
    jsonText.request = 3; //get the servos value at current position
    jsonText.id = configId;
    serialPort.sendToArduino(jsonText);
  });

  ipcMain.on("react:save", (event, jsonText) => {
    jsonText.request = 4;
    serialPort.sendToArduino(jsonText);
  });

  ipcMain.on("react:debug", (event, rawData) => {
    serialPort.sendRawToArduino(rawData);
  });

  //-------------------------------------ARDUINO COMMANDS END-----------------------------------
});
