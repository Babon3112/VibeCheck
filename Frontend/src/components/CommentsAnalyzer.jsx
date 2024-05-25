import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Arial", sans-serif;
  margin-top: 50px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const SentimentContainer = styled.div`
  margin-top: 20px;
  text-align: center;
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const Error = styled.p`
  color: red;
  margin-top: 20px;
`;

function CommentsAnalyzer() {
  const [videoId, setVideoId] = useState("");
  const [sentiment, setSentiment] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:7000/comments?videoId=${videoId}`
      );
      console.log("Response data:", response.data);
      setSentiment(response.data.data.sentiment);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to fetch comments. Please try again.");
    }
  };

  const data = sentiment
    ? [
        { name: "Negative", value: sentiment.neg },
        { name: "Neutral", value: sentiment.neu },
        { name: "Positive", value: sentiment.pos },
      ]
    : [];

  console.log("Data for chart:", data);

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="Enter Video ID"
        />
        <Button type="submit">Analyze Comments</Button>
      </Form>
      {error && <Error>{error}</Error>}
      {sentiment && (
        <SentimentContainer>
          <Title>Sentiment Analysis</Title>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </SentimentContainer>
      )}
    </Container>
  );
}

export default CommentsAnalyzer;
