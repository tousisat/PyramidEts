const electron = require("electron");
const MainWindow = require("./app/MainWindow");
const SerialPort = require("./app/SerialPort");
const { ipcMain } = electron;

const { app } = electron;

let mainWindow;

app.on("ready", () => {
  mainWindow = new MainWindow(`http://localhost:3000`);

  SerialPort.giveSerialPortList(mainWindow); //give to React the port list

  //wait for the client to choose the port he want to connect
  ipcMain.on("react:port", (event, portName) => {
    const serialPort = new SerialPort(mainWindow, portName, 9600);
  });
});
