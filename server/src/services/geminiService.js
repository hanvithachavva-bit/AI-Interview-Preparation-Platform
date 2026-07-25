const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateQuestions(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  console.dir(response, { depth: null });

  // Different SDK versions return the text differently
  let text;

  if (typeof response.text === "function") {
    text = response.text();
  } else if (typeof response.text === "string") {
    text = response.text;
  } else if (
    response.candidates &&
    response.candidates[0]?.content?.parts?.length
  ) {
    text = response.candidates[0].content.parts
      .map((part) => part.text)
      .join("");
  } else {
    throw new Error("Unable to extract generated questions from Gemini response.");
  }

  return text;
}

async function evaluateAnswer(question, answer) {
  const prompt = `
You are an expert technical interviewer.

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer.

Return ONLY a valid JSON object in this format:

{
  "score": 8,
  "feedback": "Your feedback here"
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  console.dir(response, { depth: null });

  // Different SDK versions return the text differently
  let text;

  if (typeof response.text === "function") {
    text = response.text();
  } else if (typeof response.text === "string") {
    text = response.text;
  } else if (
    response.candidates &&
    response.candidates[0]?.content?.parts?.length
  ) {
    text = response.candidates[0].content.parts
      .map((part) => part.text)
      .join("");
  } else {
    throw new Error("Unable to extract evaluation from Gemini response.");
  }

  // Remove markdown if Gemini returns ```json ... ```
  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  console.log("Gemini Response:");
  console.log(text);

  const evaluation = JSON.parse(text);

  return evaluation;
}

module.exports = {
  generateQuestions,
  evaluateAnswer,
};