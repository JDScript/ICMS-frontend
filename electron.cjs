const { app, BrowserWindow } = require("electron");
const path = require("node:path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "electron-preload.cjs"),
      webSecurity: false,
    },
  });

  win.loadFile("./dist-electron/vite/index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  checkAndApplyDeviceAccessPrivilege();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

async function checkAndApplyDeviceAccessPrivilege() {
  const cameraPrivilege = systemPreferences.getMediaAccessStatus("camera");
  console.log(
    `checkAndApplyDeviceAccessPrivilege before apply cameraPrivilege: ${cameraPrivilege}`
  );
  if (cameraPrivilege !== "granted") {
    await systemPreferences.askForMediaAccess("camera");
  }

  const micPrivilege = systemPreferences.getMediaAccessStatus("microphone");
  console.log(
    `checkAndApplyDeviceAccessPrivilege before apply micPrivilege: ${micPrivilege}`
  );
  if (micPrivilege !== "granted") {
    await systemPreferences.askForMediaAccess("microphone");
  }

  const screenPrivilege = systemPreferences.getMediaAccessStatus("screen");
  console.log(
    `checkAndApplyDeviceAccessPrivilege before apply screenPrivilege: ${screenPrivilege}`
  );
}
