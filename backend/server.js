import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;
const API_KEY = process.env.API_KEY;

app.post("/completions", async (req, res) => {
  const { messages } = req.body;

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 100,
    }),
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", options);
    const data = await response.json();
    res.send(data);
  } catch (err) {
    console.error("Error fetching completion:", err);
    res.status(500).send({ error: "Failed to fetch completion" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});