const { dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const gTTS = require("gtts");

const Converter = require("./Converter");

class PdfConverter extends Converter {
  convertPdfToAudio(filePath) {
    const text = this.#convertPdf(filePath);
    return this.generateAudio(text);
  }

  async #convertPdf(filePath) {
    console.log("filePath", filePath);
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text; // Extracted text
  }

  convertPdfToAudioFromDialog() {
    return new Promise(async (resolve, reject) => {
      try {
        // Open file dialog to select a PDF
        const { canceled, filePaths } = await dialog.showOpenDialog({
          title: "Select a PDF File",
          filters: [{ name: "PDF Files", extensions: ["pdf"] }],
          properties: ["openFile"],
        });

        console.log("Starting PDF to audio conversion...");

        if (canceled || filePaths.length === 0) {
          return reject(new Error("No file selected"));
        }

        const pdfPath = filePaths[0];
        const pdfBuffer = fs.readFileSync(pdfPath);

        // Extract text from PDF
        const pdfData = await pdfParse(pdfBuffer);
        const text = pdfData.text;

        if (!text.trim()) {
          return reject(new Error("No readable text found in the PDF"));
        }

        // Convert text to audio
        const audioPath = path.join(
          this.audioDir,
          `pdf-to-audio__output-${Date.now()}.mp3`
        );

        const gtts = new gTTS(text, "en");
        const stream = gtts.stream();

        const { canceled: saveCanceled, filePath: saveFilePath } =
          await dialog.showSaveDialog({
            title: "Save Audio File",
            defaultPath: audioPath,
            filters: [{ name: "Audio Files", extensions: ["mp3"] }],
          });

        if (saveCanceled || saveFilePath.length === 0) {
          return reject(new Error("No file selected"));
        }

        // When I create stream manually, it works much more faster
        const writeStream = fs.createWriteStream(saveFilePath);

        stream.pipe(writeStream);
        writeStream.on("finish", () => {
          console.log("Audio file generated:", audioPath);
          resolve(audioPath);
        });
        writeStream.on("error", (err) => {
          console.error("Error generating audio:", err);
          reject(new Error("Error generating audio"));
        });

        // gtts.save(saveFilePath, (err) => {
        //   if (err) {
        //     console.error("Error generating audio:", err);
        //     return reject(new Error("Error generating audio"));
        //   }

        //   console.log("Audio file generated:", audioPath);
        //   resolve(audioPath);
        // });
      } catch (error) {
        console.error("Error processing PDF to audio:", error);
        reject(new Error("Failed to process PDF"));
      }
    });
  }
}

module.exports = new PdfConverter();
