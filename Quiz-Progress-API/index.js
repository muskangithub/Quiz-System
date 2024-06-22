// Import required modules
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

// Create an Express.js application
const app = express();
app.use(cors());

const prisma = new PrismaClient();

app.use(express.json());

// Create quiz progress - on start of the quiz
app.post("/quiz-progress", async (req, res) => {
  try {
    const { userId, quizId, questions } = req.body;

    // Check if a record with the same userId and quizId already exists
    const existingProgress = await prisma.quizProgress.findFirst({
      where: {
        userId: parseInt(userId),
        quizId: parseInt(quizId),
      },
    });

    if (existingProgress) {
      // A record with the same userId and quizId already exists
      return res.status(400).json({
        error:
          "Quiz progress record already exists for this userId and quizId.",
      });
    }

    // Serialize the JSON data to a string before storing it
    const progressString = JSON.stringify(questions);

    const createdProgress = await prisma.quizProgress.create({
      data: {
        userId: parseInt(userId),
        quizId: parseInt(quizId),
        questions: progressString,
      },
    });

    res.json(createdProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get quiz progress records by quizId and userId
app.get("/quiz-progress", async (req, res) => {
  try {
    const { quizId, userId } = req.query;

    if (!quizId && !userId) {
      // If neither quizId nor userId is provided, fetch all quiz progress records
      const allProgress = await prisma.quizProgress.findMany();

      // Deserialize the JSON data from the stored strings for all records
      const progressArray = allProgress.map((progress) => ({
        ...progress,
        questions: JSON.parse(progress.questions),
      }));
      return res.json(progressArray);
    }

    if (!quizId || !userId) {
      return res.status(400).json({
        error:
          "Both quizId and userId are required when querying by specific parameters.",
      });
    }

    const quizProgress = await prisma.quizProgress.findFirst({
      where: {
        quizId: parseInt(quizId),
        userId: parseInt(userId),
      },
    });

    console.log(quizProgress, "quizProgress");

    if (!quizProgress || quizProgress.length === 0) {
      return res.status(200).json({});
    }

    quizProgress.questions = JSON.parse(quizProgress.questions);

    res.json(quizProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a question in quiz progress by ID and questionId - used for updating progress
app.patch("/quiz-progress/:id/:questionId", async (req, res) => {
  try {
    console.log(req.params, "req.params");
    const progressId = parseInt(req.params.id);
    const questionId = parseInt(req.params.questionId);
    const newQuestionData = req.body;

    // Fetch the quiz progress record by ID
    const progress = await prisma.quizProgress.findUnique({
      where: { id: parseInt(progressId) },
    });

    if (!progress) {
      res.status(404).json({ error: "Progress not found" });
      return;
    }

    let progressData = progress.questions;

    // Check the current type of progressData
    if (typeof progressData === "string") {
      // Parse the 'progressData' from a JSON string to an object
      try {
        progressData = JSON.parse(progressData);
      } catch (error) {
        res.status(400).json({ error: "Invalid progress data format" });
        return;
      }
    } else if (!Array.isArray(progressData)) {
      progressData = [];
    }

    const index = progressData.findIndex((data) => {
      return parseInt(data.id) === parseInt(questionId);
    });

    console.log(index, "index");

    progressData[index] = newQuestionData;

    // Stringify the 'updatedProgressData' array back to JSON format
    const updatedProgressDataString = JSON.stringify(progressData);

    console.log(progressData, "progressData");

    // // Update the quiz progress record with the modified 'progress' field
    const updatedProgress = await prisma.quizProgress.update({
      where: { id: progressId },
      data: { questions: updatedProgressDataString },
    });

    res.json(updatedProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete quiz progress by ID
app.delete("/quiz-progress/:id", async (req, res) => {
  try {
    const progressId = parseInt(req.params.id);

    // Check if the record with the specified ID exists
    const existingProgress = await prisma.quizProgress.findUnique({
      where: { id: progressId },
    });

    if (!existingProgress) {
      return res.status(404).json({ error: "Progress record not found" });
    }

    // Attempt to delete the record
    await prisma.quizProgress.delete({
      where: { id: progressId },
    });

    res.json({ message: "Progress deleted successfully" });
  } catch (error) {
    // Handle other errors (e.g., database connection issues)
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update quiz progress by ID -  not used atm
app.put("/quiz-progress/:id", async (req, res) => {
  try {
    const progressId = parseInt(req.params.id);
    const { progress } = req.body;
    // Serialize the JSON data to a string before updating it
    const progressString = JSON.stringify(progress);
    const updatedProgress = await prisma.quizProgress.update({
      where: { id: progressId },
      data: { progress: progressString },
    });
    res.json(updatedProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get quiz progress by ID - getting progress by id (not used)
app.get("/quiz-progress/:id", async (req, res) => {
  try {
    const progressId = parseInt(req.params.id);
    const progress = await prisma.quizProgress.findUnique({
      where: { id: parseInt(progressId) },
    });
    if (!progress) {
      res.status(404).json({ error: "Progress not found" });
      return;
    }
    // Deserialize the JSON data from the stored string
    progress.questions = JSON.parse(progress.questions);
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Define the port to listen on
const PORT = process.env.PORT || 3000;

// Start the Express.js server
app.listen(PORT, () => {
  console.log("Server is running on port ${PORT}");
});
