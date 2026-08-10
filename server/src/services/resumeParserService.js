const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

const extractResumeText = async (file) => {
  if (!file) {
    throw new Error("No resume file was uploaded.");
  }

  // ================= PDF =================

  if (file.mimetype === "application/pdf") {
    const parser = new PDFParse({
      data: file.buffer,
    });

    try {
      const result = await parser.getText();

      const text = result?.text;

      if (typeof text !== "string") {
        throw new Error("Could not extract text from the PDF.");
      }

      return text.trim();
    } finally {
      await parser.destroy();
    }
  }

  // ================= DOCX =================

  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    if (typeof result.value !== "string") {
      throw new Error("Could not extract text from the DOCX file.");
    }

    return result.value.trim();
  }

  throw new Error("Only PDF and DOCX files are supported.");
};

module.exports = {
  extractResumeText,
};