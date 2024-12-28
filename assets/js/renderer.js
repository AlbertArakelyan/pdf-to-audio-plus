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
      pdfAudioPlayer.onerror = () => {
        alert(
          "Seems you saved your audio out of the application's directory. Please find and play it manually."
        );
        // throw new Error(
        //   "Seems you saved your audio out of the application's directory. Please find and play it manually."
        // );
      };
      alert(
        `Audio generated successfully at: ${audioPath}! You can also play it on the audio player.`
      );
    }
  } catch (error) {
    console.error(error.message);
  }
}

// function might be needed in future
// async function convertText() {
//   const textInput = document.getElementById('textInput').value;

//   if (!textInput) {
//       alert('Please enter some text.');
//       return;
//   }

//   // Generate audio from input text
//   const audioPath = await ipcRenderer.invoke('generate-audio', textInput, 'text_to_audio');
//   alert(`Audio generated successfully! Saved at: ${audioPath}`);
// }
