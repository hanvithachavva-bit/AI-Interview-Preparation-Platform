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

Evaluate the candidate's answer.

Rules:
- Give a score between 0 and 10.
- Feedback should be short (maximum 2 sentences).
- Explain briefly why the answer is right or wrong.
- If the answer is unrelated or meaningless, give a score of 0.
- Return ONLY valid JSON.

Example:
{
  "score": 7,
  "feedback": "Good explanation, but you missed discussing event bubbling."
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  console.dir(response, { depth: null });

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

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  console.log("Gemini Response:");
  console.log(text);

  return JSON.parse(text);
}

module.exports = {
  generateQuestions,
  evaluateAnswer,
};