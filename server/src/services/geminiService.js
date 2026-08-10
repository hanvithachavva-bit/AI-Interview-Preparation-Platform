const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateQuestions(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
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
    throw new Error(
      "Unable to extract generated questions from Gemini response."
    );
  }

  return text;
}

async function evaluateAnswer(question, answer) {
  const prompt = `
You are an expert technical interviewer evaluating a candidate's answer.

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate the candidate's answer carefully.

Scoring criteria:

1. Correctness:
   - Is the answer technically correct?
   - Does it contain incorrect information?

2. Relevance:
   - Does the answer directly address the question?
   - If the answer is unrelated, meaningless, or does not answer the question, give 0.

3. Completeness:
   - Does the answer cover the important points needed for the question?
   - Give partial credit when the answer is partially correct.

4. Clarity:
   - Is the explanation understandable?

Scoring guide:

- 9-10: Excellent and mostly complete answer
- 7-8: Good answer with minor missing details
- 5-6: Partially correct answer with important missing details
- 3-4: Mostly incorrect or incomplete answer
- 1-2: Very poor answer with little relevant information
- 0: Completely unrelated, meaningless, or no answer

Important:

- Do not give a high score just because the answer sounds confident.
- Evaluate the actual technical content.
- Do not assume information that the candidate did not provide.
- If the answer is empty, give 0.
- Feedback must briefly explain why the score was given.
- Feedback should mention what was correct and what could be improved when appropriate.
- Keep feedback to a maximum of 2 sentences.
- Strengths should briefly describe what the candidate did well.
- Improvements should briefly describe what the candidate should improve or add.
- If the answer is completely wrong or meaningless, strengths can say "No significant strengths identified."
- Return ONLY valid JSON.
- Do not use markdown or code blocks.

Return exactly this format:

{
  "score": 7,
  "feedback": "The answer correctly explains X, but it misses Y.",
  "strengths": "You correctly explained X.",
  "improvements": "You should also explain Y."
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
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
    throw new Error(
      "Unable to extract evaluation from Gemini response."
    );
  }

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  console.log("Gemini Response:");
  console.log(text);

  const evaluation = JSON.parse(text);

  return {
    score: Math.max(0, Math.min(10, Number(evaluation.score))),
    feedback: evaluation.feedback,
    strengths: evaluation.strengths,
    improvements: evaluation.improvements,
  };
}
async function analyzeResume(resume, jobDescription) {
  const prompt = `
You are an expert resume and recruitment analyst.

Analyze the candidate's resume against the given job description.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Evaluate the match carefully.

Return ONLY valid JSON.
Do not use markdown or code blocks.

Return exactly this structure:

{
  "matchPercentage": 80,
  "matchingSkills": [
    "JavaScript",
    "React",
    "Node.js"
  ],
  "missingSkills": [
    "TypeScript",
    "Docker"
  ],
  "strengths": [
    "Good experience with React",
    "Strong JavaScript knowledge"
  ],
  "improvements": [
    "Add TypeScript experience",
    "Mention Docker or containerization experience"
  ],
  "summary": "The resume is a good match for this position but could be improved by adding the missing skills."
}

Rules:

- matchPercentage must be a number between 0 and 100.
- matchingSkills should contain skills that are clearly present in the resume and relevant to the job description.
- missingSkills should contain important skills from the job description that are missing from the resume.
- strengths should describe relevant strengths in the resume.
- improvements should provide practical suggestions.
- summary should briefly explain the overall match.
- Do not assume skills that are not present in the resume.
- Evaluate the actual resume content against the actual job description.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
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
    throw new Error(
      "Unable to extract resume analysis from Gemini response."
    );
  }

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  console.log("Gemini Resume Analysis:");
  console.log(text);

  const analysis = JSON.parse(text);

  return {
    matchPercentage: Math.max(
      0,
      Math.min(100, Number(analysis.matchPercentage))
    ),
    matchingSkills: Array.isArray(analysis.matchingSkills)
      ? analysis.matchingSkills
      : [],
    missingSkills: Array.isArray(analysis.missingSkills)
      ? analysis.missingSkills
      : [],
    strengths: Array.isArray(analysis.strengths)
      ? analysis.strengths
      : [],
    improvements: Array.isArray(analysis.improvements)
      ? analysis.improvements
      : [],
    summary: analysis.summary || "",
  };
}


// Generate an overall assessment for the complete interview
async function generateOverallAssessment(qa) {
  const formattedQA = qa
    .map(
      (item, index) => `
Question ${index + 1}:
${item.question}

Candidate Answer:
${item.answer}

Score:
${item.score}/10

Feedback:
${item.feedback}

Strengths:
${item.strengths}

Improvements:
${item.improvements}
`
    )
    .join("\n");

  const prompt = `
You are an expert technical interviewer reviewing a complete interview.

Here are the interview results:

${formattedQA}

Based on the complete interview, provide an overall assessment.

Evaluate:

1. Overall performance
2. Common strengths across the answers
3. Common areas that need improvement
4. A practical recommendation for the candidate

Important rules:

- Consider the scores and individual feedback.
- Do not invent information that is not present in the interview.
- Keep the overall summary concise.
- Overall strengths should be concise.
- Overall improvements should be concise.
- Recommendation should be practical and encouraging.
- Return ONLY valid JSON.
- Do not use markdown or code blocks.

Return exactly this format:

{
  "overallSummary": "The candidate demonstrated a good understanding of the core concepts but needs more complete explanations.",
  "overallStrengths": "Good understanding of fundamental concepts and generally relevant answers.",
  "overallImprovements": "Focus on providing more detailed explanations and covering important missing concepts.",
  "recommendation": "Continue practicing technical questions and work on explaining concepts with examples."
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
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
    throw new Error(
      "Unable to extract overall assessment from Gemini response."
    );
  }

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  console.log("Gemini Overall Assessment:");
  console.log(text);

  const assessment = JSON.parse(text);

  return {
    overallSummary: assessment.overallSummary,
    overallStrengths: assessment.overallStrengths,
    overallImprovements: assessment.overallImprovements,
    recommendation: assessment.recommendation,
  };
}

module.exports = {
  generateQuestions,
  evaluateAnswer,
  generateOverallAssessment,
  analyzeResume,
};