const { ipcRenderer } = require("electron");

// Elements
const textToAudioButton = document.getElementById("textToAudio");
const convertPdfToAudioFromDialogButton = document.getElementById(
  "convertPdfToAudioFromDialog"
);
const pdfAudioPlayer = document.getElementById("pdfAudioPlayer");

// Event listeners
textToAudioButton.addEventListener("click", textToAudio);
convertPdfToAudioFromDialogButton.addEventListener(
  "click",
  convertPdfToAudioFromDialog
);

// Listener functions
function textToAudio() {
  const text = document.getElementById("textInput").value;
  const lang = document.getElementById("langSelect").value;

  ipcRenderer.invoke("text-to-audio", text, lang);
}

async function convertPdfToAudioFromDialog() {
  try {
    const audioPath = await ipcRenderer.invoke("pdf-to-audio");
    console.log("audioPath", audioPath);
    if (audioPath) {
      pdfAudioPlayer.src = audioPath;
      alert(
        `Audio generated successfully at: ${audioPath}! You can also play it on the audio player.`
      );
    }
  } catch (error) {
    console.error("Error converting PDF to audio:", error);
  }
}
