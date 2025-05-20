const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function connect() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

module.exports = {
  connect,
  prisma
};
