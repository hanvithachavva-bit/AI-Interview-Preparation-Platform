import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function InterviewResult() {
  const { id } = useParams();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    try {
      const response = await api.get(`/interviews/${id}`);

      console.log(response.data);

      setInterview(response.data.interview);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!interview) {
    return <h2>Interview not found.</h2>;
  }

  const totalScore = interview.qa.reduce(
    (sum, item) => sum + item.score,
    0
  );

  return (
    <div>
      <h1>🎉 Interview Completed</h1>

      <hr />

      <h2>{interview.role}</h2>

      <p>
        <strong>Difficulty:</strong> {interview.difficulty}
      </p>

      <h2>
        Overall Score: {totalScore} / {interview.questions.length * 10}
      </h2>

      <hr />

      {interview.qa.map((item, index) => (
        <div key={index}>
          <h3>Question {index + 1}</h3>

          <p>
            <strong>Question:</strong>
          </p>

          <p>{item.question}</p>

          <p>
            <strong>Your Answer:</strong>
          </p>

          <p>{item.answer}</p>

          <p>
            <strong>Score:</strong> {item.score}/10
          </p>

          <p>
            <strong>Feedback:</strong>
          </p>

          <p>{item.feedback}</p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default InterviewResult;