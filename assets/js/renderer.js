const { ipcRenderer } = require("electron");

// Elements
const textToAudioButton = document.getElementById("textToAudio");

// Event listeners
textToAudioButton.addEventListener("click", textToAudio);

// Listener functions
function textToAudio() {
  const text = document.getElementById("textInput").value;
  const lang = document.getElementById("langSelect").value;

  ipcRenderer.invoke("text-to-audio", text, lang);
}
