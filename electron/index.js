const electron = require("electron");
const serialport = require("serialport");
const MainWindow = require("./app/MainWindow");

const { app } = electron;

let mainWindow;

app.on("ready", () => {
  mainWindow = new MainWindow(`http://localhost:3000`);
});

serialport.list((err, ports) => {
  console.log("ports", ports);
  if (err) {
    console.log(err.message);
    return;
  }

  if (ports.length === 0) {
    console.log("No ports discovered");
  }
});
