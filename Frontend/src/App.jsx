import React from "react";
import styled from "styled-components";
import CommentsAnalyzer from "./components/CommentsAnalyzer";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background: linear-gradient(135deg, #e0eafc, #cfdef3);
  min-height: 100vh;
  font-family: "Arial", sans-serif;
`;

const Title = styled.h1`
  font-size: 3em;
  color: #2c3e50;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const Card = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 800px;
  margin-top: 20px;
`;

function App() {
  return (
    <AppContainer>
      <Title>Comment Analyzer</Title>
      <Card>
        <CommentsAnalyzer />
      </Card>
    </AppContainer>
  );
}

export default App;
