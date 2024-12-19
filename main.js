const { app, BrowserWindow, ipcMain } = require("electron");

const pdfConverter = require("./assets/js/services/PdfConverter");
const audioConverter = require("./assets/js/services/AudioConverter");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'), // Secure communication
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");
});

// Handle PDF to Text conversion
ipcMain.handle("convert-pdf", async (_, filePath) => {});

// Handle Text-to-Audio generation
ipcMain.handle("generate-audio", (_, text, fileName) => {});

// Handle Text-to-Audio generation 2
ipcMain.handle("text-to-audio", async (_, text, lang = "en") => {
  audioConverter.textToAudio(text, lang);
});

// Handle PDF-to-Audio conversion (directly from dialog)
ipcMain.handle("pdf-to-audio", async () => {
  try {
    const audioPath = await pdfConverter.convertPdfToAudioFromDialog();
    return audioPath;
  } catch (error) {
    console.error("Error converting PDF to audio:", error);
    return null;
  }
});

app.on("window-all-closed", () => {
  app.quit();
});
