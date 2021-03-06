const Serial = require("serialport");
const Readline = require("@serialport/parser-readline");

class SerialPort {
  constructor(mainWindow, portName, baudRate) {
    this.mainWindow = mainWindow;

    this.port = this.connectToPort(portName, baudRate);
  }

  connectToPort(portName, baudRate) {
    const port = new Serial(
      portName,
      {
        baudRate: baudRate
      },
      error => {
        if (!error) {
          this.mainWindow.webContents.send("electron:connected", {
            message: "Connected to " + portName,
            error: null
          });
        } else {
          this.mainWindow.webContents.send("electron:connected", {
            message: null,
            error: error.message
          });
        }
      }
    );
    //listen for any disconnect event once
    port.once("close", err => {
      this.mainWindow.webContents.send("electron:disconnected", {
        message: "Disconnected",
        error: null
      });
    });

    return port;
  }
  disconnectFromPort() {
    this.port.close(error => {
      if (error) {
        this.mainWindow.webContents.send("electron:disconnected", {
          message: null,
          error: error.message
        });
      }
    });
  }

  sendToArduino(json) {
    console.log(json);
    this.port.write(JSON.stringify(json));
  }

  sendRawToArduino(data) {
    console.log(data);
    this.port.write(data);
  }

  listenToPort(callback) {
    const parser = this.port.pipe(new Readline());
    parser.on("data", data => {
      //REF: https://stackoverflow.com/questions/48981442/how-to-send-json-from-arduino-to-node-js-serialport
      let str = data.toString(); //Convert to string
      // try {
      //   str = str.replace(/\r?\n|\r/g, ""); //remove '\r' from this String
      //   str = JSON.stringify(data); // Convert to JSON
      //   str = JSON.parse(data); //Then parse it
      //   callback(str);
      // } catch (err) {}
      console.log(str);
      callback(str);
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

      mainWindow.webContents.send("electron:port", {
        ports: [...ports.map(port => port.comName)],
        error: null
      });
    });
  }
}

module.exports = SerialPort;
