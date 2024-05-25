import vader from "vader-sentiment";
import fs from "fs";
import { ApiResponse } from "./ApiResponse.util.js";
import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";
import { stopwords } from "./stopWords.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const youtube = google.youtube({
  version: "v3",
  auth: process.env.DEVELOPER_KEY,
});

export const sentimentAnalysis = async (req, res) => {
  const videoId = req.query.videoId;

  if (!videoId) {
    return res.status(400).send("videoId is required");
  }

  try {
    const response = await youtube.commentThreads.list({
      part: "snippet",
      maxResults: 100,
      videoId: videoId,
    });

    if (!response.data.items) {
      console.error("API response does not contain items:", response.data);
      return res
        .status(500)
        .send("Error fetching comments, response does not contain items");
    }

    const comments = response.data.items.map(
      (item) => item.snippet.topLevelComment.snippet.textDisplay
    );

    let text = comments.join(" ").toLowerCase();
    text = text.replace(/[^\w\s]/gi, ""); // Remove punctuations

    const tokenizedWords = text.split(/\s+/);
    const finalWords = tokenizedWords.filter(
      (word) => !stopwords.includes(word)
    );

    const emotionList = [];
    const emotionFile = path.join(__dirname, "data", "emotion.txt");
    const emotionData = fs.readFileSync(emotionFile, "utf-8");
    const emotionLines = emotionData.split("\n");

    emotionLines.forEach((line) => {
      const [word, emotion] = line.split(":").map((item) => item.trim());
      if (finalWords.includes(word)) {
        emotionList.push(emotion);
      }
    });

    const emotionCounts = emotionList.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {});

    const sentimentScore =
      vader.SentimentIntensityAnalyzer.polarity_scores(text);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          emotions: emotionCounts,
          sentiment: sentimentScore,
        },
        "Comment fetched successfully for sentiment analysis"
      )
    );
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).send("Error fetching comments");
  }
};
