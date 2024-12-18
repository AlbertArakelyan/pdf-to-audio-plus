const fs = require("fs");
const path = require("path");
const say = require("say");

class Converter {
  constructor() {
    this.audioDir = path.join(__dirname, "audio");

    if (!fs.existsSync(this.audioDir)) {
      fs.mkdirSync(this.audioDir, { recursive: true });
    }
  }

  generateAudio(text, fileName = `generate-audio__output-${Date.now()}.wav`) {
    const audioPath = path.join(this.audioDir, fileName);

    return new Promise((resolve, reject) => {
      say.export(text, null, 1.0, audioPath, (err) => {
        if (err) {
          console.error("Error exporting audio:", err);
          reject(new Error(`Failed to generate audio: ${err.message}`));
        } else {
          console.log("Audio generated successfully:", audioPath);
          resolve(audioPath);
        }
      });
    });
  }
}

module.exports = Converter;
