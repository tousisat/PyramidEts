const Serial = require("serialport");

class SerialPort {
  constructor(mainWindow, portName, baudRate) {
    this.mainWindow = mainWindow;

    const port = this.connectToPort(portName, baudRate);
    this.listenToPort(port);
  }

  connectToPort(portName, baudRate) {
    const port = new Serial(
      portName,
      {
        baudRate: baudRate
      },
      errOpen => {
        this.mainWindow.webContents.send("electron:connected", {
          message: null,
          error: errOpen.message
        });
        return console.log(errOpen.message);
      }
    );

    this.mainWindow.webContents.send("electron:connected", {
      message: "Connected to " + portName,
      error: null
    });

    return port;
  }

  listenToPort(port) {
    port.on("data", data => {
      console.log("DATA:", data);
    });
  }

  static giveSerialPortList(mainWindow) {
    Serial.list((err, ports) => {
      if (err) {
        console.log(err.message);
        mainWindow.webContents.send("electron:port", {
          ports: [],
          error: err.message
        });
        return;
      }

      if (ports.length === 0) {
        console.log("No ports discovered");
        mainWindow.webContents.send("electron:port", {
          ports: [],
          error: "No ports discovered"
        });
        return;
      }

      console.log("ports", ports.map(port => port.comName));
      mainWindow.webContents.send("electron:port", {
        ports: ports.map(port => port.comName),
        error: null
      });
    });
  }
}

module.exports = SerialPort;
