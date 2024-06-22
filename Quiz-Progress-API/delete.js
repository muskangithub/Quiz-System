const { PrismaClient } = require("@prisma/client");

// Initialize Prisma client
const prisma = new PrismaClient();

async function deleteAllQuizProgress() {
  try {
    // Delete all quiz progress records
    const deleteResult = await prisma.quizProgress.deleteMany();

    console.log(`Deleted ${deleteResult.count} quiz progress records.`);
  } catch (error) {
    console.error("Error deleting quiz progress:", error);
  } finally {
    // Close the Prisma client
    await prisma.$disconnect();
  }
}

// Call the function to delete all quiz progress records
deleteAllQuizProgress();
