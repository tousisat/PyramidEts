const electron = require("electron");
const { BrowserWindow } = electron;

class MainWindow extends BrowserWindow {
  constructor(url) {
    super({
      height: 650,
      width: 1200,
      resizable: false,
      webPreferences: { backgroundThrottling: false }
    });

    this.loadURL(url);
  }
}

module.exports = MainWindow;
