import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Interview() {
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

  return (
    <div>
      <h1>Interview Page</h1>

      <hr />

      <h2>Role: {interview.role}</h2>
      <p>
        <strong>Difficulty:</strong> {interview.difficulty}
      </p>

      <h3>Questions</h3>

      <ol>
        {interview.questions.map((question, index) => (
          <li key={index}>
            {question}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Interview;