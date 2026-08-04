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

  useEffect(() => {
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    try {
      const response = await api.get(`/interviews/${id}`);

      console.log(response.data);
      setInterview(response.data.interview);

      setAnswers(
        new Array(response.data.interview.questions.length).fill("")
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answers[currentQuestion]?.trim()) {
      alert("Please enter an answer before continuing.");
      return;
    }
    try {
      const response = await api.post(`/interviews/${id}/answer`, {
        question: interview.questions[currentQuestion],
        answer: answers[currentQuestion],
      });

      console.log(response.data);
      setScore(response.data.interview.qa[currentQuestion].score);
      setFeedback(response.data.interview.qa[currentQuestion].feedback);

      if (currentQuestion < interview.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setScore(null);
        setFeedback("");
        
      } else {
        navigate(`/interview-result/${id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!interview) {
    return <h2>Interview not found.</h2>;
  }
  const progress =
    ((currentQuestion + 1) / interview.questions.length) * 100;

  return (
    <div>
      <h1>Interview Page</h1>

      <hr />

      <h2>Role: {interview.role}</h2>

      <p>
        <strong>Difficulty:</strong> {interview.difficulty}
      </p>
      <div
        style={{
        width: "100%",
        backgroundColor: "#ddd",
        borderRadius: "10px",
        marginTop: "20px",
        marginBottom: "10px",
        }}
      >
        <div
          style={{
          width: `${progress}%`,
          backgroundColor: "#4CAF50",
          height: "12px",
          borderRadius: "10px",
          transition: "width 0.3s ease",
        }}
      ></div>
    </div>

    <p>
      Progress: {currentQuestion + 1} / {interview.questions.length}
    </p>

      <hr />

      <h3>
        Question {currentQuestion + 1} of {interview.questions.length}
      </h3>

      <p>{interview.questions[currentQuestion]}</p>

      <textarea
        rows="6"
        cols="60"
        placeholder="Type your answer here..."
        value={answers[currentQuestion] || ""}
        onChange={(e) => {
          const updatedAnswers = [...answers];
          updatedAnswers[currentQuestion] = e.target.value;
          setAnswers(updatedAnswers);
        }}
      />

      {score !== null && (
        <div>
          <h3>Evaluation</h3>

          <p>
            <strong>Score:</strong> {score}/10
          </p>

          <p>
            <strong>Feedback:</strong> {feedback}
          </p>
        </div>
      )}

      <br />
      <br />

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
        >
          ← Previous Question
        </button>

        <button onClick={handleSubmitAnswer}>
          {currentQuestion === interview.questions.length - 1
            ? "Finish Interview 🎉"
            : "Next Question →"}
        </button>
      </div>
    </div>
  );
}

export default Interview;