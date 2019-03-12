const electron = require("electron");
const { BrowserWindow } = electron;

class MainWindow extends BrowserWindow {
  constructor(url) {
    super({
      height: 600,
      width: 1200,
      webPreferences: { backgroundThrottling: false }
    });

    this.loadURL(url);
  }
}

module.exports = MainWindow;
