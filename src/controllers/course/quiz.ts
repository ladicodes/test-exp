import express from "express";
import type { Request, Response } from "express";

const app = express();
app.use(express.json()); 

interface Scores {
  frontend?: number;
  backend?: number;
  uiux?: number;
  cybersecurity?: number;
  qa?: number;
}

interface Result {
  result: number;
  categories: Scores;
  mostProficient: string;
  level: string;
}

function calculateResult(scores: Scores): Result {
  const categories: Scores = {
    frontend: scores.frontend || 0,
    backend: scores.backend || 0,
    uiux: scores.uiux || 0,
    cybersecurity: scores.cybersecurity || 0,
    qa: scores.qa || 0,
  };

  const total = Object.values(categories).reduce((a, b) => a + (b || 0), 0);
  const maxTotal = 25;
  const result = (total / maxTotal) * 20;

  const mostProficient = Object.keys(categories).reduce((a, b) =>
    (categories[a as keyof Scores] || 0) >= (categories[b as keyof Scores] || 0) ? a : b
  );

  let level = "Beginner";
  if (result >= 9 && result <= 13) {
    level = "Intermediate";
  } else if (result >= 14 && result <= 20) {
    level = "Advanced";
  }

  return {
    result: parseFloat(result.toFixed(1)),
    categories,
    mostProficient,
    level,
  };
}

app.post("/calculate", (req: Request, res: Response) => {
  const { scores } = req.body;

  if (!scores) {
    return res.status(400).json({ error: "Scores are required" });
  }

  const response = calculateResult(scores);


  console.log("Full Backend Result:", response);

  res.json({ message: `You are now a ${response.level}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
