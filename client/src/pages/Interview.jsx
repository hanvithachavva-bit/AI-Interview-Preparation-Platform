import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  const [answer, setAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Questions marked for review
  const [markedQuestions, setMarkedQuestions] = useState(
    new Set()
  );

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerStartedAt, setTimerStartedAt] = useState(null);

  // ============================================================
  // FETCH INTERVIEW
  // ============================================================

  useEffect(() => {
    fetchInterview();
  }, [id]);

  // ============================================================
  // TIMER
  // ============================================================

  useEffect(() => {
    if (!timerStartedAt) {
      return;
    }

    const timer = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - timerStartedAt) / 1000
      );

      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [timerStartedAt]);

  // ============================================================
  // GET INTERVIEW
  // ============================================================

  const fetchInterview = async () => {
    try {
      setLoading(true);
      setSubmitError("");

      const response = await api.get(`/interviews/${id}`);

      const interviewData = response.data.interview;

      if (!interviewData) {
        throw new Error("Interview data was not found.");
      }

      // Already completed
      if (interviewData.status === "completed") {
        navigate(`/interview-result/${id}`);
        return;
      }

      setInterview(interviewData);

      // Timer
      const startTime = interviewData.startedAt
        ? new Date(interviewData.startedAt).getTime()
        : Date.now();

      setTimerStartedAt(startTime);

      // Resume at first unanswered question
      const answeredQuestions =
        interviewData.qa?.length || 0;

      setCurrentQuestion(answeredQuestions);

      // Restore answer if available
      const existingAnswer =
        interviewData.qa?.[answeredQuestions]?.answer || "";

      setAnswer(existingAnswer);
    } catch (error) {
      console.error(
        "Failed to load interview:",
        error
      );

      setSubmitError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load interview."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SUBMIT CURRENT ANSWER
  // ============================================================

  const handleNextQuestion = async () => {
    // If user is looking at an already answered question,
    // do not submit it again.
    if (
      interview?.qa &&
      currentQuestion < interview.qa.length
    ) {
      setCurrentQuestion(interview.qa.length);

      setAnswer("");

      setSubmitError("");

      return;
    }

    const currentAnswer = answer.trim();

    if (!currentAnswer) {
      setSubmitError(
        "Please answer the question before continuing."
      );
      return;
    }

    if (
      !interview ||
      !interview.questions ||
      !interview.questions[currentQuestion]
    ) {
      setSubmitError(
        "Current question could not be found."
      );
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const currentQuestionText =
        interview.questions[currentQuestion].question;

      // ========================================================
      // SEND ANSWER TO BACKEND
      // ========================================================

      const response = await api.post(
        `/interviews/${id}/answer`,
        {
          question: currentQuestionText,
          answer: currentAnswer,
        }
      );

      // ========================================================
      // INTERVIEW COMPLETED
      // ========================================================

      if (response.data.completed) {
        navigate(`/interview-result/${id}`);
        return;
      }

      // ========================================================
      // NEXT QUESTION
      // ========================================================

      const nextQuestion = response.data.nextQuestion;

      if (
        !nextQuestion ||
        !nextQuestion.question
      ) {
        throw new Error(
          "Next question was not generated."
        );
      }

      // ========================================================
      // UPDATE LOCAL QA
      // This is important for BLUE attempted status.
      // ========================================================

      setInterview((previousInterview) => ({
        ...previousInterview,

        qa: [
          ...(previousInterview.qa || []),
          {
            question: currentQuestionText,
            answer: currentAnswer,
          },
        ],

        currentDifficulty:
          nextQuestion.difficulty,

        questions: [
          ...previousInterview.questions,
          nextQuestion,
        ],
      }));

      // ========================================================
      // MOVE TO NEXT QUESTION
      // ========================================================

      setCurrentQuestion(
        (previousQuestion) =>
          previousQuestion + 1
      );

      setAnswer("");

      setSubmitError("");
    } catch (error) {
      console.error(
        "Failed to submit answer:",
        error
      );

      setSubmitError(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit answer. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // MARK FOR REVIEW
  // ============================================================

  const handleMarkForReview = () => {
    setMarkedQuestions((previousMarked) => {
      const updated = new Set(previousMarked);

      if (updated.has(currentQuestion)) {
        updated.delete(currentQuestion);
      } else {
        updated.add(currentQuestion);
      }

      return updated;
    });
  };

  // ============================================================
  // GO TO PREVIOUS / ANSWERED QUESTION
  // ============================================================

  const handleQuestionNavigation = (index) => {
    // Do not allow navigation to questions
    // that have not been answered/generated yet.
    if (
      !interview?.qa ||
      index >= interview.qa.length
    ) {
      return;
    }

    setCurrentQuestion(index);

    setAnswer(
      interview.qa[index]?.answer || ""
    );

    setSubmitError("");
  };

  // ============================================================
  // RETURN TO CURRENT QUESTION
  // ============================================================

  const handleReturnToCurrent = () => {
    const latestQuestion =
      interview?.qa?.length || 0;

    setCurrentQuestion(latestQuestion);

    setAnswer("");

    setSubmitError("");
  };

  // ============================================================
  // FORMAT TIMER
  // ============================================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  // ============================================================
  // QUESTION STATUS
  // ============================================================

  const getQuestionStatus = (index) => {
    if (markedQuestions.has(index)) {
      return "marked";
    }

    if (
      index <
      (interview?.qa?.length || 0)
    ) {
      return "attempted";
    }

    return "unattempted";
  };

  // ============================================================
  // QUESTION STATUS COLORS
  // ============================================================

  const getQuestionStatusClasses = (index) => {
    const status = getQuestionStatus(index);

    const isCurrent =
      index === currentQuestion;

    let classes = "";

    if (status === "marked") {
      classes =
        "bg-orange-500 text-white border-orange-500";
    } else if (status === "attempted") {
      classes =
        "bg-blue-600 text-white border-blue-600";
    } else {
      classes =
        "bg-gray-200 text-gray-600 border-gray-300";
    }

    if (isCurrent) {
      classes +=
        " ring-2 ring-blue-300 ring-offset-2";
    }

    return classes;
  };

  // ============================================================
  // LOADING
  // ============================================================

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

  // ============================================================
  // NOT FOUND
  // ============================================================

  if (!interview) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">

        <div className="rounded-xl bg-white p-8 text-center shadow-sm">

          <p className="text-lg font-semibold text-gray-700">
            Interview not found.
          </p>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="mt-4 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </button>

        </div>

      </div>
    );
  }

  // ============================================================
  // CURRENT QUESTION
  // ============================================================

  const currentQuestionData =
    interview.questions?.[currentQuestion];

  if (!currentQuestionData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">

        <div className="rounded-xl bg-white p-8 text-center shadow-sm">

          <p className="text-lg font-semibold text-gray-700">
            Preparing your next question...
          </p>

        </div>

      </div>
    );
  }

  // ============================================================
  // TOTAL QUESTIONS
  // ============================================================

  const totalQuestions =
    interview.totalQuestions ||
    interview.numberOfQuestions ||
    1;

  // ============================================================
  // PROGRESS
  // ============================================================

  const answeredCount =
    interview.qa?.length || 0;

  const progress = Math.min(
    (answeredCount / totalQuestions) * 100,
    100
  );

  const isReviewingPrevious =
    currentQuestion < answeredCount;

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-5xl">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-sm font-medium text-blue-600">
                AI Adaptive Interview
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900">
                {interview.role}
              </h1>

              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">

                <span>
                  Company:{" "}
                  <strong className="text-gray-700">
                    {interview.company ||
                      "Not specified"}
                  </strong>
                </span>

                <span>
                  Type:{" "}
                  <strong className="text-gray-700">
                    {interview.type ||
                      "Not specified"}
                  </strong>
                </span>

                <span>
                  Difficulty:{" "}
                  <strong className="text-gray-700">
                    {
                      currentQuestionData.difficulty
                    }
                  </strong>
                </span>

              </div>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

              <div className="rounded-lg bg-blue-50 px-4 py-2 text-center text-sm font-semibold text-blue-700">
                ⏱️ Time:{" "}
                {formatTime(elapsedSeconds)}
              </div>

              <button
                onClick={() =>
                  navigate("/dashboard")
                }
                disabled={submitting}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ← Dashboard
              </button>

            </div>

          </div>

        </div>

        {/* ======================================================
            PROGRESS
        ====================================================== */}

        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-2 flex items-center justify-between">

            <span className="text-sm font-semibold text-gray-600">
              Interview Progress
            </span>

            <span className="text-sm font-bold text-gray-800">
              {Math.min(
                currentQuestion + 1,
                totalQuestions
              )}{" "}
              / {totalQuestions}
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
              /{totalQuestions}
            </span>

            <span>
              Current difficulty:{" "}
              <strong className="text-blue-600">
                {
                  currentQuestionData.difficulty
                }
              </strong>
            </span>

          </div>

        </div>

        {/* ======================================================
            QUESTION STATUS
        ====================================================== */}

        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-4 flex items-center justify-between">

            <h3 className="text-sm font-semibold text-gray-700">
              Questions
            </h3>

            <span className="text-xs text-gray-400">
              Click an answered question to review
            </span>

          </div>

          <div className="flex flex-wrap gap-3">

            {Array.from(
              { length: totalQuestions },
              (_, index) => {

                const isAnswered =
                  index < answeredCount;

                const isMarked =
                  markedQuestions.has(index);

                const isCurrent =
                  index === currentQuestion;

                if (isAnswered) {
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        handleQuestionNavigation(
                          index
                        )
                      }
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition hover:scale-105 ${getQuestionStatusClasses(
                        index
                      )}`}
                      title={
                        isMarked
                          ? "Marked for review"
                          : "Attempted - click to review"
                      }
                    >
                      {index + 1}
                    </button>
                  );
                }

                return (
                  <div
                    key={index}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold ${getQuestionStatusClasses(
                      index
                    )}`}
                    title="Unattempted"
                  >
                    {index + 1}
                  </div>
                );
              }
            )}

          </div>

          {/* LEGEND */}

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs text-gray-500">

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-gray-300"></span>
              <span>Unattempted</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-600"></span>
              <span>Attempted</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-orange-500"></span>
              <span>Marked for Review</span>
            </div>

          </div>

        </div>

        {/* ======================================================
            ADAPTIVE INFO
        ====================================================== */}

        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-5">

          <div className="flex gap-3">

            <div className="text-xl">
              🤖
            </div>

            <div>

              <h3 className="font-semibold text-blue-800">
                Adaptive AI Interview
              </h3>

              <p className="mt-1 text-sm leading-relaxed text-blue-700">
                Your next question is generated
                based on your previous answer.
                Strong answers increase the
                difficulty, while weaker answers
                may reduce it.
              </p>

            </div>

          </div>

        </div>

        {/* ======================================================
            CURRENT QUESTION
        ====================================================== */}

        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-6">

            <div className="flex items-center justify-between">

              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
                Question {currentQuestion + 1}
              </p>

              {isReviewingPrevious && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  Reviewing previous answer
                </span>
              )}

            </div>

            <h2 className="text-xl font-bold leading-relaxed text-gray-900">
              {currentQuestionData.question}
            </h2>

            <div className="mt-3">

              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Difficulty:{" "}
                {currentQuestionData.difficulty}
              </span>

            </div>

          </div>

          {/* ANSWER */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Your Answer
            </label>

            <textarea
              rows="9"
              placeholder="Type your answer here..."
              value={answer}
              disabled={
                submitting ||
                isReviewingPrevious
              }
              onChange={(e) => {
                setAnswer(e.target.value);

                if (submitError) {
                  setSubmitError("");
                }
              }}
              className="w-full resize-y rounded-xl border border-gray-300 p-4 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            />

            <div className="mt-2 text-right text-xs text-gray-400">
              {answer.length} characters
            </div>

          </div>

          {/* ERROR */}

          {submitError && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              ⚠️ {submitError}
            </div>
          )}

          {/* ACTIONS */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <button
                type="button"
                onClick={
                  handleMarkForReview
                }
                disabled={submitting}
                className={`rounded-lg px-5 py-3 font-semibold transition ${
                  markedQuestions.has(
                    currentQuestion
                  )
                    ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                    : "border border-orange-300 bg-white text-orange-600 hover:bg-orange-50"
                }`}
              >
                {markedQuestions.has(
                  currentQuestion
                )
                  ? "⭐ Remove Review"
                  : "⭐ Mark for Review"}
              </button>

            </div>

            <div className="flex gap-3">

              {isReviewingPrevious && (
                <button
                  type="button"
                  onClick={
                    handleReturnToCurrent
                  }
                  disabled={submitting}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Return to Current →
                </button>
              )}

              {!isReviewingPrevious && (
                <button
                  type="button"
                  onClick={
                    handleNextQuestion
                  }
                  disabled={
                    submitting ||
                    !answer.trim()
                  }
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {submitting
                    ? "🤖 Evaluating..."
                    : currentQuestion + 1 >=
                      totalQuestions
                    ? "Submit & Finish Interview ✓"
                    : "Submit Answer & Continue →"}
                </button>
              )}

            </div>

          </div>

        </div>

        {/* REMINDER */}

        <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">

          💡{" "}
          <strong>Tip:</strong> Take your time
          and explain your reasoning clearly.
          The AI evaluates your answer before
          deciding the difficulty of the next
          question.

        </div>

      </div>

    </div>
  );
}

export default Interview;