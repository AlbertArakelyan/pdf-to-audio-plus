const path = require("path");
const gTTS = require("gtts");

const Converter = require("./Converter");

class AudioConverter extends Converter {
  textToAudio(text, lang = "en") {
    return new Promise((resolve, reject) => {
      try {
        if (!text || !text.trim()) {
          return reject(new Error("No text provided or text is empty"));
        }

        // Set audio file name
        const audioPath = path.join(
          this.audioDir,
          `text-to-audio__output-${Date.now()}.mp3`
        );

        // Convert text to audio
        const gtts = new gTTS(text, lang);
        gtts.save(audioPath, (err) => {
          if (err) {
            console.error("Error generating audio:", err);
            return reject(new Error("Failed to generate audio"));
          }
          console.log("Audio generated successfully:", audioPath);
          resolve(audioPath);
        });
      } catch (error) {
        console.error("Error processing text-to-audio:", error);
        reject(new Error("Internal processing error"));
      }
    });
  }
}

module.exports = new AudioConverter();
