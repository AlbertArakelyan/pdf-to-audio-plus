const { app, BrowserWindow, ipcMain } = require("electron");

// for setting up app menu
// https://electronjs.org/docs/latest/api/menu#:~:text=On%20macOS%20the%20label%20of,plist%20file.

const pdfConverter = require("./assets/js/services/PdfConverter");
const audioConverter = require("./assets/js/services/AudioConverter");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    icon: "/assets/images/icon.png",
    title: "PDF to Audio",
    width: 800,
    height: 600,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'), // Secure communication
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");
  // mainWindow.webContents.openDevTools();
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

// Action might be needed in future
// ipcMain.handle("generate-audio", (_, text, fileName) => {
//   return new Promise((resolve, reject) => {
//     // Define output audio path
//     const safeFileName = fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase(); // Sanitize file name
//     const audioPath = path.join(audioDir, `${safeFileName}.wav`);

//     // Generate the audio file
//     say.export(text, null, 1.0, audioPath, (err) => {
//       if (err) {
//         console.error("Error exporting audio:", err);
//         reject(new Error(`Failed to generate audio: ${err.message}`));
//       } else {
//         console.log("Audio generated successfully:", audioPath);
//         resolve(audioPath);
//       }
//     });
//   });
// });
