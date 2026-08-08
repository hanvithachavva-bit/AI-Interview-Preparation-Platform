import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [markedQuestions, setMarkedQuestions] = useState([]);

  useEffect(() => {
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    try {
      const response = await api.get(`/interviews/${id}`);

      console.log(response.data);

      const interviewData = response.data.interview;

      setInterview(interviewData);

      setAnswers(
        new Array(interviewData.questions.length).fill("")
      );

      setMarkedQuestions(
        new Array(interviewData.questions.length).fill(false)
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < interview.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setScore(null);
      setFeedback("");
    } else {
      const unansweredQuestion = answers.findIndex(
        (answer) => answer.trim() === ""
      );

      if (unansweredQuestion !== -1) {
        alert(
          "Please answer all questions before finishing the interview."
        );

        setCurrentQuestion(unansweredQuestion);
        return;
      }

      submitInterview();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setScore(null);
      setFeedback("");
    }
  };

  const submitInterview = async () => {
    try {
      const answersToSubmit = interview.questions.map(
        (question, index) => ({
          question,
          answer: answers[index],
        })
      );

      const response = await api.post(
        `/interviews/${id}/submit`,
        {
          answers: answersToSubmit,
        }
      );

      console.log(response.data);

      navigate(`/interview-result/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestion(index);
    setScore(null);
    setFeedback("");
  };

  const handleMarkForReview = () => {
    const updatedMarkedQuestions = [...markedQuestions];

    updatedMarkedQuestions[currentQuestion] =
      !updatedMarkedQuestions[currentQuestion];

    setMarkedQuestions(updatedMarkedQuestions);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

          <p className="text-gray-600">
            Loading interview...
          </p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-700">
            Interview not found.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const progress =
    ((currentQuestion + 1) /
      interview.questions.length) *
    100;

  const answeredCount = answers.filter(
    (answer) => answer.trim() !== ""
  ).length;

  const markedCount = markedQuestions.filter(
    (marked) => marked
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                AI Interview
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900">
                {interview.role}
              </h1>

              <p className="mt-1 text-gray-500">
                Difficulty:{" "}
                <span className="font-semibold capitalize text-gray-700">
                  {interview.difficulty}
                </span>
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-fit rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              ← Dashboard
            </button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-600">
              Interview Progress
            </span>

            <span className="text-sm font-bold text-gray-800">
              {currentQuestion + 1} /{" "}
              {interview.questions.length}
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
            <span>
              Answered:{" "}
              <strong className="text-green-600">
                {answeredCount}
              </strong>
              /{interview.questions.length}
            </span>

            <span>
              Marked:{" "}
              <strong className="text-orange-500">
                {markedCount}
              </strong>
            </span>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            Questions
          </h2>

          <div className="flex flex-wrap gap-3">
            {interview.questions.map((_, index) => {
              let buttonClass =
                "bg-gray-200 text-gray-700 hover:bg-gray-300";

              if (markedQuestions[index]) {
                buttonClass =
                  "bg-orange-500 text-white hover:bg-orange-600";
              } else if (answers[index].trim() !== "") {
                buttonClass =
                  "bg-green-500 text-white hover:bg-green-600";
              }

              if (currentQuestion === index) {
                buttonClass =
                  "bg-blue-600 text-white ring-4 ring-blue-100";
              }

              return (
                <button
                  key={index}
                  onClick={() =>
                    handleQuestionNavigation(index)
                  }
                  className={`flex h-11 w-11 items-center justify-center rounded-full font-bold transition ${buttonClass}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
            <span>⚪ Not answered</span>
            <span className="text-green-600">
              🟢 Answered
            </span>
            <span className="text-orange-500">
              🟠 Marked for review
            </span>
            <span className="text-blue-600">
              🔵 Current
            </span>
          </div>
        </div>

        {/* Current Question */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-6">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
              Question {currentQuestion + 1}
            </p>

            <h2 className="text-xl font-bold leading-relaxed text-gray-900">
              {interview.questions[currentQuestion]}
            </h2>
          </div>

          {/* Answer */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Your Answer
            </label>

            <textarea
              rows="9"
              placeholder="Type your answer here..."
              value={answers[currentQuestion] || ""}
              onChange={(e) => {
                const updatedAnswers = [...answers];

                updatedAnswers[currentQuestion] =
                  e.target.value;

                setAnswers(updatedAnswers);
              }}
              className="w-full resize-y rounded-xl border border-gray-300 p-4 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-2 text-right text-xs text-gray-400">
              {answers[currentQuestion]?.length || 0} characters
            </div>
          </div>

          {/* Evaluation */}
          {score !== null && (
            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
              <h3 className="mb-3 text-lg font-bold text-blue-800">
                🤖 AI Evaluation
              </h3>

              <p className="mb-2 text-gray-700">
                <strong>Score:</strong> {score}/10
              </p>

              <p className="text-gray-700">
                <strong>Feedback:</strong>{" "}
                {feedback}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <button
              onClick={handleMarkForReview}
              className={`rounded-lg px-5 py-3 font-semibold transition ${
                markedQuestions[currentQuestion]
                  ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  : "border border-orange-300 bg-white text-orange-600 hover:bg-orange-50"
              }`}
            >
              {markedQuestions[currentQuestion]
                ? "⭐ Remove Review"
                : "⭐ Mark for Review"}
            </button>

            <div className="flex flex-col gap-3 sm:flex-row">
              {currentQuestion > 0 && (
                <button
                  onClick={handlePreviousQuestion}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                >
                  ← Previous
                </button>
              )}

              <button
                onClick={handleNextQuestion}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                {currentQuestion ===
                interview.questions.length - 1
                  ? "Finish Interview 🎉"
                  : "Next Question →"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Reminder */}
        <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          💡 <strong>Tip:</strong> You can use the question
          numbers above to move between questions and mark
          questions for review.
        </div>
      </div>
    </div>
  );
}

export default Interview;